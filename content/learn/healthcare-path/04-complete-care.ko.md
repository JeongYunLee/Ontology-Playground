---
title: "완성된 진료 모델"
description: "Prescription을 추가해 헬스케어 온톨로지를 완성합니다. 진단과 치료를 이어 진료 순환을 닫습니다."
---

## 치료 체인

헬스케어 퍼즐의 마지막 조각은 **Prescription** — 진단에 대한 치료 대응입니다. 이것이 진료 순환을 닫습니다. 예약 → 진단 → 치료.

## Prescription 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `rxNumber` | string | ✓ |
| `medication` | string | |
| `dosage` | string | |
| `frequency` | string | |
| `refillsRemaining` | integer | |

식별자는 `rxNumber`(처방 번호)입니다. 약국 표준 식별자죠. `refillsRemaining` integer는 리필 추적과 복약 순응 모니터링을 가능하게 합니다.

## 새 관계

- **treated_by** — `Diagnosis` → `Prescription` (one-to-many)
  하나의 진단은 여러 처방으로 이어질 수 있습니다 (같은 상태에 대한 여러 약제).

- **prescribes** — `Provider` → `Prescription` (one-to-many)
  의료진은 환자에게 처방을 발행합니다.

> **진료 체인:** 이제 완전한 경로는 `Patient → Diagnosis → Prescription`이 되고, `Provider`는 모든 단계에서 연결됩니다(예약을 담당, 진단을 내리고, 처방을 발행). 실제 임상 워크플로우가 반영됩니다.

## 완성된 그래프

<ontology-embed id="official/healthcare-step-3" diff="official/healthcare-step-2" height="500px"></ontology-embed>

*완성된 헬스케어 온톨로지: 5개 엔티티, 6개 관계. 진료 체인은 Patient → Diagnosis → Prescription으로 흐릅니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 리필이 필요한 환자는? | Patient → Diagnosis → Prescription (refillsRemaining=0) |
| 처방을 가장 많이 내는 의료진은? | Provider → Prescription (count) |
| 아직 치료가 없는 중증 진단은? | Diagnosis (severity=severe) 중 → Prescription 없음 |
| 자신이 진단한 상태를 직접 처방하는 전문의는? | Provider → Diagnosis AND Provider → Prescription |

## GQL 쿼리 예시

중증 진단을 받은 환자 중 처방 잔여분이 떨어져 가는 사람 찾기:

```gql
MATCH (p:Patient)-[:diagnosed_with]->(d:Diagnosis)-[:treated_by]->(rx:Prescription)
WHERE d.severity = 'severe' AND rx.refillsRemaining <= 1
RETURN p.patientId, d.description, rx.medication, rx.refillsRemaining
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Patient, Provider, Appointment | 3 | 공유 엔티티, 스케줄링 |
| 2 | Diagnosis | 4 | 표준 코드, 이중 연결 |
| 3 | Prescription | 5 | 진료 체인, 치료 추적 |

## 핵심 정리

1. **공유 엔티티**(Appointment, Diagnosis)는 여러 액터를 이어 줍니다
2. **표준 코드**(ICD, Rx)는 시스템 간 상호운용성을 확보합니다
3. **진료 체인**(Patient → Diagnosis → Prescription)은 임상 워크플로우를 모델링합니다
4. **Provider는 모든 단계에서 연결됩니다** — 헬스케어 제공의 중심 역할을 반영합니다
5. **integer 속성**(refillsRemaining, duration)은 운영 질의를 가능하게 합니다

```quiz
Q: Provider 엔티티는 완성된 헬스케어 온톨로지에서 어떻게 연결되나요?
- Provider는 Appointment에만 연결됨
- Provider는 Appointment, Diagnosis, Prescription 모두에 연결되어 진료 각 단계에서의 역할을 반영함 [correct]
- Provider는 Patient에 직접 연결됨
- Provider는 Prescription에만 연결됨
> Provider는 이 온톨로지에서 가장 많이 연결된 엔티티입니다. 예약을 담당하고, 진단을 내리고, 처방을 발행합니다. 이는 진료 제공 체인의 모든 단계에 의료진이 관여하는 실제 워크플로우를 그대로 담아냅니다.
```

헬스케어 시스템 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
