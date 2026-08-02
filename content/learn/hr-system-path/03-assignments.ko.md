---
title: "배정"
description: "직원·학과·직책에 걸친 배치 이력을 모델링하는 정션 엔티티로 Assignment를 추가합니다."
---

## 배치 이력 문제

직원은 시간이 지나며 학과나 직책 사이를 옮길 수 있습니다. 학과는 많은 직원을 수용합니다. 직책은 시간에 걸쳐 여러 사람이 맡을 수 있습니다.

이건 단순한 one-to-one 구조가 아닙니다.

## 정션 엔티티로서의 Assignment

**Assignment**를 만들어 다음을 잇습니다.

- `Employee` -> `Assignment` (one-to-many)
- `Assignment` -> `Department` (many-to-one)
- `Assignment` -> `Position` (many-to-one)

Assignment는 관계의 맥락을 담습니다.

### Assignment 속성

| 속성 | 타입 | 식별자? |
|---|---|---|
| `assignmentId` | string | ✓ |
| `startDate` | date | |
| `endDate` | date | |
| `isPrimary` | boolean | |

`startDate`와 `endDate`가 있으면 이력 질의가 가능해집니다.

- "Q2에 재무팀에 있었던 사람은?"
- "올해 학과를 옮긴 직원은?"

## 실전에서 통하는 설계 패턴

이건 여러 도메인에서 쓰이는 동일한 일반 패턴입니다.

- Student-Course를 잇는 Enrollment
- Customer-Product를 잇는 Order line items
- Employee-Department-Position을 잇는 Assignment

관계가 자체 속성을 가져야 할 때 정션 엔티티를 씁니다.

```quiz
Q: Assignment가 별도 엔티티여야 하는 주된 이유는?
- 그래프의 아이콘 선택이 더 좋아져서
- startDate와 endDate 같은 관계 특유 속성을 담아서 [correct]
- 식별자가 필요 없어져서
- many-to-one 관계를 막아 줘서
> Assignment는 시간에 걸친 배치 맥락을 저장합니다. 이 속성들은 관계에 속하지, Employee·Department·Position 어느 하나에도 속하지 않습니다.
```

다음에는 HR 분석 모델을 완성하기 위해 성과 리뷰를 추가합니다.
