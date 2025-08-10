'use client'

import {
    Bell,
    Database,
    Download,
    Palette,
    RefreshCw,
    Save,
    Shield,
    Upload,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SettingsData {
  company: {
    name: string
    industry: string
    size: string
    fiscalYear: string
  }
  payroll: {
    currency: string
    decimalPlaces: number
    autoCalculate: boolean
    includeOvertime: boolean
    includeBonuses: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    dateFormat: string
    numberFormat: string
  }
  notifications: {
    email: boolean
    browser: boolean
    payrollReminders: boolean
    costAlerts: boolean
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const [settings, setSettings] = useState<SettingsData>({
    company: {
      name: 'PayPulse99',
      industry: 'IT/소프트웨어',
      size: '중소기업 (50-200명)',
      fiscalYear: '1월-12월'
    },
    payroll: {
      currency: 'KRW',
      decimalPlaces: 0,
      autoCalculate: true,
      includeOvertime: true,
      includeBonuses: true
    },
    display: {
      theme: 'light',
      language: 'ko',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: 'ko-KR'
    },
    notifications: {
      email: true,
      browser: true,
      payrollReminders: true,
      costAlerts: true
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = localStorage.getItem('paypulse_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('설정 로드 실패:', error)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem('paypulse_settings', JSON.stringify(settings))
      
      // 실제로는 API 호출로 서버에 저장
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('설정이 성공적으로 저장되었습니다.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('설정 저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      const defaultSettings: SettingsData = {
        company: {
          name: 'PayPulse99',
          industry: 'IT/소프트웨어',
          size: '중소기업 (50-200명)',
          fiscalYear: '1월-12월'
        },
        payroll: {
          currency: 'KRW',
          decimalPlaces: 0,
          autoCalculate: true,
          includeOvertime: true,
          includeBonuses: true
        },
        display: {
          theme: 'light',
          language: 'ko',
          dateFormat: 'YYYY-MM-DD',
          numberFormat: 'ko-KR'
        },
        notifications: {
          email: true,
          browser: true,
          payrollReminders: true,
          costAlerts: true
        }
      }
      setSettings(defaultSettings)
      setMessage('설정이 기본값으로 초기화되었습니다.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'paypulse-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setSettings(imported)
        setMessage('설정이 성공적으로 가져와졌습니다.')
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('설정 파일 형식이 올바르지 않습니다.')
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: 'company', name: '회사 정보', icon: User },
    { id: 'payroll', name: '급여 설정', icon: Database },
    { id: 'display', name: '화면 설정', icon: Palette },
    { id: 'notifications', name: '알림 설정', icon: Bell },
    { id: 'security', name: '보안 설정', icon: Shield }
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
          <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 메시지 표시 */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* 설정 헤더 */}
        <div className="ok-header mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
              <p className="text-gray-600">PayPulse99 시스템을 사용자 환경에 맞게 커스터마이징하세요</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleImport}
                className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                가져오기
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-settings"
                />
              </button>
              <button
                onClick={handleExport}
                className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                내보내기
              </button>
              <button
                onClick={handleReset}
                className="ok-btn-outline px-4 py-2 inline-flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4" />
                초기화
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 탭 */}
          <div className="lg:col-span-1">
            <div className="ok-card">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* 설정 내용 */}
          <div className="lg:col-span-3">
            <div className="ok-card">
              {/* 회사 정보 설정 */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">회사 정보</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        회사명
                      </label>
                      <input
                        type="text"
                        value={settings.company.name}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          company: { ...prev.company, name: e.target.value }
                        }))}
                        className="ok-input w-full"
                        placeholder="회사명을 입력하세요"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        업종
                      </label>
                      <select
                        value={settings.company.industry}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          company: { ...prev.company, industry: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="IT/소프트웨어">IT/소프트웨어</option>
                        <option value="제조업">제조업</option>
                        <option value="서비스업">서비스업</option>
                        <option value="금융업">금융업</option>
                        <option value="건설업">건설업</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        회사 규모
                      </label>
                      <select
                        value={settings.company.size}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          company: { ...prev.company, size: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="스타트업 (1-10명)">스타트업 (1-10명)</option>
                        <option value="소기업 (10-50명)">소기업 (10-50명)</option>
                        <option value="중소기업 (50-200명)">중소기업 (50-200명)</option>
                        <option value="중견기업 (200-1000명)">중견기업 (200-1000명)</option>
                        <option value="대기업 (1000명 이상)">대기업 (1000명 이상)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        회계연도
                      </label>
                      <select
                        value={settings.company.fiscalYear}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          company: { ...prev.company, fiscalYear: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="1월-12월">1월-12월</option>
                        <option value="4월-3월">4월-3월</option>
                        <option value="7월-6월">7월-6월</option>
                        <option value="10월-9월">10월-9월</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 급여 설정 */}
              {activeTab === 'payroll' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">급여 설정</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        통화
                      </label>
                      <select
                        value={settings.payroll.currency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          payroll: { ...prev.payroll, currency: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="KRW">한국 원화 (₩)</option>
                        <option value="USD">미국 달러 ($)</option>
                        <option value="EUR">유로 (€)</option>
                        <option value="JPY">일본 엔 (¥)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        소수점 자릿수
                      </label>
                      <select
                        value={settings.payroll.decimalPlaces}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          payroll: { ...prev.payroll, decimalPlaces: Number(e.target.value) }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value={0}>0 (정수)</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">자동 계산</label>
                        <p className="text-sm text-gray-500">급여 항목을 자동으로 계산합니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payroll.autoCalculate}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            payroll: { ...prev.payroll, autoCalculate: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">초과근무 포함</label>
                        <p className="text-sm text-gray-500">초과근무 수당을 급여에 포함합니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payroll.includeOvertime}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            payroll: { ...prev.payroll, includeOvertime: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">상여금 포함</label>
                        <p className="text-sm text-gray-500">상여금을 급여에 포함합니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payroll.includeBonuses}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            payroll: { ...prev.payroll, includeBonuses: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 화면 설정 */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">화면 설정</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        테마
                      </label>
                      <select
                        value={settings.display.theme}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          display: { ...prev.display, theme: e.target.value as 'light' | 'dark' | 'auto' }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="light">라이트 모드</option>
                        <option value="dark">다크 모드</option>
                        <option value="auto">시스템 설정 따름</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        언어
                      </label>
                      <select
                        value={settings.display.language}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          display: { ...prev.display, language: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        날짜 형식
                      </label>
                      <select
                        value={settings.display.dateFormat}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          display: { ...prev.display, dateFormat: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="YYYY-MM-DD">2024-12-31</option>
                        <option value="MM/DD/YYYY">12/31/2024</option>
                        <option value="DD/MM/YYYY">31/12/2024</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        숫자 형식
                      </label>
                      <select
                        value={settings.display.numberFormat}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          display: { ...prev.display, numberFormat: e.target.value }
                        }))}
                        className="ok-input w-full"
                      >
                        <option value="ko-KR">한국 (1,234,567)</option>
                        <option value="en-US">미국 (1,234,567)</option>
                        <option value="de-DE">독일 (1.234.567)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 알림 설정 */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">이메일 알림</label>
                        <p className="text-sm text-gray-500">중요한 알림을 이메일로 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">브라우저 알림</label>
                        <p className="text-sm text-gray-500">브라우저에서 실시간 알림을 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.browser}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, browser: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">급여 알림</label>
                        <p className="text-sm text-gray-500">급여 계산 완료 시 알림을 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.payrollReminders}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, payrollReminders: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">비용 경고</label>
                        <p className="text-sm text-gray-500">인건비 예산 초과 시 경고를 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.costAlerts}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, costAlerts: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 보안 설정 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">보안 설정</h3>
                  
                  <div className="ok-card bg-yellow-50 border-yellow-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">보안 기능 준비 중</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          사용자 인증, 권한 관리, 데이터 암호화 등의 보안 기능이 준비 중입니다.
                          향후 업데이트를 통해 제공될 예정입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">2단계 인증</h4>
                        <p className="text-sm text-gray-600">SMS 또는 이메일을 통한 추가 보안</p>
                      </div>
                      <span className="text-sm text-gray-500">준비 중</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">세션 관리</h4>
                        <p className="text-sm text-gray-600">자동 로그아웃 및 세션 제한</p>
                      </div>
                      <span className="text-sm text-gray-500">준비 중</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">데이터 백업</h4>
                        <p className="text-sm text-gray-600">정기적인 데이터 백업 및 복원</p>
                      </div>
                      <span className="text-sm text-gray-500">준비 중</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 저장 버튼 */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="ok-btn-primary px-6 py-2 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      설정 저장
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
