'use client'

import { useState } from 'react'
import { X, Download, Printer, Eye, FileText } from 'lucide-react'
import { SalaryData } from '@/types/payroll'

interface SalaryDetailProps {
  salary: SalaryData | null
  isOpen: boolean
  onClose: () => void
}

export default function SalaryDetail({ salary, isOpen, onClose }: SalaryDetailProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'payslip'>('detail')

  // 모달이 열려있지 않거나 급여 데이터가 없으면 렌더링하지 않음
  if (!isOpen || !salary) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  const getEmployeeTypeText = (type: string) => {
    switch (type) {
      case 'regular': return '정규직'
      case 'contract': return '계약직'
      case 'part-time': return '파트타임'
      default: return type
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">급여 상세보기</h2>
            <p className="text-gray-600">{salary.employeeName} - {salary.department} {salary.position}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('detail')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'detail'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            상세 정보
          </button>
          <button
            onClick={() => setActiveTab('payslip')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'payslip'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            급여 명세서
          </button>
        </div>

        {/* 상세 정보 탭 */}
        {activeTab === 'detail' && (
          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">직원 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">직원 ID</span>
                    <span className="font-medium">{salary.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">직원명</span>
                    <span className="font-medium">{salary.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">부서</span>
                    <span className="font-medium">{salary.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">직급</span>
                    <span className="font-medium">{salary.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">고용 형태</span>
                    <span className="font-medium">{getEmployeeTypeText(salary.employeeType)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">급여 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">급여 월</span>
                    <span className="font-medium">{salary.year}년 {salary.month}월</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">업로드 일자</span>
                    <span className="font-medium">{formatDate(salary.uploadDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">파일명</span>
                    <span className="font-medium text-sm">{salary.fileName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 급여 상세 내역 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">급여 상세 내역</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">기본급</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(salary.baseSalary)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">초과근무수당</span>
                  <span className="font-semibold text-blue-600">+{formatCurrency(salary.overtimePay)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">제수당</span>
                  <span className="font-semibold text-blue-600">+{formatCurrency(salary.allowances)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">상여금</span>
                  <span className="font-semibold text-blue-600">+{formatCurrency(salary.bonuses)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">공제액</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(salary.deductions)}원</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-900">실수령액</span>
                  <span className="font-bold text-green-600">{formatCurrency(salary.netSalary)}원</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 급여 명세서 탭 */}
        {activeTab === 'payslip' && (
          <div className="p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* 명세서 헤더 */}
              <div className="text-center border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">급여 명세서</h3>
                <p className="text-gray-600">{salary.year}년 {salary.month}월</p>
              </div>

              {/* 직원 정보 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">직원명</p>
                  <p className="font-semibold">{salary.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">직원 ID</p>
                  <p className="font-semibold">{salary.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">부서</p>
                  <p className="font-semibold">{salary.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">직급</p>
                  <p className="font-semibold">{salary.position}</p>
                </div>
              </div>

              {/* 급여 내역 */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">급여 내역</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>기본급</span>
                    <span className="font-medium">{formatCurrency(salary.baseSalary)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>초과근무수당</span>
                    <span className="font-medium text-blue-600">{formatCurrency(salary.overtimePay)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>제수당</span>
                    <span className="font-medium text-blue-600">{formatCurrency(salary.allowances)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>상여금</span>
                    <span className="font-medium text-blue-600">{formatCurrency(salary.bonuses)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>공제액</span>
                    <span className="font-medium text-red-600">-{formatCurrency(salary.deductions)}원</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>실수령액</span>
                    <span className="text-green-600">{formatCurrency(salary.netSalary)}원</span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                <button className="ok-btn-primary px-6 py-2 inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  PDF 다운로드
                </button>
                <button className="ok-btn-outline px-6 py-2 inline-flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  인쇄
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
