---
title: "과수원 기초"
description: "Zava의 다중 원산지 소싱 모델을 담는 네 엔티티 — Grower, Farm, Plot, FruitVariety를 정의합니다."
---

## Zava 데이터가 시작되는 곳

Zava는 파트너 생산자 네트워크에서 프리미엄 과일을 조달합니다. 품질·배송·리테일 주문을 이야기하기 전에 **누가 어디서 무엇을 재배하는지**에 대한 어휘가 필요합니다.

네 엔티티가 이를 담습니다.

- **Grower** — 파트너 회사 (예: *Finca La Marina S.L.*)
- **Farm** — 재배자가 소유하거나 운영하는 지리적 부지
- **Plot** — 하나의 품종이 식재된 농장 내 관리 필지
- **FruitVariety** — 상업 품종 (예: *Nadorcott* 만다린, *Sekoya Pop* 블루베리)

## 엔티티

### Grower

| 속성 | 타입 | 식별자? |
|---|---|---|
| `growerId` | string | ✓ |
| `name` | string | |
| `country` | string | |
| `partnerSince` | date | |
| `isMasterGrower` | boolean | |

`isMasterGrower`는 Zava의 전략적 장기 파트너를 표시합니다.

### Farm

| 속성 | 타입 | 식별자? |
|---|---|---|
| `farmId` | string | ✓ |
| `name` | string | |
| `country` | string | |
| `region` | string | |
| `hectares` | decimal (ha) | |

### Plot

| 속성 | 타입 | 식별자? |
|---|---|---|
| `plotId` | string | ✓ |
| `hectares` | decimal (ha) | |
| `plantingYear` | integer | |

### FruitVariety

| 속성 | 타입 | 식별자? |
|---|---|---|
| `varietyId` | string | ✓ |
| `commercialName` | string | |
| `category` | string | |
| `shelfLifeDays` | integer (days) | |

## 관계

| 출발 | 동사 | 도착 | 카디널리티 |
|---|---|---|---|
| Grower | owns | Farm | one-to-many |
| Farm | contains | Plot | one-to-many |
| Plot | grows | FruitVariety | many-to-one |

`Grower → Farm → Plot → FruitVariety` 체인이 **종단 간 추적성**을 가능하게 합니다. 매장 진열대의 과일 한 조각을 정확히 어느 필지에서 왔는지까지 되짚어 갈 수 있습니다.

## 지금까지의 그래프

<ontology-embed id="official/zava-grove-to-shelf-step-1" height="380px"></ontology-embed>

*네 개의 엔티티와 세 개의 관계만으로도 "Zava가 스페인에서 소싱하는 Nadorcott 만다린은 몇 헥타르인가?" 같은 질문에 답하기 충분합니다.*

```quiz
Q: Zava 모델에서 `Plot`이 `Farm`의 속성이 아닌 별도 엔티티인 이유는?
- 그래프가 더 조밀해 보여서
- 한 농장이 서로 다른 품종을 심은 여러 필지를 가질 수 있고, 추적성이 필지 수준의 정체성을 요구해서 [correct]
- 필지가 농장과 다른 소유자를 가져서
- RDF가 요구해서
> 필지는 일급 개념입니다. 한 농장이 대개 여러 품종을 나란히 재배하고, Zava는 각 수확 로트를 농장이 아닌 특정 필지까지 되짚어야 하기 때문이죠.
```

다음에는 **수확 이벤트**와 유명한 **4단계 품질 검사**를 추가합니다.
