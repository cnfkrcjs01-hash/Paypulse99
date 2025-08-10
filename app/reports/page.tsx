'use client'

import { exportToCSV, formatDate, storage } from '@/lib/utils'
import {
    BarChart3,
    Building,
    Calendar,
    Download,
    FileText,
    Search,
    TrendingUp,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: any
  category: string
  parameters: string[]
}

interface GeneratedReport {
  id: string
  name: string
  generatedAt: Date
  data: any[]
  type: string
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'employee-salary',
    name: '직원별 급여 현황',
    description: '전체 직원의 급여 정보를 상세히 분석한 보고서',
    icon: Users,
    category: '급여',
    parameters: ['부서', '급여구간', '입사일자']
  },
  {
    id: 'department-cost',
    name: '부서별 비용 분석',
    description: '부서별 인건비 현황 및 분석 보고서',
    icon: Building,
    category: '비용',
    parameters: ['기간', '비용구분', '비교분석']
  },
  {
    id: 'monthly-trend',
    name: '월별 트렌드 분석',
    description: '월별 인건비 변화 추이 및 예측 보고서',
    icon: TrendingUp,
    category: '트렌드',
    parameters: ['기간', '지표', '예측기간']
  },
  {
    id: 'cost-breakdown',
    name: '비용 구성 분석',
    description: '인건비 세부 구성요소별 분석 보고서',
    icon: BarChart3,
    category: '분석',
    parameters: ['비용구분', '기간', '부서']
  },
  {
    id: 'comparison',
    name: '기간별 비교 분석',
    description: '다른 기간과의 인건비 비교 분석 보고서',
    icon: Calendar,
    category: '비교',
    parameters: ['기준기간', '비교기간', '지표']
  },
  {
    id: 'summary',
    name: '종합 요약 보고서',
    description: '전체 인건비 현황을 요약한 종합 보고서',
    icon: FileText,
    category: '요약',
    parameters: ['기간', '부서', '상세도']
  }
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({})
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadGeneratedReports()
  }, [])

  const loadGeneratedReports = () => {
    const saved = storage.get('generatedReports') || []
    setGeneratedReports(saved)
  }

  const generateReport = async () => {
    if (!selectedTemplate) return

    setLoading(true)
    
    try {
      // 저장된 데이터 가져오기
      const savedData = storage.get('integratedPayrollData')
      
      // 실제 데이터가 있으면 사용, 없으면 샘플 데이터 생성
      const data = savedData && savedData.length > 0 ? savedData : generateSampleData()
      
      // 보고서 데이터 생성
      const reportData = await processReportData(selectedTemplate.id, data, reportParameters)
      
      // 보고서 객체 생성
      const newReport: GeneratedReport = {
        id: `${selectedTemplate.id}-${Date.now()}`,
        name: selectedTemplate.name,
        generatedAt: new Date(),
        data: reportData,
        type: selectedTemplate.id
      }
      
      // 저장
      const updatedReports = [newReport, ...generatedReports]
      storage.set('generatedReports', updatedReports)
      setGeneratedReports(updatedReports)
      
      // 파라미터 초기화
      setReportParameters({})
      setSelectedTemplate(null)
      
    } catch (error) {
      console.error('보고서 생성 중 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleData = () => {
    const departments = ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀']
    const positions = ['사원', '대리', '과장', '차장', '부장']
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `직원${i + 1}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      baseSalary: 3000000 + Math.random() * 7000000,
      allowance: 500000 + Math.random() * 1000000,
      insurance: 300000 + Math.random() * 500000,
      totalCost: 0,
      hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
      performance: 70 + Math.random() * 30
    })).map(emp => ({
      ...emp,
      totalCost: emp.baseSalary + emp.allowance + emp.insurance
    }))
  }

  const processReportData = async (reportType: string, data: any[], parameters: any) => {
    // 실제 구현에서는 더 복잡한 데이터 처리 로직이 들어갈 수 있습니다
    await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션된 지연
    
    switch (reportType) {
      case 'employee-salary':
        return data.map(emp => ({
          '직원ID': emp.id,
          '이름': emp.name,
          '부서': emp.department,
          '직급': emp.position,
          '기본급': emp.baseSalary.toLocaleString(),
          '수당': emp.allowance.toLocaleString(),
          '보험': emp.insurance.toLocaleString(),
          '총액': emp.totalCost.toLocaleString(),
          '입사일': formatDate(emp.hireDate),
          '성과점수': emp.performance.toFixed(1)
        }))
      
      case 'department-cost':
        const deptMap = new Map()
        data.forEach(emp => {
          const dept = emp.department
          if (!deptMap.has(dept)) {
            deptMap.set(dept, { employees: 0, totalCost: 0, avgSalary: 0 })
          }
          const deptData = deptMap.get(dept)
          deptData.employees++
          deptData.totalCost += emp.totalCost
        })
        
        return Array.from(deptMap.entries()).map(([dept, data]: [string, any]) => ({
          '부서': dept,
          '직원수': data.employees,
          '총비용': data.totalCost.toLocaleString(),
          '평균급여': Math.floor(data.totalCost / data.employees).toLocaleString(),
          '비중': ((data.totalCost / data.totalCost) * 100).toFixed(1) + '%'
        }))
      
      case 'monthly-trend':
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const month = date.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })
          const baseCost = 800000000
          const variation = 0.95 + Math.random() * 0.1
          return {
            '월': month,
            '총비용': Math.floor(baseCost * variation).toLocaleString(),
            '직원수': 150 + Math.floor(Math.random() * 10),
            '평균급여': Math.floor((baseCost * variation) / 150).toLocaleString(),
            '증감률': ((variation - 1) * 100).toFixed(1) + '%'
          }
        }).reverse()
      
      case 'cost-breakdown':
        const breakdownTotalCost = data.reduce((sum, emp) => sum + emp.totalCost, 0)
        return [
          { '구분': '기본급', '금액': Math.floor(breakdownTotalCost * 0.6).toLocaleString(), '비중': '60%' },
          { '구분': '수당', '금액': Math.floor(breakdownTotalCost * 0.2).toLocaleString(), '비중': '20%' },
          { '구분': '4대보험', '금액': Math.floor(breakdownTotalCost * 0.15).toLocaleString(), '비중': '15%' },
          { '구분': '기타', '금액': Math.floor(breakdownTotalCost * 0.05).toLocaleString(), '비중': '5%' }
        ]
      
      case 'comparison':
        const currentPeriod = data.reduce((sum, emp) => sum + emp.totalCost, 0)
        const previousPeriod = currentPeriod * 0.95
        return [
          { '구분': '현재기간', '금액': currentPeriod.toLocaleString(), '직원수': data.length },
          { '구분': '이전기간', '금액': Math.floor(previousPeriod).toLocaleString(), '직원수': data.length },
          { '구분': '증감', '금액': (currentPeriod - previousPeriod).toLocaleString(), '비율': '5.3%' }
        ]
      
      case 'summary':
        const totalEmployees = data.length
        const totalCost = data.reduce((sum, emp) => sum + emp.totalCost, 0)
        const avgSalary = totalCost / totalEmployees
        const deptCount = new Set(data.map(emp => emp.department)).size
        
        return [
          { '항목': '총 직원수', '값': totalEmployees + '명' },
          { '항목': '총 인건비', '값': totalCost.toLocaleString() + '원' },
          { '항목': '평균 급여', '값': Math.floor(avgSalary).toLocaleString() + '원' },
          { '항목': '부서 수', '값': deptCount + '개' },
          { '항목': '인당 평균 비용', '값': Math.floor(totalCost / totalEmployees).toLocaleString() + '원' }
        ]
      
      default:
        return data
    }
  }

  const exportReport = (report: GeneratedReport) => {
    exportToCSV(report.data, `${report.name}-${formatDate(report.generatedAt)}`)
  }

  const deleteReport = (reportId: string) => {
    const updatedReports = generatedReports.filter(r => r.id !== reportId)
    storage.set('generatedReports', updatedReports)
    setGeneratedReports(updatedReports)
  }

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(reportTemplates.map(t => t.category)))]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">보고서 생성</h1>
          <p className="text-gray-600">다양한 인건비 분석 보고서를 생성하고 내보낼 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 보고서 템플릿 선택 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">보고서 템플릿</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="템플릿 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? '전체' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.parameters.map((param, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 보고서 생성 및 설정 */}
          <div className="space-y-6">
            {/* 선택된 템플릿 정보 */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <selectedTemplate.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedTemplate.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTemplate.category}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
                
                <div className="space-y-3">
                  {selectedTemplate.parameters.map((param, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {param}
                      </label>
                      <input
                        type="text"
                        placeholder={`${param} 입력...`}
                        value={reportParameters[param] || ''}
                        onChange={(e) => setReportParameters({
                          ...reportParameters,
                          [param]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '생성 중...' : '보고서 생성'}
                </button>
              </div>
            )}

            {/* 최근 생성된 보고서 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 보고서</h3>
              <div className="space-y-3">
                {generatedReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{report.name}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(report.generatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportReport(report)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        내보내기
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
                {generatedReports.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    아직 생성된 보고서가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 생성된 보고서 목록 */}
        {generatedReports.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">생성된 보고서 목록</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보고서명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일시</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">데이터 수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.generatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.data.length}건
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportReport(report)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            내보내기
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
