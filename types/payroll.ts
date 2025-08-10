// 직원 정보
export interface Employee {
  id: string
  name: string
  department: string
  position: string
  employeeType: 'regular' | 'contract' | 'part-time'
  baseSalary: number
  allowances: number
  overtimePay: number
  annualLeavePay: number
  insurancePremiums: number
  totalCost: number
}

// 도급사/개인사업자
export interface Contractor {
  id: string
  name: string
  type: 'company' | 'individual'
  contractAmount: number
  period: string
  description: string
}

// 대행사 수수료
export interface Agency {
  id: string
  name: string
  serviceType: string
  feeRate: number
  monthlyCost: number
}

// HC ROI 데이터
export interface HCROIData {
  totalHeadcount: number
  totalCost: number
  revenue: number
  roi: number
  costPerEmployee: number
}

// 4대보험 요율
export interface InsuranceRates {
  nationalPension: number // 국민연금
  healthInsurance: number // 건강보험
  employmentInsurance: number // 고용보험
  industrialAccident: number // 산재보험
}

// 계산기 입력값
export interface CalculatorInput {
  baseSalary: number
  workingDays: number
  overtimeHours: number
  annualLeaveDays: number
  childcareLeave: boolean
  shortWorkHours: number
}

// 직접인건비 (Direct Labor Cost)
export interface DirectLaborCost {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  baseSalary: number
  overtimePay: number
  allowances: number
  bonuses: number
  totalDirectCost: number
  month: string
  year: number
}

// 간접인건비 (Indirect Labor Cost)
export interface IndirectLaborCost {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  insurancePremiums: number
  welfareBenefits: number
  trainingCosts: number
  recruitmentCosts: number
  totalIndirectCost: number
  month: string
  year: number
}

// 인건비 요약
export interface TotalLaborCost {
  directCosts: DirectLaborCost[]
  indirectCosts: IndirectLaborCost[]
  totalDirectCost: number
  totalIndirectCost: number
  totalLaborCost: number
  month: string
  year: number
  departmentBreakdown: {
    department: string
    directCost: number
    indirectCost: number
    totalCost: number
  }[]
}

// 통합데이터업로드 - 급여대장
export interface PayrollData {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  employeeType: 'regular' | 'contract' | 'part-time'
  baseSalary: number
  allowances: number
  overtimePay: number
  annualLeavePay: number
  insurancePremiums: number
  bonuses: number
  totalPayroll: number
  month: string
  year: number
  uploadDate: string
  fileName: string
}

// 통합데이터업로드 - 개인사업자/도급사/대행업체 수수료
export interface FeeData {
  id: string
  companyName: string
  businessType: 'individual' | 'contractor' | 'agency'
  serviceDescription: string
  contractAmount: number
  feeRate: number
  monthlyFee: number
  contractPeriod: string
  startDate: string
  endDate: string
  totalFee: number
  month: string
  year: number
  uploadDate: string
  fileName: string
  // 이미지 데이터 구조에 맞춘 추가 필드들
  personnel?: number // 인원 수
  category?: string // 구분 (개발/인프라 등)
  contractEntity?: string // 계약주체
  remarks?: string // 비고
  isDevelopment?: boolean // 개발 업무 여부
  isInfrastructure?: boolean // 인프라 업무 여부
}

// 통합데이터업로드 요약
export interface IntegratedDataSummary {
  payrollData: PayrollData[]
  feeData: FeeData[]
  totalPayrollCost: number
  totalFeeCost: number
  totalLaborCost: number
  lastUpdated: string
  totalFiles: number
}

// 파일 업로드 히스토리
export interface UploadHistory {
  id: string
  fileName: string
  fileType: 'payroll' | 'fee'
  uploadDate: string
  recordCount: number
}

// 급여 데이터
export interface SalaryData {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  employeeType: 'regular' | 'contract' | 'part-time'
  baseSalary: number
  overtimePay: number
  allowances: number
  bonuses: number
  deductions: number
  netSalary: number
  month: string
  year: number
  uploadDate: string
  fileName: string
}

// 급여 조회 필터
export interface SalaryFilter {
  employeeName?: string
  department?: string
  position?: string
  startDate?: string
  endDate?: string
  minSalary?: number
  maxSalary?: number
}

// 급여 통계
export interface SalaryStatistics {
  totalEmployees: number
  totalBaseSalary: number
  totalOvertimePay: number
  totalAllowances: number
  totalBonuses: number
  totalDeductions: number
  totalNetSalary: number
  averageSalary: number
  departmentBreakdown: {
    department: string
    employeeCount: number
    totalSalary: number
    averageSalary: number
  }[]
  positionBreakdown: {
    position: string
    employeeCount: number
    totalSalary: number
    averageSalary: number
  }[]
}



