'use client'

import { storage } from '@/lib/utils'
import {
    BarChart3,
    Building,
    Calendar,
    DollarSign,
    PieChart as PieChartIcon,
    TrendingUp,
    UserCheck,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

interface AnalyticsData {
  totalEmployees: number
  totalCost: number
  averageSalary: number
  departmentBreakdown: Array<{
    name: string
    employees: number
    totalCost: number
    averageSalary: number
  }>
  monthlyTrends: Array<{
    month: string
    totalCost: number
    employeeCount: number
    averageSalary: number
  }>
  salaryDistribution: Array<{
    range: string
    count: number
    percentage: number
  }>
  costBreakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('12months')

  useEffect(() => {
    generateAnalyticsData()
  }, [selectedPeriod])

  const generateAnalyticsData = () => {
    setLoading(true)
    
    // 저장된 데이터가 있으면 사용, 없으면 샘플 데이터 생성
    const savedData = storage.get('integratedPayrollData')
    
    setTimeout(() => {
      if (savedData && savedData.length > 0) {
        const data = processRealData(savedData)
        setAnalyticsData(data)
      } else {
        const sampleData = generateSampleAnalyticsData()
        setAnalyticsData(sampleData)
      }
      setLoading(false)
    }, 500)
  }

  const processRealData = (data: any[]): AnalyticsData => {
    const totalEmployees = data.length
    const totalCost = data.reduce((sum, emp) => sum + (emp.totalCost || 0), 0)
    const averageSalary = totalEmployees > 0 ? totalCost / totalEmployees : 0

    // 부서별 분석
    const deptMap = new Map()
    data.forEach(emp => {
      const dept = emp.department || '기타'
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { employees: 0, totalCost: 0 })
      }
      deptMap.get(dept).employees++
      deptMap.get(dept).totalCost += emp.totalCost || 0
    })

    const departmentBreakdown = Array.from(deptMap.entries()).map(([name, data]: [string, any]) => ({
      name,
      employees: data.employees,
      totalCost: data.totalCost,
      averageSalary: data.totalCost / data.employees
    }))

    // 월별 트렌드 (최근 12개월)
    const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString('ko-KR', { month: 'short' })
      const variation = 0.95 + Math.random() * 0.1
      return {
        month,
        totalCost: totalCost * variation,
        employeeCount: totalEmployees,
        averageSalary: averageSalary * variation
      }
    }).reverse()

    // 급여 분포
    const salaryRanges = [
      { min: 0, max: 3000000, label: '300만원 미만' },
      { min: 3000000, max: 5000000, label: '300-500만원' },
      { min: 5000000, max: 8000000, label: '500-800만원' },
      { min: 8000000, max: 12000000, label: '800-1200만원' },
      { min: 12000000, max: Infinity, label: '1200만원 이상' }
    ]

    const salaryDistribution = salaryRanges.map(range => {
      const count = data.filter(emp => {
        const salary = emp.baseSalary || emp.totalCost || 0
        return salary >= range.min && salary < range.max
      }).length
      return {
        range: range.label,
        count,
        percentage: (count / totalEmployees) * 100
      }
    })

    // 비용 분류
    const costBreakdown = [
      { category: '기본급', amount: totalCost * 0.6, percentage: 60 },
      { category: '수당', amount: totalCost * 0.2, percentage: 20 },
      { category: '4대보험', amount: totalCost * 0.15, percentage: 15 },
      { category: '기타', amount: totalCost * 0.05, percentage: 5 }
    ]

    return {
      totalEmployees,
      totalCost,
      averageSalary,
      departmentBreakdown,
      monthlyTrends,
      salaryDistribution,
      costBreakdown
    }
  }

  const generateSampleAnalyticsData = (): AnalyticsData => {
    const totalEmployees = 150
    const totalCost = 850000000
    const averageSalary = 5666667

    const departmentBreakdown = [
      { name: '개발팀', employees: 45, totalCost: 270000000, averageSalary: 6000000 },
      { name: '마케팅팀', employees: 25, totalCost: 125000000, averageSalary: 5000000 },
      { name: '영업팀', employees: 35, totalCost: 175000000, averageSalary: 5000000 },
      { name: '인사팀', employees: 15, totalCost: 75000000, averageSalary: 5000000 },
      { name: '기획팀', employees: 20, totalCost: 120000000, averageSalary: 6000000 },
      { name: '기타', employees: 10, totalCost: 85000000, averageSalary: 8500000 }
    ]

    const monthlyTrends = [
      { month: '1월', totalCost: 820000000, employeeCount: 145, averageSalary: 5655172 },
      { month: '2월', totalCost: 830000000, employeeCount: 147, averageSalary: 5646259 },
      { month: '3월', totalCost: 835000000, employeeCount: 148, averageSalary: 5641892 },
      { month: '4월', totalCost: 840000000, employeeCount: 149, averageSalary: 5637584 },
      { month: '5월', totalCost: 845000000, employeeCount: 149, averageSalary: 5671141 },
      { month: '6월', totalCost: 850000000, employeeCount: 150, averageSalary: 5666667 },
      { month: '7월', totalCost: 855000000, employeeCount: 150, averageSalary: 5700000 },
      { month: '8월', totalCost: 860000000, employeeCount: 151, averageSalary: 5695364 },
      { month: '9월', totalCost: 865000000, employeeCount: 151, averageSalary: 5728477 },
      { month: '10월', totalCost: 870000000, employeeCount: 152, averageSalary: 5723684 },
      { month: '11월', totalCost: 875000000, employeeCount: 152, averageSalary: 5756579 },
      { month: '12월', totalCost: 880000000, employeeCount: 153, averageSalary: 5751634 }
    ]

    const salaryDistribution = [
      { range: '300만원 미만', count: 15, percentage: 10 },
      { range: '300-500만원', count: 45, percentage: 30 },
      { range: '500-800만원', count: 60, percentage: 40 },
      { range: '800-1200만원', count: 25, percentage: 16.7 },
      { range: '1200만원 이상', count: 5, percentage: 3.3 }
    ]

    const costBreakdown = [
      { category: '기본급', amount: 510000000, percentage: 60 },
      { category: '수당', amount: 170000000, percentage: 20 },
      { category: '4대보험', amount: 127500000, percentage: 15 },
      { category: '기타', amount: 42500000, percentage: 5 }
    ]

    return {
      totalEmployees,
      totalCost,
      averageSalary,
      departmentBreakdown,
      monthlyTrends,
      salaryDistribution,
      costBreakdown
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">인건비 분석 대시보드</h1>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="6months">최근 6개월</option>
                <option value="12months">최근 12개월</option>
                <option value="24months">최근 24개월</option>
              </select>
              <button
                onClick={generateAnalyticsData}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                새로고침
              </button>
            </div>
          </div>
          <p className="text-gray-600">종합적인 인건비 분석 및 인사이트를 제공합니다.</p>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 직원 수</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalEmployees.toLocaleString()}명</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 인건비</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalCost)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 급여</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageSalary)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">부서 수</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.departmentBreakdown.length}개</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 월별 트렌드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              월별 인건비 트렌드
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '금액']}
                  labelFormatter={(label) => `${label}월`}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalCost" 
                  stroke="#f97316" 
                  fill="#fed7aa" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 부서별 분석 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              부서별 직원 수
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.departmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, '직원 수']} />
                <Bar dataKey="employees" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 급여 분포 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-green-500" />
              급여 분포
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.salaryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.salaryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, '직원 수']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 비용 분류 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              비용 분류
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.costBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <YAxis dataKey="category" type="category" width={80} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), '금액']} />
                <Bar dataKey="amount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 부서별 상세 분석 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-500" />
              부서별 상세 분석
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원 수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 비용</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 급여</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비중</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.departmentBreakdown.map((dept, index) => (
                  <tr key={dept.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.employees}명</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(dept.totalCost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(dept.averageSalary)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((dept.totalCost / analyticsData.totalCost) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
