---
title: "공장 현장"
description: "IoT 기반 위에 설비와 센서를 정의합니다. 공장 장비를 실시간으로 모니터링하는 뼈대입니다."
---

## IoT 기초

모든 스마트 공장은 두 개의 개념에서 시작합니다.

- **Machine** — 공장 현장에 어떤 장비가 있는가?
- **Sensor** — 어떤 데이터를 생성하는가?

설비와 센서가 텔레메트리의 척추를 이룹니다. 생산이나 품질을 추적하기 전에 무엇이 돌아가고 있고 무엇을 보고하는지부터 알아야 합니다.

## 엔티티 정의

### Machine

| 속성 | 타입 | 식별자? |
|---|---|---|
| `machineId` | string | ✓ |
| `name` | string | |
| `type` | string | |
| `status` | string | |
| `installDate` | date | |

`status` 속성은 운영 상태를 추적합니다. `running`, `idle`, `maintenance`, `offline`. 실시간 대시보드와 유지보수 스케줄링에 쓰입니다.

### Sensor

| 속성 | 타입 | 식별자? |
|---|---|---|
| `sensorId` | string | ✓ |
| `type` | string | |
| `unit` | string | |
| `lastReading` | float | |
| `threshold` | float | |

`threshold` 속성은 알람 경계를 정의합니다. `lastReading`이 `threshold`를 넘으면 시스템이 알람을 발동합니다. 예방 정비의 근본 패턴입니다.

## 관계

- **monitors** — `Sensor` → `Machine` (many-to-one)
  하나의 설비를 여러 센서가 모니터링합니다. 온도용 하나, 진동용 하나 등.

> **소유 계층:** IoT 온톨로지에서 센서는 설비에 속합니다. 방향이 중요합니다. 센서가 설비를 모니터링하지, 그 반대가 아닙니다. 이 부모-자식 계층이 IoT 플랫폼이 텔레메트리 데이터를 조직하는 방식입니다.

## 지금까지의 그래프

<ontology-embed id="official/manufacturing-step-1" height="300px"></ontology-embed>

*단순하지만 의미 있는 시작: 센서가 모니터링하는 설비.*

## 배운 것

- **IoT 계층**은 부모-자식 관계(Sensor → Machine)를 씁니다
- **status 속성**은 실시간 운영 추적을 가능하게 합니다
- **threshold 속성**은 예방 정비 알람을 뒷받침합니다
- 두 개의 엔티티만으로도 유용한 텔레메트리 뼈대를 만들 수 있습니다

```quiz
Q: Sensor 엔티티가 lastReading과 threshold 두 속성을 모두 가지는 이유는?
- 한쪽이 잘못될 경우 백업 값을 저장하기 위해
- threshold가 알람 경계를 정의해 lastReading이 이를 넘으면 예방 정비를 위한 알람을 발동해서 [correct]
- 두 값이 모든 IoT 표준에서 필수라서
- threshold가 센서의 정확도를 계산하는 데 쓰여서
> threshold 패턴은 예방 정비의 근본입니다. 현재 판독값을 안전 경계와 비교함으로써 시스템은 이상을 자동으로 감지하고 장비 고장 전에 운영자에게 알람을 보낼 수 있습니다.
```

다음에는 Work Order와 Part로 생산 추적을 추가합니다.
