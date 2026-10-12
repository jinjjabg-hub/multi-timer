# 안드로이드 출시 체크리스트 (멀티타이머)

방식: 웹앱을 TWA(Trusted Web Activity)로 감싸 앱으로 출시. 화면은 웹사이트를 그대로 보여 주므로, 웹 수정은 스토어 재심사 없이 바로 반영된다.
앱 이름 `멀티타이머` · 패키지 `com.tm.multitimer` · 시작 주소 `https://jinjjabg-hub.github.io/multi-timer/`

## A. 이미 준비됨 (저장소 안)
- [x] 앱 아이콘 512 / 192 / 마스크용 (`icon-*.png`)
- [x] 홍보 그래픽 1024×500 (`feature-graphic.png`)
- [x] 스크린샷 6장 1080×1920 (`store/screenshots/`)
- [x] 개인정보처리방침 (`privacy.html`) ← 문의 이메일만 채우면 됨
- [x] 등록 문구·데이터 보안 답안 (`store/listing-ko.md`)
- [x] PWA 매니페스트 (id, 바로가기, 색상)

## B. 송승훈 님이 할 일 (사람이 해야 하는 것)
1. `privacy.html`의 노란 칸에 문의 이메일 입력
2. Google Play Console 개발자 계정 가입 (등록비 US$25, 본인 확인 필요)
3. 앱 만들기: 이름 `멀티타이머`, 언어 한국어, 앱, 무료
4. Play 앱 서명 사용(기본값). 업로드 키는 안전한 곳에 보관 (분실 시 재설정 요청 필요)
5. 개인 계정은 출시 전 비공개 테스트 요건(테스터 모집·기간)이 있을 수 있음 → 콘솔 안내 확인

## C. 앱 파일(AAB) 만들기 — 둘 중 하나
- 방법 1 (권장, 가장 쉬움): pwabuilder.com → 주소 입력 → Android 패키지 → 패키지 ID `com.tm.multitimer` → 다운로드한 zip의 `.aab`와 서명 키 파일 보관
- 방법 2: MANDU와 같은 GitHub Actions 방식 (워크플로 파일을 이 저장소에 추가 요청)

## D. 주소창 없는 앱처럼 보이게 하기 (필수 확인)
- `https://jinjjabg-hub.github.io/.well-known/assetlinks.json` 이 열려야 함
- 이 파일은 주소의 맨 뒤 `/multi-timer/`가 아니라 도메인 맨 앞에 있어야 해서, GitHub의 `jinjjabg-hub.github.io` 저장소에 올린다 (MANDU가 이미 쓰고 있으면 기존 목록에 항목을 추가)
- 서식은 `store/assetlinks.template.json`, 지문(SHA-256)은 Play Console → 앱 무결성 → 앱 서명 키 인증서에서 복사

## E. 콘솔 입력
- 스토어 등록정보: `store/listing-ko.md` 복사
- 데이터 보안, 콘텐츠 등급, 대상 연령(전체), 광고 없음
- 비공개/공개 테스트 → 프로덕션 신청

## F. 출시 전 최종 확인
- [ ] 폰에서 설치 후 주소창 없이 열림
- [ ] 소리·진동·화면 유지 동작
- [ ] 방 코드로 운영자↔태블릿 연결
- [ ] 개인정보처리방침 주소가 로그인 없이 열림
