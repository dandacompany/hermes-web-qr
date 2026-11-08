# hermes-web-qr

**Web Access QR — Hermes Desktop의 외부 접속 설정과 휴대폰 QR 플러그인.**

English: [README.md](./README.md)

Tailscale 설치와 연결을 돕고, Cloudflare Tunnel을 단계별로 안내하며, 이미 준비한 HTTPS 주소도 사용할 수 있습니다. QR에는 저장한 접속 주소만 담고 기존 Hermes 로그인 방식을 유지합니다.

화면은 Hermes 기본 컴포넌트를 사용하며 앱의 언어 설정을 따릅니다. 플러그인 이름은 항상 **Web Access QR**입니다. 한국어·영어·일본어·중국어 간체/번체·독일어·프랑스어·스페인어·러시아어·아랍어를 제공합니다. 추가 언어팩의 언어는 영어로 표시합니다.

## 준비 사항

- Hermes Agent와 Desktop **v0.23.0 이상**. v0.23.0에서 검증했습니다. Hermes의 내부 로컬 권한 API를 사용하므로 이후 업데이트에서 호환성 조정이 필요할 수 있습니다.
- 로그인 보호가 켜진 Hermes 웹 서버. **설정 → Web access**에서 준비합니다. 기본 최초 설정은 Nous 로그인을 이용하며, 이미 설정한 비밀번호 로그인도 유지합니다. 이 플러그인은 계정이나 비밀번호를 만들지 않습니다.
- 자동 설정은 **이 컴퓨터의 기본 프로필**에서 사용하며 에이전트·데스크톱 기능을 모두 켭니다. 격리된 보조 프로필에는 필요한 로컬 권한이 전달되지 않습니다. 웹·원격 환경에서는 QR과 기존 주소 입력을 사용할 수 있습니다.

## 설치

### Option A — 복제 후 연결

```sh
git clone https://github.com/dandacompany/hermes-web-qr.git ~/hermes-web-qr
mkdir -p ~/.hermes/plugins
ln -s ~/hermes-web-qr ~/.hermes/plugins/hermes-web-qr
hermes plugins enable hermes-web-qr --no-allow-tool-override
```

빌드된 `desktop/plugin.js`가 포함되어 있어 설치할 때 Node.js는 필요하지 않습니다.

### Option B — Hermes 설치 명령

```sh
hermes plugins install dandacompany/hermes-web-qr --enable
```

### Verify — 설치 확인

```sh
hermes plugins list
hermes plugins doctor hermes-web-qr
```

**Capabilities → 플러그인**에서 다시 검색하고 **Web Access QR의 데스크톱 기능**도 켜세요. 상태 표시줄의 버튼 또는 **설정 → 플러그인 → Web Access QR**에서 엽니다. 에이전트와 데스크톱 활성화는 별개입니다.

이전에 파일을 직접 복사한 데스크톱 전용 버전을 썼다면 `~/.hermes/desktop-plugins/hermes-web-qr` 폴더를 백업하고 제거한 후 다시 검색하세요. 통합 패키지가 데스크톱 파일을 관리하게 됩니다. 저장한 주소는 앱 저장소에 있어 유지됩니다.

## 사용

| 방식 | 마법사가 하는 일 |
| --- | --- |
| Tailscale | 설치·로그인 상태 확인, macOS의 Homebrew 설치 시도, 앱 로그인 안내, Hermes 로그인 보호 확인, 443 포트 HTTPS Serve 설정 또는 기존 연결 재사용 |
| Cloudflare Tunnel | 공식 콘솔에서 계정·도메인·연결 프로그램·공개 주소 설정 안내. 토큰 입력이나 DNS 자동 변경은 하지 않음 |
| 기존 HTTPS 주소 | 기존 터널·프록시 주소를 직접 확인한 후 형식 검사와 저장 |

Tailscale 흐름의 **Hermes 로그인 준비** 단계에서 표시된 주소를 Web access에 넣고 로그인을 설정한 다음 공유를 켜세요. 이 플러그인은 Hermes 인증과 서버 설정을 직접 수정하지 않습니다. 운영체제 관리자 승인과 서비스 로그인은 각 공식 화면에서 진행합니다. Homebrew 설치가 권한 문제로 실패하면 공식 다운로드 버튼을 사용하세요. 다른 운영체제는 설치·로그인을 수동으로 진행하며 자동화는 검증하지 않았습니다.

Tailscale 공유는 해당 네트워크 안에서만 열립니다. 휴대폰에도 Tailscale을 설치하고 같은 네트워크에 연결하세요. QR은 Hermes 로그인을 건너뛰지 않습니다.

Cloudflare나 다른 HTTPS 서비스에서는 주소를 공유하기 전에 Hermes 로그인 화면을 확인하세요. Tailscale 없이 사용할 수 있습니다. 직접 주소 입력은 URL 형식만 검사하며 외부 접속과 접근 정책은 사용자가 확인합니다.

## 빌드

```sh
npm ci
npm run build
```

`desktop/plugin.js`와 `dist/plugin.js`를 만듭니다. 공개 버전의 기본 접속 주소는 비어 있습니다. 화면은 TypeScript/React, 설정 API는 Python 표준 라이브러리와 Hermes FastAPI를 사용합니다. QR은 로컬에서 생성합니다.

## 보안과 제한

- 설정 API는 이 컴퓨터의 데스크톱 권한만 허용합니다. 웹 쿠키·원격 토큰으로 설치나 공유를 실행할 수 없습니다.
- 정해진 작업과 명령 인자만 실행합니다. 임의 셸·URL 호출 API는 없고, CLI 원문 출력이나 API 자격증명을 전달하지 않습니다.
- 로그인 보호와 비로그인 신원 조회의 401 응답을 확인한 뒤 공유합니다. 상태 불명·443 포트 충돌·추가 경로·공개 Funnel 설정이 있으면 자동 변경을 차단합니다.
- Serve 전체 초기화, 계정 전환, Funnel 활성화, 기존 경로 덮어쓰기는 하지 않습니다. 다른 도구에서 Serve를 동시에 변경하지 마세요. 외부 변경까지 잠글 수는 없습니다.
- HTTPS만 허용하며 계정정보·쿼리·프래그먼트·루프백 주소를 차단합니다. URL 경로에도 비밀번호를 넣지 마세요.
- macOS에서 기존 설치 감지, 로그인 보호 확인, 기존 공유 재사용을 검증했습니다. 새 컴퓨터에서의 전체 설치, 실물 휴대폰 스캔, 다른 운영체제는 검증하지 않았습니다. 번역 키는 10개 언어 모두 검사했고, 실제 언어 전환은 영어·한국어로 확인했습니다.
- 플러그인을 삭제해도 Tailscale 앱과 지속되는 Serve 설정은 남습니다. Tailscale에서 관리하세요.

공식 문서: [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve), [Tailscale 설치](https://tailscale.com/download), [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/get-started/).

## 출처와 라이선스

[Hermes Agent](https://github.com/NousResearch/hermes-agent)용 플러그인입니다. QR 생성에는 [qrcode](https://github.com/soldair/node-qrcode)와 dijkstrajs를 사용합니다. [서드파티 고지](./THIRD_PARTY_NOTICES.md)를 참고하세요.

[MIT](./LICENSE) © Dante Labs.

---
[Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [이메일](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [커피 한 잔 후원](https://buymeacoffee.com/dante.labs)
