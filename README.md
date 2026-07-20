# Jamkris Homepage

이승현(Jamkris)의 포트폴리오 & 블로그. Next.js 16 + Payload CMS 3 단일 앱.

- 공개 페이지: 홈 / 블로그 / 소개 / 포트폴리오 (`/ko`, `/en`)
- 어드민: `/admin` — 모든 콘텐츠 관리 (Payload CMS)
- DB: SQLite, 업로드: 로컬 파일시스템 (`MEDIA_DIR`)

## 개발

```bash
cp .env.example .env   # PAYLOAD_SECRET 채우기: openssl rand -hex 24
npm install
npm run dev            # http://localhost:3000
```

- dev 모드는 스키마를 DB에 자동 반영(push)합니다.
- 컬렉션/글로벌 필드를 바꾸면: `npm run generate:types`

## i18n

- 라우팅: `/ko`(기본) · `/en` — UI 문자열은 `messages/*.json`
- 콘텐츠: 어드민 우측 상단 로케일 토글로 언어별 입력. 영어가 비어 있으면 한국어로 폴백.

## 배포 (Docker)

스키마가 바뀐 릴리즈 전에 마이그레이션 생성 (프로덕션은 push가 아니라 마이그레이션으로 스키마 반영, 시작 시 자동 실행):

```bash
npm run migrate:create <이름>
```

server1 (Dockge):

```bash
docker compose up -d --build
```

`compose.yaml`의 호스트 볼륨 경로(`/usb/homepage/...`)와 `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` 환경변수만 맞춰주면 됩니다. 호스트 볼륨 디렉토리는 `chown -R 1001:1001` 필요.

## 구조

```
src/
├── app/(frontend)/[locale]/   # 공개 페이지
├── app/(payload)/             # 어드민 (자동 생성)
├── collections/               # Posts, Projects, Media, Users
├── globals/                   # SiteSettings, About, Home
├── i18n/                      # next-intl 라우팅/설정
├── migrations/                # 프로덕션 DB 마이그레이션
└── components/, lib/, fields/, access/
```
