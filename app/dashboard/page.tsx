'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, DollarSign, Target, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { Employee, Contractor, Agency } from '@/lib/types'
import { formatCurrency, formatNumber, calculateROI } from '@/lib/utils'

interface DashboardData {
  employees: Employee[]
  contractors: Contractor[]
  agencies: Agency[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ employees: [], contractors: [], agencies: [] })
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const savedData = localStorage.getItem('paypulse_data')
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  // 데이터 계산
  const totalEmployees = data.employees.length
  const totalEmployeeCost = data.employees.reduce((sum, emp) => sum + emp.totalCost, 0)
  const totalContractorCost = data.contractors.reduce((sum, cont) => sum + cont.contractAmount, 0)
  const totalAgencyCost = data.agencies.reduce((sum, agency) => sum + agency.monthlyCost, 0)
  const grandTotal = totalEmployeeCost + totalContractorCost + totalAgencyCost
  
  // 가상의 매출 데이터 (실제로는 API에서 가져와야 함)
  const monthlyRevenue = 500000000 // 5억
  const hcROI = calculateROI(monthlyRevenue, grandTotal)
  const costPerEmployee = totalEmployees > 0 ? grandTotal / totalEmployees : 0

  // 차트 데이터
  const categoryData = [
    { name: '직원급여', value: totalEmployeeCost, color: '#3b82f6' },
    { name: '도급비', value: totalContractorCost, color: '#10b981' },
    { name: '대행수수료', value: totalAgencyCost, color: '#8b5cf6' },
  ]

  const departmentData = data.employees.reduce((acc, emp) => {
    const existing = acc.find(item => item.name === emp.department)
    if (existing) {
      existing.value += emp.totalCost
      existing.count += 1
    } else {
      acc.push({ name: emp.department, value: emp.totalCost, count: 1 })
    }
    return acc
  }, [] as { name: string; value: number; count: number }[])

  const trendData = [
    { month: '1월', cost: grandTotal * 0.85, revenue: monthlyRevenue * 0.9 },
    { month: '2월', cost: grandTotal * 0.92, revenue: monthlyRevenue * 0.95 },
    { month: '3월', cost: grandTotal, revenue: monthlyRevenue },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>
          <p className="text-gray-600 mt-2">실시간 인건비 현황을 한눈에 확인하세요</p>
        </div>
        
        <div className="flex gap-2">
          {(['month', 'quarter', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === 'month' ? '월간' : period === 'quarter' ? '분기' : '연간'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={<DollarSign className="w-8 h-8" />}
          title="총 인건비"
          value={formatCurrency(grandTotal)}
          change={5.2}
          color="blue"
        />
        <KPICard
          icon={<Target className="w-8 h-8" />}
          title="HC ROI"
          value={`${(hcROI * 100).toFixed(1)}%`}
          change={hcROI > 0 ? 12.3 : -3.2}
          color="green"
        />
        <KPICard
          icon={<Users className="w-8 h-8" />}
          title="총 인원"
          value={`${formatNumber(totalEmployees)}명`}
          change={2.1}
          color="purple"
        />
        <KPICard
          icon={<TrendingUp className="w-8 h-8" />}
          title="인당 비용"
          value={formatCurrency(costPerEmployee)}
          change={-1.5}
          color="orange"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 인건비 구성 파이 차트 */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">인건비 구성</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 부서별 인건비 바 차트 */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">부서별 인건비</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), '인건비']} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 트렌드 차트 */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">월별 추이</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${Math.round(value / 100000000)}억`} />
            <Tooltip formatter={(value, name) => [
              formatCurrency(Number(value)), 
              name === 'cost' ? '인건비' : '매출'
            ]} />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} name="인건비" />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="매출" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 테이블 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DetailTable
          title="높은 비용 직원"
          data={data.employees
            .sort((a, b) => b.totalCost - a.totalCost)
            .slice(0, 5)
            .map(emp => ({ name: emp.name, value: emp.totalCost, extra: emp.department }))}
        />
        <DetailTable
          title="주요 도급사"
          data={data.contractors
            .sort((a, b) => b.contractAmount - a.contractAmount)
            .slice(0, 5)
            .map(cont => ({ name: cont.name, value: cont.contractAmount, extra: cont.type === 'company' ? '법인' : '개인' }))}
        />
        <DetailTable
          title="대행사 비용"
          data={data.agencies
            .sort((a, b) => b.monthlyCost - a.monthlyCost)
            .slice(0, 5)
            .map(agency => ({ name: agency.name, value: agency.monthlyCost, extra: agency.serviceType }))}
        />
      </div>
    </div>
  )
}

// KPI 카드 컴포넌트
interface KPICardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: number
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function KPICard({ icon, title, value, change, color }: KPICardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  const isPositive = change > 0

  return (
    <div className={`card bg-gradient-to-r ${colorClasses[color]} text-white border-none`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          {icon}
        </div>
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className={isPositive ? 'text-green-200' : 'text-red-200'}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

// 상세 테이블 컴포넌트
interface DetailTableProps {
  title: string
  data: { name: string; value: number; extra: string }[]
}

function DetailTable({ title, data }: DetailTableProps) {
  return (
    <div className="card">
      <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div>
              <p className="font-medium text-gray-800 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.extra}</p>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


