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

// 날짜 포맷팅 함수
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// 시간 포맷팅 함수
export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 데이터 검증 함수
export function validateEmployeeData(data: any): boolean {
  const requiredFields = ['name', 'department', 'position', 'baseSalary']
  return requiredFields.every(field => data[field] !== undefined && data[field] !== '')
}

// 급여 등급 계산
export function calculateSalaryGrade(baseSalary: number): string {
  if (baseSalary < 3000000) return '초급'
  if (baseSalary < 5000000) return '중급'
  if (baseSalary < 8000000) return '고급'
  return '특급'
}

// 부서별 평균 급여 계산
export function calculateDepartmentAverageSalary(employees: any[], department: string): number {
  const deptEmployees = employees.filter(emp => emp.department === department)
  if (deptEmployees.length === 0) return 0
  
  const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0)
  return Math.floor(totalSalary / deptEmployees.length)
}

// 연도별 급여 증가율 계산
export function calculateSalaryIncreaseRate(currentSalary: number, previousSalary: number): number {
  if (previousSalary === 0) return 0
  return ((currentSalary - previousSalary) / previousSalary) * 100
}

// 효율성 점수 계산 (ROI 기반)
export function calculateEfficiencyScore(revenue: number, totalCost: number, targetROI: number = 0.15): number {
  const actualROI = calculateROI(revenue, totalCost)
  const score = Math.min(100, Math.max(0, (actualROI / targetROI) * 100))
  return Math.round(score)
}

// 데이터 내보내기 함수 (CSV)
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}



