import {
    ArrowRight,
    Calculator,
    Star,
    Upload
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-0">
      {/* 메인 히어로 섹션 - OK저축은행 스타일 */}
      <section className="ok-section bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium">
                  <Star className="w-4 h-4" />
                  국내 최고의 인건비 관리 시스템
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  급여계산부터 분석까지<br />
                  <span className="text-orange-600">인건비 관리를</span><br />
                  간편하게
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  PayPulse가 새롭게 오픈했어요!<br />
                  AI 기반 스마트 인건비 관리를 경험해보세요!
                </p>
              </div>

              <div className="flex justify-center">
                <Link href="/dashboard" className="ok-btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                  지금 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* 빠른 링크들 - OK저축은행 스타일 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                {[
                  { name: '통합데이터업로드', href: '/upload' },
                  { name: '인건비', href: '/total-labor-cost' },
                  { name: 'AI 분석', href: '/ai-chat' },
                  { name: '급여 계산기', href: '/calculator' }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="p-3 bg-white hover:bg-orange-50 hover:text-orange-600 rounded-xl text-center text-sm font-medium transition-colors border border-gray-200 hover:border-orange-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 실시간 현황 카드 - OK저축은행 스타일 */}
            <div className="relative">
              <div className="ok-card p-8 bg-white shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">실시간 현황</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">총 직원 수</span>
                    <span className="text-2xl font-bold text-gray-900">247명</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">월 인건비</span>
                    <span className="text-2xl font-bold text-gray-900">₩12,000만원</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 font-medium">직접인건비</span>
                    <span className="text-2xl font-bold text-blue-600">₩8,500만원</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-medium">간접인건비</span>
                    <span className="text-2xl font-bold text-green-600">₩3,500만원</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                    <span className="text-gray-600 font-medium">HC ROI</span>
                    <span className="text-2xl font-bold text-orange-600">187%</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    최근 업데이트: 2024년 8월 10일
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* CTA 섹션 */}
      <section className="ok-section bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            지금 바로 PayPulse를<br />
            경험해보세요!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            복잡한 인건비 계산과 분석, 이제 PayPulse가 해결해드립니다
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="ok-btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              데이터 업로드하기
            </Link>
            <Link href="/calculator" className="ok-btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center justify-center">
              <Calculator className="w-5 h-5 mr-2" />
              계산기 사용하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}




