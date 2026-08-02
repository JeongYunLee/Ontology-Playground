---
title: "2단계: 지리 계층"
description: "지리적 집중 분석을 위해 재해 지역 플래그가 있는 지역·국가·관할권을 추가합니다."
reviewStatus: under-human-review
---

## 리스크가 사는 곳

업종 분류는 포트폴리오가 *어느* 부문에 노출되어 있는지 알려 줍니다. 지리 계층은 *어디*인지 알려 줍니다. 플로리다에 집중된 포트폴리오는 캘리포니아에 집중된 것과 다른 리스크에 직면합니다 — 허리케인 vs 지진과 산불.

이 단계에서 자연재해 플래그로 강화된, 세분화 수준이 점점 커지는 세 지리 위치 엔티티를 추가합니다.

## 새 엔티티 타입

### Region

대륙 또는 거시경제 지역 — "북아메리카", "유럽", "아시아-태평양".

| 속성 | 타입 | 노트 |
|---|---|---|
| `regionCode` | string | 식별자 |
| `regionName` | string | 표시 이름 |
| `description` | string | 지역 설명 |
| `disasterProfile` | string | 지역의 지배적 재해 유형 |

### Country

경제와 규제 속성을 가진 국가.

| 속성 | 타입 | 노트 |
|---|---|---|
| `countryCode` | string | 식별자 (ISO 국가 코드) |
| `countryName` | string | 표시 이름 |
| `economicZone` | string | 경제 분류 (예: "선진국", "신흥국") |
| `currency` | string | 국가 통화 코드 |
| `regulatoryFramework` | string | 주요 은행 규제 기관 |

### Jurisdiction

boolean 재해 지역 플래그가 있는 하위 국가 관할권 (주, 도).

| 속성 | 타입 | 노트 |
|---|---|---|
| `code` | string | 식별자 (예: "FL", "CA") |
| `name` | string | 표시 이름 |
| `hurricaneZone` | boolean | 허리케인 리스크 노출 |
| `floodZone` | boolean | 홍수 리스크 노출 |
| `earthquakeZone` | boolean | 지진 리스크 노출 |
| `wildfireZone` | boolean | 산불 리스크 노출 |
| `coastal` | boolean | 해안 관할권 |
| `latitude` | decimal | 지리적 위도 |
| `longitude` | decimal | 지리적 경도 |

## 새 관계

- **inCountry**: `Jurisdiction` → `Country` (`many-to-one`) — 각 관할권은 하나의 국가에 속함
- **inRegion**: `Jurisdiction` → `Region` (`many-to-one`) — 각 관할권은 하나의 지리 지역에 매핑됨

## 설계 패턴: boolean 리스크 플래그

Jurisdiction이 하나의 "riskType" enum 대신 **boolean 플래그**를 사용한다는 점에 주목하세요. 이는 의도적입니다 — 관할권은 여러 재해 지역에 동시에 있을 수 있습니다. 플로리다는 `hurricaneZone`인 동시에 `floodZone`입니다. 캘리포니아는 `earthquakeZone`인 동시에 `wildfireZone`입니다.

이 패턴이 정밀한 필터링을 가능하게 합니다.

- "`hurricaneZone = true` AND `coastal = true`인 모든 관할권을 보여 줘"
- "`earthquakeZone` 관할권에서 우리 총 노출은?"

## 두 개의 독립된 계층

이 시점에서 모델은 두 개의 별도 하위 그래프를 가집니다.

1. **업종**: Sector ← Subsector ← IndustryGroup
2. **지리**: Region ← Country (Jurisdiction 경유), Region ← Jurisdiction

이들은 대출 상품과 규제 한도를 추가하는 이후 단계에서 연결됩니다.

## 2단계 그래프 (1단계 대비 차이)

<ontology-embed id="official/fibo-risk-step-2" diff="official/fibo-risk-step-1" height="400px"></ontology-embed>

*세 개의 새 엔티티(강조 표시)가 지리 차원을 더합니다. 두 개의 독립된 하위 그래프에 주목하세요 — 3단계에서 연결됩니다.*

```quiz
Q: Jurisdiction이 단일 riskType 속성 대신 boolean 플래그를 사용하는 이유는?
- boolean 플래그가 DB 저장이 더 쉬워서
- 관할권은 여러 재해 지역에 동시에 있을 수 있는데 단일 enum으로는 표현할 수 없어서 [correct]
- boolean 플래그가 그래프 시각화에서 더 잘 렌더링돼서
- FIBO가 모든 분류자에 boolean 속성을 요구해서
> 한 관할권은 동시에 여러 자연재해 리스크에 직면할 수 있습니다. 플로리다는 허리케인에도 홍수에도 취약합니다. boolean 플래그는 정밀한 다차원 필터링을 허용하며, "허리케인 지역 AND 해안 AND 홍수 지역" 같은 복합 리스크 질의에 필수적입니다.
```
