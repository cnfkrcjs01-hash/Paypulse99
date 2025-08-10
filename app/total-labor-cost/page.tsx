'use client'

import {
  DirectLaborCost,
  FeeData,
  IndirectLaborCost,
  PayrollData,
  TotalLaborCost
} from '@/types/payroll'
import {
  Calendar,
  DollarSign,
  Home, Menu,
  PieChart,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TotalLaborCostPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-12')
  const [selectedView, setSelectedView] = useState<'summary' | 'direct' | 'indirect'>('summary')
  const [laborCostData, setLaborCostData] = useState<TotalLaborCost | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState({
    dataSource: 'none',
    payrollDataCount: 0,
    feeDataCount: 0,
    totalRecords: 0
  })

  // 실제 업로드된 데이터에서 인건비 데이터 생성
  useEffect(() => {
    const loadLaborCostData = () => {
      console.log('인건비 데이터 로딩 시작...')

      try {
        // localStorage에서 업로드된 데이터 확인
        const savedData = localStorage.getItem('integrated_paypulse_data')
        console.log('localStorage에서 데이터 확인:', savedData ? '있음' : '없음')

        if (savedData) {
          const parsedData = JSON.parse(savedData)
          console.log('파싱된 데이터 구조:', Object.keys(parsedData))

          let payrollData: PayrollData[] = []
          let feeData: FeeData[] = []

          // 데이터 구조에 따라 분리
          if (parsedData.payrollData && Array.isArray(parsedData.payrollData)) {
            payrollData = parsedData.payrollData
            console.log('payrollData 로드됨:', payrollData.length, '레코드')
          }

          if (parsedData.feeData && Array.isArray(parsedData.feeData)) {
            feeData = parsedData.feeData
            console.log('feeData 로드됨:', feeData.length, '레코드')
          }

          // 직접인건비 데이터 생성 (PayrollData 기반)
          const directCosts: DirectLaborCost[] = payrollData.map((item, index) => ({
            id: item.id || `direct-${index}`,
            employeeId: item.employeeId || '',
            employeeName: item.employeeName || '이름 없음',
            department: item.department || '미분류',
            position: item.position || '미분류',
            baseSalary: Number(item.baseSalary) || 0,
            overtimePay: Number(item.overtimePay) || 0,
            allowances: Number(item.allowances) || 0,
            bonuses: Number(item.bonuses) || 0,
            totalDirectCost: 0,
            month: item.month || '12',
            year: item.year || 2024
          }))

          // 간접인건비 데이터 생성 (FeeData 기반)
          const indirectCosts: IndirectLaborCost[] = feeData.map((item, index) => ({
            id: item.id || `indirect-${index}`,
            employeeId: item.employeeId || '',
            employeeName: item.companyName || '이름 없음', // companyName 사용
            department: item.category || '미분류', // category를 department로 사용
            position: item.serviceDescription || '미분류', // serviceDescription을 position으로 사용
            insurancePremiums: Number(item.monthlyFee) || 0, // monthlyFee를 insurancePremiums로 사용
            welfareBenefits: 0, // 기본값
            trainingCosts: 0, // 기본값
            recruitmentCosts: 0, // 기본값
            totalIndirectCost: 0,
            month: item.month || '12',
            year: item.year || 2024
          }))

          // 데이터가 없는 경우 샘플 데이터 생성
          if (directCosts.length === 0 && indirectCosts.length === 0) {
            console.log('업로드된 데이터가 없어 샘플 데이터 생성')
            generateSampleData()
            return
          }

          // 총 비용 계산
          directCosts.forEach(cost => {
            cost.totalDirectCost = (cost.baseSalary || 0) + (cost.overtimePay || 0) + (cost.allowances || 0) + (cost.bonuses || 0)
          })

          indirectCosts.forEach(cost => {
            cost.totalIndirectCost = (cost.insurancePremiums || 0) + (cost.welfareBenefits || 0) + (cost.trainingCosts || 0) + (cost.recruitmentCosts || 0)
          })

          const totalDirectCost = directCosts.reduce((sum, cost) => sum + (cost.totalDirectCost || 0), 0)
          const totalIndirectCost = indirectCosts.reduce((sum, cost) => sum + (cost.totalIndirectCost || 0), 0)

          // 부서별 분석
          const allDepartments = [...new Set([
            ...directCosts.map(cost => cost.department),
            ...indirectCosts.map(cost => cost.department)
          ])]

          const departmentBreakdown = allDepartments.map(dept => {
            const deptDirectCosts = directCosts.filter(cost => cost.department === dept)
            const deptIndirectCosts = indirectCosts.filter(cost => cost.department === dept)

            const directCost = deptDirectCosts.reduce((sum, cost) => sum + (cost.totalDirectCost || 0), 0)
            const indirectCost = deptIndirectCosts.reduce((sum, cost) => sum + (cost.totalIndirectCost || 0), 0)

            return {
              department: dept,
              directCost,
              indirectCost,
              totalCost: directCost + indirectCost
            }
          })

          const finalData: TotalLaborCost = {
            directCosts,
            indirectCosts,
            totalDirectCost,
            totalIndirectCost,
            totalLaborCost: totalDirectCost + totalIndirectCost,
            month: '12',
            year: 2024,
            departmentBreakdown
          }

          setLaborCostData(finalData)
          setDebugInfo({
            dataSource: 'uploaded',
            payrollDataCount: payrollData.length,
            feeDataCount: feeData.length,
            totalRecords: directCosts.length + indirectCosts.length
          })

          console.log('업로드된 데이터로 인건비 데이터 생성 완료:', {
            directCosts: directCosts.length,
            indirectCosts: indirectCosts.length,
            totalDirectCost,
            totalIndirectCost,
            totalLaborCost: totalDirectCost + totalIndirectCost
          })

        } else {
          console.log('업로드된 데이터가 없어 샘플 데이터 생성')
          generateSampleData()
        }

      } catch (error) {
        console.error('데이터 로딩 중 오류:', error)
        console.log('오류로 인해 샘플 데이터 생성')
        generateSampleData()
      }

      setLoading(false)
    }

    // 샘플 데이터 생성 (실제로는 업로드된 데이터에서 가져옴)
    const generateSampleData = () => {
      console.log('샘플 데이터 생성 중...')

      const departments = ['개발팀', '마케팅팀', '영업팀', '인사팀', '재무팀']
      const positions = ['팀장', '과장', '대리', '사원', '인턴']

      const directCosts: DirectLaborCost[] = departments.flatMap((dept, deptIndex) =>
        Array.from({ length: 8 }, (_, i) => ({
          id: `direct-${deptIndex}-${i}`,
          employeeId: `EMP-${deptIndex}${i.toString().padStart(2, '0')}`,
          employeeName: `${dept} ${positions[i % positions.length]} ${i + 1}`,
          department: dept,
          position: positions[i % positions.length],
          baseSalary: 3000000 + (i * 200000) + (deptIndex * 500000),
          overtimePay: 150000 + (i * 10000),
          allowances: 200000 + (i * 15000),
          bonuses: 500000 + (i * 50000),
          totalDirectCost: 0,
          month: '12',
          year: 2024
        }))
      )

      const indirectCosts: IndirectLaborCost[] = departments.flatMap((dept, deptIndex) =>
        Array.from({ length: 8 }, (_, i) => ({
          id: `indirect-${deptIndex}-${i}`,
          employeeId: `EMP-${deptIndex}${i.toString().padStart(2, '0')}`,
          employeeName: `${dept} ${positions[i % positions.length]} ${i + 1}`,
          department: dept,
          position: positions[i % positions.length],
          insurancePremiums: 200000 + (i * 15000),
          welfareBenefits: 150000 + (i * 10000),
          trainingCosts: 50000 + (i * 5000),
          recruitmentCosts: 100000 + (i * 8000),
          totalIndirectCost: 0,
          month: '12',
          year: 2024
        }))
      )

      // 총 비용 계산
      directCosts.forEach(cost => {
        cost.totalDirectCost = (cost.baseSalary || 0) + (cost.overtimePay || 0) + (cost.allowances || 0) + (cost.bonuses || 0)
      })

      indirectCosts.forEach(cost => {
        cost.totalIndirectCost = (cost.insurancePremiums || 0) + (cost.welfareBenefits || 0) + (cost.trainingCosts || 0) + (cost.recruitmentCosts || 0)
      })

      const totalDirectCost = directCosts.reduce((sum, cost) => sum + (cost.totalDirectCost || 0), 0)
      const totalIndirectCost = indirectCosts.reduce((sum, cost) => sum + (cost.totalIndirectCost || 0), 0)

      // 부서별 분석
      const departmentBreakdown = departments.map(dept => {
        const deptDirectCosts = directCosts.filter(cost => cost.department === dept)
        const deptIndirectCosts = indirectCosts.filter(cost => cost.department === dept)

        const directCost = deptDirectCosts.reduce((sum, cost) => sum + (cost.totalDirectCost || 0), 0)
        const indirectCost = deptIndirectCosts.reduce((sum, cost) => sum + (cost.totalIndirectCost || 0), 0)

        return {
          department: dept,
          directCost,
          indirectCost,
          totalCost: directCost + indirectCost
        }
      })

      setLaborCostData({
        directCosts,
        indirectCosts,
        totalDirectCost,
        totalIndirectCost,
        totalLaborCost: totalDirectCost + totalIndirectCost,
        month: '12',
        year: 2024,
        departmentBreakdown
      })

      setDebugInfo({
        dataSource: 'sample',
        payrollDataCount: 0,
        feeDataCount: 0,
        totalRecords: 0
      })

      console.log('샘플 데이터 생성 완료')
    }

    loadLaborCostData()
  }, [])

  // 디버깅 정보 로그
  const logDebugInfo = () => {
    console.log('=== 인건비 분석 디버깅 정보 ===')
    console.log('현재 데이터 소스:', debugInfo.dataSource)
    console.log('PayrollData 레코드 수:', debugInfo.payrollDataCount)
    console.log('FeeData 레코드 수:', debugInfo.feeDataCount)
    console.log('총 레코드 수:', debugInfo.totalRecords)
    console.log('localStorage 내용:', localStorage.getItem('integrated_paypulse_data'))
    console.log('현재 laborCostData:', laborCostData)
  }

  if (loading) {
    return (
      <div className="page-background">
        <div className="ok-section-unified min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!laborCostData) {
    return (
      <div className="page-background">
        <div className="ok-section-unified min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">데이터를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900">총 인건비 관리</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="ok-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">인건비 분석</h1>
              <p className="text-gray-600">직접인건비와 간접인건비를 통합 분석하여 인건비 효율성을 파악하세요</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/salary" className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                급여 관리
              </a>
            </div>
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>

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
              onClick={() => setSelectedView('direct')}
              className={`ok-tab ${selectedView === 'direct' ? 'ok-tab-active' : 'ok-tab-inactive'}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              직접인건비
            </button>
            <button
              onClick={() => setSelectedView('indirect')}
              className={`ok-tab ${selectedView === 'indirect' ? 'ok-tab-active' : 'ok-tab-inactive'}`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              간접인건비
            </button>
          </div>

          {/* 디버깅 정보 패널 (개발 모드에서만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">디버깅 정보</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>데이터 소스: <span className="font-medium">{debugInfo.dataSource === 'uploaded' ? '업로드됨' : debugInfo.dataSource === 'sample' ? '샘플' : '없음'}</span></div>
                <div>PayrollData: <span className="font-medium">{debugInfo.payrollDataCount}개</span></div>
                <div>FeeData: <span className="font-medium">{debugInfo.feeDataCount}개</span></div>
                <div>총 레코드: <span className="font-medium">{debugInfo.totalRecords}개</span></div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={logDebugInfo}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  콘솔 로그
                </button>
                <button
                  onClick={() => {
                    console.log('localStorage 키들:', Object.keys(localStorage))
                    console.log('integrated_paypulse_data:', localStorage.getItem('integrated_paypulse_data'))
                  }}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  저장소 확인
                </button>
              </div>
            </div>
          )}

          {/* 요약 대시보드 */}
          {selectedView === 'summary' && (
            <div className="space-y-6">
              {/* KPI 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="ok-kpi-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">인건비</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrencyShort(laborCostData.totalLaborCost)}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(laborCostData.totalLaborCost)}원
                  </p>
                </div>

                <div className="ok-kpi-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">직접인건비</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrencyShort(laborCostData.totalDirectCost)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(laborCostData.totalDirectCost)}원
                  </p>
                </div>

                <div className="ok-kpi-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">간접인건비</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrencyShort(laborCostData.totalIndirectCost)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(laborCostData.totalIndirectCost)}원
                  </p>
                </div>
              </div>

              {/* 부서별 분석 */}
              <div className="ok-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">부서별 인건비 분석</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">부서</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">직접인건비</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">간접인건비</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">인건비</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">비율</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laborCostData.departmentBreakdown.map((dept) => (
                        <tr key={dept.department} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                          <td className="py-3 px-4 text-right text-blue-600 font-medium">
                            {formatCurrency(dept.directCost)}
                          </td>
                          <td className="py-3 px-4 text-right text-green-600 font-medium">
                            {formatCurrency(dept.indirectCost)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            {formatCurrency(dept.totalCost)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            {((dept.totalCost / laborCostData.totalLaborCost) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 직접인건비 상세 */}
          {selectedView === 'direct' && (
            <div className="ok-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">직접인건비 상세</h3>
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
                      <th className="text-right py-3 px-4 font-medium text-gray-700">총액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborCostData.directCosts.map((cost) => (
                      <tr key={cost.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-gray-900">{cost.employeeName}</td>
                        <td className="py-3 px-4 text-gray-600">{cost.department}</td>
                        <td className="py-3 px-4 text-gray-600">{cost.position}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.baseSalary)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.overtimePay)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.allowances)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.bonuses)}</td>
                        <td className="py-3 px-4 text-right font-bold text-blue-600">{formatCurrency(cost.totalDirectCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 간접인건비 상세 */}
          {selectedView === 'indirect' && (
            <div className="ok-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">간접인건비 상세</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">직원명</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">부서</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">직급</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">4대보험</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">복리후생</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">교육훈련</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">채용비용</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">총액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborCostData.indirectCosts.map((cost) => (
                      <tr key={cost.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-gray-900">{cost.employeeName}</td>
                        <td className="py-3 px-4 text-gray-600">{cost.department}</td>
                        <td className="py-3 px-4 text-gray-600">{cost.position}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.insurancePremiums)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.welfareBenefits)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.trainingCosts)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(cost.recruitmentCosts)}</td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(cost.totalIndirectCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
