---
title: "리테일 이행"
description: "Zava 공급망을 리테일 파트너와 매출에 연결하기 위해 RetailDC, Store, Order를 추가합니다."
---

## 공급망이 계산대를 만나는 곳

이전 단계는 이동 중인 배송으로 끝났습니다. 이번 단계는 수신자에게 얼굴을 붙입니다. 어느 리테일 체인, 어느 DC, 어느 매장, 어느 주문인지.

세 개의 새 엔티티가 Zava의 커머셜 쪽을 완성합니다.

- **RetailDC** — Zava 배송을 받는 리테일러의 물류 센터
- **Store** — 하나의 DC로부터 공급받는 리테일러의 매장
- **Order** — 매장이 특정 과일 품종에 대해 발주하는 구매 주문

## 엔티티

### RetailDC

| 속성 | 타입 | 식별자? |
|---|---|---|
| `dcId` | string | ✓ |
| `name` | string | |
| `country` | string | |
| `city` | string | |
| `retailerCode` | string | |

### Store

| 속성 | 타입 | 식별자? |
|---|---|---|
| `storeId` | string | ✓ |
| `name` | string | |
| `retailerName` | string | |
| `country` | string | |
| `city` | string | |

### Order

| 속성 | 타입 | 식별자? |
|---|---|---|
| `orderId` | string | ✓ |
| `kilograms` | decimal (kg) | |
| `orderDate` | date | |
| `deliveryDate` | date | |
| `status` | string | |
| `unitPriceEur` | decimal (EUR) | |

## 새 관계

| 출발 | 동사 | 도착 | 카디널리티 |
|---|---|---|---|
| Shipment | deliveredTo | RetailDC | many-to-one |
| RetailDC | supplies | Store | one-to-many |
| Store | places | Order | one-to-many |
| Order | forVariety | FruitVariety | many-to-one |

## 이제 콜드체인 이탈 질의가 루프를 닫습니다

3단계의 이탈 질문을 기억하세요. 리테일이 자리를 잡으면 전체 순회는 이렇습니다.

```
ColdChainSensor[breach]
   → Shipment
   → HarvestLot ─ ofVariety → FruitVariety
   → Shipment
   → RetailDC
   → Store
   → Order[forVariety = 같은 품종, status = open]
```

Fabric IQ 데이터 에이전트는 이제 비즈니스 영어로 고객 영향 질문에 답할 수 있습니다.

> *"배송 SH-2026-04812의 콜드체인 이탈에 대해, 어느 리테일러 주문이 위험에 놓였고 매출 노출(kg × unitPriceEur)은 얼마인가?"*

## 지금까지의 그래프

<ontology-embed id="official/zava-grove-to-shelf-step-4" diff="official/zava-grove-to-shelf-step-3" height="480px"></ontology-embed>

*11개 엔티티. 리테일 가지(RetailDC → Store → Order)가 `Order forVariety FruitVariety`를 통해 FruitVariety 허브에 바로 꽂혀 grove-to-shelf 경로를 닫습니다.*

```quiz
Q: 이탈 질의에서 `Shipment carries HarvestLot ofVariety FruitVariety`에 *더해서* `Order forVariety FruitVariety`가 필요한 이유는?
- Fabric IQ가 중복을 요구해서
- 리테일러는 로트가 아닌 품종으로 주문하기 때문에, 위험 로트를 *같은 품종에 대한 오픈 주문*과 매칭하려면 필요하다 [correct]
- 시각화용으로만 있다
- 그것이 없으면 그래프가 단절된다
> 리테일러는 품종으로 주문하지 로트로 주문하지 않습니다. 특정 로트의 이탈로 *어느 주문이 노출되는지* 알려면 그 품종을 `Order.forVariety`와 교차 참조합니다. 이 링크 없이는 그래프가 배송이 위험하다는 것만 알려 주고 어느 오픈 주문이 위험한지는 알려 주지 않습니다.
```

마지막 엔티티 하나만 남았습니다 — Zava의 CSR 스토리를 모델에서 노래하게 하는 프로그램.
