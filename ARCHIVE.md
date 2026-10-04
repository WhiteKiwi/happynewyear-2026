# 연하장 아카이브 운영

`happynewyear-2026.whitekiwi.link`와 기존 `?f=` 편지 링크를 유지한다.
편지 JSON은 URL에 있고 브라우저에서 복원된다. DB나 편지 저장 API는 없다.
사용자가 원본 편지 링크를 보관하며 운영 백업에는 정적 파일과 소스만 포함한다.

2026-10-04부터 Mac mini nginx + 기존 WhiteKiwi 공유 CloudFront로 운영한다.
Google Analytics를 제거하고 referrer 전송을 막았다. 편지 작성 `/kiwi`, 답신,
봉투 애니메이션, 음악, 폰트와 링크 encoding/decoding은 기존 구현을 유지한다.

`pnpm install --frozen-lockfile` 후 `pnpm build`로 정적 배포본을 재현한다.
실제 host integration·배포·검증·rollback·AWS 비용은
[infra 운영 문서](https://github.com/WhiteKiwi/infra/tree/main/services/happynewyear)에 있다.
편지 링크를 public Git, 이슈, analytics에 남기지 않는다.
