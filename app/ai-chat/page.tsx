'use client'

import OKSidebar from '@/components/OKSidebar'
import OKTopBar from '@/components/OKTopBar'
import { BarChart3, Bot, FileText, Loader, Send } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

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
  payrollData?: any[]
  feeData?: any[]
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '안녕하세요! 저는 PayPulse AI 어시스턴트예요! 💪\n\n업로드된 데이터를 기반으로 인건비 현황을 분석하고, 맞춤형 인사이트를 제공해드릴게요!\n\n어떤 정보가 궁금하신가요?',
      timestamp: new Date(),
      suggestions: [
        '우리 회사 인건비 현황 분석해줘',
        '데이터 기반 인사이트 보여줘',
        '비용 최적화 방안 제안해줘',
        '부서별/직급별 분석해줘'
      ]
    }
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    try {
      // 기존 데이터 로드
      const savedData = localStorage.getItem('paypulse_data')
      const integratedData = localStorage.getItem('integrated_paypulse_data')
      
      let allData: ChatData = {
        employees: [],
        contractors: [],
        agencies: [],
        totalCost: 0,
        totalEmployees: 0,
        payrollData: [],
        feeData: []
      }

      if (savedData) {
        const data = JSON.parse(savedData)
        allData.employees = data.employees || []
        allData.contractors = data.contractors || []
        allData.agencies = data.agencies || []
      }

      if (integratedData) {
        const data = JSON.parse(integratedData)
        allData.payrollData = data.payrollData || []
        allData.feeData = data.feeData || []
      }

      // 총 비용 계산
      const employeeCost = allData.employees.reduce((sum: number, emp: any) => {
        const cost = emp?.totalCost || 0
        return sum + (isNaN(cost) ? 0 : cost)
      }, 0)
      
      const contractorCost = allData.contractors.reduce((sum: number, cont: any) => {
        const cost = cont?.contractAmount || 0
        return sum + (isNaN(cost) ? 0 : cost)
      }, 0)
      
      const agencyCost = allData.agencies.reduce((sum: number, agency: any) => {
        const cost = agency?.monthlyCost || 0
        return sum + (isNaN(cost) ? 0 : cost)
      }, 0)

      const payrollCost = allData.payrollData.reduce((sum: number, item: any) => {
        const cost = item?.totalPayroll || 0
        return sum + (isNaN(cost) ? 0 : cost)
      }, 0)

      const feeCost = allData.feeData.reduce((sum: number, item: any) => {
        const cost = item?.totalFee || 0
        return sum + (isNaN(cost) ? 0 : cost)
      }, 0)

      allData.totalCost = employeeCost + contractorCost + agencyCost + payrollCost + feeCost
      allData.totalEmployees = allData.employees.length + allData.payrollData.length

      setChatData(allData)
    } catch (error) {
      console.error('데이터 로드 오류:', error)
      setChatData(null)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase()

    // 특정 직원 급여 상세 정보 (월별, 총액 등)
    if (message.includes('급여') || message.includes('연봉') || message.includes('월급')) {
      if (message.includes('월별') || message.includes('매달') || message.includes('상세') || message.includes('자세히')) {
        return generateEmployeeDetailedSalaryInfo(userMessage)
      }
      return generateEmployeeSalaryInfo(userMessage)
    }
    
    // 특정 직원 검색
    if (message.includes('누구') || message.includes('어디') || message.includes('찾아')) {
      return generateEmployeeSearch(userMessage)
    }

    // 직원 목록 요청
    if (message.includes('목록') || message.includes('리스트') || message.includes('전체')) {
      return generateEmployeeList()
    }

    // 부서별 분석
    if (message.includes('부서별') || message.includes('팀별')) {
      return generateDepartmentAnalysis()
    }

    // 비용 분석
    if (message.includes('비용') || message.includes('금액') || message.includes('총액')) {
      return generateCostAnalysis()
    }

    // 평균 급여
    if (message.includes('평균') || message.includes('평균급여') || message.includes('평균연봉')) {
      return generateAverageSalaryAnalysis()
    }

    // 상세 분석 요청
    if (message.includes('상세') || message.includes('자세히') || message.includes('구체적')) {
      return generateDetailedAnalysis(userMessage)
    }

    if (message.includes('현황') || message.includes('상황') || message.includes('분석')) {
      return generateCompanyOverview()
    } else if (message.includes('인사이트') || message.includes('insight')) {
      return generateDataInsights()
    } else if (message.includes('최적화') || message.includes('절약') || message.includes('줄이')) {
      return generateOptimizationSuggestions()
    } else if (message.includes('부서') || message.includes('팀') || message.includes('직급')) {
      return generateDepartmentAnalysis()
    } else if (message.includes('비교') || message.includes('대비') || message.includes('평균')) {
      return generateComparisonAnalysis()
    } else if (message.includes('트렌드') || message.includes('추이') || message.includes('변화')) {
      return generateTrendAnalysis()
    } else if (message.includes('4대보험') || message.includes('보험')) {
      return generateInsuranceInfo()
    } else if (message.includes('roi') || message.includes('투자수익')) {
      return generateROIAnalysis()
    } else if (message.includes('안녕') || message.includes('hi') || message.includes('hello')) {
      return generateGreeting()
    } else {
      return generateGeneralResponse()
    }
  }

  // 특정 직원 급여 정보 생성
  const generateEmployeeSalaryInfo = (userMessage: string): string => {
    if (!chatData) {
      return '📊 **데이터가 없습니다**\n\n먼저 데이터를 업로드해주시면 정확한 정보를 제공해드릴 수 있어요!'
    }

    // 이름 추출 (한글 이름 패턴)
    const nameMatch = userMessage.match(/[가-힣]{2,4}/)
    if (!nameMatch) {
      return '🤔 **이름을 찾을 수 없어요**\n\n"최재윤 급여" 또는 "김철수 연봉" 같은 식으로 질문해주세요!'
    }

    const searchName = nameMatch[0]
    console.log('검색할 이름:', searchName)
    console.log('급여 데이터:', chatData.payrollData)
    
    // 정직원 데이터에서 검색
    const employee = chatData.employees.find((emp: any) => 
      emp?.name?.includes(searchName) || emp?.employeeName?.includes(searchName)
    )
    
    // 급여 데이터에서 검색 (더 정확한 검색)
    const payrollEmployee = chatData.payrollData?.find((item: any) => {
      if (!item) return false
      const itemName = item.employeeName || item.name || ''
      console.log('검색 대상:', itemName, '검색어:', searchName, '일치:', itemName.includes(searchName))
      return itemName.includes(searchName)
    })

    console.log('찾은 직원:', employee)
    console.log('찾은 급여 데이터:', payrollEmployee)

    if (employee) {
      const totalCost = employee.totalCost || 0
      const baseSalary = employee.baseSalary || 0
      const allowance = employee.allowance || 0
      
      return `👤 **${searchName}님 급여 정보** 💰\n\n` +
             `💰 **총 급여**: ${totalCost.toLocaleString('ko-KR')}원\n` +
             `💵 **기본급**: ${baseSalary.toLocaleString('ko-KR')}원\n` +
             `🎁 **수당**: ${allowance.toLocaleString('ko-KR')}원\n` +
             `🏢 **부서**: ${employee.department || '정보 없음'}\n` +
             `📋 **직급**: ${employee.position || '정보 없음'}\n\n` +
             `💡 **추가 정보가 필요하시면**:\n` +
             `• "최재윤 상세정보"\n` +
             `• "최재윤 부서 정보"\n` +
             `• "최재윤 4대보험 정보"`
    }
    
    if (payrollEmployee) {
      const totalPayroll = payrollEmployee.totalPayroll || 0
      const baseSalary = payrollEmployee.baseSalary || 0
      const allowances = payrollEmployee.allowances || 0
      const department = payrollEmployee.department || '정보 없음'
      const position = payrollEmployee.position || '정보 없음'
      
      return `👤 **${searchName}님 급여 정보** 💰\n\n` +
             `💰 **총 급여**: ${totalPayroll.toLocaleString('ko-KR')}원\n` +
             `💵 **기본급**: ${baseSalary.toLocaleString('ko-KR')}원\n` +
             `🎁 **수당**: ${allowances.toLocaleString('ko-KR')}원\n` +
             `🏢 **부서**: ${department}\n` +
             `📋 **직급**: ${position}\n` +
             `📅 **급여 유형**: 급여 데이터\n\n` +
             `💡 **더 자세한 정보가 필요하시면**:\n` +
             `• "최재윤 급여 상세정보"\n` +
             `• "최재윤 상세정보"`
    }

    // 검색 결과가 없을 때 더 자세한 정보 제공
    let notFoundMessage = `❌ **${searchName}님을 찾을 수 없어요**\n\n`
    
    if (chatData.payrollData && chatData.payrollData.length > 0) {
      notFoundMessage += `📋 **등록된 급여 데이터 (${chatData.payrollData.length}건)**:\n`
      // 처음 5개 직원 이름만 표시
      const sampleNames = chatData.payrollData.slice(0, 5).map((item: any) => 
        item?.employeeName || item?.name || '이름 없음'
      )
      sampleNames.forEach((name, index) => {
        notFoundMessage += `• ${name}\n`
      })
      if (chatData.payrollData.length > 5) {
        notFoundMessage += `... 외 ${chatData.payrollData.length - 5}건\n`
      }
    }
    
    notFoundMessage += `\n💡 **도움말**:\n` +
                      `• "직원 목록 보여줘"\n` +
                      `• "우리 회사 인건비 현황 분석해줘"\n` +
                      `• 정확한 이름을 입력해주세요 (예: "최재윤", "김철수")`

    return notFoundMessage
  }

  // 특정 직원 급여 상세 정보 생성
  const generateEmployeeDetailedSalaryInfo = (userMessage: string): string => {
    if (!chatData) {
      return '📊 **데이터가 없습니다**\n\n먼저 데이터를 업로드해주세요!'
    }

    const nameMatch = userMessage.match(/[가-힣]{2,4}/)
    if (!nameMatch) {
      return '🤔 **이름을 찾을 수 없어요**\n\n"최재윤 급여 상세정보" 또는 "김철수 급여 자세히" 같은 식으로 질문해주세요!'
    }

    const searchName = nameMatch[0]
    console.log('상세 검색할 이름:', searchName)

    const employee = chatData.employees.find((emp: any) => 
      emp?.name?.includes(searchName) || emp?.employeeName?.includes(searchName)
    )

    // 급여 데이터에서 검색 (더 정확한 검색)
    const payrollEmployee = chatData.payrollData?.find((item: any) => {
      if (!item) return false
      const itemName = item.employeeName || item.name || ''
      return itemName.includes(searchName)
    })

    console.log('상세 검색 - 찾은 직원:', employee)
    console.log('상세 검색 - 찾은 급여 데이터:', payrollEmployee)

    if (!employee && !payrollEmployee) {
      return `❌ **${searchName}님을 찾을 수 없어요**\n\n` +
             `📋 **등록된 데이터**:\n` +
             `• 정직원: ${chatData.employees.length}명\n` +
             `• 급여 데이터: ${chatData.payrollData?.length || 0}건\n\n` +
             `💡 **도움말**:\n` +
             `• "직원 목록 보여줘"\n` +
             `• "우리 회사 인건비 현황 분석해줘"`
    }

    let details = `👤 **${searchName}님 급여 상세 정보** 💰\n\n`

    if (payrollEmployee) {
      const totalPayroll = payrollEmployee.totalPayroll || 0
      const baseSalary = payrollEmployee.baseSalary || 0
      const allowances = payrollEmployee.allowances || 0
      const overtimePay = payrollEmployee.overtimePay || 0
      const bonuses = payrollEmployee.bonuses || 0
      const department = payrollEmployee.department || '정보 없음'
      const position = payrollEmployee.position || '정보 없음'
      const month = payrollEmployee.month || '정보 없음'
      const year = payrollEmployee.year || '정보 없음'

      details += `💰 **총 급여**: ${totalPayroll.toLocaleString('ko-KR')}원\n`
      details += `💵 **기본급**: ${baseSalary.toLocaleString('ko-KR')}원\n`
      details += `🎁 **수당**: ${allowances.toLocaleString('ko-KR')}원\n`
      details += `⏰ **초과근무수당**: ${overtimePay.toLocaleString('ko-KR')}원\n`
      details += `🎉 **상여금**: ${bonuses.toLocaleString('ko-KR')}원\n`
      details += `🏢 **부서**: ${department}\n`
      details += `📋 **직급**: ${position}\n`
      details += `📅 **급여 기간**: ${year}년 ${month}월\n\n`

      // 월별 지급 내역이 있는 경우 추가 (현재는 단일 급여 데이터)
      details += `**급여 구성**:\n`
      details += `• 기본급: ${((baseSalary / totalPayroll) * 100).toFixed(1)}%\n`
      details += `• 수당: ${((allowances / totalPayroll) * 100).toFixed(1)}%\n`
      details += `• 초과근무수당: ${((overtimePay / totalPayroll) * 100).toFixed(1)}%\n`
      details += `• 상여금: ${((bonuses / totalPayroll) * 100).toFixed(1)}%\n\n`
    }

    if (employee) {
      details += `**정직원 정보**:\n`
      details += `• 부서: ${employee.department || '정보 없음'}\n`
      details += `• 직급: ${employee.position || '정보 없음'}\n`
      details += `• 총 비용: ${(employee.totalCost || 0).toLocaleString('ko-KR')}원\n`
    }

    details += `💡 **더 자세한 정보가 필요하시면**:\n` +
               `• "최재윤 상세정보"\n` +
               `• "최재윤 부서 정보"\n` +
               `• "최재윤 4대보험 정보"`

    return details
  }

  // 직원 검색 기능
  const generateEmployeeSearch = (userMessage: string): string => {
    if (!chatData) {
      return '📊 **데이터가 없습니다**\n\n먼저 데이터를 업로드해주세요!'
    }

    if (chatData.employees.length === 0 && (!chatData.payrollData || chatData.payrollData.length === 0)) {
      return '👥 **등록된 직원이 없어요**\n\n먼저 직원 데이터를 업로드해주세요!'
    }

    let result = `👥 **등록된 직원 현황** 📊\n\n`
    
    if (chatData.employees.length > 0) {
      result += `**정직원 (${chatData.employees.length}명)**:\n`
      chatData.employees.slice(0, 10).forEach((emp: any, index: number) => {
        const name = emp?.name || emp?.employeeName || '이름 없음'
        const dept = emp?.department || '부서 없음'
        result += `${index + 1}. ${name} (${dept})\n`
      })
      if (chatData.employees.length > 10) {
        result += `... 외 ${chatData.employees.length - 10}명\n`
      }
    }
    
    if (chatData.payrollData && chatData.payrollData.length > 0) {
      result += `\n**급여 데이터 (${chatData.payrollData.length}건)**:\n`
      chatData.payrollData.slice(0, 5).forEach((item: any, index: number) => {
        const name = item?.name || item?.employeeName || '이름 없음'
        result += `${index + 1}. ${name}\n`
      })
      if (chatData.payrollData.length > 5) {
        result += `... 외 ${chatData.payrollData.length - 5}건\n`
      }
    }

    result += `\n💡 **특정 직원 정보가 필요하시면**:\n` +
              `• "최재윤 급여"\n` +
              `• "김철수 정보"\n` +
              `• "부서별 직원 현황"`

    return result
  }

  const generateEmployeeList = (): string => {
    if (!chatData) {
      return '📊 **데이터가 없습니다**\n\n먼저 데이터를 업로드해주세요!'
    }

    let list = `👥 **등록된 직원 목록** 📊\n\n`

    if (chatData.employees.length > 0) {
      list += `**정직원 (${chatData.employees.length}명)**:\n`
      chatData.employees.forEach((emp: any, index: number) => {
        const name = emp?.name || emp?.employeeName || '이름 없음'
        const dept = emp?.department || '부서 없음'
        list += `${index + 1}. ${name} (${dept})\n`
      })
    }

    if (chatData.payrollData && chatData.payrollData.length > 0) {
      list += `\n**급여 데이터 (${chatData.payrollData.length}건)**:\n`
      chatData.payrollData.forEach((item: any, index: number) => {
        const name = item?.name || item?.employeeName || '이름 없음'
        list += `${index + 1}. ${name}\n`
      })
    }

    if (chatData.contractors.length > 0) {
      list += `\n**계약직 (${chatData.contractors.length}명)**:\n`
      chatData.contractors.forEach((cont: any, index: number) => {
        const name = cont?.name || '이름 없음'
        list += `${index + 1}. ${name}\n`
      })
    }

    if (chatData.agencies.length > 0) {
      list += `\n**에이전시 (${chatData.agencies.length}개)**:\n`
      chatData.agencies.forEach((agency: any, index: number) => {
        const name = agency?.name || '이름 없음'
        list += `${index + 1}. ${name}\n`
      })
    }

    return list
  }

  const generateCostAnalysis = (): string => {
    if (!chatData) {
      return '📊 **비용 분석**\n\n데이터가 없어서 비용 분석을 할 수 없어요.'
    }

    let analysis = `📊 **총 인건비 분석** 💰\n\n`

    const totalCost = chatData.totalCost
    const totalEmployees = chatData.totalEmployees
    const avgCostPerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0

    analysis += `💰 **총 인건비**: ${totalCost.toLocaleString('ko-KR')}원\n`
    analysis += `👥 **총 인원**: ${totalEmployees}명\n`
    analysis += `📈 **인당 평균비용**: ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n\n`

    // 데이터 유형별 분석
    const employeeCost = chatData.employees.reduce((sum: number, emp: any) => sum + (emp?.totalCost || 0), 0)
    const contractorCost = chatData.contractors.reduce((sum: number, cont: any) => sum + (cont?.contractAmount || 0), 0)
    const agencyCost = chatData.agencies.reduce((sum: number, agency: any) => sum + (agency?.monthlyCost || 0), 0)
    const payrollCost = chatData.payrollData.reduce((sum: number, item: any) => sum + (item?.totalPayroll || 0), 0)
    const feeCost = chatData.feeData.reduce((sum: number, item: any) => sum + (item?.totalFee || 0), 0)

    analysis += `**비용 구조**:\n`
    analysis += `• 정직원 비용: ${employeeCost.toLocaleString('ko-KR')}원\n`
    analysis += `• 계약직 비용: ${contractorCost.toLocaleString('ko-KR')}원\n`
    analysis += `• 에이전시 비용: ${agencyCost.toLocaleString('ko-KR')}원\n`
    analysis += `• 급여 데이터 비용: ${payrollCost.toLocaleString('ko-KR')}원\n`
    analysis += `• 수수료 데이터 비용: ${feeCost.toLocaleString('ko-KR')}원\n\n`

    // 비용 효율성 분석
    if (totalCost > 0 && chatData.totalEmployees > 0) {
      const avgCostPerEmployee = totalCost / chatData.totalEmployees
      if (avgCostPerEmployee > 5000000) {
        analysis += `⚠️ **높은 인당 비용**: 월 평균 ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
        analysis += `   → 비용 최적화 검토 필요\n`
      } else if (avgCostPerEmployee < 3000000) {
        analysis += `✅ **적정 인당 비용**: 월 평균 ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
        analysis += `   → 효율적인 비용 구조\n`
      }
    }

    return analysis
  }

  const generateAverageSalaryAnalysis = (): string => {
    if (!chatData) {
      return '📊 **평균 급여 분석**\n\n데이터가 없어서 평균 급여를 계산할 수 없어요.'
    }

    let analysis = `📊 **평균 급여 분석** 💰\n\n`

    const totalEmployees = chatData.totalEmployees
    const totalCost = chatData.totalCost

    if (totalEmployees === 0) {
      analysis += `📊 **평균 급여**: 0원\n`
      analysis += `👥 **총 인원**: ${totalEmployees}명\n`
      analysis += `💰 **총 인건비**: ${totalCost.toLocaleString('ko-KR')}원\n`
      analysis += `🔍 **평균 급여 계산 불가**\n`
      analysis += `   → 직원 데이터가 없어 평균을 계산할 수 없어요.`
    } else {
      const avgSalary = totalCost / totalEmployees
      analysis += `📊 **평균 급여**: ${Math.round(avgSalary).toLocaleString('ko-KR')}원\n`
      analysis += `👥 **총 인원**: ${totalEmployees}명\n`
      analysis += `💰 **총 인건비**: ${totalCost.toLocaleString('ko-KR')}원\n`
      analysis += `🔍 **평균 급여 계산 가능**`
    }

    return analysis
  }

  const generateCompanyOverview = (): string => {
    if (!chatData || (chatData.totalCost === 0 && chatData.totalEmployees === 0)) {
      return '📊 **데이터가 없습니다**\n\n먼저 데이터를 업로드해주시면 정확한 분석을 도와드릴 수 있어요!\n\n📁 **업로드 메뉴**에서 급여 데이터나 인사 데이터를 등록해보세요.'
    }

    const totalCost = chatData.totalCost
    const totalEmployees = chatData.totalEmployees
    const avgCostPerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0

    let overview = `🏢 **회사 인건비 현황 분석** 📊\n\n`
    overview += `💰 **총 인건비**: ${totalCost.toLocaleString('ko-KR')}원\n`
    overview += `👥 **총 인원**: ${totalEmployees}명\n`
    overview += `📈 **인당 평균비용**: ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n\n`

    // 데이터 유형별 분석
    if (chatData.employees.length > 0) {
      overview += `**정직원**: ${chatData.employees.length}명\n`
    }
    if (chatData.contractors.length > 0) {
      overview += `**계약직**: ${chatData.contractors.length}명\n`
    }
    if (chatData.agencies.length > 0) {
      overview += `**에이전시**: ${chatData.agencies.length}개\n`
    }
    if (chatData.payrollData.length > 0) {
      overview += `**급여 데이터**: ${chatData.payrollData.length}건\n`
    }
    if (chatData.feeData.length > 0) {
      overview += `**수수료 데이터**: ${chatData.feeData.length}건\n`
    }

    return overview
  }

  const generateDataInsights = (): string => {
    if (!chatData || chatData.totalCost === 0) {
      return '🔍 **데이터 인사이트**\n\n데이터가 없어서 인사이트를 제공할 수 없어요.\n\n먼저 데이터를 업로드해주세요!'
    }

    let insights = `🔍 **데이터 기반 인사이트** 💡\n\n`

    // 비용 구조 분석
    const employeeCost = chatData.employees.reduce((sum: number, emp: any) => sum + (emp?.totalCost || 0), 0)
    const contractorCost = chatData.contractors.reduce((sum: number, cont: any) => sum + (cont?.contractAmount || 0), 0)
    const agencyCost = chatData.agencies.reduce((sum: number, agency: any) => sum + (agency?.monthlyCost || 0), 0)
    const payrollCost = chatData.payrollData.reduce((sum: number, item: any) => sum + (item?.totalPayroll || 0), 0)
    const feeCost = chatData.feeData.reduce((sum: number, item: any) => sum + (item?.totalFee || 0), 0)

    const totalCost = chatData.totalCost

    if (employeeCost > 0) {
      const employeeRatio = (employeeCost / totalCost * 100).toFixed(1)
      insights += `👥 **정직원 비용 비율**: ${employeeRatio}%\n`
    }
    if (contractorCost > 0) {
      const contractorRatio = (contractorCost / totalCost * 100).toFixed(1)
      insights += `📋 **계약직 비용 비율**: ${contractorRatio}%\n`
    }
    if (agencyCost > 0) {
      const agencyRatio = (agencyCost / totalCost * 100).toFixed(1)
      insights += `🏢 **에이전시 비용 비율**: ${agencyRatio}%\n`
    }

    // 비용 효율성 분석
    if (totalCost > 0 && chatData.totalEmployees > 0) {
      const avgCostPerEmployee = totalCost / chatData.totalEmployees
      if (avgCostPerEmployee > 5000000) {
        insights += `⚠️ **높은 인당 비용**: 월 평균 ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
        insights += `   → 비용 최적화 검토 필요\n`
      } else if (avgCostPerEmployee < 3000000) {
        insights += `✅ **적정 인당 비용**: 월 평균 ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
        insights += `   → 효율적인 비용 구조\n`
      }
    }

    return insights
  }

  const generateOptimizationSuggestions = (): string => {
    if (!chatData || chatData.totalCost === 0) {
      return '💡 **비용 최적화 제안**\n\n데이터를 업로드하면 맞춤형 최적화 방안을 제안해드릴게요!'
    }

    let suggestions = `💡 **맞춤형 비용 최적화 제안** 🎯\n\n`

    const totalCost = chatData.totalCost
    const totalEmployees = chatData.totalEmployees
    const avgCostPerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0

    // 비용 구조별 최적화 제안
    if (chatData.contractors.length > 0) {
      suggestions += `📋 **계약직 최적화**:\n`
      suggestions += `   • 계약직 비용이 ${chatData.contractors.length}건으로 관리되고 있어요\n`
      suggestions += `   • 정직원 전환 검토로 장기적 비용 절감 가능\n\n`
    }

    if (chatData.agencies.length > 0) {
      suggestions += `🏢 **에이전시 비용 관리**:\n`
      suggestions += `   • 에이전시 ${chatData.agencies.length}개사와 계약 중\n`
      suggestions += `   • 단가 협상 및 통합 검토로 비용 절감\n\n`
    }

    if (avgCostPerEmployee > 5000000) {
      suggestions += `💰 **고비용 구조 개선**:\n`
      suggestions += `   • 현재 인당 평균 ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
      suggestions += `   • 성과급 체계 도입으로 기본급 조정 검토\n`
      suggestions += `   • 복리후생비 최적화\n\n`
    }

    suggestions += `📊 **일반적 최적화 방안**:\n`
    suggestions += `• 4대보험 최적화 (기본급 vs 복리후생 비율 조정)\n`
    suggestions += `• 효율적인 인력 배치 및 업무 프로세스 개선\n`
    suggestions += `• 교육 투자로 생산성 향상\n`
    suggestions += `• 재택근무 등 부대비용 절감 방안 검토`

    return suggestions
  }

  const generateDepartmentAnalysis = (): string => {
    if (!chatData || (chatData.employees.length === 0 && chatData.payrollData.length === 0)) {
      return '📊 **부서별 분석**\n\n부서 데이터가 없어서 분석할 수 없어요.\n\n직원 데이터를 업로드해주세요!'
    }

    let analysis = `📊 **부서별 인건비 분석** 🏢\n\n`

    // 부서별 데이터 수집
    const deptData: { [key: string]: { count: number; cost: number } } = {}

    // employees 데이터에서 부서 정보 수집
    chatData.employees.forEach((emp: any) => {
      if (emp.department) {
        if (!deptData[emp.department]) {
          deptData[emp.department] = { count: 0, cost: 0 }
        }
        deptData[emp.department].count += 1
        deptData[emp.department].cost += emp.totalCost || 0
      }
    })

    // payrollData에서 부서 정보 수집 (부서 정보가 있다면)
    chatData.payrollData.forEach((item: any) => {
      if (item.department) {
        if (!deptData[item.department]) {
          deptData[item.department] = { count: 0, cost: 0 }
        }
        deptData[item.department].count += 1
        deptData[item.department].cost += item.totalPayroll || 0
      }
    })

    if (Object.keys(deptData).length === 0) {
      return '📊 **부서별 분석**\n\n부서 정보가 포함된 데이터가 없어요.\n\n직원명과 함께 부서 정보도 업로드해주세요!'
    }

    // 부서별 분석 결과
    Object.entries(deptData).forEach(([dept, data]) => {
      const avgCost = Math.round(data.cost / data.count)
      analysis += `**${dept}**:\n`
      analysis += `   👥 인원: ${data.count}명\n`
      analysis += `   💰 총 비용: ${data.cost.toLocaleString('ko-KR')}원\n`
      analysis += `   📊 평균: ${avgCost.toLocaleString('ko-KR')}원/명\n\n`
    })

    // 인사이트 추가
    const costs = Object.values(deptData).map(d => d.cost)
    const maxCost = Math.max(...costs)
    const minCost = Math.min(...costs)
    const costGap = maxCost - minCost

    if (costGap > 0) {
      analysis += `💡 **인사이트**:\n`
      analysis += `• 부서간 비용 편차: ${costGap.toLocaleString('ko-KR')}원\n`
      analysis += `• 비용 표준화를 통한 효율성 향상 가능\n`
      analysis += `• 부서별 적정 인원 배치 검토 필요`
    }

    return analysis
  }

  const generateComparisonAnalysis = (): string => {
    if (!chatData || chatData.totalCost === 0) {
      return '📊 **비교 분석**\n\n데이터가 없어서 비교 분석을 할 수 없어요.'
    }

    let comparison = `📊 **비교 분석 결과** ⚖️\n\n`

    const totalCost = chatData.totalCost
    const totalEmployees = chatData.totalEmployees
    const avgCostPerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0

    // 업계 평균과 비교 (예시 데이터)
    const industryAverages = {
      'IT업계': 4500000,
      '제조업': 3800000,
      '서비스업': 3200000,
      '금융업': 5500000
    }

    comparison += `**현재 상황**:\n`
    comparison += `• 인당 평균 비용: ${Math.round(avgCostPerEmployee).toLocaleString('ko-KR')}원\n`
    comparison += `• 총 인건비: ${totalCost.toLocaleString('ko-KR')}원\n\n`

    comparison += `**업계별 평균 대비**:\n`
    Object.entries(industryAverages).forEach(([industry, avg]) => {
      const ratio = ((avgCostPerEmployee / avg) * 100).toFixed(1)
      comparison += `• ${industry}: ${ratio}% ${avgCostPerEmployee > avg ? '⬆️' : '⬇️'}\n`
    })

    return comparison
  }

  const generateTrendAnalysis = (): string => {
    return `📈 **트렌드 분석**\n\n현재는 단일 시점 데이터만 있어서 트렌드를 분석할 수 없어요.\n\n\n💡 **트렌드 분석을 위해서는**:\n• 월별/분기별 데이터 업로드\n• 시계열 데이터 수집\n• 비용 변화 추이 기록\n\n이런 데이터가 필요해요!`
  }

  const generateInsuranceInfo = (): string => {
    return `🛡️ **4대보험 정보**\n\n**2024년 4대보험료율**:\n• 국민연금: 4.5%\n• 건강보험: 3.545% (장기요양보험 포함)\n• 고용보험: 0.9%\n• 산재보험: 0.7%\n\n💰 **월급 300만원 기준 개인 부담액**: 약 267,750원\n\n🧮 **정확한 계산**: 계산기 메뉴를 이용해보세요!`
  }

  const generateROIAnalysis = (): string => {
    if (!chatData || chatData.totalCost === 0) {
      return '📊 **HC ROI 분석**\n\n데이터가 없어서 ROI를 계산할 수 없어요.\n\n매출 데이터와 함께 업로드해주세요!'
    }

    return `📊 **HC ROI (인적자원 투자수익률) 분석**\n\n**ROI 계산 공식**:\n(매출 - 인건비) ÷ 인건비 × 100\n\n**좋은 HC ROI 기준**:\n• 제조업: 150-200%\n• 서비스업: 100-150%\n• IT업: 200-300%\n\n💡 **ROI 향상 방법**:\n1. 직원 역량 강화 교육\n2. 업무 프로세스 개선\n3. 적절한 성과급 시스템\n\n현재 인건비: ${chatData.totalCost.toLocaleString('ko-KR')}원\n매출 데이터가 있으면 정확한 ROI를 계산해드릴 수 있어요!`
  }

  const generateGreeting = (): string => {
    return `안녕하세요! 반가워요! 😊\n\n저는 PayPulse의 AI 어시스턴트예요. 업로드된 데이터를 기반으로 맞춤형 인사이트를 제공해드릴게요!\n\n💡 **주요 기능**:\n• 📊 데이터 기반 현황 분석\n• 🔍 맞춤형 인사이트 제공\n• 💰 비용 최적화 제안\n• 📈 부서별/직급별 분석\n• ⚖️ 업계 평균 비교\n\n어떤 정보가 궁금하신가요?`
  }

  const generateGeneralResponse = (): string => {
    return `🤔 **질문을 이해했어요!**\n\n더 구체적으로 말씀해주시면 정확한 답변을 드릴 수 있을 것 같아요.\n\n💡 **추천 질문**:\n• "우리 회사 인건비 현황 분석해줘"\n• "데이터 기반 인사이트 보여줘"\n• "비용 최적화 방안 제안해줘"\n• "부서별 분석해줘"\n• "업계 평균과 비교해줘"\n\n이런 식으로 질문해주세요! 😊`
  }

  const generateDetailedAnalysis = (userMessage: string): string => {
    if (!chatData) {
      return '📊 **상세 분석**\n\n데이터가 없어서 상세 분석을 할 수 없어요.\n\n먼저 데이터를 업로드해주세요!'
    }

    let analysis = `📊 **상세 분석** 📈\n\n`

    const nameMatch = userMessage.match(/[가-힣]{2,4}/)
    if (!nameMatch) {
      return '🤔 **이름을 찾을 수 없어요**\n\n"최재윤 상세정보" 또는 "김철수 상세정보" 같은 식으로 질문해주세요!'
    }

    const searchName = nameMatch[0]

    const employee = chatData.employees.find((emp: any) => 
      emp?.name?.includes(searchName) || emp?.employeeName?.includes(searchName)
    )

    if (!employee) {
      return `❌ **${searchName}님의 상세 정보를 찾을 수 없어요**\n\n📋 **등록된 직원 목록**:\n• 정직원: ${chatData.employees.length}명\n• 급여 데이터: ${chatData.payrollData?.length || 0}건\n\n💡 **도움말**:\n• "직원 목록 보여줘"\n• "우리 회사 인건비 현황 분석해줘"`
    }

    const payrollEmployee = chatData.payrollData?.find((item: any) => 
      item?.name?.includes(searchName) || item?.employeeName?.includes(searchName)
    )

    if (!payrollEmployee) {
      return `❌ **${searchName}님의 급여 데이터 상세 정보를 찾을 수 없어요**\n\n📋 **등록된 급여 데이터**:\n• 정직원: ${chatData.payrollData?.length || 0}건\n• 계약직: ${chatData.contractors.length}명\n\n💡 **도움말**:\n• "직원 목록 보여줘"\n• "우리 회사 인건비 현황 분석해줘"`
    }

    analysis += `👤 **${searchName}님 상세 정보** 📊\n\n`
    analysis += `🏢 **부서**: ${employee.department || '정보 없음'}\n`
    analysis += `📋 **직급**: ${employee.position || '정보 없음'}\n`
    analysis += `💰 **총 급여**: ${(employee.totalCost || 0).toLocaleString('ko-KR')}원\n`
    analysis += `💰 **총 지급액**: ${(payrollEmployee.totalPayroll || 0).toLocaleString('ko-KR')}원\n`
    analysis += `📅 **입사일**: ${employee.hireDate || '정보 없음'}\n`
    analysis += `📅 **퇴사일**: ${employee.endDate || '정보 없음'}\n`
    analysis += `🎁 **수당**: ${(employee.allowance || 0).toLocaleString('ko-KR')}원\n`
    analysis += `💵 **기본급**: ${(employee.baseSalary || 0).toLocaleString('ko-KR')}원\n\n`

    // 월별 지급 내역이 있는 경우 추가
    if (payrollEmployee.monthlyPayments && payrollEmployee.monthlyPayments.length > 0) {
      analysis += `**월별 지급 내역**:\n`
      payrollEmployee.monthlyPayments.forEach((payment: any, index: number) => {
        analysis += `• ${payment.month || (index + 1)}월: ${(payment.amount || 0).toLocaleString('ko-KR')}원\n`
      })
    }

    analysis += `\n💡 **더 자세한 정보가 필요하시면**:\n` +
               `• "최재윤 급여 상세정보"\n` +
               `• "최재윤 부서 정보"\n` +
               `• "최재윤 4대보험 정보"`

    return analysis
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
      // AI 응답 생성
      const aiResponse = await generateAIResponse(text)

      // 응답 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      // 컨텍스트에 따른 제안 생성
      const suggestions = generateContextualSuggestions(text, aiResponse)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions
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

  const generateContextualSuggestions = (userMessage: string, aiResponse: string): string[] => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('현황') || message.includes('분석')) {
      return [
        '부서별 비용 분석해줘',
        '데이터 기반 인사이트 보여줘',
        '비용 최적화 방안 제안해줘'
      ]
    } else if (message.includes('인사이트') || message.includes('insight')) {
      return [
        '부서별 분석해줘',
        '업계 평균과 비교해줘',
        '비용 최적화 방안 제안해줘'
      ]
    } else if (message.includes('최적화') || message.includes('절약')) {
      return [
        '4대보험 최적화 방법',
        '부서 효율성 분석',
        '수당 관리 꿀팁'
      ]
    } else if (message.includes('부서') || message.includes('팀')) {
      return [
        '직급별 분석해줘',
        '비용 효율성 분석해줘',
        '인력 배치 최적화 제안해줘'
      ]
    } else if (message.includes('비교') || message.includes('대비')) {
      return [
        '부서별 비교 분석해줘',
        '업계 평균과 비교해줘',
        '비용 구조 분석해줘'
      ]
    } else {
      return [
        '우리 회사 인건비 현황 분석해줘',
        '데이터 기반 인사이트 보여줘',
        '비용 최적화 방안 제안해줘'
      ]
    }
  }

  const handleRefreshData = () => {
    loadAllData()
    const refreshMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: '🔄 **데이터를 새로고침했습니다!**\n\n최신 업로드된 데이터를 기반으로 분석을 제공해드릴게요.\n\n어떤 정보가 궁금하신가요?',
      timestamp: new Date(),
      suggestions: [
        '우리 회사 인건비 현황 분석해줘',
        '데이터 기반 인사이트 보여줘',
        '부서별/직급별 분석해줘'
      ]
    }
    setMessages(prev => [...prev, refreshMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="page-background">
      <OKSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <OKTopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI 인사이트</h1>
                <p className="text-gray-600">업로드된 데이터 기반 맞춤형 분석</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>데이터 새로고침</span>
              </button>
              
              <Link
                href="/upload"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>데이터 업로드</span>
              </Link>
            </div>
          </div>

          {/* 데이터 상태 표시 */}
          {chatData && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">데이터 연결됨</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">총 인원: {chatData.totalEmployees}명</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">총 비용: {chatData.totalCost.toLocaleString('ko-KR')}원</span>
                </div>
                <button
                  onClick={handleRefreshData}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  새로고침
                </button>
              </div>
            </div>
          )}

          {/* 채팅 영역 */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* 제안 버튼들 */}
                    {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left p-2 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-gray-600">AI가 분석 중입니다...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="인건비 관련 질문을 입력하세요..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>전송</span>
                </button>
              </div>
              
              {/* 빠른 질문 제안 */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendMessage('우리 회사 인건비 현황 분석해줘')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  현황 분석
                </button>
                <button
                  onClick={() => handleSendMessage('데이터 기반 인사이트 보여줘')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  인사이트
                </button>
                <button
                  onClick={() => handleSendMessage('비용 최적화 방안 제안해줘')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  최적화 방안
                </button>
                <button
                  onClick={() => handleSendMessage('부서별/직급별 분석해줘')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  부서별 분석
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



