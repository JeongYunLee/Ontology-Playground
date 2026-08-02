---
title: "콜드체인 물류"
description: "신선 물류 계층과 Zava에서 가장 중요한 알림 규칙을 뒷받침하는 실시간 온도 텔레메트리를 모델링하기 위해 Shipment와 ColdChainSensor를 추가합니다."
---

## Zava에서 가장 비싼 분들

HarvestLot이 팩하우스를 떠나면 시계가 돌기 시작합니다. 과일은 신선품입니다. 한 품종에 대한 안전 온도를 15분간 넘기면 리퍼 컨테이너 전체를 손상 처리해야 할 수 있습니다. 매출로 여섯 자리 손실이 쉽게 발생합니다. 시맨틱에 대한 Zava의 투자가 가장 크게 보답받는 곳이 콜드체인 계층입니다.

두 개의 새 엔티티가 이 도메인을 표현합니다.

- **Shipment** — 하나 이상의 HarvestLot을 리테일 DC로 옮기는 리퍼 컨테이너나 트럭
- **ColdChainSensor** — 배송에 부착되어 온도와 습도 텔레메트리를 스트리밍하는 센서

## 엔티티

### Shipment

| 속성 | 타입 | 식별자? |
|---|---|---|
| `shipmentId` | string | ✓ |
| `departureDate` | datetime | |
| `etaDate` | datetime | |
| `modality` | string | |
| `containerId` | string | |

### ColdChainSensor

| 속성 | 타입 | 식별자? |
|---|---|---|
| `sensorId` | string | ✓ |
| `sensorModel` | string | |
| `temperatureC` | decimal (°C) | |
| `humidityPct` | decimal (%) | |

Microsoft Fabric IQ에서 `ColdChainSensor`는 **시계열 엔티티**의 정식 예시입니다. 판독값은 Lakehouse 테이블이 아니라 Eventhouse에 바인딩됩니다. 온톨로지는 이 분할을 숨깁니다. `Sensor → Shipment` 질의는 기저 엔진을 몰라도 순회합니다.

## 새 관계

| 출발 | 동사 | 도착 | 카디널리티 |
|---|---|---|---|
| Shipment | carries | HarvestLot | one-to-many |
| Shipment | monitoredBy | ColdChainSensor | one-to-many |

`Shipment`가 **허브** 역할을 한다는 점에 주목하세요. 정적인 Lakehouse 세계(HarvestLot 계보)와 스트리밍 Eventhouse 세계(센서 텔레메트리)를 이어 줍니다.

## 콜드체인 이탈 질의

Zava 데모의 대표 질문:

> *"방금 배송 SH-2026-04812가 9°C를 넘었다. 어느 리테일러 주문이 노출되어 있는가?"*

오늘날 이건 다섯 시스템 수동 추적입니다. 온톨로지가 있으면 한 번의 순회입니다.

```
ColdChainSensor[temperatureC > FruitVariety.maxStorageTempC + 2]
   → Shipment
   → HarvestLot
   → (이후) Order → Store → Retailer
```

다음 단계에서 리테일 쪽을 연결합니다.

## 지금까지의 그래프

<ontology-embed id="official/zava-grove-to-shelf-step-3" diff="official/zava-grove-to-shelf-step-2" height="450px"></ontology-embed>

*8개 엔티티. 오른쪽 가지(Sensor → Shipment)는 실시간 텔레메트리 쪽이고, 왼쪽 가지(HarvestLot → Plot → Farm → Grower)는 계보 쪽입니다. 온톨로지가 이를 통합합니다.*

```quiz
Q: `Shipment`가 "허브" 엔티티로 기술되는 것은 무슨 뜻인가요?
- 그래프에서 가장 큰 엔티티다
- 그렇지 않으면 별개일 두 도메인 — 계보(수확 로트)와 텔레메트리(센서) — 을 하나의 공유 개념을 통해 연결한다 [correct]
- 다른 모든 엔티티가 이를 통해 연결되어야 한다
- 허브는 RDF 준수에 필요하다
> 허브 엔티티는 서로 다른 시스템에 살았을 도메인을 잇습니다. Shipment는 HarvestLot(Lakehouse 계보)과 ColdChainSensor(Eventhouse 텔레메트리)를 연결해 한 번의 그래프 순회가 양쪽을 아우르게 합니다.
```

다음에는 리테일까지 루프를 닫습니다 — DC, 매장, 그리고 위험에 처한 주문.
