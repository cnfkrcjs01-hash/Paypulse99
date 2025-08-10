'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600 mb-6 text-sm">{error.message}</p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
