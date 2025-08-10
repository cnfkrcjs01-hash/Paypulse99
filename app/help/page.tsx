'use client'

import {
    BarChart3,
    BookOpen,
    Calculator,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    FileText,
    HelpCircle,
    MessageCircle,
    Search,
    Upload,
    Video
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    question: "PayPulse99는 어떤 시스템인가요?",
    answer: "PayPulse99는 AI 기반 통합 인건비 관리 시스템입니다. 급여부터 수수료까지 모든 인건비를 효율적으로 관리하고 분석할 수 있으며, 실시간 대시보드와 AI 인사이트를 통해 최적의 의사결정을 지원합니다.",
    category: "기본"
  },
  {
    question: "어떤 파일 형식을 지원하나요?",
    answer: "Excel(.xlsx, .xls)과 CSV 파일을 지원합니다. 급여대장, 수수료 파일 등을 업로드하여 시스템에서 분석할 수 있습니다.",
    category: "업로드"
  },
  {
    question: "4대보험 계산은 어떻게 하나요?",
    answer: "계산기 메뉴에서 기본급을 입력하면 자동으로 4대보험료(국민연금, 건강보험, 고용보험, 산재보험)를 계산합니다. 최신 법규를 반영하여 정확한 계산을 제공합니다.",
    category: "계산기"
  },
  {
    question: "AI 인사이트는 어떻게 작동하나요?",
    answer: "자연어로 질문을 입력하면 AI가 업로드된 데이터를 분석하여 인건비 최적화 방안, 부서별 효율성 분석, 4대보험 최적화 가이드 등을 제공합니다.",
    category: "AI"
  },
  {
    question: "데이터는 어디에 저장되나요?",
    answer: "현재는 브라우저의 로컬 스토리지에 저장됩니다. 향후 클라우드 저장소 연동을 통해 더 안전하고 접근 가능한 데이터 저장을 제공할 예정입니다.",
    category: "데이터"
  },
  {
    question: "급여 계산 정확도는 어떻게 되나요?",
    answer: "최신 노동법과 세법을 반영하여 높은 정확도를 제공합니다. 다만, 개별 사업장의 특수한 규정이나 협약이 있는 경우 별도 설정이 필요할 수 있습니다.",
    category: "계산기"
  },
  {
    question: "부서별 분석은 어떻게 하나요?",
    answer: "대시보드에서 부서별 인건비 현황을 차트와 그래프로 확인할 수 있으며, 인건비 분석 페이지에서 더 상세한 부서별 분석을 제공합니다.",
    category: "대시보드"
  },
  {
    question: "데이터를 내보낼 수 있나요?",
    answer: "네, CSV 형식으로 데이터를 내보낼 수 있습니다. 각 페이지에서 내보내기 기능을 통해 분석 결과를 다운로드할 수 있습니다.",
    category: "데이터"
  },
  {
    question: "모바일에서도 사용할 수 있나요?",
    answer: "네, 반응형 디자인으로 모든 기기에서 사용할 수 있습니다. 모바일, 태블릿, 데스크톱에서 최적화된 경험을 제공합니다.",
    category: "기본"
  },
  {
    question: "시스템 설정은 어떻게 변경하나요?",
    answer: "설정 메뉴에서 회사 정보, 급여 설정, 화면 설정, 알림 설정 등을 변경할 수 있습니다. 설정은 자동으로 저장되며 필요시 내보내기/가져오기가 가능합니다.",
    category: "설정"
  }
]

const categories = ['기본', '업로드', '계산기', 'AI', '대시보드', '데이터', '설정']

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const quickStartSteps = [
    {
      title: "1. 데이터 업로드",
      description: "급여대장과 수수료 파일을 업로드하세요",
      icon: Upload,
      href: "/upload"
    },
    {
      title: "2. 대시보드 확인",
      description: "전체 인건비 현황을 파악하세요",
      icon: BarChart3,
      href: "/dashboard"
    },
    {
      title: "3. 계산기 사용",
      description: "4대보험과 수당을 계산하세요",
      icon: Calculator,
      href: "/calculator"
    },
    {
      title: "4. AI 분석",
      description: "AI 인사이트로 최적화 방안을 찾으세요",
      icon: MessageCircle,
      href: "/ai-chat"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 헤더 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              홈으로
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              대시보드
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">도움말</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="ok-header mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <HelpCircle className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">PayPulse99 도움말</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              PayPulse99 시스템을 효과적으로 사용하는 방법을 알아보세요. 
              자주 묻는 질문과 빠른 시작 가이드를 통해 시스템을 쉽게 활용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 빠른 시작 가이드 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 시작 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Link
                  key={index}
                  href={step.href}
                  className="ok-card hover:shadow-lg transition-shadow group"
                >
                  <div className="text-center p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                        <Icon className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="질문이나 키워드를 검색하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ok-input w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="ok-input"
              >
                <option value="전체">전체 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="ok-card text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="ok-card">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {faq.category}
                      </span>
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </div>
                    {expandedItems.has(index) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedItems.has(index) && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 추가 리소스 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">추가 리소스</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ok-card text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 매뉴얼</h3>
              <p className="text-sm text-gray-600 mb-4">상세한 기능 설명과 사용법을 제공합니다</p>
              <button className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                매뉴얼 보기
              </button>
            </div>
            
            <div className="ok-card text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Video className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">동영상 가이드</h3>
              <p className="text-sm text-gray-600 mb-4">시각적 학습을 위한 동영상 튜토리얼</p>
              <button className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                <Video className="w-4 h-4" />
                동영상 보기
              </button>
            </div>
            
            <div className="ok-card text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">고객 지원</h3>
              <p className="text-sm text-gray-600 mb-4">추가 질문이나 문제가 있으시면 문의하세요</p>
              <button className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                문의하기
              </button>
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="ok-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">더 많은 도움이 필요하신가요?</h3>
            <p className="text-gray-700 mb-6">
              PayPulse99 팀이 언제든지 도움을 드릴 준비가 되어 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="ok-btn-primary px-6 py-3 inline-flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                고객 지원 문의
              </button>
              <button className="ok-btn-outline px-6 py-3 inline-flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                공식 문서 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
