---
title: "완성된 모델"
description: "grove-to-shelf 모델을 닫는 SustainabilityProgram을 추가합니다 — 12개 엔티티, 13개 관계, 데모 준비 완료."
---

## 마지막 엔티티: 지속 가능성

Zava는 내부 코드명 **Dreams**로 알려진 재배자 개발 프로그램을 운영합니다. 파트너 농장이 옵트인할 수 있습니다. 물 효율성, 공정 임금, 생물다양성 이니셔티브에 자금을 지원합니다. 오늘날 이 데이터는 공급망과 단절된 마케팅 시스템에 있습니다.

한 엔티티와 한 관계가 이를 모델로 끌어들입니다.

### SustainabilityProgram

| 속성 | 타입 | 식별자? |
|---|---|---|
| `programId` | string | ✓ |
| `name` | string | |
| `focusArea` | string | |
| `startYear` | integer | |

### 새 관계

| 출발 | 동사 | 도착 | 카디널리티 |
|---|---|---|---|
| Farm | participatesIn | SustainabilityProgram | many-to-many |

many-to-many인 이유는 하나의 농장이 여러 프로그램(예: *Dreams Water*와 *Dreams Biodiversity*)에 참여할 수 있고, 하나의 프로그램이 여러 농장을 등록하기 때문입니다.

## 완성된 그래프

<ontology-embed id="official/zava-grove-to-shelf-step-5" diff="official/zava-grove-to-shelf-step-4" height="520px"></ontology-embed>

*12개 엔티티, 13개 관계. Zava가 관심 있는 모든 비즈니스 도메인이 이제 이름 있는 엣지로 연결된 일급 개념입니다.*

## 이 모델이 무대에서 풀어 주는 것

각각 이전에는 다중 시스템·다일 작업이었던 다섯 개 질문이 이제 하나의 온톨로지에서 답이 가능합니다.

| 질문 | 경로 |
|---|---|
| *"지난 분기 만다린 매출을 리테일 체인과 원산국별로 세분화하여 보여 줘."* | `Order forVariety FruitVariety[category=citrus]`, `Store.retailerName`과 `HarvestLot → Plot → Farm.country`로 그룹 |
| *"지난 30일간 블루베리에서 품질 검사 실패가 있었던 재배자는?"* | `QualityCheck[passed=false] → HarvestLot[ofVariety.category=berry] → Plot → Farm ← owns ← Grower` |
| *"이동 중 온도가 자기 품종의 안전 임계값을 넘긴 배송은?"* | `Shipment monitoredBy ColdChainSensor[temperatureC > carries.harvestLot.ofVariety.maxStorageTempC]` |
| *"SH-2026-04812 이탈에 대해 어느 리테일러 주문이 위험에 놓였고 매출 노출은?"* | `Shipment[id=SH-2026-04812] → RetailDC supplies Store places Order[forVariety = 이탈 품종, status=open]`, 이후 `kilograms × unitPriceEur` 합산 |
| *"이번 시즌 우리 베리 물량 중 Dreams 프로그램 농장 비중은?"* | `HarvestLot[ofVariety.category=berry, harvestDate∈season]`, `fromPlot → Farm participatesIn SustainabilityProgram[name~"Dreams"]` 여부로 그룹 |

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Grower, Farm, Plot, FruitVariety | 4 | 다중 원산지 소싱, 추적 앵커 |
| 2 | HarvestLot, QualityCheck | 6 | 계보 이벤트, 4단계 QC 체제 |
| 3 | Shipment, ColdChainSensor | 8 | 허브 엔티티, 시계열 바인딩 |
| 4 | RetailDC, Store, Order | 11 | 매출까지 루프 닫기 |
| 5 | SustainabilityProgram | 12 | many-to-many CSR 오버레이 |

## 핵심 정리

1. **하나의 어휘가 다섯 시스템을 아우릅니다.** 농경 ERP, 팩하우스 QC 앱, IoT eventhouse, 리테일 EDI 피드, CSR 기록이 모두 동일한 12-엔티티 모델의 바인딩이 됩니다.
2. **허브 엔티티가 중요합니다.** `HarvestLot`은 계보 허브. `Shipment`는 lakehouse↔eventhouse 허브. `FruitVariety`는 공급↔수요 허브.
3. **시계열 텔레메트리는 일급입니다.** `ColdChainSensor`는 온톨로지에서 다른 엔티티와 똑같아 보입니다 — 기저 저장 선택(Eventhouse)은 질문자에게 보이지 않습니다.
4. **지속 가능성은 별도 스프레드시트가 아닙니다.** `SustainabilityProgram`을 추가하면 CSR 질문이 매출 질문과 같은 그래프를 타게 됩니다.
5. **온톨로지가 계약이 됩니다.** GQL 질의, Fabric 데이터 에이전트 프롬프트, Activator 규칙 모두 같은 엔티티와 관계 이름을 참조합니다.

```quiz
Q: Zava 완성 모델에서 *"이번 시즌 우리 베리 물량 중 Dreams 프로그램 농장 비중은?"* 질문은 어느 경로를 필요로 할까요?
- Order → Store → RetailDC → Farm
- HarvestLot → Plot → Farm → SustainabilityProgram [correct]
- ColdChainSensor → Shipment → Farm → SustainabilityProgram
- FruitVariety → SustainabilityProgram
> 물량은 HarvestLot에 기록됩니다. 그 로트가 Dreams 프로그램 농장에서 왔는지 알려면 HarvestLot → fromPlot → Plot → (포함하는) Farm → participatesIn → SustainabilityProgram을 따라가 프로그램 이름으로 필터링합니다.
```

Zava Grove-to-Shelf 랩을 완주하셨습니다. [5단계 온톨로지](#/catalogue/official/zava-grove-to-shelf-step-5)를 플레이그라운드에서 열어 질의·확장·내보내기를 해 보세요.
