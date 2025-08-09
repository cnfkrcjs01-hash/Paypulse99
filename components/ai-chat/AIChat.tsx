'use client'

import { useState, useRef, useEffect } from 'react'
import type React from 'react'
import { Send, Bot, User, Loader, Lightbulb, TrendingUp, Calculator, FileText } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatData {
  employees: any[]
  contractors: any[]
  agencies: any[]
  totalCost: number
  totalEmployees: number
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '안녕하세요! 저는 PayPulse AI 어시스턴트예요! 💪\n\n인건비와 관련된 모든 궁금한 점을 편하게 물어보세요. 데이터 분석부터 절약 팁까지, 친구처럼 도와드릴게요!',
      timestamp: new Date(),
      suggestions: [
        '우리 회사 인건비 현황이 어때?',
        '4대보험료 계산해줘',
        '인건비 절약 방법 알려줘',
        '부서별 비용 분석해줘'
      ]
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedData = localStorage.getItem('paypulse_data')
    if (savedData) {
      const data = JSON.parse(savedData)
      const totalCost = data.employees?.reduce((sum: number, emp: any) => sum + emp.totalCost, 0) || 0
      const contractorCost = data.contractors?.reduce((sum: number, cont: any) => sum + cont.contractAmount, 0) || 0
      const agencyCost = data.agencies?.reduce((sum: number, agency: any) => sum + agency.monthlyCost, 0) || 0
      
      setChatData({
        employees: data.employees || [],
        contractors: data.contractors || [],
        agencies: data.agencies || [],
        totalCost: totalCost + contractorCost + agencyCost,
        totalEmployees: data.employees?.length || 0
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase()

    if (message.includes('현황') || message.includes('상황')) {
      return chatData ? 
        `우리 회사 인건비 현황을 분석해드릴게요! 📊\n\n` +
        `💰 **총 인건비**: ${(chatData.totalCost).toLocaleString('ko-KR')}원\n` +
        `👥 **총 인원**: ${chatData.totalEmployees}명\n` +
        `📈 **인당 평균비용**: ${chatData.totalEmployees > 0 ? Math.round(chatData.totalCost / chatData.totalEmployees).toLocaleString('ko-KR') : 0}원\n\n` +
        `직원 급여가 ${((chatData.employees.reduce((sum, emp) => sum + emp.totalCost, 0) / chatData.totalCost) * 100).toFixed(1)}%를 차지하고 있어요. 전체적으로 안정적인 구조를 보이고 있습니다! 👍` :
        '데이터를 먼저 업로드해주시면 정확한 분석을 도와드릴 수 있어요! 📁'

    } else if (message.includes('4대보험') || message.includes('보험')) {
      return `4대보험 계산이 필요하시군요! 💪\n\n` +
        `**2024년 4대보험료율**:\n` +
        `• 국민연금: 4.5%\n` +
        `• 건강보험: 3.545% (장기요양보험 포함)\n` +
        `• 고용보험: 0.9%\n` +
        `• 산재보험: 0.7%\n\n` +
        `월급 300만원 기준으로 개인 부담액은 약 **267,750원**이에요.\n` +
        `정확한 계산은 계산기 메뉴를 이용해보세요! 🧮`

    } else if (message.includes('절약') || message.includes('줄이') || message.includes('감소')) {
      return `인건비 절약 꿀팁을 알려드릴게요! 💡\n\n` +
        `**1. 효율적인 인력 배치** 🎯\n` +
        `- 업무량에 따른 적정 인력 운영\n` +
        `- 파트타임/계약직 활용으로 유연성 확보\n\n` +
        `**2. 스마트한 수당 관리** ⏰\n` +
        `- 연장근무 대신 효율성 향상 프로그램\n` +
        `- 재택근무로 부대비용 절감\n\n` +
        `**3. 4대보험 최적화** 🛡️\n` +
        `- 기본급 vs 복리후생 비율 조정\n` +
        `- 비과세 항목 활용\n\n` +
        `**4. 교육 투자로 생산성 UP** 📚\n` +
        `단기적 비용이지만 장기적으로 큰 절약효과가 있어요!`

    } else if (message.includes('부서') || message.includes('팀')) {
      if (chatData && chatData.employees.length > 0) {
        const deptAnalysis = chatData.employees.reduce((acc: any, emp: any) => {
          if (!acc[emp.department]) {
            acc[emp.department] = { count: 0, cost: 0 }
          }
          acc[emp.department].count += 1
          acc[emp.department].cost += emp.totalCost
          return acc
        }, {})

        let analysis = `부서별 인건비 분석 결과입니다! 📈\n\n`
        Object.entries(deptAnalysis).forEach(([dept, data]: [string, any]) => {
          const avgCost = Math.round((data as any).cost / (data as any).count)
          analysis += `**${dept}**: ${(data as any).count}명, 총 ${(data as any).cost.toLocaleString('ko-KR')}원\n`
          analysis += `  → 평균: ${avgCost.toLocaleString('ko-KR')}원/명\n\n`
        })

        return analysis + `💡 **인사이트**: 부서별 편차를 줄이면 더 효율적인 운영이 가능해요!`
      } else {
        return '부서별 분석을 위해서는 먼저 직원 데이터를 업로드해주세요! 📊'
      }

    } else if (message.includes('roi') || message.includes('투자수익')) {
      return `HC ROI (인적자원 투자수익률) 분석이군요! 📊\n\n` +
        `**ROI 계산 공식**:\n` +
        `(매출 - 인건비) ÷ 인건비 × 100\n\n` +
        `**좋은 HC ROI 기준**:\n` +
        `• 제조업: 150-200%\n` +
        `• 서비스업: 100-150%\n` +
        `• IT업: 200-300%\n\n` +
        `**ROI 향상 방법**:\n` +
        `1. 직원 역량 강화 교육 💪\n` +
        `2. 업무 프로세스 개선 ⚡\n` +
        `3. 적절한 성과급 시스템 🎯\n\n` +
        `현재 데이터로 정확한 ROI를 계산해드릴까요?`

    } else if (message.includes('안녕') || message.includes('hi') || message.includes('hello')) {
      return `안녕하세요! 반가워요! 😊\n\n` +
        `저는 PayPulse의 AI 어시스턴트예요. 인사담당자로서 고생이 많으시죠?\n\n` +
        `인건비 관련 어떤 것이든 편하게 물어보세요:\n` +
        `• 데이터 분석 및 인사이트\n` +
        `• 4대보험 및 각종 수당 계산\n` +
        `• 인건비 절약 방법\n` +
        `• 법규 관련 질문\n\n` +
        `함께 효율적인 인사관리를 만들어가요! 💪`

    } else {
      return `흥미로운 질문이네요! 🤔\n\n` +
        `좀 더 구체적으로 말씀해주시면 더 정확한 답변을 드릴 수 있을 것 같아요.\n\n` +
        `예를 들어:\n` +
        `• "4대보험료 계산해줘"\n` +
        `• "우리 회사 인건비 분석해줘"\n` +
        `• "연장근무수당 계산 방법 알려줘"\n\n` +
        `이런 식으로 질문해주세요! 😊`
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(text)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: text.includes('현황') ? [
          '부서별 비용 분석해줘',
          '인건비 절약 방법 알려줘',
          'HC ROI 계산해줘'
        ] : text.includes('절약') ? [
          '4대보험 최적화 방법',
          '부서 효율성 분석',
          '수당 관리 꿀팁'
        ] : undefined
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '죄송해요, 일시적인 오류가 발생했어요. 다시 한번 시도해주세요! 😅',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="card h-[600px] flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="p-2 bg-blue-100 rounded-full">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">AI 인사이트</h2>
          <p className="text-sm text-gray-600">친구같은 AI와 대화하며 인건비를 분석해보세요</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">온라인</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {message.type === 'ai' && message.suggestions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gray-200 text-gray-600">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">생각 중...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="인건비 관련 질문을 편하게 해주세요..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { icon: <TrendingUp className="w-4 h-4" />, text: '현황 분석', query: '우리 회사 인건비 현황 분석해줘' },
            { icon: <Calculator className="w-4 h-4" />, text: '4대보험 계산', query: '4대보험료 계산해줘' },
            { icon: <Lightbulb className="w-4 h-4" />, text: '절약 팁', query: '인건비 절약 방법 알려줘' },
            { icon: <FileText className="w-4 h-4" />, text: '부서별 분석', query: '부서별 인건비 분석해줘' },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(item.query)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg transition-colors"
              disabled={isLoading}
            >
              {item.icon}
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


