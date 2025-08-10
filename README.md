# PayPulse99 - 스마트 인건비 관리 시스템

![PayPulse99 Logo](https://img.shields.io/badge/PayPulse99-인건비관리-FF6B35?style=for-the-badge&logo=react)

> AI 기반 통합 인건비 관리 시스템으로, 급여부터 수수료까지 모든 인건비를 효율적으로 관리하고 분석할 수 있습니다.

## 🚀 주요 기능

### 📊 **실시간 대시보드**

- 직원별, 부서별 인건비 현황 실시간 모니터링
- 인건비 트렌드 분석 및 예측
- HC ROI (인적자원 투자수익률) 계산
- 시각적 차트와 그래프로 직관적인 데이터 표현

### 📁 **통합 데이터 업로드**

- 급여대장, 수수료 파일 일괄 업로드
- Excel, CSV 등 다양한 파일 형식 지원
- 자동 데이터 검증 및 오류 감지
- 실시간 데이터 미리보기

### 🤖 **AI 인사이트**

- 인건비 최적화 방안 제시
- 부서별 효율성 분석
- 4대보험 최적화 가이드
- 자연어로 질문하고 답변 받기

### 🧮 **정확한 계산기**

- 4대보험료 자동 계산
- 각종 수당 계산 (연장근무, 야간근무, 휴일근무 등)
- 육아휴직 급여 계산
- 최신 법규 반영

### 💰 **급여 관리**

- 개별 급여 상세 분석
- 부서별, 직급별 급여 현황
- 급여 구성 요소별 분석
- 필터링 및 검색 기능

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Charts**: Recharts
- **File Processing**: ExcelJS
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS, Autoprefixer

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/PayPulse99.git
cd PayPulse99
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

### 4. 브라우저에서 확인

```
http://localhost:3000
```

## 🎯 사용 방법

### 📊 대시보드 사용

1. **홈페이지**에서 "지금 시작하기" 클릭
2. **대시보드**에서 전체 인건비 현황 확인
3. **기간별 분석**으로 트렌드 파악
4. **부서별 분석**으로 효율성 검토

### 📁 데이터 업로드

1. **업로드** 메뉴로 이동
2. 급여대장 파일 선택 (Excel/CSV)
3. 수수료 파일 선택 (Excel/CSV)
4. **데이터 미리보기**로 내용 확인
5. **업로드 완료** 후 대시보드에서 분석

### 🤖 AI 분석

1. **AI 인사이트** 메뉴로 이동
2. 자연어로 질문 입력
3. AI가 분석 결과 및 최적화 방안 제시
4. **제안 버튼**으로 추가 분석 진행

### 🧮 계산기 사용

1. **계산기** 메뉴로 이동
2. **4대보험 계산기** 또는 **수당 계산기** 선택
3. 필요한 정보 입력
4. **자동 계산 결과** 확인

## 📁 프로젝트 구조

```
PayPulse99/
├── app/                    # Next.js App Router
│   ├── ai-chat/          # AI 채팅 페이지
│   ├── calculator/        # 계산기 페이지
│   ├── dashboard/         # 대시보드 페이지
│   ├── salary/            # 급여 관리 페이지
│   ├── total-labor-cost/  # 인건비 분석 페이지
│   ├── upload/            # 업로드 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── ai-chat/          # AI 채팅 관련 컴포넌트
│   ├── calculator/        # 계산기 관련 컴포넌트
│   ├── salary/            # 급여 관련 컴포넌트
│   ├── upload/            # 업로드 관련 컴포넌트
│   ├── Navigation.tsx     # 네비게이션 컴포넌트
│   ├── OKSidebar.tsx      # 사이드바 컴포넌트
│   └── OKTopBar.tsx       # 상단바 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── types.ts          # TypeScript 타입 정의
│   └── utils.ts          # 공통 유틸리티 함수
├── types/                 # 타입 정의 파일
│   └── payroll.ts        # 급여 관련 타입
└── package.json           # 프로젝트 설정 및 의존성
```

## 🎨 디자인 시스템

### **OK저축은행 스타일**

- **색상**: 오렌지(#FF6B35) 기반의 따뜻한 톤
- **그라데이션**: 부드러운 그라데이션 효과
- **카드**: 반투명 배경과 블러 효과
- **버튼**: 둥근 모서리와 호버 효과

### **컴포넌트 클래스**

- `.ok-card`: 기본 카드 스타일
- `.ok-btn-primary`: 주요 액션 버튼
- `.ok-btn-secondary`: 보조 액션 버튼
- `.ok-input`: 입력 필드 스타일
- `.ok-section`: 섹션 배경 스타일

## 📱 반응형 디자인

- **모바일**: 320px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상
- **대형 화면**: 1280px 이상

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 빌드 분석
npm run build:analyze
```

## 🌟 주요 특징

### **AI 기반 분석**

- 자연어 처리로 직관적인 질의응답
- 인건비 최적화 방안 자동 제시
- 부서별 효율성 분석 및 개선점 도출

### **실시간 데이터 처리**

- 파일 업로드 즉시 분석
- 실시간 대시보드 업데이트
- 자동 데이터 검증 및 오류 감지

### **사용자 친화적 UI/UX**

- 직관적인 네비게이션
- 반응형 디자인으로 모든 기기 지원
- 접근성을 고려한 색상 및 폰트

### **확장 가능한 아키텍처**

- 모듈화된 컴포넌트 구조
- TypeScript로 타입 안정성 확보
- 재사용 가능한 유틸리티 함수

## 🚀 향후 계획

### **단기 계획 (1-2개월)**

- [ ] 사용자 인증 시스템 추가
- [ ] 데이터 백업 및 복원 기능
- [ ] 다국어 지원 (영어, 일본어)

### **중기 계획 (3-6개월)**

- [ ] 모바일 앱 개발
- [ ] API 서버 구축
- [ ] 실시간 협업 기능

### **장기 계획 (6개월 이상)**

- [ ] AI 모델 고도화
- [ ] 예측 분석 기능 강화
- [ ] 외부 시스템 연동

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의 및 지원

- **이메일**: support@paypulse99.com
- **문서**: [docs.paypulse99.com](https://docs.paypulse99.com)
- **이슈**: [GitHub Issues](https://github.com/your-username/PayPulse99/issues)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Recharts](https://recharts.org/) - 차트 라이브러리
- [Lucide](https://lucide.dev/) - 아이콘 라이브러리

---

**PayPulse99**로 인건비 관리의 새로운 경험을 시작하세요! 🚀
