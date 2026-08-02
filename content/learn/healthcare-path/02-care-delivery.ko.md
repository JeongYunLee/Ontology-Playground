---
title: "진료 제공"
description: "헬스케어 예약과 진료 제공을 뒷받침하는 핵심 엔티티 Patient, Provider, Appointment를 정의합니다."
---

## 진료 제공의 기초

헬스케어 진료 제공은 세 개의 개념을 중심으로 돕니다.

- **Patient** — 누가 진료를 받는가?
- **Provider** — 누가 진료를 제공하는가?
- **Appointment** — 진료가 언제 어디서 이루어지는가?

이 세 엔티티가 헬스케어의 스케줄링과 진료 제공을 담습니다. 모든 진단과 치료는 진료 예약에서 흘러나옵니다.

## 엔티티 정의

### Patient

| 속성 | 타입 | 식별자? |
|---|---|---|
| `patientId` | string | ✓ |
| `mrn` | string | |
| `dateOfBirth` | date | |
| `bloodType` | string | |
| `allergies` | string | |

`mrn` (의료 기록 번호, Medical Record Number)는 병원 내부 식별자입니다. `patientId`는 온톨로지 식별자로 사용되고, `mrn`은 EHR 시스템과 연결되는 도메인 특화 속성입니다.

### Provider

| 속성 | 타입 | 식별자? |
|---|---|---|
| `providerId` | string | ✓ |
| `name` | string | |
| `specialty` | string | |
| `licenseNumber` | string | |
| `department` | string | |

`specialty`와 `department` 속성은 임상 도메인 기준으로 의료진을 필터링할 수 있게 합니다. 진료 의뢰나 라우팅 질의에 필수적입니다.

### Appointment

| 속성 | 타입 | 식별자? |
|---|---|---|
| `appointmentId` | string | ✓ |
| `scheduledTime` | datetime | |
| `duration` | integer (분) | |
| `type` | string | |
| `status` | string | |

`duration` 속성은 분 단위 integer로, 스케줄 계산과 활용률 분석을 가능하게 합니다.

## 관계

- **has_appointment** — `Patient` → `Appointment` (one-to-many)
  환자 한 명은 시간에 걸쳐 여러 예약을 가질 수 있습니다.

- **sees** — `Provider` → `Appointment` (one-to-many)
  의료진 한 명이 여러 예약을 담당합니다.

> **공유 엔티티 패턴:** Appointment는 Patient와 Provider *양쪽* 모두에 연결됩니다. 두 독립된 엔티티가 만나는 지점입니다. 두 명의 액터가 같은 이벤트에 참여할 때마다 이 패턴이 흔히 등장합니다.

## 지금까지의 그래프

<ontology-embed id="official/healthcare-step-1" height="350px"></ontology-embed>

*Patient와 Provider가 모두 Appointment로 연결됩니다. 진료 제공의 만남 지점입니다.*

## 배운 것

- **공유 엔티티**(Appointment)는 두 독립된 액터(Patient, Provider)를 연결합니다
- **duration 속성**은 단위가 있는 integer를 씁니다 (분, 시간, 일)
- **도메인 특화 식별자**(MRN)와 **온톨로지 식별자**(patientId)는 공존합니다
- 스케줄링 삼각형(Patient–Appointment–Provider)이 헬스케어의 기초입니다

```quiz
Q: Appointment가 Patient나 Provider 중 하나가 아니라 둘 모두에 연결된 이유는?
- 그래프를 더 완전해 보이게 하려고
- Appointment는 공유 엔티티로, 두 액터의 상호작용 지점을 표현하기 때문에 [correct]
- 모든 엔티티는 최소 두 개의 관계를 가져야 해서
- Patient와 Provider가 같은 속성을 가져서
> 진료 예약은 본질적으로 환자와 의료진이 함께 참여하는 협력적 이벤트입니다. 두 관계를 모두 모델링하면 스케줄링 전체 그림을 담을 수 있고, 양쪽 관점에서 질의할 수 있습니다. "환자의 다음 방문은 언제?" 또는 "이 의료진은 하루에 몇 명을 진료하나?"
```

다음에는 의학적 상태를 추적하기 위해 Diagnosis를 추가합니다.
