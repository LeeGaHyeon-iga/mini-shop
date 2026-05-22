# Mini Shop (Before 버전)

React 실무 학습을 위한 미니 이커머스 프로젝트의 **Before 버전**입니다.

이 프로젝트는 기본적인 React 기능만을 사용하여 구현되어 있습니다. 강의를 통해 이 프로젝트를 실무 수준의 도구들(React Query, Zustand, React Hook Form 등)을 활용한 **After 버전**으로 개선합니다.

## 기술 스택

- **빌드 도구**: Vite 8
- **프레임워크**: React 18
- **언어**: TypeScript
- **라우팅**: React Router v7
- **상태 관리**: Context API (useState + useContext)
- **데이터 페칭**: useState + useEffect + fetch
- **폼 관리**: useState + 수동 검증
- **스타일링**: CSS Modules

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 환경 변수

`.env` 파일에서 API URL을 설정할 수 있습니다:

```env
VITE_API_URL=http://54.180.25.65:8001
```

팀별로 다른 포트를 사용합니다:

- 팀 1: 포트 8001
- 팀 2: 포트 8002
- 팀 3: 포트 8003
- 팀 4: 포트 8004

## 테스트 계정

```
이메일: test@example.com
비밀번호: password123
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Button, Input, Spinner)
│   ├── layout/          # 레이아웃 컴포넌트 (Header, Footer, Layout)
│   ├── product/         # 상품 관련 컴포넌트
│   └── cart/            # 장바구니 관련 컴포넌트
├── contexts/            # Context API (AuthContext, CartContext)
├── pages/               # 페이지 컴포넌트
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수 및 API
├── App.tsx              # 앱 진입점 (라우팅 설정)
└── main.tsx             # React 렌더링 진입점
```

## 주요 기능

- **상품**: 목록 조회, 검색, 카테고리 필터, 정렬, 상세 보기
- **장바구니**: 추가/삭제, 수량 변경, 합계 계산
- **인증**: 로그인, 회원가입, 로그아웃
- **주문**: 주문하기, 주문 내역 조회
- **마이페이지**: 회원 정보 수정, 찜 목록

## Before vs After 비교

| 기능        | Before (현재)        | After (강의 후)                |
| ----------- | -------------------- | ------------------------------ |
| 데이터 페칭 | useState + useEffect | React Query                    |
| 상태 관리   | Context API          | Zustand                        |
| 폼 관리     | useState + 수동 검증 | React Hook Form + Zod          |
| 스타일링    | CSS Modules          | Tailwind CSS                   |
| 테스트      | 없음                 | Vitest + React Testing Library |

## 학습 목표

이 프로젝트를 개선하면서 다음을 학습합니다:

1. **React Query**: 서버 상태 관리, 캐싱, 자동 리페치
2. **Zustand**: 간결한 클라이언트 상태 관리
3. **React Hook Form + Zod**: 폼 관리와 스키마 기반 유효성 검증
4. **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
5. **테스트**: 컴포넌트 테스트 작성

## 기타 사항

05.22
zustand 작업 후 페이지가 열리지 않는 문제 발생..
