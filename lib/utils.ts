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


