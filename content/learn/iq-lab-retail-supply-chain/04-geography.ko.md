---
title: "지리"
description: "Region과 Store를 모델링해 지리 구조를 추가합니다 — 주문이 이행되는 곳과 매장이 위치한 곳."
---

## 위치 맥락 추가

상거래는 진공에서 일어나지 않습니다. **장소**에서 일어납니다. 지리 엔티티를 추가하면 이런 질문에 답할 수 있습니다.

- "남서 지역의 총매출은?"
- "북동 지역에서 주문량이 감소하는 매장은?"
- "남서 지역에 콜드체인 물류가 필요한가?"

## Region

Region은 매장과 창고를 포함하는 넓은 지리 영역을 대표합니다.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `regionId` | string | ✓ |
| `regionName` | string | |
| `timezone` | string | |
| `coldChainRequired` | boolean | |

`coldChainRequired` 속성은 **boolean 속성**의 좋은 예입니다. 예/아니오 비즈니스 규칙(이 지역에 냉장 배송이 필요한가?)을 문서에 묻어 두지 않고 질의 가능한 속성으로 담습니다.

## Store

Store는 고객이 주문을 발주하는 물리적 리테일 위치입니다.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `storeId` | string | ✓ |
| `storeName` | string | |
| `address` | string | |

## 새 관계

- **OrderFulfilledToRegion** — `Order` → `Region` (many-to-one)
  각 주문은 하나의 지역에서 이행됩니다. 지역별 매출 분석을 가능하게 합니다.

- **StoreInRegion** — `Store` → `Region` (many-to-one)
  각 매장은 하나의 지역에 속합니다. 주문 관계와 결합하면 Region으로 가는 두 경로가 만들어져 분석 관점을 다양화할 수 있습니다.

## 지리 계층

**Store** → **Region** 이 **지리 계층**을 형성한다는 패턴에 주목하세요. 더 상세한 온톨로지에서는 City, State, Country 레벨을 추가할 수 있습니다. 핵심 원칙은 다음과 같습니다.

> 계층의 각 레벨은 many-to-one 관계로 다음 레벨과 연결됩니다. 이 덕분에 자동 롤업이 가능합니다. 매장 수준 데이터가 지역 수준 총계로 집계됩니다.

## 3단계 그래프

<ontology-embed id="official/iq-lab-retail-step-3" diff="official/iq-lab-retail-step-2" height="400px"></ontology-embed>

*7개 엔티티 타입. Region과 Store가 지리 맥락을 더합니다. Order가 Customer(누가 샀는가)와 Region(어디서 이행됐는가) 양쪽에 연결된다는 점에 주목하세요.*

## 배운 것

- **지리 엔티티**는 위치 기반 분석을 가능하게 합니다
- **boolean 속성**(`coldChainRequired` 같은)은 비즈니스 규칙을 담습니다
- **계층**은 데이터를 세분화된 수준에서 집계 수준으로 롤업할 수 있게 합니다
- 하나의 엔티티는 여러 엔티티와 관계를 가질 수 있습니다. Order는 Customer, Product(OrderLine 경유), Region에 연결됩니다

```quiz
Q: Store에 "region" 텍스트 속성을 추가하지 않고 Region을 별도 엔티티로 모델링하는 이유는?
- 저장 공간을 절약하려고
- 롤업 질의를 가능하게 하고 지리 데이터의 단일 진실 원천을 유지하려고 [correct]
- 온톨로지 다이어그램이 예뻐 보이려고
- Fabric IQ가 요구해서
> Region을 별도 엔티티로 모델링하면 Store → Region 계층이 만들어집니다. 이 덕분에 IQ가 지역별 데이터를 집계할 수 있고("북동 지역 총매출"), 지역 메타데이터가 매장마다 중복되지 않고 한 번만 정의됩니다.
```

다음에는 주문이 실제로 어떻게 배달되는지 모델링합니다.
