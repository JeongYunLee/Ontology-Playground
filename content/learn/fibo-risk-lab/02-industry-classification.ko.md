---
title: "1단계: 업종 분류"
description: "경제 계층 모델링 — 기후와 경기 순환 특성을 가진 Sector, Subsector, IndustryGroup."
reviewStatus: under-human-review
---

## 왜 업종을 분류하나?

은행은 경제 부문 전반에 걸친 노출을 이해해야 합니다. 포트폴리오 대출의 40%가 건설업체에 대한 것이라면 주택 시장 침체가 파괴적일 수 있습니다. **NAICS**(North American Industry Classification System)는 FIBO가 기반으로 삼는 표준 분류 체계를 제공합니다.

이 단계에서 세 레벨 계층을 모델링합니다: Sector → Subsector → IndustryGroup, 리스크 관련 속성으로 강화됩니다.

## 엔티티 타입

### Sector

가장 넓은 분류 — "제조", "금융", "헬스케어" 같은.

| 속성 | 타입 | 노트 |
|---|---|---|
| `sectorCode` | string | 식별자 (예: "31-33") |
| `sectorName` | string | 표시 이름 |
| `description` | string | 이 부문이 다루는 내용 |

### Subsector

Sector 내 세분화 — "제조" 내 "식품 제조".

| 속성 | 타입 | 노트 |
|---|---|---|
| `subsectorCode` | string | 식별자 (예: "311") |
| `subsectorName` | string | 표시 이름 |

### IndustryGroup

가장 세분화된 수준으로, 포트폴리오 분석에 중요한 리스크 속성을 담습니다.

| 속성 | 타입 | 노트 |
|---|---|---|
| `naicsCode` | string | 식별자 — 공식 NAICS 코드 |
| `name` | string | 업종 이름 |
| `cyclicality` | string | 경기 사이클에 대한 민감도 (예: "high", "low", "counter-cyclical") |
| `climateSensitivity` | string | 기후 이벤트 노출도 (예: "high", "moderate", "low") |
| `essentialServices` | boolean | 필수 서비스를 제공하는 업종인지 (더 견고) |
| `description` | string | 업종 설명 |

## 관계

- **partOfSector**: `Subsector` → `Sector` (`many-to-one`) — 모든 서브섹터는 정확히 하나의 섹터에 속함
- **belongsToSubsector**: `IndustryGroup` → `Subsector` (`many-to-one`) — 모든 산업 그룹은 하나의 서브섹터에 속함

이렇게 엄격한 계층이 만들어집니다: `Sector` ← `Subsector` ← `IndustryGroup`

## 설계 패턴: 분류 계층

이건 가장 흔한 온톨로지 패턴 중 하나입니다 — **엄격한 트리 계층**에서 각 자식이 정확히 하나의 부모를 가집니다. 다음을 가능하게 합니다.

- **롤업 집계**: 한 서브섹터 내 모든 산업 그룹의 대출을 합산해 서브섹터 노출을 얻음
- **드릴다운 분석**: 섹터 수준에서 시작해 서브섹터로, 이어서 특정 산업 그룹으로 파고듦
- **리스크 속성 상속**: 섹터가 "순환적"이면 그 자식들이 그 리스크 맥락을 상속함

## 1단계 그래프

<ontology-embed id="official/fibo-risk-step-1" height="340px"></ontology-embed>

*세 개의 엔티티가 분류 트리를 이룹니다 — 업종 집중 분석의 기초 패턴.*

```quiz
Q: IndustryGroup에 climateSensitivity 속성을 포함하는 이유는?
- 업종의 탄소 배출을 추적하려고
- 허리케인이나 산불 같은 기후 이벤트에 대한 노출로 업종을 필터링하는 포트폴리오 리스크 질의를 가능하게 하려고 [correct]
- ESG 보고 요건을 준수하려고
- 대출 보험료를 계산하려고
> climateSensitivity 속성은 리스크 분석가가 대출 포트폴리오의 어느 부분이 기후 관련 이벤트에 노출되어 있는지 식별할 수 있게 합니다. 다음 단계의 지리 데이터와 결합하면 강력한 크로스 도메인 집중 질의가 가능해집니다.
```
