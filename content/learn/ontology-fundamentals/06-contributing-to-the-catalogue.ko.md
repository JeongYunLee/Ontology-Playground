---
title: 카탈로그에 기여하기
description: 여러분의 온톨로지를 커뮤니티와 공유하는 방법 — 포크, RDF와 메타데이터 추가, PR 제출, 그리고 카탈로그에 게시되기까지.
---

## 커뮤니티 카탈로그

Ontology Playground에는 온톨로지 [카탈로그](#/catalogue)가 포함되어 있습니다. 일부는 프로젝트 팀이 관리("official")하고, 일부는 커뮤니티가 기여한 것입니다. 누구나 풀 리퀘스트를 열어 온톨로지를 제출할 수 있습니다.

## 두 가지 기여 방법

### 옵션 A: 디자이너에서 원클릭 PR

가장 빠른 기여 방법:

1. [Designer](#/designer)를 열고 온톨로지를 만들거나 기존 것을 불러오세요
2. 툴바의 **Submit to Catalogue**를 클릭
3. 메타데이터 입력: 이름, 설명, 카테고리, 태그
4. GitHub 디바이스 플로우로 로그인 (비밀번호는 저장되지 않음)
5. 도구가 자동으로 저장소를 포크하고, 브랜치를 만들고, RDF와 메타데이터를 커밋한 뒤 풀 리퀘스트를 엽니다

끝입니다. CI 파이프라인이 RDF를 검증하고, 메타데이터 스키마를 확인하고, 테스트를 실행합니다. 유지 관리자가 리뷰하고 머지합니다.

### 옵션 B: 수동 PR

Git으로 직접 작업하는 것을 선호한다면:

1. GitHub에서 저장소를 **포크**하세요
2. `catalogue/community/<your-github-username>/<ontology-slug>/` 아래에 디렉터리를 만드세요
3. 두 개의 파일을 추가하세요:
   - `ontology.rdf` — RDF/OWL 파일
   - `metadata.json` — 온톨로지 설명

## 메타데이터 포맷

```json
{
  "name": "Library System",
  "description": "A public library with books, authors, members, and loans.",
  "icon": "📚",
  "category": "education",
  "tags": ["library", "books", "lending"],
  "author": "your-github-username"
}
```

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `name` | 필수 | 카탈로그에 표시되는 이름 |
| `description` | 필수 | 한 문장 요약 |
| `category` | 필수 | 다음 중 하나: `retail`, `healthcare`, `finance`, `manufacturing`, `education`, `technology`, `general` |
| `icon` | 선택 | 카드에 표시될 단일 이모지 |
| `tags` | 선택 | 검색용 소문자 키워드 배열 |
| `author` | 선택 | GitHub 사용자명 (원클릭 흐름에서는 자동 입력) |

## 검증 규칙

PR은 다음 규칙에 대해 자동으로 검증됩니다.

- **유효한 RDF/OWL** — 오류 없이 파싱되어야 함
- **라운드트립 무결성** — `parse(serialize(ontology))`가 동등한 결과를 내야 함
- **메타데이터 스키마** — 필수 필드가 모두 있고 카테고리가 유효해야 함
- **디렉터리 명명** — 소문자 알파벳/숫자, 하이픈, 언더스코어만 허용
- **심볼릭 링크 금지** — 보안을 위해 카탈로그의 심볼릭 링크는 거절됩니다

## 머지된 뒤에는?

머지되면 빌드 파이프라인이 다음을 수행합니다.

1. `npm run catalogue:build`를 실행해 모든 RDF 파일을 `catalogue.json`으로 컴파일
2. 업데이트된 사이트를 배포하고, 여러분의 온톨로지가 [Gallery](#/catalogue)에 표시됨
3. 임베드, 딥 링크, Playground 불러오기에 즉시 사용 가능

<ontology-embed id="official/university" height="400px"></ontology-embed>

*University System 온톨로지는 official 카탈로그 엔트리 중 하나입니다. 커뮤니티 기여도 같은 포맷을 따르며, 여러분의 온톨로지도 갤러리에서 이렇게 표시됩니다.*

## 부드러운 리뷰를 위한 팁

- **좋은 설명을 작성하세요** — 어떤 도메인을 모델링했고 누구를 위한 것인지 설명하세요
- **의미 있는 태그를 추가하세요** — 검색에서 여러분의 온톨로지를 찾는 데 도움이 됩니다
- **로컬에서 테스트하세요** — push 전에 `npm run validate -- catalogue/community/<you>/<slug>/ontology.rdf`를 실행하세요
- **초점을 유지하세요** — 3~8개의 엔티티 타입으로 구성된 명확한 온톨로지가 30개 이상이 흩어져 있는 것보다 훨씬 유용합니다

## 핵심 정리

- 누구나 원클릭 PR 흐름 또는 수동 풀 리퀘스트로 온톨로지를 기여할 수 있습니다
- 각 제출에는 RDF 파일과 `metadata.json`이 필요합니다
- CI가 RDF를 자동 검증합니다. 리뷰 전에 오류를 수정하세요
- 머지된 온톨로지는 배포 직후 라이브 카탈로그에 나타납니다

```quiz
Q: 모든 카탈로그 기여에 반드시 포함되어야 하는 두 파일은?
- ontology.json과 README.md
- schema.rdf와 config.yaml
- ontology.rdf와 metadata.json [correct]
- index.html과 style.css
> 각 카탈로그 엔트리에는 ontology.rdf 파일(RDF/OWL 온톨로지)과 metadata.json 파일(이름, 설명, 카테고리, 태그)이 필요합니다.
```
