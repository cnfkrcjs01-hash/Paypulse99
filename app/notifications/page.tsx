'use client'

import { formatDate, formatTime, storage } from '@/lib/utils'
import {
    AlertTriangle,
    Bell,
    BellOff,
    Calendar,
    CheckCircle,
    Edit3,
    Info,
    Plus,
    Search,
    Settings,
    Trash2,
    XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationRule {
  id: string
  name: string
  enabled: boolean
  category: string
  conditions: string[]
  actions: string[]
}

const notificationCategories = [
  '급여', '4대보험', '수당', '인사', '예산', '시스템', '보고서', '기타'
]

const priorityLevels = ['low', 'medium', 'high']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [showRead, setShowRead] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showRules, setShowRules] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)

  useEffect(() => {
    loadNotifications()
    loadNotificationRules()
    generateSampleNotifications()
  }, [])

  const loadNotifications = () => {
    const saved = storage.get('notifications') || []
    setNotifications(saved)
  }

  const loadNotificationRules = () => {
    const saved = storage.get('notificationRules') || []
    if (saved.length === 0) {
      const defaultRules = generateDefaultRules()
      storage.set('notificationRules', defaultRules)
      setNotificationRules(defaultRules)
    } else {
      setNotificationRules(saved)
    }
  }

  const generateDefaultRules = (): NotificationRule[] => [
    {
      id: 'rule-1',
      name: '급여 초과 알림',
      enabled: true,
      category: '급여',
      conditions: ['월 급여 총액이 예산을 초과할 때'],
      actions: ['이메일 알림', '대시보드 알림']
    },
    {
      id: 'rule-2',
      name: '4대보험 납부 알림',
      enabled: true,
      category: '4대보험',
      conditions: ['4대보험 납부일 3일 전'],
      actions: ['이메일 알림', 'SMS 알림']
    },
    {
      id: 'rule-3',
      name: '인사 변동 알림',
      enabled: true,
      category: '인사',
      conditions: ['신규 입사', '퇴사', '부서 이동'],
      actions: ['대시보드 알림', '팀 리더 알림']
    },
    {
      id: 'rule-4',
      name: '예산 경고 알림',
      enabled: true,
      category: '예산',
      conditions: ['월 예산 사용률 80% 이상'],
      actions: ['대시보드 알림', '관리자 알림']
    }
  ]

  const generateSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: '급여 예산 초과 경고',
        message: '이번 달 급여 총액이 예산을 5% 초과했습니다. 검토가 필요합니다.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
        read: false,
        category: '급여',
        priority: 'high'
      },
      {
        id: '2',
        type: 'info',
        title: '4대보험 납부 알림',
        message: '4대보험 납부일이 3일 후입니다. 준비를 확인해주세요.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
        read: false,
        category: '4대보험',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'success',
        title: '보고서 생성 완료',
        message: '월간 인건비 보고서가 성공적으로 생성되었습니다.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
        read: true,
        category: '보고서',
        priority: 'low'
      },
      {
        id: '4',
        type: 'error',
        title: '데이터 업로드 실패',
        message: '급여 데이터 업로드 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8시간 전
        read: false,
        category: '시스템',
        priority: 'high'
      },
      {
        id: '5',
        type: 'info',
        title: '신규 직원 등록',
        message: '개발팀에 새로운 직원이 등록되었습니다.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12시간 전
        read: true,
        category: '인사',
        priority: 'low'
      }
    ]

    storage.set('notifications', sampleNotifications)
    setNotifications(sampleNotifications)
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    storage.set('notifications', updatedNotifications)
    setNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    storage.set('notifications', updatedNotifications)
    setNotifications(updatedNotifications)
  }

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    storage.set('notifications', updatedNotifications)
    setNotifications(updatedNotifications)
  }

  const clearAllNotifications = () => {
    storage.set('notifications', [])
    setNotifications([])
  }

  const toggleRule = (ruleId: string) => {
    const updatedRules = notificationRules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    )
    storage.set('notificationRules', updatedRules)
    setNotificationRules(updatedRules)
  }

  const deleteRule = (ruleId: string) => {
    const updatedRules = notificationRules.filter(rule => rule.id !== ruleId)
    storage.set('notificationRules', updatedRules)
    setNotificationRules(updatedRules)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    const matchesCategory = selectedCategory === 'all' || notif.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || notif.priority === selectedPriority
    const matchesRead = showRead || !notif.read
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesPriority && matchesRead && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">알림 관리</h1>
              <p className="text-gray-600">시스템 알림 및 경고를 관리하고 설정할 수 있습니다.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRules(!showRules)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                {showRules ? '알림 보기' : '규칙 설정'}
              </button>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                모두 읽음 처리
              </button>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 알림</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">읽지 않은 알림</p>
                  <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
                <BellOff className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">활성 규칙</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notificationRules.filter(r => r.enabled).length}
                  </p>
                </div>
                <Settings className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">오늘 생성</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {notifications.filter(n => {
                      const today = new Date()
                      const notifDate = new Date(n.timestamp)
                      return notifDate.toDateString() === today.toDateString()
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {showRules ? (
          /* 알림 규칙 설정 */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">알림 규칙 설정</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  새 규칙 추가
                </button>
              </div>

              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            rule.enabled
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-gray-100'
                          }`}
                        >
                          {rule.enabled && <CheckCircle className="w-4 h-4" />}
                        </button>
                        <h3 className="font-medium text-gray-900">{rule.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {rule.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingRule(rule)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="ml-9 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">조건:</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.map((condition, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">동작:</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.actions.map((action, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 알림 목록 */
          <div className="space-y-6">
            {/* 필터 및 검색 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="알림 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">전체 카테고리</option>
                    {notificationCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">전체 우선순위</option>
                    {priorityLevels.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === 'high' ? '높음' : priority === 'medium' ? '보통' : '낮음'}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showRead}
                      onChange={(e) => setShowRead(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">읽은 알림 표시</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    알림 목록 ({filteredNotifications.length})
                  </h2>
                  <button
                    onClick={clearAllNotifications}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    모두 삭제
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-lg font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority === 'high' ? '높음' : 
                                   notification.priority === 'medium' ? '보통' : '낮음'}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {notification.category}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{notification.message}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{formatDate(notification.timestamp)}</span>
                                <span>{formatTime(notification.timestamp)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                >
                                  읽음 처리
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">표시할 알림이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
