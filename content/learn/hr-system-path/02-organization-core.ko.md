---
title: "조직 핵심"
description: "핵심 조직 구조를 모델링하기 위해 Employee, Department, Position을 정의합니다."
---

## 조직의 척추 세우기

모든 HR 온톨로지는 세 개의 핵심 엔티티에서 시작합니다.

- **Employee** — 조직 인력의 사람
- **Department** — 업무가 조직되는 사업 단위
- **Position** — 책임과 등급을 기술하는 역할 정의

이 세 엔티티가 채용, 보고, 인력 계획을 위한 최소한의 구조를 제공합니다.

## 엔티티 설계

### Employee

| 속성 | 타입 | 식별자? |
|---|---|---|
| `employeeId` | string | ✓ |
| `name` | string | |
| `hireDate` | date | |
| `employmentStatus` | enum | |
| `jobLevel` | enum | |

`employeeId`는 안정적인 비즈니스 식별자입니다. 이메일처럼 바뀔 수 있는 속성을 주 키로 쓰지 마세요.

### Department

| 속성 | 타입 | 식별자? |
|---|---|---|
| `departmentId` | string | ✓ |
| `name` | string | |
| `budget` | decimal | |
| `status` | enum | |

학과 예산을 담으면 같은 그래프에서 자원 계획과 코스트 센터 분석이 가능해집니다.

### Position

| 속성 | 타입 | 식별자? |
|---|---|---|
| `positionId` | string | ✓ |
| `title` | string | |
| `level` | enum | |
| `salaryBand` | string | |

Position은 현재 그 자리에 배정된 사람과 역할 정의를 분리합니다.

## 이 분리가 중요한 이유

이 개념들을 하나의 "EmployeeProfile" 엔티티로 뭉치면 다음의 유연성을 잃습니다.

- 이력이 있는 배치 변경
- 역할 전환
- 채용 전에 존재하는 공석

별도 엔티티로 두면 모델이 깨끗하고 확장 가능해집니다.

```quiz
Q: 역할 필드를 Employee에 직접 저장하는 대신 Position을 별도 엔티티로 모델링하는 이유는?
- 온톨로지 도구가 최소 세 개의 엔티티를 요구해서
- Position은 특정 직원과 독립적으로 존재할 수 있는 재사용 가능한 역할 정의라서 [correct]
- 관계 수를 줄이려고
- 식별자 속성을 피하려고
> Position은 역할 자체(title, level, salary band)를 대표하고, Employee는 사람을 대표합니다. 이 둘을 분리하면 공석, 역할 전환, 더 깨끗한 배치 분석이 가능해집니다.
```

다음에는 누가 어느 역할을, 어디서, 언제 맡았는지 담기 위해 Assignment를 추가합니다.
