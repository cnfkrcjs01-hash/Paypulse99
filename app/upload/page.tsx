"use client"

import OKSidebar from '@/components/OKSidebar'
import OKTopBar from '@/components/OKTopBar'
import IntegratedDataPreview from '@/components/upload/IntegratedDataPreview'
import IntegratedFileUpload from '@/components/upload/IntegratedFileUpload'
import { FeeData, PayrollData } from '@/types/payroll'
import { BarChart3, CheckCircle, Database, FileSpreadsheet, Home, Menu, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface IntegratedData {
  payrollData: PayrollData[]
  feeData: FeeData[]
}

export default function IntegratedUploadPage() {
  const [uploadedData, setUploadedData] = useState<IntegratedData>({
    payrollData: [],
    feeData: []
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleDataUploaded = (data: IntegratedData) => {
    console.log('=== 통합데이터업로드 페이지에서 데이터 수신 ===')
    console.log('전체 데이터:', data)
    console.log('급여 데이터:', data.payrollData)
    console.log('수수료 데이터:', data.feeData)
    console.log('급여 데이터 개수:', data.payrollData.length)
    console.log('수수료 데이터 개수:', data.feeData.length)

    // 데이터 유효성 검사
    const validPayrollData = data.payrollData.filter(item =>
      item &&
      item.employeeName &&
      item.totalPayroll > 0 &&
      typeof item.totalPayroll === 'number'
    )

    const validFeeData = data.feeData.filter(item =>
      item &&
      item.companyName &&
      item.totalFee > 0 &&
      typeof item.totalFee === 'number'
    )

    console.log('유효한 급여 데이터:', validPayrollData.length)
    console.log('유효한 수수료 데이터:', validFeeData.length)

    setUploadedData({
      payrollData: validPayrollData,
      feeData: validFeeData
    })
  }

  // 데이터 요약 계산
  const totalPayrollCost = uploadedData.payrollData.reduce((sum, item) => {
    if (item && item.totalPayroll && typeof item.totalPayroll === 'number' && !isNaN(item.totalPayroll)) {
      return sum + item.totalPayroll
    }
    return sum
  }, 0)

  const totalFeeCost = uploadedData.feeData.reduce((sum, item) => {
    if (item && item.totalFee && typeof item.totalFee === 'number' && !isNaN(item.totalFee)) {
      return sum + item.totalFee
    }
    return sum
  }, 0)

  // 수수료 데이터 추가 통계
  const developmentFeeCost = uploadedData.feeData.reduce((sum, item) => {
    if (item && item.isDevelopment && item.totalFee && typeof item.totalFee === 'number' && !isNaN(item.totalFee)) {
      return sum + item.totalFee
    }
    return sum
  }, 0)

  const infrastructureFeeCost = uploadedData.feeData.reduce((sum, item) => {
    if (item && item.isInfrastructure && item.totalFee && typeof item.totalFee === 'number' && !isNaN(item.totalFee)) {
      return sum + item.totalFee
    }
    return sum
  }, 0)

  const totalPersonnel = uploadedData.feeData.reduce((sum, item) => {
    if (item && item.personnel && typeof item.personnel === 'number' && !isNaN(item.personnel)) {
      return sum + item.personnel
    }
    return sum
  }, 0)

  const totalLaborCost = totalPayrollCost + totalFeeCost

  console.log('업로드 페이지 데이터 요약:', {
    payrollCount: uploadedData.payrollData.length,
    feeCount: uploadedData.feeData.length,
    totalPayrollCost,
    totalFeeCost,
    totalLaborCost,
    developmentFeeCost,
    infrastructureFeeCost,
    totalPersonnel
  })

  const formatShortCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `₩${(amount / 100000000).toFixed(1)}억`
    } else if (amount >= 10000) {
      return `₩${(amount / 10000).toFixed(0)}만`
    } else {
      return `₩${amount.toLocaleString()}`
    }
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
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-4 h-4" />
                메뉴 보기
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">통합 데이터 업로드</h1>
          </div>
        </div>

        <main className="ok-section-unified">
          {/* 헤더 섹션 - OK저축은행 스타일 */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-4">
              <Database className="w-4 h-4" />
              통합 데이터 관리
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">통합데이터업로드</h1>
            <p className="text-xl text-gray-600">급여대장과 수수료 파일을 업로드하여 통합 인건비 데이터를 관리하세요</p>
          </div>

          {/* 업로드 가이드 - OK저축은행 스타일 */}
          <div className="ok-card bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">📋 지원 파일 형식</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>급여대장: Excel (.xlsx, .xls), CSV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>수수료: Excel (.xlsx, .xls), CSV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <IntegratedFileUpload onDataUploaded={handleDataUploaded} />

            {uploadedData.payrollData.length > 0 || uploadedData.feeData.length > 0 ? (
              <IntegratedDataPreview
                payrollData={uploadedData.payrollData}
                feeData={uploadedData.feeData}
              />
            ) : null}
          </div>

          {/* 업로드 완료 후 안내 - OK저축은행 스타일 */}
          {uploadedData.payrollData.length > 0 || uploadedData.feeData.length > 0 ? (
            <div className="ok-card bg-green-50 border-green-200 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">데이터 업로드 완료! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  총 {uploadedData.payrollData.length + uploadedData.feeData.length}건의 데이터가 성공적으로 업로드되었습니다.
                  {totalPersonnel > 0 && (
                    <span className="block text-sm mt-1">
                      총 {totalPersonnel}명의 인력이 포함되어 있습니다.
                    </span>
                  )}
                </p>

                {/* 데이터 요약 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-600 font-medium text-sm">총 급여비용</div>
                    <div className="text-xl font-bold text-blue-900">{formatShortCurrency(totalPayrollCost)}</div>
                    <div className="text-blue-600 text-sm">{uploadedData.payrollData.length}명의 직원</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-green-600 font-medium text-sm">총 수수료비용</div>
                    <div className="text-xl font-bold text-green-900">{formatShortCurrency(totalFeeCost)}</div>
                    <div className="text-green-600 text-sm">
                      {uploadedData.feeData.length}개 업체
                      {uploadedData.feeData.length > 0 && (
                        <div className="text-xs mt-1">
                          개발: {uploadedData.feeData.filter(f => f.isDevelopment).length}개
                          인프라: {uploadedData.feeData.filter(f => f.isInfrastructure).length}개
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-orange-600 font-medium text-sm">인건비</div>
                    <div className="text-xl font-bold text-orange-900">{formatShortCurrency(totalLaborCost)}</div>
                    <div className="text-orange-600 text-sm">전체 비용 합계</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard" className="ok-btn-primary flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    대시보드 보기
                  </Link>
                  <Link href="/ai-chat" className="ok-btn-outline flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    AI 분석 시작
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {/* 추가 기능 안내 - OK저축은행 스타일 */}
          <div className="ok-card bg-gray-50/80 backdrop-blur-sm border-gray-200 mt-8">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 더 많은 기능을 활용해보세요</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <Link href="/dashboard" className="text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">실시간 분석</h4>
                  <p className="text-gray-600">업로드된 데이터를 실시간으로 분석하고 인사이트를 제공합니다</p>
                </Link>
                <Link href="/ai-chat" className="text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI 추천</h4>
                  <p className="text-gray-600">AI가 분석한 인건비 최적화 방안을 제시합니다</p>
                </Link>
                <Link href="/calculator" className="text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">자동 검증</h4>
                  <p className="text-gray-600">데이터 오류를 자동으로 검출하고 수정 가이드를 제공합니다</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


