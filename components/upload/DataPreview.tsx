'use client'

import { useState } from 'react'
import { Users, Building, Briefcase, Eye, EyeOff } from 'lucide-react'
import { Employee, Contractor, Agency } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface DataPreviewProps {
  employees: Employee[]
  contractors: Contractor[]
  agencies: Agency[]
}

export default function DataPreview({ employees, contractors, agencies }: DataPreviewProps) {
  const [activeTab, setActiveTab] = useState<'employees' | 'contractors' | 'agencies'>('employees')
  const [showDetails, setShowDetails] = useState(false)

  const totalEmployeeCost = employees.reduce((sum, emp) => sum + emp.totalCost, 0)
  const totalContractorCost = contractors.reduce((sum, cont) => sum + cont.contractAmount, 0)
  const totalAgencyCost = agencies.reduce((sum, agency) => sum + agency.monthlyCost, 0)
  const grandTotal = totalEmployeeCost + totalContractorCost + totalAgencyCost

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">데이터 미리보기</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showDetails ? '간단히 보기' : '자세히 보기'}
        </button>
      </div>

      {/* 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={<Users className="w-6 h-6" />}
          title="직원"
          count={employees.length}
          amount={totalEmployeeCost}
          color="blue"
        />
        <SummaryCard
          icon={<Building className="w-6 h-6" />}
          title="도급사"
          count={contractors.length}
          amount={totalContractorCost}
          color="green"
        />
        <SummaryCard
          icon={<Briefcase className="w-6 h-6" />}
          title="대행사"
          count={agencies.length}
          amount={totalAgencyCost}
          color="purple"
        />
        <SummaryCard
          icon={<span className="text-2xl">💰</span>}
          title="총계"
          count={employees.length + contractors.length + agencies.length}
          amount={grandTotal}
          color="orange"
          isTotal
        />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-4">
        <TabButton
          active={activeTab === 'employees'}
          onClick={() => setActiveTab('employees')}
          icon={<Users className="w-4 h-4" />}
          text={`직원급여 (${employees.length})`}
        />
        <TabButton
          active={activeTab === 'contractors'}
          onClick={() => setActiveTab('contractors')}
          icon={<Building className="w-4 h-4" />}
          text={`도급사 (${contractors.length})`}
        />
        <TabButton
          active={activeTab === 'agencies'}
          onClick={() => setActiveTab('agencies')}
          icon={<Briefcase className="w-4 h-4" />}
          text={`대행사 (${agencies.length})`}
        />
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto">
        {activeTab === 'employees' && (
          <EmployeeTable employees={employees} showDetails={showDetails} />
        )}
        {activeTab === 'contractors' && (
          <ContractorTable contractors={contractors} showDetails={showDetails} />
        )}
        {activeTab === 'agencies' && (
          <AgencyTable agencies={agencies} showDetails={showDetails} />
        )}
      </div>
    </div>
  )
}

// 요약 카드 컴포넌트
interface SummaryCardProps {
  icon: React.ReactNode
  title: string
  count: number
  amount: number
  color: 'blue' | 'green' | 'purple' | 'orange'
  isTotal?: boolean
}

function SummaryCard({ icon, title, count, amount, color, isTotal }: SummaryCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className={`p-4 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white ${isTotal ? 'ring-2 ring-yellow-300' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        {isTotal && <span className="text-xs bg-yellow-300 text-orange-800 px-2 py-1 rounded">TOTAL</span>}
      </div>
      <div className="text-right">
        <p className="text-sm opacity-90">{formatNumber(count)}건</p>
        <p className="text-xl font-bold">{formatCurrency(amount)}</p>
      </div>
    </div>
  )
}

// 탭 버튼 컴포넌트
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  text: string
}

function TabButton({ active, onClick, icon, text }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
        active
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      {icon}
      {text}
    </button>
  )
}

// 직원 테이블
function EmployeeTable({ employees, showDetails }: { employees: Employee[], showDetails: boolean }) {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">부서</th>
          {showDetails && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">직급</th>}
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">기본급</th>
          {showDetails && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">수당</th>}
          {showDetails && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">연장근무</th>}
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">총비용</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {employees.map((emp) => (
          <tr key={emp.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
            {showDetails && <td className="px-4 py-3 text-sm text-gray-600">{emp.position}</td>}
            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(emp.baseSalary)}</td>
            {showDetails && <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(emp.allowances)}</td>}
            {showDetails && <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(emp.overtimePay)}</td>}
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(emp.totalCost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// 도급사 테이블
function ContractorTable({ contractors, showDetails }: { contractors: Contractor[], showDetails: boolean }) {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">업체명</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">구분</th>
          {showDetails && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">계약기간</th>}
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">계약금액</th>
          {showDetails && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">업무내용</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {contractors.map((cont) => (
          <tr key={cont.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{cont.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">
              <span className={`px-2 py-1 text-xs rounded-full ${
                cont.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {cont.type === 'company' ? '법인' : '개인사업자'}
              </span>
            </td>
            {showDetails && <td className="px-4 py-3 text-sm text-gray-600">{cont.period}</td>}
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(cont.contractAmount)}</td>
            {showDetails && <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{cont.description}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// 대행사 테이블
function AgencyTable({ agencies, showDetails }: { agencies: Agency[], showDetails: boolean }) {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">업체명</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">서비스</th>
          {showDetails && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">수수료율</th>}
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">월비용</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {agencies.map((agency) => (
          <tr key={agency.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{agency.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{agency.serviceType}</td>
            {showDetails && <td className="px-4 py-3 text-sm text-right text-gray-600">{(agency.feeRate * 100).toFixed(1)}%</td>}
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(agency.monthlyCost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


