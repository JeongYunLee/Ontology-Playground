---
title: "이행 & 물류"
description: "배송 파이프라인을 모델링하기 위해 Shipment, Carrier, Warehouse를 추가합니다 — 주문이 창고에서 고객까지 어떻게 이동하는지."
---

## 배송 파이프라인

고객은 주문을 발주하지만, 그 주문이 어떻게 고객에게 도달할까요? 이행 계층이 주문을 물리적 물류 인프라와 잇습니다.

- **Shipment** — 배송 기록
- **Carrier** — 물류 제공자 (FedEx, UPS 등)
- **Warehouse** — 상품을 재고로 두고 출하하는 이행 센터

## Shipment

각 배송은 하나의 딜리버리를 대표합니다.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `shipmentId` | string | ✓ |
| `shipDate` | date | |
| `deliveryDate` | date | |
| `status` | string | |

## Carrier

배송을 담당하는 물류 회사.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `carrierId` | string | ✓ |
| `carrierName` | string | |
| `serviceType` | string | |

## Warehouse

이행 센터.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `warehouseId` | string | ✓ |
| `warehouseName` | string | |
| `capacity` | integer | |

## 새 관계

세 개의 새 관계가 물류 엔티티를 연결합니다.

- **ShipmentFulfillsOrder** — `Shipment` → `Order` (many-to-one)
  각 배송은 하나의 주문을 이행합니다. 여러 배송이 같은 주문을 이행할 수도 있습니다 (분할 배송).

- **ShipmentByCarrier** — `Shipment` → `Carrier` (many-to-one)
  각 배송은 하나의 캐리어가 처리합니다.

- **ShipmentDepartedFromWarehouse** — `Shipment` → `Warehouse` (many-to-one)
  각 배송은 하나의 창고에서 출발합니다.

## 허브 패턴

**Shipment**가 **허브 엔티티** 역할을 한다는 점에 주목하세요. Order, Carrier, Warehouse에 동시에 연결됩니다. 이는 여러 개념을 잇는 트랜잭션이나 이벤트 엔티티에서 흔한 패턴입니다.

```
Carrier ← Shipment → Order → Customer
              ↓
          Warehouse
```

Carrier에서 Shipment, Order, Customer로 이어지는 한 번의 그래프 순회로 "CarrierX의 배송을 받은 고객은?"에 답할 수 있습니다.

## 4단계 그래프

<ontology-embed id="official/iq-lab-retail-step-4" diff="official/iq-lab-retail-step-3" height="450px"></ontology-embed>

*10개 엔티티 타입이 풍부한 연결 그래프를 이룹니다. Shipment가 물류 계층(Carrier, Warehouse)과 상거래 계층(Order, Customer)을 잇습니다. 그래프를 통해 어느 창고에서든 어느 고객이든 순회할 수 있습니다.*

## 배운 것

- **허브 엔티티**(Shipment 같은)는 여러 도메인을 연결합니다
- 물류 계층이 상거래 계층을 확장합니다. 기존 엔티티를 수정할 필요가 없습니다
- 그래프 순회로 크로스 도메인 질의가 자연스러워집니다. "남서 지역에 배송하는 창고는?"에 SQL 조인이 필요 없습니다
- 이제 온톨로지는 10개 엔티티와 10개 관계입니다. 자라고 있지만 여전히 읽기 쉽습니다

```quiz
Q: 온톨로지에서 Shipment 엔티티의 역할은?
- Order 엔티티를 대체합니다
- 물류 계층과 상거래 계층을 잇는 허브 역할을 합니다 [correct]
- 고객 주소를 저장합니다
- Warehouse와 Carrier 사이의 카디널리티를 정의합니다
> Shipment는 여러 도메인을 잇는 허브 엔티티입니다. Order를 물류 인프라(Carrier, Warehouse)와 연결해 기존 엔티티를 수정하지 않고도 크로스 도메인 질의를 가능하게 합니다.
```

다음에는 재고 추적과 수요 예측을 추가합니다.
