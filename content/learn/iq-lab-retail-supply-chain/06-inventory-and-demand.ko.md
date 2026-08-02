---
title: "재고 & 수요"
description: "창고와 지역에 걸친 재고 수준을 추적하고 미래 수요를 예측하기 위해 Inventory, Forecast, DemandSignal을 추가합니다."
---

## 트랜잭션에서 계획으로

1~4단계는 **일어난 일** — 주문, 배송, 딜리버리 — 을 모델링했습니다. 이제 **일어나고 있는 일**(재고 수준, 수요 신호)과 **일어날 일**(예측)을 위한 엔티티를 추가합니다. 여기서 온톨로지가 진가를 발휘합니다. 이력·실시간·예측 데이터를 하나의 모델 아래 통합하는 것이죠.

## Inventory

각 창고의 재고 수준.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `inventoryId` | string | ✓ |
| `stockLevel` | integer | |
| `reorderPoint` | integer | |

`reorderPoint`는 새 재고를 주문해야 하는 임계값을 나타냅니다. 공급망 관리의 결정적 지표입니다.

## Forecast

상품에 대한 예측 수요.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `forecastId` | string | ✓ |
| `forecastDate` | date | |
| `predictedDemand` | integer | |

## DemandSignal

검색 트렌드, 소셜 미디어 언급, 날씨 패턴 등 실시간 고객 수요 지표.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `signalId` | string | ✓ |
| `signalDate` | datetime | |
| `signalStrength` | decimal | |

## 새 관계

5개의 새 관계가 재고와 수요를 기존 엔티티와 연결합니다.

- **InventoryForProduct** — `Inventory` → `Product` (many-to-one)
  특정 상품의 재고 수준.

- **InventoryAtWarehouse** — `Inventory` → `Warehouse` (many-to-one)
  재고가 저장된 곳. InventoryForProduct와 결합하면 교집합이 생깁니다. "상품 X가 창고 Y에 얼마나 있는가?"

- **ForecastForProduct** — `Forecast` → `Product` (many-to-one)
  특정 상품에 대한 예측 수요.

- **DemandSignalForProduct** — `DemandSignal` → `Product` (many-to-one)
  상품에 대한 실시간 수요 지표.

- **DemandSignalInRegion** — `DemandSignal` → `Region` (many-to-one)
  수요 신호가 발생한 곳.

## 크로스 소스 통합

실제 Fabric IQ 배포에서 이 엔티티들은 매우 다른 소스에서 올 수 있습니다.

| 엔티티 | 일반적 소스 |
|---|---|
| Inventory | Eventhouse (실시간 업데이트) |
| Forecast | Lakehouse (배치 ML 예측) |
| DemandSignal | Eventhouse (스트리밍 데이터) |
| Product | Lakehouse(카탈로그)와 Eventhouse(할인) 양쪽 |

온톨로지는 **이 모든 것을 통합**해 하나의 연결된 그래프로 만듭니다. "남서 지역에서 수요 신호가 높은 상품에 대해, 인근 창고의 현재 재고는?" 같은 질의는 모든 소스를 매끄럽게 넘나듭니다.

## 5단계 그래프

<ontology-embed id="official/iq-lab-retail-step-5" diff="official/iq-lab-retail-step-4" height="450px"></ontology-embed>

*13개 엔티티 타입. Inventory가 Product와 Warehouse를 잇습니다. DemandSignal이 Product와 Region을 연결합니다. 그래프는 이제 상거래·물류·계획 도메인을 아우릅니다.*

## 배운 것

- 온톨로지는 **이력·실시간·예측** 데이터를 통합할 수 있습니다
- **Inventory**는 고전적인 교집합 엔티티입니다. Product와 Warehouse 사이에 앉습니다
- **DemandSignal**은 Product와 Region 양쪽에 연결되어 크로스 차원 분석을 가능하게 합니다
- 크로스 소스 통합이 핵심 가치 제안입니다. 하나의 모델, 여러 데이터 엔진

```quiz
Q: Inventory가 "교집합 엔티티"라 불리는 이유는?
- 다른 엔티티보다 데이터를 더 많이 저장해서
- Product와 Warehouse 사이에 앉아 특정 상품이 특정 위치에 얼마나 있는지 대표해서 [correct]
- 온톨로지에서 관계가 가장 많아서
- Eventhouse에서 온 유일한 엔티티라서
> Inventory는 Product와 Warehouse의 교집합입니다. 각 재고 레코드가 "상품 X가 창고 Y에 얼마나 있는가?"에 답합니다. 고전적인 교집합(또는 정션) 엔티티죠.
```

한 단계 남았습니다. Promotion과 Return을 추가해 그림을 완성합시다.
