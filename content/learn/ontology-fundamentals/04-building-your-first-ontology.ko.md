---
title: 첫 번째 온톨로지 만들기
description: 시각적 디자이너를 사용해 처음부터 온톨로지를 만드는 단계별 튜토리얼입니다. 엔티티를 추가하고, 속성을 정의하고, 관계로 연결한 다음 RDF로 내보냅니다.
---

## 무엇을 만들까

이 튜토리얼에서는 세 개의 엔티티 타입 `Book`, `Author`, `Member`가 관계로 연결된 간단한 **도서관(Library)** 온톨로지를 만듭니다. 끝날 즈음에는 Microsoft Fabric IQ나 다른 시맨틱 도구에서 사용할 수 있는 유효한 RDF 파일을 갖게 됩니다.

## 1단계: 디자이너 열기

상단 내비게이션의 **Designer** 버튼을 클릭하거나 [/#/designer](#/designer)로 직접 이동하세요. 빈 캔버스가 나타납니다. 왼쪽에는 엔티티 폼, 오른쪽에는 실시간 그래프 미리보기가 있습니다.

## 2단계: 엔티티 타입 만들기

**+ Add Entity** 버튼으로 세 개의 엔티티를 추가하세요.

**Book**
- Name: `Book`
- Icon: `📚`
- Color: 파란 계열
- Properties:
  - `isbn` — string, **identifier** ✓
  - `title` — string
  - `publishedYear` — integer

**Author**
- Name: `Author`
- Icon: `✍️`
- Color: 초록 계열
- Properties:
  - `authorId` — string, **identifier** ✓
  - `name` — string
  - `nationality` — string

**Member**
- Name: `Member`
- Icon: `👤`
- Color: 보라 계열
- Properties:
  - `memberId` — string, **identifier** ✓
  - `name` — string
  - `joinDate` — date

각 엔티티를 추가할 때마다 그래프 미리보기가 실시간으로 갱신되는 것을 확인하세요.

## 3단계: 관계 추가

**Relationships** 탭으로 전환한 뒤 아래를 추가하세요.

| 관계 | 출발 | 도착 | 카디널리티 |
|-------------|------|-----|-------------|
| `writtenBy` | Book | Author | Many-to-one |
| `borrowedBy` | Book | Member | Many-to-many |

`writtenBy` 관계가 many-to-one인 이유는 많은 책이 한 명의 저자를 공유할 수 있지만 각 책의 주 저자는 한 명이기 때문입니다. `borrowedBy` 관계가 many-to-many인 이유는 한 권의 책이 여러 회원에게 대출될 수 있고, 한 명의 회원도 여러 책을 대출할 수 있기 때문입니다.

## 4단계: 검증

툴바의 **Validate** 버튼을 클릭하세요. 모두 올바르면 "No issues found" 라는 초록 배너가 나타납니다. 그렇지 않으면 아래 항목들을 수정하세요.

- 모든 엔티티는 하나 이상의 식별자 속성이 있어야 합니다
- 관계는 존재하는 엔티티 타입을 참조해야 합니다
- 중복되는 ID가 없어야 합니다

## 5단계: RDF 미리보기

미리보기 패널의 **RDF** 탭을 클릭하세요. 문법 강조가 적용된 실시간 RDF/OWL 출력을 볼 수 있습니다. 이것이 Fabric IQ 같은 도구가 소비하는 정확한 파일입니다.

<ontology-embed id="official/cosmic-coffee" height="400px"></ontology-embed>

*Fourth Coffee 온톨로지도 같은 흐름으로 만들어졌습니다. 여러분의 도서관 온톨로지도 비슷하게 보일 것입니다. 엔티티는 색깔 있는 노드로, 관계는 방향이 있는 엣지로 표시됩니다.*

## 6단계: 내보내기

세 가지 선택지가 있습니다.

1. **Download RDF** — 다운로드 폴더에 `.rdf` 파일 저장
2. **Submit to Catalogue** — 커뮤니티 카탈로그에 기여하는 원클릭 PR 흐름 시작 (GitHub 로그인 필요)
3. **Copy JSON** — 앱에서 사용할 JSON 표현을 클립보드에 복사

## 다음은 뭘까?

- [Catalogue](#/catalogue)를 둘러보며 다른 온톨로지의 구조를 살펴보세요
- [Ontology Design Patterns](#/learn/ontology-design-patterns)에서 명명 규칙과 모범 사례를 확인하세요
- 홈 페이지의 **Query Playground**에서 여러분의 온톨로지에 자연어 질문을 던져 보세요

## 핵심 정리

- 디자이너는 코드 없이 온톨로지를 만드는 시각적 흐름을 제공합니다
- 모든 엔티티는 이름, 하나 이상의 속성, 하나의 식별자가 필요합니다
- 관계는 이름과 카디널리티로 엔티티를 연결합니다
- 실시간 그래프와 RDF 미리보기가 즉각적인 피드백을 줍니다
- Fabric IQ용으로 RDF로 내보내거나, 커뮤니티 카탈로그에 바로 제출할 수 있습니다

```quiz
Q: Book과 Member 사이의 borrowedBy 관계가 many-to-many로 설정된 이유는?
- 한 권의 책은 한 번만 대출될 수 있어서
- 각 회원은 한 번에 정확히 한 권만 대출해서
- 한 권의 책이 시간에 걸쳐 여러 회원에게 대출될 수 있고, 한 명의 회원도 여러 책을 대출할 수 있어서 [correct]
- Many-to-many가 모든 관계의 기본값이라서
> 한 권의 책은 서로 다른 시점에 서로 다른 회원에게 대출될 수 있고, 각 회원은 여러 책을 동시에 대출할 수 있습니다. 이 양방향 다중성 때문에 many-to-many가 됩니다.
```
