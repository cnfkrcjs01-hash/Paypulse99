import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// 숫자를 한국 원화로 포맷팅
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

// 숫자를 천단위 콤마로 포맷팅
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

// 퍼센트 포맷팅
export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(2)}%`
}

// ROI 계산
export function calculateROI(revenue: number, totalCost: number): number {
  if (totalCost === 0) return 0
  return (revenue - totalCost) / totalCost
}

// 4대보험 계산
export function calculateInsurance(baseSalary: number) {
  const rates = {
    nationalPension: 0.045, // 4.5%
    healthInsurance: 0.0354, // 3.54% 
    employmentInsurance: 0.009, // 0.9%
    industrialAccident: 0.007, // 0.7%
  }
  
  return {
    nationalPension: Math.floor(baseSalary * rates.nationalPension),
    healthInsurance: Math.floor(baseSalary * rates.healthInsurance),
    employmentInsurance: Math.floor(baseSalary * rates.employmentInsurance),
    industrialAccident: Math.floor(baseSalary * rates.industrialAccident),
    total: Math.floor(
      baseSalary * (
        rates.nationalPension +
        rates.healthInsurance +
        rates.employmentInsurance +
        rates.industrialAccident
      )
    ),
  }
}

// 연장근무 수당 계산 (1.5배)
export function calculateOvertimePay(hourlyWage: number, overtimeHours: number): number {
  return Math.floor(hourlyWage * overtimeHours * 1.5)
}

// 연차 수당 계산
export function calculateAnnualLeavePay(dailyWage: number, leaveDays: number): number {
  return Math.floor(dailyWage * leaveDays)
}

// 샘플 데이터 생성 함수들
export function generateSampleEmployees() {
  const departments = ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '재무팀']
  const positions = ['사원', '대리', '과장', '차장', '부장', '이사']
  
  return Array.from({ length: 50 }, (_, i) => {
    const baseSalary = 3000000 + Math.random() * 2000000 + (i % 6) * 500000
    const allowances = baseSalary * 0.1
    const overtimePay = baseSalary * 0.05
    const annualLeavePay = baseSalary * 0.02
    const insurancePremiums = baseSalary * 0.1
    
    return {
      id: `emp_${i + 1}`,
      name: `직원${i + 1}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      employeeType: 'regular' as const,
      baseSalary: Math.floor(baseSalary),
      allowances: Math.floor(allowances),
      overtimePay: Math.floor(overtimePay),
      annualLeavePay: Math.floor(annualLeavePay),
      insurancePremiums: Math.floor(insurancePremiums),
      totalCost: Math.floor(baseSalary + allowances + overtimePay + annualLeavePay + insurancePremiums)
    }
  })
}

export function generateSampleContractors() {
  const types = ['company', 'individual'] as const
  const descriptions = ['웹개발', '앱개발', '디자인', '마케팅', '컨설팅']
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `cont_${i + 1}`,
    name: `도급사${i + 1}`,
    type: types[i % types.length],
    contractAmount: Math.floor(5000000 + Math.random() * 10000000),
    period: '2024년 1월 ~ 12월',
    description: descriptions[i % descriptions.length]
  }))
}

export function generateSampleAgencies() {
  const serviceTypes = ['인사대행', '급여대행', '회계대행', '법무대행', 'IT대행']
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `agency_${i + 1}`,
    name: `대행사${i + 1}`,
    serviceType: serviceTypes[i % serviceTypes.length],
    feeRate: 0.05 + Math.random() * 0.1,
    monthlyCost: Math.floor(2000000 + Math.random() * 5000000)
  }))
}

// 대시보드 초기 데이터 설정
export function initializeDashboardData() {
  const employees = generateSampleEmployees()
  const contractors = generateSampleContractors()
  const agencies = generateSampleAgencies()
  
  const data = { employees, contractors, agencies }
  localStorage.setItem('paypulse_data', JSON.stringify(data))
  
  return data
}



