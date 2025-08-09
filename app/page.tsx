import Link from 'next/link'
import { ArrowRight, TrendingUp, Calculator, Upload, MessageCircle, Sparkles, BarChart3, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 웰컴 헤더 */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full text-rose-700 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          혁신적인 인건비 관리의 시작
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            PayPulse와 함께하는
          </span>
          <br />
          <span className="text-slate-800">스마트한 인사관리</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI 기술과 직관적인 인터페이스로 복잡한 인건비 계산과 분석을 
          <span className="text-purple-600 font-semibold"> 쉽고 정확하게</span> 처리하세요
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-rose-300 to-purple-300 mx-auto rounded-full pulse-animation"></div>
      </div>

      {/* 주요 기능 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<BarChart3 className="w-7 h-7" />}
          title="실시간 대시보드"
          description="총 인건비와 HC ROI를 한눈에 확인하세요"
          href="/dashboard"
          gradient="from-emerald-200 to-teal-300"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        
        <FeatureCard
          icon={<Upload className="w-7 h-7" />}
          title="간편한 데이터 업로드"
          description="엑셀 파일로 모든 데이터를 쉽게 관리"
          href="/upload"
          gradient="from-blue-200 to-indigo-300"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        
        <FeatureCard
          icon={<Calculator className="w-7 h-7" />}
          title="스마트 계산기"
          description="4대보험과 각종 수당을 정확하게 계산"
          href="/calculator"
          gradient="from-purple-200 to-violet-300"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        
        <FeatureCard
          icon={<MessageCircle className="w-7 h-7" />}
          title="AI 인사이트"
          description="친구같은 AI와 대화하며 데이터 분석"
          href="/ai-chat"
          gradient="from-amber-200 to-orange-300"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* 통계 섹션 */}
      <div className="card-gradient">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">PayPulse 현황</h2>
          <p className="text-slate-600">실시간으로 업데이트되는 우리 회사의 인건비 현황입니다</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="총 직원 수"
            value="247명"
            change="+5.2%"
            positive={true}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="월 인건비"
            value="₩1.2억"
            change="-2.1%"
            positive={false}
            color="emerald"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="HC ROI"
            value="187%"
            change="+12.3%"
            positive={true}
            color="purple"
          />
        </div>
      </div>

      {/* 빠른 시작 가이드 */}
      <div className="card-gradient">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          🚀 3단계로 시작하는 PayPulse
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <QuickStartStep
            step="1"
            title="데이터 업로드"
            description="급여 데이터를 엑셀로 업로드하세요"
            icon={<Upload className="w-6 h-6" />}
            color="blue"
          />
          <QuickStartStep
            step="2"
            title="대시보드 확인"
            description="실시간 인건비 현황을 확인하세요"
            icon={<BarChart3 className="w-6 h-6" />}
            color="emerald"
          />
          <QuickStartStep
            step="3"
            title="AI 인사이트 활용"
            description="AI와 함께 데이터를 분석하세요"
            icon={<MessageCircle className="w-6 h-6" />}
            color="purple"
          />
        </div>
      </div>
    </div>
  )
}

// 기능 카드 컴포넌트
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  gradient: string
  iconBg: string
  iconColor: string
}

function FeatureCard({ icon, title, description, href, gradient, iconBg, iconColor }: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className={`card hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br ${gradient} border-none relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className={`p-4 ${iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          
          <div className="flex items-center gap-2 text-slate-700 group-hover:text-slate-900 transition-colors">
            <span className="text-sm font-medium">시작하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// 통계 카드 컴포넌트
interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  positive: boolean
  color: 'blue' | 'emerald' | 'purple'
}

function StatCard({ icon, title, value, change, positive, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-100 to-blue-200 text-blue-700',
    emerald: 'from-emerald-100 to-emerald-200 text-emerald-700',
    purple: 'from-purple-100 to-purple-200 text-purple-700',
  }

  return (
    <div className={`p-6 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/50 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-sm opacity-80 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

// 빠른 시작 단계 컴포넌트
interface QuickStartStepProps {
  step: string
  title: string
  description: string
  icon: React.ReactNode
  color: 'blue' | 'emerald' | 'purple'
}

function QuickStartStep({ step, title, description, icon, color }: QuickStartStepProps) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-500',
    emerald: 'from-emerald-400 to-emerald-500',
    purple: 'from-purple-400 to-purple-500',
  }

  return (
    <div className="text-center group">
      <div className={`w-16 h-16 bg-gradient-to-r ${colorClasses[color]} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {step}
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="text-slate-600">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}


