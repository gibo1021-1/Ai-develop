# AI 디벨롭

강의 소개, 3단계 로드맵, 수강 후기, 무료 자료, 강사진을 소개하는 한국어 웹사이트입니다. 별도 패키지 설치 없이 Node.js 18 이상으로 빌드합니다.

## GitHub Pages 배포

`docs/`에 GitHub Pages용 완성 파일을 포함합니다.

1. GitHub 저장소의 **Settings → Pages**를 엽니다.
2. **Source**를 **Deploy from a branch**로 선택합니다.
3. **Branch**를 `main`, 폴더를 `/docs`로 선택하고 **Save**를 누릅니다.

배포가 완료되면 Pages 설정 화면에 방문자용 주소가 표시됩니다. 저장소 주소와 실제 사이트 주소는 다릅니다.

현재 기본 배포 대상은 `gibo1021-1/Ai-develop`입니다. 다른 이름의 저장소에 올릴 때에는 다음 명령으로 해당 저장소 이름에 맞춰 다시 빌드하세요.

```sh
npm run build:pages -- gibo1021-1/Ai-develop
```

GitHub에서 내용을 수정한 뒤에는 이 명령으로 `docs/`도 갱신해 함께 커밋해야 사이트에 반영됩니다. 사이트는 로그인 없이 방문할 수 있으며, GitHub Pages 설정은 저장소에서 관리합니다.

## 로컬 확인

```sh
npm run build
python -m http.server 4173 --directory dist
```

브라우저에서 `http://localhost:4173/`를 엽니다.

## 파일 구성

- `src/layout.html`: 공통 메뉴, 푸터와 안내 창
- `src/sections/`: 페이지별 본문
- `site/`: CSS, JavaScript, 이미지, 글꼴과 무료 PDF
- `scripts/build.mjs`: 정적 페이지 빌드
- `scripts/build-pages.mjs`: 저장소 경로에 맞춘 GitHub Pages 빌드
- `docs/`: GitHub Pages에 게시하는 파일

홈, 강의(`/classes/`), 로드맵(`/roadmap/`), 후기(`/reviews/`), 무료 자료(`/resources/`), 강사진(`/instructors/`)의 여섯 페이지로 구성했습니다. 후기 자동 넘김은 3초이며, 마우스·키보드·일시정지·모바일 좌우 밀기를 지원합니다.

## 수강 및 자료 안내

카카오 채널: http://pf.kakao.com/_xgrjxaX/chat

현재 안내하는 과정은 ‘나만의 비서 챗봇 만들기’, 3주·99,000원입니다. Zoom 온라인으로 주 1회, 총 3회, 회당 약 60~90분 예정입니다. 개강일, 사용할 도구와 추가 구독 비용, 결제 방법과 환불 기준은 별도 안내합니다. 사이트에는 온라인 결제 기능을 연결하지 않았습니다.

무료 PDF와 외부 전자책·노션 자료 링크를 제공합니다. 후기는 닉네임 일부를 가린 텍스트로 게시하며, 원본 프로필 사진을 포함하지 않습니다.
