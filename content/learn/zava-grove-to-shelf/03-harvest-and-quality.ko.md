---
title: "수확 & 품질"
description: "추적 가능한 모든 수확 이벤트와 Zava의 4단계 품질 체제를 담기 위해 HarvestLot과 QualityCheck를 추가합니다."
---

## 모든 박스에는 로트가 있다

필지가 수확되면 나오는 킬로그램은 **HarvestLot**이 됩니다 — 이후 공급망 전체에 걸쳐 흐르는 추적성 단위입니다. 이후의 모든 이벤트(온도 이탈, 리테일러 반품, 고객 클레임)는 궁극적으로 하나의 HarvestLot을 가리키게 됩니다.

Zava는 또한 **"4번의 품질 관리"** 를 운영합니다 — 동일한 로트가 필드, 팩하우스, 목적지 DC, 마지막으로 매장이라는 네 개의 명확한 단계에서 검사됩니다. 각 검사는 자체 단계 번호를 가진 별도의 `QualityCheck` 이벤트입니다.

## 엔티티

### HarvestLot

| 속성 | 타입 | 식별자? |
|---|---|---|
| `lotId` | string | ✓ |
| `harvestDate` | date | |
| `kilograms` | decimal (kg) | |
| `qcGrade` | string | |

### QualityCheck

| 속성 | 타입 | 식별자? |
|---|---|---|
| `checkId` | string | ✓ |
| `stage` | integer (1–4) | |
| `passed` | boolean | |
| `defectRate` | decimal (%) | |
| `checkedAt` | datetime | |

`stage` 필드가 4단계 체제를 시맨틱 계층에 명시적으로 드러냅니다. *"단계 3 검사에서 지속적으로 실패하는 재배자는?"* 같은 단일 비즈니스 질문이 이제 직접적인 속성 필터가 됩니다.

## 새 관계

| 출발 | 동사 | 도착 | 카디널리티 |
|---|---|---|---|
| HarvestLot | fromPlot | Plot | many-to-one |
| HarvestLot | ofVariety | FruitVariety | many-to-one |
| QualityCheck | checks | HarvestLot | many-to-one |

`ofVariety`는 `fromPlot → grows → FruitVariety` 경로가 있는데 중복처럼 보일 수 있지만, 배송의 품종 구성을 묻는 질의가 한 홉을 건너뛸 수 있게 합니다. 그리고 결정적으로 *수확 시점의* 품종을 담습니다. 이는 재식재 사이클 이후 필지의 명목 품종과 다를 수 있습니다.

## 지금까지의 그래프

<ontology-embed id="official/zava-grove-to-shelf-step-2" diff="official/zava-grove-to-shelf-step-1" height="420px"></ontology-embed>

*6개 엔티티. 두 개의 새 허브에 주목하세요. HarvestLot은 계보의 앵커이고 QualityCheck는 옆에서 붙습니다.*

## 이것이 풀어 주는 비즈니스 질문

- *"지난 30일간 블루베리에서 QC 실패가 있었던 재배자는?"*
  → `QualityCheck[passed=false] → HarvestLot → Plot → Farm → Grower`, `ofVariety.category = "berry"` 필터.
- *"단계와 원산국별 QC 통과율은?"*
  → `QualityCheck.stage`와 `HarvestLot → Plot → Farm.country`로 그룹.

```quiz
Q: Zava가 `QualityCheck`를 별도 엔티티로 모델링하고 `HarvestLot`에 네 개의 boolean 컬럼(예: `qc1Passed`, `qc2Passed`, …)을 두지 않는 이유는?
- RDF가 boolean을 지원하지 않아서
- 엔티티로 모델링하면 각 검사가 자체 `inspector`, `defectRate`, `checkedAt`을 실을 수 있고, `stage`로 검사를 세거나 필터링할 수 있어서 [correct]
- 그래프 렌더링 성능이 개선돼서
- boolean 컬럼은 Fabric IQ가 지원하지 않아서
> boolean은 검사자, 타임스탬프, 결함률을 뭉개 버립니다. 엔티티로 두면 QualityCheck는 집계·필터·조인 가능한 일급 이벤트가 됩니다. 정확히 "단계 3에서 가장 자주 실패하는 재배자는?"에 답하기 위해 필요한 것이죠.
```

다음에는 수확 로트를 사업의 콜드체인 쪽과 연결합니다.
