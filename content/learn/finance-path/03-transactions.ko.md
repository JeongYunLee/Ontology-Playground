---
title: "거래"
description: "계좌의 모든 출금·입금·이체를 추적하기 위해 Transaction 기록을 추가합니다."
---

## 활동 추적

거래 이력이 없는 계좌는 정적인 잔고일 뿐입니다. **Transaction**을 추가하면 돈의 흐름 — 모든 구매, 입금, 이체, 수수료 — 을 담을 수 있습니다.

이 덕분에 이런 질문이 가능해집니다.

- "이 고객이 지난달 식당에서 얼마나 썼나?"
- "특이한 거래 패턴을 보이는 계좌는?"
- "계좌 유형별 평균 거래 금액은?"

## Transaction 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `transactionId` | string | ✓ |
| `amount` | decimal (USD) | |
| `type` | string | |
| `timestamp` | datetime | |
| `merchant` | string | |

`timestamp`는 date가 아니라 datetime입니다. 금융 거래는 정밀도가 필요하기 때문입니다. 부정 탐지에서는 오후 2시 30분의 결제와 2시 31분의 결제가 다른 이야기가 됩니다.

`merchant` 속성은 거래가 어디서 발생했는지를 담습니다. 지출 카테고리 분석에 유용하죠.

## 새 관계

- **has_transaction** — `Account` → `Transaction` (one-to-many)
  각 계좌는 시간에 걸쳐 많은 거래를 가지지만, 각 거래는 한 계좌에 속합니다.

이렇게 소유 체인이 확장됩니다: `Customer → Account → Transaction`.

## 성장하는 그래프

<ontology-embed id="official/finance-step-2" diff="official/finance-step-1" height="400px"></ontology-embed>

*Transaction이 활동 계층을 더합니다. 소유 체인이 자랍니다: Customer → Account → Transaction.*

## 배운 것

- **datetime 정밀도**는 금융과 컴플라이언스 시나리오에서 중요합니다
- **소유 체인**(Customer → Account → Transaction)은 드릴다운 질의를 가능하게 합니다
- `merchant` 속성은 Merchant 엔티티를 만들지 않고도 지출 분석을 열어 줍니다
- 새 엔티티 하나가 답할 수 있는 질문을 더 깊게 만듭니다

```quiz
Q: Transaction이 timestamp에 date가 아닌 datetime 타입을 사용하는 이유는?
- datetime은 모든 시간 기반 필드의 기본 타입이라서
- 금융 거래는 부정 탐지와 감사 이력을 위해 시각 정밀도가 필요해서 [correct]
- date 타입은 현대 온톨로지에서 폐기됐다고 해서
- datetime이 date보다 저장 공간이 적어서
> 금융 컴플라이언스와 부정 탐지에는 정확한 타임스탬프가 필요합니다. 같은 날짜지만 몇 분 간격으로 발생한 두 거래는 부정 패턴을 시사할 수 있습니다. datetime은 날짜와 시간을 모두 담아 필요한 정밀도를 제공합니다.
```

다음에는 Loan과 Investment로 뱅킹 상품 라인업을 완성합니다.
