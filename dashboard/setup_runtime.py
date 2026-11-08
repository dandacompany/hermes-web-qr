"""Bounded, fixed-argument local setup. No credentials or raw command output leave here."""
from __future__ import annotations
import http.client
import json
import os
from pathlib import Path
import platform
import re
import shutil
import signal
import subprocess
import threading
from urllib.parse import urlsplit

_LOCK = threading.Lock()
_JOB = {'state': 'idle', 'action': '', 'message': ''}

class SetupError(Exception):
    pass


def valid_dns(host):
    return isinstance(host, str) and bool(re.fullmatch(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+ts\.net', host))


def serve_state(config, dns, port):
    """Never replace a listener, path router, or existing public Funnel."""
    if not isinstance(config, dict):
        return 'unknown'
    if any(not isinstance(config.get(key, {}), dict) for key in ('TCP', 'Web', 'AllowFunnel')):
        return 'unknown'
    if any(not isinstance(k, str) for key in ('TCP', 'Web', 'AllowFunnel') for k in config.get(key, {})):
        return 'unknown'
    address = f'{dns}:443'
    if any(v for k, v in config.get('AllowFunnel', {}).items() if k.endswith(':443')):
        return 'conflict'
    tcp = config.get('TCP', {}).get('443')
    web = {k: v for k, v in config.get('Web', {}).items() if k.endswith(':443')}
    if not tcp and not web:
        return 'available'
    expected = {address: {'Handlers': {'/': {'Proxy': f'http://127.0.0.1:{port}'}}}}
    if tcp == {'HTTPS': True} and web == expected:
        return 'ready'
    return 'conflict'


def auth_ready(data):
    if not isinstance(data, dict):
        return False
    providers = data.get('auth_providers')
    return data.get('auth_required') is True and isinstance(providers, list) and bool(providers) and all(isinstance(p, str) and p for p in providers)


def binary(name):
    candidates = []
    if name == 'tailscale':
        candidates.append('/Applications/Tailscale.app/Contents/MacOS/Tailscale')
    candidates += [f'/opt/homebrew/bin/{name}', f'/usr/local/bin/{name}', shutil.which(name)]
    return next((p for p in candidates if p and os.path.isfile(p) and os.access(p, os.X_OK)), None)


def run(argv, timeout=12):
    # Do not pass gateway API secrets to package manager / vendor subprocesses.
    env = {k: os.environ[k] for k in ('HOME', 'USER', 'TMPDIR', 'LANG') if k in os.environ}
    env.update(PATH='/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin', TERM='dumb', NONINTERACTIVE='1', HOMEBREW_NO_AUTO_UPDATE='1')
    proc = subprocess.Popen(argv, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                            env=env, start_new_session=True)
    try:
        out, _ = proc.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(proc.pid, signal.SIGTERM)
        try:
            proc.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(proc.pid, signal.SIGKILL)
            proc.communicate()
        raise SetupError('timeout') from None
    if proc.returncode:
        raise SetupError('command_failed')
    if len(out) > 1024 * 1024:
        raise SetupError('output_too_large')
    return out


def json_command(argv):
    try:
        result = json.loads(run(argv))
        if not isinstance(result, dict):
            raise ValueError()
        return result
    except (ValueError, OSError, SetupError):
        raise SetupError('status_unavailable') from None


def probe_web(web):
    """Probe only configured local origin, without cookies, proxy env, or redirects."""
    url = urlsplit(web.get('public_url') or '')
    port = web.get('port')
    if not web.get('enabled') or url.scheme != 'https' or not url.hostname or url.username or url.password or not isinstance(port, int) or not 1 <= port <= 65535:
        return False
    try:
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=3)
        headers = {'Host': url.netloc}
        conn.request('GET', '/api/status', headers=headers)
        response = conn.getresponse()
        data = response.read(65537)
        if response.status != 200 or len(data) > 65536 or not auth_ready(json.loads(data)):
            return False
        conn.request('GET', '/api/auth/me', headers=headers)
        response = conn.getresponse()
        response.read(65537)
        return response.status == 401
    except (OSError, ValueError, http.client.HTTPException):
        return False
    finally:
        if 'conn' in locals():
            conn.close()


def inspect(web):
    cli = binary('tailscale')
    state = {'platform': platform.system(), 'installed': bool(cli),
             'can_install': platform.system() == 'Darwin' and bool(binary('brew')),
             'connected': False, 'dns': '', 'url': '', 'serve': 'unknown',
             'web_ready': probe_web(web), 'web_url': web.get('public_url') or '',
             'origin': f"http://127.0.0.1:{web.get('port', 9120)}",
             'job': dict(_JOB), 'issue': ''}
    if not cli:
        return state
    try:
        status = json_command([cli, 'status', '--json', '--peers=false'])
        dns = (status.get('Self') or {}).get('DNSName', '').removesuffix('.')
        state['connected'] = status.get('BackendState') == 'Running'
        if state['connected'] and valid_dns(dns):
            state['dns'], state['url'] = dns, f'https://{dns}'
            cfg = json_command([cli, 'serve', 'status', '--json'])
            state['serve'] = serve_state(cfg, dns, web.get('port', 9120))
    except (SetupError, TypeError, AttributeError):
        state['issue'] = 'status_unavailable'
    return state


def perform(action, web):
    """Only invoked under the single action lock. Recheck preconditions at execution time."""
    if action == 'install':
        if binary('tailscale'):
            return 'already_installed'
        brew = binary('brew')
        if platform.system() != 'Darwin' or not brew:
            raise SetupError('manual_install')
        run([brew, 'install', '--cask', 'tailscale-app'], timeout=240)
        if not binary('tailscale'):
            raise SetupError('manual_install')
        return 'installed'
    if action == 'login':
        if platform.system() != 'Darwin' or not Path('/Applications/Tailscale.app').is_dir():
            raise SetupError('manual_login')
        run(['/usr/bin/open', '-a', 'Tailscale'])
        return 'finish_login_in_app'
    if action != 'serve':
        raise SetupError('unsupported_action')
    state = inspect(web)
    if not state['connected'] or not state['url']:
        raise SetupError('connect_first')
    if not state['web_ready'] or state['web_url'].rstrip('/') != state['url']:
        raise SetupError('prepare_web')
    if state['serve'] == 'ready':
        return 'already_connected'
    if state['serve'] != 'available':
        raise SetupError('port_conflict')
    cli = binary('tailscale')
    run([cli, 'serve', '--bg', '--https=443', '--yes', state['origin']], timeout=25)
    if inspect(web)['serve'] != 'ready':
        raise SetupError('verify_failed')
    return 'connected'


def start(action, web):
    if action not in ('install', 'login', 'serve'):
        raise SetupError('unsupported_action')
    if not _LOCK.acquire(blocking=False):
        raise SetupError('busy')
    _JOB.update(state='running', action=action, message='')
    def worker():
        try:
            message = perform(action, web)
            _JOB.update(state='done', message=message)
        except SetupError as exc:
            _JOB.update(state='error', message=str(exc))
        except Exception:
            _JOB.update(state='error', message='command_failed')
        finally:
            _LOCK.release()
    threading.Thread(target=worker, name='hermes-web-qr-setup', daemon=True).start()
    return dict(_JOB)
