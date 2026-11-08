# hermes-web-qr

**Web Access QR — remote access setup and a mobile QR code for Hermes Desktop.**

한국어: [README.ko.md](./README.ko.md)

Choose Tailscale, follow Cloudflare Tunnel setup, or enter an existing HTTPS URL. The QR contains only the saved address; scanning it opens Hermes and keeps its existing sign-in flow.

The UI uses Hermes Desktop's own controls and follows its language setting. The plugin name stays **Web Access QR**. Bundled translations: English, Korean, Japanese, Simplified and Traditional Chinese, German, French, Spanish, Russian and Arabic. Additional app languages fall back to English.

## Requirements

- Hermes Agent and Desktop **v0.23.0 or later**. Verified against v0.23.0; private native-authority APIs may need adaptation after Hermes updates.
- A running Hermes web listener with authentication. Configure it in **Settings → Web access**. The built-in initial setup uses Nous sign-in; an existing configured password login also works. This plugin does not create accounts or passwords.
- For automatic setup: use the **local main profile**, with the plugin's agent and desktop components enabled. Hosted/secondary-profile API requests do not carry the required native authority. Browser and remote sessions can use the QR/manual-URL flow.

## Install

### Option A — clone and link

```sh
git clone https://github.com/dandacompany/hermes-web-qr.git ~/hermes-web-qr
mkdir -p ~/.hermes/plugins
ln -s ~/hermes-web-qr ~/.hermes/plugins/hermes-web-qr
hermes plugins enable hermes-web-qr --no-allow-tool-override
```

The prebuilt `desktop/plugin.js` is included; Node.js is not required to install.

### Option B — Hermes installer

```sh
hermes plugins install dandacompany/hermes-web-qr --enable
```

### Verify

```sh
hermes plugins list
hermes plugins doctor hermes-web-qr
```

Open **Capabilities → Plugins**, rescan, and enable the **Desktop** component of **Web Access QR**. Open it from the status bar or **Settings → Plugins → Web Access QR**. The agent toggle and desktop toggle are separate.

If upgrading a manually copied desktop-only version, back up and remove its old `~/.hermes/desktop-plugins/hermes-web-qr` folder before rescanning, so Hermes can manage the unified package. The saved URL lives in app storage and is preserved.

## Use

| Connection | What the wizard does |
| --- | --- |
| Tailscale | Checks installation and login; on macOS with Homebrew, attempts `brew install --cask tailscale-app`; opens the installed app for login; validates Hermes authentication; configures or reuses HTTPS Serve on port 443. |
| Cloudflare Tunnel | Guides account, domain, connector and published application setup in the official console. No tokens, DNS changes or unattended installations. |
| Existing HTTPS URL | Validates and saves a manually verified address from any tunnel or reverse proxy. |

For Tailscale, follow the wizard's **Hermes Web access** step to configure the displayed URL and sign-in before enabling sharing. The plugin does not edit Hermes authentication or server configuration. Installer approvals and account login stay in the operating system and vendor app. If Homebrew needs interactive administrator approval, use the official download button. Other operating systems use manual installation/login; their automation has not been verified.

Tailscale Serve stays private to your tailnet. Install Tailscale on your phone and connect it to the same network. The QR does not bypass Hermes sign-in.

For Cloudflare or another public HTTPS service, verify the Hermes login page before sharing the address. These methods do not require Tailscale. The manual flow validates URL syntax only, not external connectivity or access policies.

## Build

```sh
npm ci
npm run build
```

The build writes `desktop/plugin.js` and `dist/plugin.js`. The public bundle has no default hostname. Source is TypeScript/React; the local setup API uses Python's standard library and Hermes's FastAPI runtime. The QR is generated locally; no QR service is contacted.

## Security and limits

- Every setup API route requires a native local desktop grant. Cookies, bearer credentials and browser origins do not confer setup authority.
- Fixed actions and argument lists only; no arbitrary command or URL-fetch endpoint. CLI output and inherited API credentials are not forwarded to the UI or vendor processes.
- Sharing requires a live login gate and an unauthenticated identity request returning 401. Unknown state, occupied port 443, extra routes and public Funnel configurations block automatic changes.
- No Serve reset, account switch, Funnel enablement or replacement of existing routes. Do not change Serve concurrently in another tool; external changes cannot be transactionally locked by this plugin.
- Existing URLs must use HTTPS and cannot contain user information, query strings, fragments or loopback addresses. Do not put credentials in URL paths.
- macOS existing-install discovery, authenticated origin detection and reuse of an existing Serve route were tested. Clean-machine installation, physical phone scans and other operating systems have not been end-to-end tested. Translation catalogs are complete; live language switching was checked in English and Korean.
- Uninstalling the plugin does not uninstall Tailscale or remove its persistent Serve configuration. Manage those in Tailscale.

Official setup references: [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve), [Tailscale installation](https://tailscale.com/download), [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/get-started/).

## Attribution and license

Built for [Hermes Agent](https://github.com/NousResearch/hermes-agent). QR generation uses [qrcode](https://github.com/soldair/node-qrcode) and dijkstrajs; see [third-party notices](./THIRD_PARTY_NOTICES.md).

[MIT](./LICENSE) © Dante Labs.

---
[Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [Email](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [Buy Me a Coffee](https://buymeacoffee.com/dante.labs)
