---
title: "진단"
description: "환자를 임상 소견과, 의료진을 그들의 진단과 연결하기 위해 Diagnosis를 추가합니다."
---

## 임상 소견 기록

진료 예약은 임상 소견을 낳습니다. 환자는 어떤 상태인가? **Diagnosis** 엔티티가 표준 코딩과 함께 이 소견을 담습니다.

Diagnosis를 추가하면 다음이 가능해집니다.

- "당뇨로 진단받은 환자는?"
- "지난 분기에 가장 중증인 상태를 확인한 의료진은?"
- "학과별 가장 흔한 진단은?"

## Diagnosis 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `diagnosisId` | string | ✓ |
| `icdCode` | string | |
| `description` | string | |
| `severity` | string | |
| `diagnosedDate` | date | |

`icdCode` 속성은 표준화된 ICD(International Classification of Diseases) 코드를 담습니다. 국제적으로 인정되는 코딩 체계입니다. 이 덕분에 온톨로지가 보험·청구·연구 시스템과 상호운용됩니다.

## 새 관계

- **diagnosed_with** — `Patient` → `Diagnosis` (one-to-many)
  한 환자는 의료 이력에 걸쳐 여러 진단을 가질 수 있습니다.

- **diagnoses** — `Provider` → `Diagnosis` (one-to-many)
  의료진은 임상 평가를 근거로 진단을 기록합니다.

> **이중 저작:** Diagnosis는 Patient(상태를 가진 사람)와 Provider(그것을 확인한 사람) 양쪽에 연결됩니다. 이 이중 연결은 환자 중심 뷰("내가 가진 모든 상태")와 의료진 중심 뷰("내가 확인한 모든 상태") 모두를 가능하게 합니다.

## 성장하는 그래프

<ontology-embed id="official/healthcare-step-2" diff="official/healthcare-step-1" height="400px"></ontology-embed>

*Diagnosis가 Patient와 Provider 양쪽 모두와 연결되며 그래프에 합류합니다. diff가 새로 생긴 부분을 강조합니다.*

## 배운 것

- **표준 코드**(ICD)는 온톨로지가 외부 시스템과 상호운용되게 합니다
- **이중 연결 엔티티**(Patient → Diagnosis ← Provider)는 양쪽 관점을 모두 담습니다
- **severity 속성**은 위험 계층화와 임상 우선순위 지정을 가능하게 합니다
- 그래프는 이제 예약 질의(Appointment 경유)와 임상 질의(Diagnosis 경유)를 모두 지원합니다

```quiz
Q: Diagnosis 엔티티에서 ICD 코드 속성이 중요한 이유는?
- 진단 식별자를 짧게 만들어 줘서
- 보험·청구·연구 시스템과의 상호운용을 가능하게 하는 국제 표준 코딩 체계라서 [correct]
- ICD 코드는 모든 온톨로지 포맷에서 필수라서
- 중복 진단 기록을 막아 줘서
> ICD(International Classification of Diseases) 코드는 의학적 상태를 분류하는 전 세계 표준입니다. 온톨로지에 포함하면 EHR, 보험 청구, 임상 시험, 공중 보건 시스템 어디서든 같은 코드가 같은 상태를 의미하게 되어 상호운용성이 확보됩니다.
```

다음에는 Prescription을 추가해 치료 체인을 완성합니다.
