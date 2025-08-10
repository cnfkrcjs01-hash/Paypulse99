'use client'

import OKSidebar from '@/components/OKSidebar'
import OKTopBar from '@/components/OKTopBar'
import { calculateROI, formatCurrency, formatNumber } from '@/lib/utils'
import { FeeData, PayrollData } from '@/types/payroll'
import { ArrowDown, ArrowUp, DollarSign, Download, Home, Menu, RefreshCw, Star, Target, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface DashboardData {
  payrollData: PayrollData[]
  feeData: FeeData[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ payrollData: [], feeData: [] })
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 통합데이터 불러오기
    const savedData = localStorage.getItem('integrated_paypulse_data')
    if (savedData) {
      setData(JSON.parse(savedData))
    } else {
      // 샘플 데이터 생성
      const sampleData = generateSampleData()
      setData(sampleData)
    }
    setIsLoading(false)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    const sampleData = generateSampleData()
    setData(sampleData)
    setTimeout(() => setIsLoading(false), 1000)
  }

  // 샘플 데이터 생성 함수
  const generateSampleData = (): DashboardData => {
    return {
      payrollData: [
        {
          id: 'emp_1',
          employeeId: 'EMP001',
          employeeName: '김철수',
          department: '개발팀',
          position: '시니어 개발자',
          employeeType: 'regular',
          baseSalary: 4500000,
          allowances: 300000,
          overtimePay: 200000,
          annualLeavePay: 150000,
          insurancePremiums: 400000,
          bonuses: 500000,
          totalPayroll: 6050000,
          month: '12',
          year: 2024,
          uploadDate: new Date().toISOString(),
          fileName: 'sample_payroll.xlsx'
        },
        {
          id: 'emp_2',
          employeeId: 'EMP002',
          employeeName: '이영희',
          department: '마케팅팀',
          position: '마케팅 매니저',
          employeeType: 'regular',
          baseSalary: 3800000,
          allowances: 250000,
          overtimePay: 150000,
          annualLeavePay: 120000,
          insurancePremiums: 350000,
          bonuses: 400000,
          totalPayroll: 4870000,
          month: '12',
          year: 2024,
          uploadDate: new Date().toISOString(),
          fileName: 'sample_payroll.xlsx'
        }
      ],
      feeData: [
        {
          id: 'fee_1',
          companyName: 'ABC 컨설팅',
          businessType: 'contractor',
          serviceDescription: 'IT 컨설팅 서비스',
          contractAmount: 10000000,
          feeRate: 0.15,
          monthlyFee: 1500000,
          contractPeriod: '6개월',
          startDate: '2024-07-01',
          endDate: '2024-12-31',
          totalFee: 1500000,
          month: '12',
          year: 2024,
          uploadDate: new Date().toISOString(),
          fileName: 'sample_fee.xlsx'
        }
      ]
    }
  }

  // 데이터 계산
  const totalEmployees = data.payrollData.length
  const totalEmployeeCost = data.payrollData.reduce((sum, emp) => sum + emp.totalPayroll, 0)
  const totalFeeCost = data.feeData.reduce((sum, fee) => sum + fee.totalFee, 0)
  const grandTotal = totalEmployeeCost + totalFeeCost

  // 가상의 매출 데이터 (실제로는 API에서 가져와야 함)
  const monthlyRevenue = 500000000 // 5억
  const hcROI = calculateROI(monthlyRevenue, grandTotal)
  const costPerEmployee = totalEmployees > 0 ? grandTotal / totalEmployees : 0

  // 차트 데이터
  const categoryData = [
    { name: '직원급여', value: totalEmployeeCost, color: '#f97316' },
    { name: '수수료', value: totalFeeCost, color: '#10b981' },
  ]

  const departmentData = data.payrollData.reduce((acc, emp) => {
    const existing = acc.find(item => item.name === emp.department)
    if (existing) {
      existing.value += emp.totalPayroll
      existing.count += 1
    } else {
      acc.push({ name: emp.department, value: emp.totalPayroll, count: 1 })
    }
    return acc
  }, [] as { name: string; value: number; count: number }[])

  const trendData = [
    { month: '1월', cost: grandTotal * 0.85, revenue: monthlyRevenue * 0.9 },
    { month: '2월', cost: grandTotal * 0.92, revenue: monthlyRevenue * 0.95 },
    { month: '3월', cost: grandTotal, revenue: monthlyRevenue },
  ]

  if (isLoading) {
    return (
      <div className="page-background">
        <OKSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="lg:pl-72">
          <OKTopBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-background">
      <OKSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-72">
        <OKTopBar onMenuClick={() => setSidebarOpen(true)} />

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
                href="/upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-4 h-4" />
                데이터 업로드
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          </div>
        </div>

        <main className="ok-section-unified">
          {/* 헤더 섹션 - OK저축은행 스타일 */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              실시간 인건비 현황
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">인건비 대시보드</h1>
            <p className="text-xl text-gray-600">전체 인건비 현황을 한눈에 파악하세요</p>
          </div>

          {/* 기간 선택 */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">기간:</span>
              <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-white/30">
                {(['month', 'quarter', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`ok-tab ${selectedPeriod === period
                        ? 'ok-tab-active'
                        : 'ok-tab-inactive'
                      }`}
                  >
                    {period === 'month' ? '월간' : period === 'quarter' ? '분기' : '연간'}
                  </button>
                ))}
              </div>
              <button
                onClick={refreshData}
                className="ok-btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                새로고침
              </button>
            </div>
          </div>

          {/* KPI 카드들 - OK저축은행 스타일 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <KPICard
              icon={<Users className="w-6 h-6" />}
              title="총 직원 수"
              value={formatNumber(totalEmployees)}
              change={5.2}
              color="orange"
            />
            <KPICard
              icon={<DollarSign className="w-6 h-6" />}
              title="인건비"
              value={formatCurrency(grandTotal)}
              change={-2.1}
              color="green"
            />
            <KPICard
              icon={<Target className="w-6 h-6" />}
              title="인당 평균비용"
              value={formatCurrency(costPerEmployee)}
              change={1.8}
              color="purple"
            />
            <KPICard
              icon={<TrendingUp className="w-6 h-6" />}
              title="HC ROI"
              value={`${hcROI.toFixed(1)}%`}
              change={3.5}
              color="blue"
            />
          </div>

          {/* 차트 섹션 - OK저축은행 스타일 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* 비용 분포 파이 차트 */}
            <div className="ok-chart-container">
              <h3 className="text-xl font-bold text-gray-900 mb-6">비용 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 부서별 비용 막대 차트 */}
            <div className="ok-chart-container">
              <h3 className="text-xl font-bold text-gray-900 mb-6">부서별 비용</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 트렌드 차트 - OK저축은행 스타일 */}
          <div className="ok-chart-container mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">월별 트렌드</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 상세 테이블들 - OK저축은행 스타일 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DetailTable
              title="부서별 현황"
              data={departmentData.map(dept => ({
                name: dept.name,
                value: dept.value,
                extra: `${dept.count}명`
              }))}
            />
            <DetailTable
              title="직원 유형별 비용"
              data={[
                { name: '정규직', value: totalEmployeeCost, extra: `${totalEmployees}명` },
                { name: '도급', value: totalFeeCost, extra: `${data.feeData.length}건` },
              ]}
            />
          </div>

          {/* 다운로드 섹션 - OK저축은행 스타일 */}
          <div className="ok-card bg-orange-50 border-orange-200 mt-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">📊 보고서 다운로드</h3>
                <p className="text-gray-600">현재 데이터를 엑셀로 다운로드하여 분석에 활용하세요</p>
              </div>
              <button className="ok-btn-primary flex items-center gap-2">
                <Download className="w-5 h-5" />
                엑셀 다운로드
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// KPI 카드 컴포넌트 - OK저축은행 스타일
interface KPICardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: number
  color: 'orange' | 'green' | 'purple' | 'blue'
}

function KPICard({ icon, title, value, change, color }: KPICardProps) {
  const colorClasses = {
    orange: 'text-orange-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600'
  }

  return (
    <div className="ok-kpi-card">
      <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      <div className={`flex items-center justify-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
        {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  )
}

// 상세 테이블 컴포넌트 - OK저축은행 스타일
interface DetailTableProps {
  title: string
  data: { name: string; value: number; extra: string }[]
}

function DetailTable({ title, data }: DetailTableProps) {
  return (
    <div className="ok-card ok-card-hover">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50/80 backdrop-blur-sm rounded-lg">
            <div>
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-sm text-gray-500 ml-2">({item.extra})</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}



