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


