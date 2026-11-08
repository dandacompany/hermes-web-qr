"""Native desktop only: cookie/bearer/browser callers cannot run local setup."""
import importlib.util
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

_spec = importlib.util.spec_from_file_location(__name__ + '_setup', Path(__file__).with_name('setup_runtime.py'))
_runtime = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_runtime)


def native_only(request: Request):
    if not getattr(request.state, 'native_http_principal', None):
        raise HTTPException(403, 'Open the Hermes app on this computer to set up access.')


router = APIRouter(dependencies=[Depends(native_only)])


def web_settings(request):
    from hermes_cli.dashboard_auth.native_http import native_profile_scope
    from hermes_cli.webapp_access import access_status
    with native_profile_scope(request):
        return access_status()


@router.get('/setup/status')
def status(request: Request):
    return _runtime.inspect(web_settings(request))


class Action(BaseModel):
    action: Literal['install', 'login', 'serve']


@router.post('/setup/action')
def action(body: Action, request: Request):
    try:
        return _runtime.start(body.action, web_settings(request))
    except _runtime.SetupError as exc:
        raise HTTPException(409, str(exc)) from None
