'use client'

import SalaryDetail from '@/components/salary/SalaryDetail'
import { SalaryData, SalaryFilter, SalaryStatistics } from '@/types/payroll'
import {
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Download,
  Eye, FileText,
  Filter,
  Home, Menu,
  PieChart,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SalaryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-12')
  const [selectedView, setSelectedView] = useState<'summary' | 'list' | 'analysis'>('summary')
  const [salaryData, setSalaryData] = useState<SalaryData[]>([])
  const [filteredData, setFilteredData] = useState<SalaryData[]>([])
  const [statistics, setStatistics] = useState<SalaryStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<SalaryFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 실제 업로드된 급여 데이터와 샘플 데이터 로드
  useEffect(() => {
    const loadSalaryData = () => {
      console.log('=== loadSalaryData 시작 ===')
      setLoading(true)

      try {
        const savedData = localStorage.getItem('integrated_paypulse_data')
        console.log('localStorage에서 찾은 데이터:', savedData ? '있음' : '없음')

        let actualData: SalaryData[] = []

        if (savedData) {
          const parsedData = JSON.parse(savedData)
          console.log('파싱된 데이터 구조:', Object.keys(parsedData))
          console.log('파싱된 데이터 타입:', typeof parsedData)
          console.log('파싱된 데이터 길이:', Array.isArray(parsedData) ? parsedData.length : '배열 아님')

          // 다양한 데이터 구조에 대응
          if (parsedData.payrollData && Array.isArray(parsedData.payrollData) && parsedData.payrollData.length > 0) {
            // PayrollData를 SalaryData로 변환
            actualData = parsedData.payrollData.map((item: any) => ({
              id: item.id,
              employeeId: item.employeeId,
              employeeName: item.employeeName,
              department: item.department,
              position: item.position,
              employeeType: item.employeeType,
              baseSalary: item.baseSalary,
              overtimePay: item.overtimePay,
              allowances: item.allowances,
              bonuses: item.bonuses,
              deductions: item.insurancePremiums || 0,
              netSalary: item.totalPayroll || 0, // totalPayroll을 netSalary로 매핑
              month: item.month,
              year: item.year,
              uploadDate: item.uploadDate,
              fileName: item.fileName
            }))
            console.log('payrollData에서 로드됨 (변환됨):', actualData.length, '레코드')
          } else if (parsedData.salaryData && Array.isArray(parsedData.salaryData) && parsedData.salaryData.length > 0) {
            actualData = parsedData.salaryData
            console.log('salaryData에서 로드됨:', actualData.length, '레코드')
          } else if (Array.isArray(parsedData) && parsedData.length > 0) {
            // 배열인 경우 각 항목의 구조를 확인하여 변환
            actualData = parsedData.map((item: any) => {
              if (item.totalPayroll !== undefined) {
                // PayrollData 형태인 경우 SalaryData로 변환
                return {
                  id: item.id,
                  employeeId: item.employeeId,
                  employeeName: item.employeeName,
                  department: item.department,
                  position: item.position,
                  employeeType: item.employeeType,
                  baseSalary: item.baseSalary,
                  overtimePay: item.overtimePay,
                  allowances: item.allowances,
                  bonuses: item.bonuses,
                  deductions: item.insurancePremiums || 0,
                  netSalary: item.totalPayroll || 0,
                  month: item.month,
                  year: item.year,
                  uploadDate: item.uploadDate,
                  fileName: item.fileName
                }
              } else if (item.netSalary !== undefined) {
                // 이미 SalaryData 형태인 경우
                return item
              } else {
                // 기본값으로 변환
                return {
                  id: item.id || `unknown_${Date.now()}_${Math.random()}`,
                  employeeId: item.employeeId || '',
                  employeeName: item.employeeName || '',
                  department: item.department || '미분류',
                  position: item.position || '미분류',
                  employeeType: item.employeeType || 'regular',
                  baseSalary: item.baseSalary || 0,
                  overtimePay: item.overtimePay || 0,
                  allowances: item.allowances || 0,
                  bonuses: item.bonuses || 0,
                  deductions: item.deductions || 0,
                  netSalary: item.netSalary || 0,
                  month: item.month || new Date().getMonth() + 1,
                  year: item.year || new Date().getFullYear(),
                  uploadDate: item.uploadDate || new Date().toISOString(),
                  fileName: item.fileName || 'unknown'
                }
              }
            })
            console.log('직접 배열에서 로드됨 (변환됨):', actualData.length, '레코드')
          } else if (parsedData.data && Array.isArray(parsedData.data) && parsedData.data.length > 0) {
            // data.data도 동일하게 변환
            actualData = parsedData.data.map((item: any) => {
              if (item.totalPayroll !== undefined) {
                return {
                  id: item.id,
                  employeeId: item.employeeId,
                  employeeName: item.employeeName,
                  department: item.department,
                  position: item.position,
                  employeeType: item.employeeType,
                  baseSalary: item.baseSalary,
                  overtimePay: item.overtimePay,
                  allowances: item.allowances,
                  bonuses: item.bonuses,
                  deductions: item.insurancePremiums || 0,
                  netSalary: item.totalPayroll || 0,
                  month: item.month,
                  year: item.year,
                  uploadDate: item.uploadDate,
                  fileName: item.fileName
                }
              } else if (item.netSalary !== undefined) {
                return item
              } else {
                return {
                  id: item.id || `unknown_${Date.now()}_${Math.random()}`,
                  employeeId: item.employeeId || '',
                  employeeName: item.employeeName || '',
                  department: item.department || '미분류',
                  position: item.position || '미분류',
                  employeeType: item.employeeType || 'regular',
                  baseSalary: item.baseSalary || 0,
                  overtimePay: item.overtimePay || 0,
                  allowances: item.allowances || 0,
                  bonuses: item.bonuses || 0,
                  deductions: item.deductions || 0,
                  netSalary: item.netSalary || 0,
                  month: item.month || new Date().getMonth() + 1,
                  year: item.year || new Date().getFullYear(),
                  uploadDate: item.uploadDate || new Date().toISOString(),
                  fileName: item.fileName || 'unknown'
                }
              }
            })
            console.log('data.data에서 로드됨 (변환됨):', actualData.length, '레코드')
          }

          // 데이터 유효성 검증
          if (actualData.length > 0) {
            const firstItem = actualData[0]
            console.log('첫 번째 항목 샘플:', firstItem)
            console.log('첫 번째 항목의 키들:', Object.keys(firstItem))

            // 필수 필드가 있는지 확인
            if (!firstItem.baseSalary && !firstItem.netSalary) {
              console.warn('데이터 구조가 유효하지 않음, 샘플 데이터 사용')
              actualData = []
            } else {
              // 각 항목의 데이터 유효성 검사
              const validData = actualData.filter(item => {
                const hasValidSalary = (item.baseSalary && item.baseSalary > 0) ||
                  (item.netSalary && item.netSalary > 0)
                if (!hasValidSalary) {
                  console.warn('유효하지 않은 급여 데이터:', item)
                }
                return hasValidSalary
              })

              if (validData.length !== actualData.length) {
                console.warn(`${actualData.length - validData.length}개의 유효하지 않은 데이터 제거됨`)
                actualData = validData
              }
            }
          }
        } else {
          console.log('integrated_paypulse_data를 localStorage에서 찾을 수 없음')

          // 다른 가능한 키들도 확인
          const possibleKeys = ['payroll_data', 'salary_data', 'uploaded_data', 'file_data', 'paypulse_data']
          for (const key of possibleKeys) {
            const data = localStorage.getItem(key)
            if (data) {
              console.log(`${key}에서 데이터 발견:`, data.substring(0, 200) + '...')
              try {
                const parsed = JSON.parse(data)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  console.log(`${key}에서 유효한 배열 데이터 발견:`, parsed.length, '레코드')
                  // 배열 데이터도 SalaryData 형태로 변환
                  actualData = parsed.map((item: any) => {
                    if (item.totalPayroll !== undefined) {
                      // PayrollData 형태인 경우 SalaryData로 변환
                      return {
                        id: item.id,
                        employeeId: item.employeeId,
                        employeeName: item.employeeName,
                        department: item.department,
                        position: item.position,
                        employeeType: item.employeeType,
                        baseSalary: item.baseSalary,
                        overtimePay: item.overtimePay,
                        allowances: item.allowances,
                        bonuses: item.bonuses,
                        deductions: item.insurancePremiums || 0,
                        netSalary: item.totalPayroll || 0,
                        month: item.month,
                        year: item.year,
                        uploadDate: item.uploadDate,
                        fileName: item.fileName
                      }
                    } else if (item.netSalary !== undefined) {
                      // 이미 SalaryData 형태인 경우
                      return item
                    } else {
                      // 기본값으로 변환
                      return {
                        id: item.id || `unknown_${Date.now()}_${Math.random()}`,
                        employeeId: item.employeeId || '',
                        employeeName: item.employeeName || '',
                        department: item.department || '미분류',
                        position: item.position || '미분류',
                        employeeType: item.employeeType || 'regular',
                        baseSalary: item.baseSalary || 0,
                        overtimePay: item.overtimePay || 0,
                        allowances: item.allowances || 0,
                        bonuses: item.bonuses || 0,
                        deductions: item.deductions || 0,
                        netSalary: item.netSalary || 0,
                        month: item.month || new Date().getMonth() + 1,
                        year: item.year || new Date().getFullYear(),
                        uploadDate: item.uploadDate || new Date().toISOString(),
                        fileName: item.fileName || 'unknown'
                      }
                    }
                  })
                  break
                }
              } catch (e) {
                console.log(`${key} 파싱 실패:`, e)
              }
            }
          }
        }

        // 실제 데이터가 없으면 샘플 데이터 생성
        if (actualData.length === 0) {
          console.log('유효한 실제 데이터가 없음, 샘플 데이터 생성...')
          actualData = generateSampleData()
        }

        console.log('최종 사용할 데이터:', actualData.length, '레코드')
        console.log('샘플 레코드:', actualData[0])

        // 데이터 타입 검증
        actualData.forEach((item, index) => {
          if (typeof item.baseSalary !== 'number' || typeof item.netSalary !== 'number') {
            console.warn(`레코드 ${index}의 급여 데이터 타입이 잘못됨:`, {
              baseSalary: item.baseSalary,
              netSalary: item.netSalary,
              types: {
                baseSalary: typeof item.baseSalary,
                netSalary: typeof item.netSalary
              }
            })
          }
        })

        setSalaryData(actualData)
        setFilteredData(actualData)
        generateStatistics(actualData)
        setLoading(false)
        console.log('=== loadSalaryData 완료 ===')
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
        setLoading(false)
        // 오류 발생 시 샘플 데이터 사용
        const sampleData = generateSampleData()
        setSalaryData(sampleData)
        setFilteredData(sampleData)
        generateStatistics(sampleData)
      }
    }

    // 샘플 급여 데이터 생성 함수
    const generateSampleData = (): SalaryData[] => {
      const departments = ['개발팀', '마케팅팀', '영업팀', '인사팀', '재무팀', '기획팀']
      const positions = ['팀장', '과장', '대리', '사원', '인턴']
      const employeeTypes = ['regular', 'contract', 'part-time']

      const sampleData: SalaryData[] = departments.flatMap((dept, deptIndex) =>
        Array.from({ length: 10 }, (_, i) => {
          const baseSalary = 3000000 + (i * 200000) + (deptIndex * 500000)
          const overtimePay = 150000 + (i * 10000)
          const allowances = 200000 + (i * 15000)
          const bonuses = 500000 + (i * 50000)
          const deductions = 300000 + (i * 20000)
          const netSalary = baseSalary + overtimePay + allowances + bonuses - deductions

          return {
            id: `salary-${deptIndex}-${i}`,
            employeeId: `EMP-${deptIndex}${i.toString().padStart(2, '0')}`,
            employeeName: `${dept} ${positions[i % positions.length]} ${i + 1}`,
            department: dept,
            position: positions[i % positions.length],
            employeeType: employeeTypes[i % employeeTypes.length] as 'regular' | 'contract' | 'part-time',
            baseSalary,
            overtimePay,
            allowances,
            bonuses,
            deductions,
            netSalary,
            month: '12',
            year: 2024,
            uploadDate: '2024-12-01',
            fileName: `급여대장_${dept}_2024년12월.xlsx`
          }
        })
      )

      console.log('Sample data generated:', sampleData.length, 'records')
      console.log('Sample record sample:', sampleData[0])
      return sampleData
    }

    loadSalaryData()
  }, [])

  const generateStatistics = (data: SalaryData[]) => {
    console.log('=== generateStatistics 시작 ===')
    console.log('통계 생성할 데이터:', data.length, '레코드')
    console.log('첫 번째 레코드:', data[0])

    if (data.length === 0) {
      console.warn('데이터가 없어서 통계를 생성할 수 없음')
      return
    }

    const totalEmployees = data.length

    // 각 급여 항목별 상세 로깅
    const salaryDetails = data.map((item, index) => ({
      index,
      employeeName: item.employeeName,
      baseSalary: item.baseSalary,
      overtimePay: item.overtimePay,
      allowances: item.allowances,
      bonuses: item.bonuses,
      deductions: item.deductions,
      netSalary: item.netSalary,
      types: {
        baseSalary: typeof item.baseSalary,
        overtimePay: typeof item.overtimePay,
        allowances: typeof item.allowances,
        bonuses: typeof item.bonuses,
        deductions: typeof item.deductions,
        netSalary: typeof item.netSalary
      }
    }))

    console.log('급여 상세 정보:', salaryDetails)

    const totalBaseSalary = data.reduce((sum, item, index) => {
      const value = Number(item.baseSalary) || 0
      if (value === 0) {
        console.warn(`직원 ${index}: ${item.employeeName}의 기본급이 0입니다.`, item)
      }
      return sum + value
    }, 0)

    const totalOvertimePay = data.reduce((sum, item, index) => {
      const value = Number(item.overtimePay) || 0
      if (value === 0) {
        console.warn(`직원 ${index}: ${item.employeeName}의 초과근무수당이 0입니다.`, item)
      }
      return sum + value
    }, 0)

    const totalAllowances = data.reduce((sum, item, index) => {
      const value = Number(item.allowances) || 0
      if (value === 0) {
        console.warn(`직원 ${index}: ${item.employeeName}의 제수당이 0입니다.`, item)
      }
      return sum + value
    }, 0)

    const totalBonuses = data.reduce((sum, item, index) => {
      const value = Number(item.bonuses) || 0
      if (value === 0) {
        console.warn(`직원 ${index}: ${item.employeeName}의 상여금이 0입니다.`, item)
      }
      return sum + value
    }, 0)

    const totalDeductions = data.reduce((sum, item, index) => {
      const value = Number(item.deductions) || 0
      return sum + value
    }, 0)

    const totalNetSalary = data.reduce((sum, item, index) => {
      const value = Number(item.netSalary) || 0
      if (value === 0) {
        console.warn(`직원 ${index}: ${item.employeeName}의 실수령액이 0입니다.`, item)
      }
      return sum + value
    }, 0)

    const averageSalary = totalEmployees > 0 ? totalNetSalary / totalEmployees : 0

    console.log('계산된 총계:', {
      totalEmployees,
      totalBaseSalary,
      totalOvertimePay,
      totalAllowances,
      totalBonuses,
      totalDeductions,
      totalNetSalary,
      averageSalary
    })

    // 부서별 분석
    const departmentMap = new Map<string, { count: number; totalSalary: number }>()
    data.forEach(item => {
      const dept = item.department || '미분류'
      const current = departmentMap.get(dept) || { count: 0, totalSalary: 0 }
      current.count++
      current.totalSalary += Number(item.netSalary) || 0
      departmentMap.set(dept, current)
    })

    const departmentBreakdown = Array.from(departmentMap.entries()).map(([dept, data]) => ({
      department: dept,
      employeeCount: data.count,
      totalSalary: data.totalSalary,
      averageSalary: data.count > 0 ? data.totalSalary / data.count : 0
    }))

    // 직급별 분석
    const positionMap = new Map<string, { count: number; totalSalary: number }>()
    data.forEach(item => {
      const pos = item.position || '미분류'
      const current = positionMap.get(pos) || { count: 0, totalSalary: 0 }
      current.count++
      current.totalSalary += Number(item.netSalary) || 0
      positionMap.set(pos, current)
    })

    const positionBreakdown = Array.from(positionMap.entries()).map(([pos, data]) => ({
      position: pos,
      employeeCount: data.count,
      totalSalary: data.totalSalary,
      averageSalary: data.count > 0 ? data.totalSalary / data.count : 0
    }))

    const stats = {
      totalEmployees,
      totalBaseSalary,
      totalOvertimePay,
      totalAllowances,
      totalBonuses,
      totalDeductions,
      totalNetSalary,
      averageSalary,
      departmentBreakdown,
      positionBreakdown
    }

    console.log('최종 통계:', stats)
    console.log('=== generateStatistics 완료 ===')
    setStatistics(stats)
  }

  const applyFilters = () => {
    let filtered = [...salaryData]

    if (filters.employeeName) {
      filtered = filtered.filter(item =>
        item.employeeName.toLowerCase().includes(filters.employeeName!.toLowerCase())
      )
    }

    if (filters.department) {
      filtered = filtered.filter(item => item.department === filters.department)
    }

    if (filters.position) {
      filtered = filtered.filter(item => item.position === filters.position)
    }

    if (filters.minSalary) {
      filtered = filtered.filter(item => item.netSalary >= filters.minSalary!)
    }

    if (filters.maxSalary) {
      filtered = filtered.filter(item => item.netSalary <= filters.maxSalary!)
    }

    setFilteredData(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, salaryData])

  const clearFilters = () => {
    setFilters({})
    setFilteredData(salaryData)
  }

  const openDetailModal = (salary: SalaryData) => {
    console.log('Opening detail modal for:', salary) // 디버깅용 로그
    setSelectedSalary(salary)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    console.log('Closing detail modal') // 디버깅용 로그
    setShowDetailModal(false)
    setSelectedSalary(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return amount.toString()
  }

  if (loading) {
    return (
      <div className="page-background">
        <div className="ok-section-unified min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">급여 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="page-background">
        <div className="ok-section-unified min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">급여 데이터를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 버튼들 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              홈으로
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-4 h-4" />
              메뉴 보기
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">급여 관리</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="ok-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">급여 관리</h1>
              <p className="text-gray-600">업로드된 급여 데이터를 대상자/기간별로 조회하고 분석하세요</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/total-labor-cost" className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                인건비 분석
              </a>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                >
                  <option value="2024-12">2024년 12월</option>
                  <option value="2024-11">2024년 11월</option>
                  <option value="2024-10">2024년 10월</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                필터
              </button>
            </div>
          </div>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="ok-section-unified p-6 bg-white/90 backdrop-blur-sm rounded-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직원명</label>
                <input
                  type="text"
                  placeholder="직원명 검색"
                  value={filters.employeeName || ''}
                  onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                <select
                  value={filters.department || ''}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">전체 부서</option>
                  {Array.from(new Set(salaryData.map(item => item.department))).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직급</label>
                <select
                  value={filters.position || ''}
                  onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">전체 직급</option>
                  {Array.from(new Set(salaryData.map(item => item.position))).map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">급여 범위</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="최소"
                    value={filters.minSalary || ''}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="최대"
                    value={filters.maxSalary || ''}
                    onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={clearFilters}
                className="ok-btn-outline px-4 py-2"
              >
                필터 초기화
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="ok-btn-primary px-4 py-2"
              >
                적용
              </button>
            </div>
          </div>
        )}

        {/* 뷰 선택 탭 */}
        <div className="ok-section-unified p-6">
          <div className="flex space-x-1 bg-white/90 backdrop-blur-sm rounded-xl p-1 mb-6">
            <button
              onClick={() => setSelectedView('summary')}
              className={`ok-tab ${selectedView === 'summary' ? 'ok-tab-active' : 'ok-tab-inactive'}`}
            >
              <PieChart className="w-4 h-4 mr-2" />
              요약 대시보드
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`ok-tab ${selectedView === 'list' ? 'ok-tab-active' : 'ok-tab-inactive'}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              급여 명세서
            </button>
            <button
              onClick={() => setSelectedView('analysis')}
              className={`ok-tab ${selectedView === 'analysis' ? 'ok-tab-active' : 'ok-tab-inactive'}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              급여 분석
            </button>
          </div>

          {/* 급여 현황 요약 */}
          {selectedView === 'summary' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">급여 통계를 불러오는 중...</p>
                </div>
              ) : statistics ? (
                <>
                  {/* KPI 카드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="ok-kpi-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">총 직원 수</p>
                          <p className="text-2xl font-bold text-gray-900">{statistics.totalEmployees}명</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="ok-kpi-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">총 급여</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrencyShort(statistics.totalNetSalary)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="ok-kpi-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">평균 급여</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrencyShort(statistics.averageSalary)}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                          <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    <div className="ok-kpi-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">총 공제액</p>
                          <p className="text-2xl font-bold text-red-600">{formatCurrencyShort(statistics.totalDeductions)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 부서별 급여 현황 */}
                  <div className="ok-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">부서별 급여 현황</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">부서</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">직원 수</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">총 급여</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">평균 급여</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">비율</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statistics.departmentBreakdown.map((dept) => (
                            <tr key={dept.department} className="border-b border-gray-100 hover:bg-gray-50/50">
                              <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                              <td className="py-3 px-4 text-right text-gray-600">{dept.employeeCount}명</td>
                              <td className="py-3 px-4 text-right text-blue-600 font-medium">
                                {formatCurrency(dept.totalSalary)}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600 font-medium">
                                {formatCurrency(dept.averageSalary)}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {((dept.totalSalary / statistics.totalNetSalary) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">급여 통계를 불러올 수 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* 급여 명세서 */}
          {selectedView === 'list' && (
            <div className="ok-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">급여 명세서</h3>
                <div className="flex gap-2">
                  <button className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    엑셀 다운로드
                  </button>
                  <span className="text-sm text-gray-500 px-3 py-2">
                    총 {filteredData.length}건
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">급여 데이터를 불러오는 중...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">표시할 급여 데이터가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">직원명</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">부서</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">직급</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">기본급</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">초과근무수당</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">제수당</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">상여금</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">공제액</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">실수령액</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={`${item.id}_${item.employeeName}_${index}`} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.employeeName}</td>
                          <td className="py-3 px-4 text-gray-600">{item.department}</td>
                          <td className="py-3 px-4 text-gray-600">{item.position}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.baseSalary)}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.overtimePay)}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.allowances)}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.bonuses)}</td>
                          <td className="py-3 px-4 text-right text-red-600">{formatCurrency(item.deductions)}</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">{formatCurrency(item.netSalary)}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openDetailModal(item)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="상세보기"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors" title="명세서">
                                <FileText className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 급여 분석 */}
          {selectedView === 'analysis' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">급여 분석 데이터를 불러오는 중...</p>
                </div>
              ) : statistics ? (
                <>
                  {/* 급여 구성 분석 */}
                  <div className="ok-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">급여 구성 분석</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">기본급</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrencyShort(statistics.totalBaseSalary)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {((statistics.totalBaseSalary / statistics.totalNetSalary) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">초과근무수당</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrencyShort(statistics.totalOvertimePay)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {((statistics.totalOvertimePay / statistics.totalNetSalary) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">제수당</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {formatCurrencyShort(statistics.totalAllowances)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {((statistics.totalAllowances / statistics.totalNetSalary) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">상여금</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrencyShort(statistics.totalBonuses)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {((statistics.totalBonuses / statistics.totalNetSalary) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 직급별 급여 현황 */}
                  <div className="ok-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">직급별 급여 현황</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">직급</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">직원 수</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">총 급여</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">평균 급여</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">비율</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statistics.positionBreakdown.map((pos) => (
                            <tr key={pos.position} className="border-b border-gray-100 hover:bg-gray-50/50">
                              <td className="py-3 px-4 font-medium text-gray-900">{pos.position}</td>
                              <td className="py-3 px-4 text-right text-gray-600">{pos.employeeCount}명</td>
                              <td className="py-3 px-4 text-right text-blue-600 font-medium">
                                {formatCurrency(pos.totalSalary)}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600 font-medium">
                                {formatCurrency(pos.averageSalary)}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {((pos.totalSalary / statistics.totalNetSalary) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">급여 분석 데이터를 불러올 수 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 급여 상세보기 모달 */}
      {showDetailModal && selectedSalary && (
        <SalaryDetail
          salary={selectedSalary}
          isOpen={showDetailModal}
          onClose={closeDetailModal}
        />
      )}

      {/* 디버깅 정보 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded text-xs z-[9998] max-w-sm">
          <div className="font-bold mb-2">디버깅 정보</div>
          <div>Modal: {showDetailModal ? 'Open' : 'Closed'}</div>
          <div>Salary: {selectedSalary ? selectedSalary.employeeName : 'None'}</div>
          <div>Data Count: {salaryData.length}</div>
          <div>Filtered Count: {filteredData.length}</div>
          <div>Statistics: {statistics ? 'Loaded' : 'Not loaded'}</div>
          {statistics && (
            <>
              <div>Total Net: {formatCurrencyShort(statistics.totalNetSalary)}</div>
              <div>Avg Salary: {formatCurrencyShort(statistics.averageSalary)}</div>
              <div>Total Base: {formatCurrencyShort(statistics.totalBaseSalary)}</div>
              <div>Total Overtime: {formatCurrencyShort(statistics.totalOvertimePay)}</div>
            </>
          )}
          <div className="mt-2 text-yellow-300">
            <button
              onClick={() => {
                console.log('=== 디버깅 정보 출력 ===')
                console.log('Current salaryData:', salaryData)
                console.log('Current filteredData:', filteredData)
                console.log('Current statistics:', statistics)
                console.log('LocalStorage keys:', Object.keys(localStorage))
                console.log('integrated_paypulse_data:', localStorage.getItem('integrated_paypulse_data'))
                console.log('=== 디버깅 정보 완료 ===')
              }}
              className="bg-yellow-600 px-2 py-1 rounded text-xs"
            >
              콘솔 로그
            </button>
          </div>
          <div className="mt-2 text-blue-300">
            <button
              onClick={() => {
                if (salaryData.length > 0) {
                  console.log('첫 번째 데이터 항목 상세:', salaryData[0])
                  console.log('데이터 타입 정보:', {
                    baseSalary: typeof salaryData[0].baseSalary,
                    netSalary: typeof salaryData[0].netSalary,
                    allowances: typeof salaryData[0].allowances
                  })
                  console.log('데이터 변환 확인:', {
                    hasTotalPayroll: 'totalPayroll' in salaryData[0],
                    hasNetSalary: 'netSalary' in salaryData[0],
                    netSalaryValue: salaryData[0].netSalary,
                    baseSalaryValue: salaryData[0].baseSalary
                  })
                }
              }}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              데이터 상세
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
