---
title: "생산 추적"
description: "무엇이 만들어지는지 추적하기 위해 Work-Order와 Part를 추가합니다. 설비와 그 산출물을 이어 줍니다."
---

## 모니터링에서 생산으로

센서는 설비가 *어떻게* 작동하는지 알려 주지만, *무엇을* 만드는지도 알아야 합니다. **Work-Order**와 **Part** 엔티티가 공장 모델에 생산 추적을 더합니다.

생산 추적을 추가하면 이런 질문이 가능해집니다.

- "이번 시프트에 가장 많은 부품을 만든 설비는?"
- "일정을 못 맞추는 작업 지시는 얼마나 되나?"
- "CNC-01에서 지금 어떤 부품을 만들고 있나?"

## Work-Order 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `workOrderId` | string | ✓ |
| `priority` | string | |
| `status` | string | |
| `startDate` | date | |
| `dueDate` | date | |

작업 지시는 `startDate`와 `dueDate`를 모두 갖습니다. 일정 준수 계산이 가능해집니다. `priority`와 결합하면 생산 계획 질의를 뒷받침합니다.

## Part 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `partId` | string | ✓ |
| `name` | string | |
| `material` | string | |
| `weight` | float | |
| `tolerance` | float | |

`tolerance` 속성은 허용 가능한 제조 편차를 정의합니다. 허용 오차가 작을수록 정밀도가 높은 설비가 필요합니다. 생산 계획의 핵심 제약이죠.

## 새 관계

- **assigned_to** — `Work-Order` → `Machine` (many-to-one)
  작업 지시는 생산을 위해 특정 설비에 할당됩니다.

- **produces** — `Work-Order` → `Part` (one-to-many)
  하나의 작업 지시가 하나 이상의 부품을 생산합니다.

- **has_part** — `Machine` → `Part` (one-to-many)
  설비가 부품을 생산합니다 (산출물 관점).

> **생산 체인:** `Machine ← Work-Order → Part` 체인은 스케줄링 엔티티를 통해 장비와 산출물을 이어 줍니다. 헬스케어에서 Appointment가 Patient와 Provider를 연결하는 것과 비슷합니다. 중간 엔티티가 이벤트를 대표합니다.

## 성장하는 그래프

<ontology-embed id="official/manufacturing-step-2" diff="official/manufacturing-step-1" height="400px"></ontology-embed>

*Work-Order와 Part가 그래프에 합류해 IoT 기초 위에 생산 추적을 얹습니다. diff가 새로 생긴 부분을 보여 줍니다.*

## 배운 것

- **생산 체인**은 스케줄링 엔티티(Work-Order)를 매개로 장비와 산출물을 잇습니다
- **이중 날짜 속성**(startDate/dueDate)은 일정 준수 추적을 가능하게 합니다
- **tolerance 속성**은 제조 정밀 요건을 담습니다
- 공장 모델은 이제 모니터링(센서)과 생산(작업 지시) 모두를 다룹니다

```quiz
Q: Part 엔티티의 tolerance 속성이 나타내는 것은?
- 결함이 허용되는 부품 최대 개수
- 허용 가능한 제조 편차 — 허용 오차가 작은 부품은 더 높은 정밀도의 설비가 필요 [correct]
- 부품 제조에 허용된 시간
- 부품이 견딜 수 있는 온도 범위
> tolerance는 부품의 실제 치수가 사양에서 얼마나 벗어날 수 있는지 정의합니다. 허용 오차가 작을수록 더 높은 정밀도의 설비와 신중한 품질 관리가 필요해지므로 생산 계획의 핵심 제약이 됩니다.
```

다음에는 Quality-Check로 생산 루프를 닫습니다.
