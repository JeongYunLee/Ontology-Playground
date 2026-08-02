---
title: "3단계: 대출 분류"
description: "Basel 위험 가중치가 있는 대출 유형, 담보 카테고리, OCC/FDIC 집중 버킷을 추가합니다."
reviewStatus: under-human-review
---

## 상품 차원

리스크가 *어디*(지리) 있고 *어느 부문*(업종)이 노출되어 있는지 모델링했습니다. 이제 **대출 상품 차원**을 추가합니다 — 대출을 유형·담보·이들이 속하는 규제 집중 버킷으로 분류합니다.

Basel III 위험 가중치가 등장하는 지점입니다.

## 새 엔티티 타입

### ConcentrationCategory

OCC/FDIC 지침이 정의한 규제 버킷. 은행은 카테고리별 노출을 모니터링해야 합니다.

| 속성 | 타입 | 노트 |
|---|---|---|
| `categoryId` | string | 식별자 (예: "CRE", "C&I", "CONSUMER") |
| `name` | string | 표시 이름 |
| `description` | string | 이 카테고리에 속하는 것 |
| `occGuidance` | string | 관련 OCC/FDIC 지침 참조 |

카테고리 예시: **CRE**(Commercial Real Estate), **C&I**(Commercial & Industrial), **Consumer**, **Agriculture**.

### LoanType

Basel III 자본 요건이 있는 특정 대출 상품.

| 속성 | 타입 | 노트 |
|---|---|---|
| `loanTypeCode` | string | 식별자 (예: "residential_mortgage") |
| `name` | string | 표시 이름 |
| `baselRiskWeight` | decimal (%) | Basel III 표준화 위험 가중치 |
| `regulatoryTreatment` | string | 규제 기관이 이 상품을 어떻게 분류하는지 |
| `capitalTier` | string | 자본 처리 티어 |
| `description` | string | 상품 설명 |

핵심 예시:

| 대출 유형 | Basel 위험 가중치 |
|---|---|
| 주거용 모기지 | 35% |
| 자동차 대출 | 75% |
| SBA 대출 | 0% (정부 보증) |
| 건설 대출 | 150% |
| CRE 모기지 | 100% |

### CollateralType

회수 기대치가 있는, 대출을 담보하는 자산 범주.

| 속성 | 타입 | 노트 |
|---|---|---|
| `collateralTypeCode` | string | 식별자 |
| `name` | string | 표시 이름 |
| `recoveryExpectation` | string | 예상 회수율 (예: "high", "moderate", "low") |
| `description` | string | 자산 범주 설명 |

## 새 관계

- **loanClassifiedAs**: `LoanType` → `ConcentrationCategory` (`many-to-one`) — 각 대출 유형이 집중 버킷에 매핑됨
- **collateralClassifiedAs**: `CollateralType` → `ConcentrationCategory` (`many-to-one`) — 담보 유형도 집중 버킷에 매핑됨
- **typicallySecuredBy**: `CollateralType` → `LoanType` (`many-to-many`) — 어느 담보 유형이 어느 대출 유형을 통상적으로 뒷받침하는지 연결

## 설계 패턴: 허브 엔티티

**ConcentrationCategory**는 *허브 엔티티*입니다 — 대출 분류 하위 그래프를 모델의 나머지에 연결합니다. LoanType과 CollateralType 모두 여기를 가리키며 규제 분석을 위한 공유 참조점을 만듭니다.

4단계에서 RegulatoryLimit도 ConcentrationCategory에 연결되어 컴플라이언스 질의의 중심 노드가 됩니다.

## Basel III 위험 가중치: 왜 중요한가

Basel III는 은행이 각 대출 유형에 대해 보유해야 하는 자본 규모를 결정하는 위험 가중치를 부여합니다. 주거용 모기지의 35% 위험 가중치는 대출 1달러당 필요한 자본이 적다는 뜻이고, 건설 대출의 150% 가중치는 훨씬 많은 자본이 필요하다는 뜻입니다.

이는 다음에 직접 영향을 미칩니다.

- **수익성**: 위험 가중치가 낮을수록 = 묶이는 자본이 적을수록 = 자기자본이익률(ROE) 상승
- **포트폴리오 전략**: 은행은 위험 가중치를 염두에 두고 대출 믹스를 최적화
- **규제 준수**: 위험가중자산 한도를 초과하면 감독 조치 발동

## 3단계 그래프 (2단계 대비 차이)

<ontology-embed id="official/fibo-risk-step-3" diff="official/fibo-risk-step-2" height="440px"></ontology-embed>

*세 개의 새 엔티티가 대출 분류 클러스터를 이룹니다. ConcentrationCategory가 대출 유형과 담보 유형을 잇는 허브입니다.*

```quiz
Q: 건설 대출은 150% Basel 위험 가중치인 반면 SBA 대출은 0%인 이유는?
- 건설 대출이 처리에 더 오래 걸려서
- SBA 대출은 정부 보증이라 은행이 신용 리스크를 지지 않지만, 건설 대출은 부도와 완공 리스크가 높아서 [correct]
- 건설 회사가 수익성이 낮아서
- SBA가 Safe Banking Asset의 약자라서
> Basel III 위험 가중치는 은행이 부담하는 신용 리스크를 반영합니다. SBA(Small Business Administration) 대출은 미국 정부가 보증하므로 은행 신용 리스크가 0입니다. 건설 대출은 완공 리스크, 시장 리스크, 높은 부도율에 직면하므로 은행이 150% 위험가중자본을 보유해야 합니다.
```
