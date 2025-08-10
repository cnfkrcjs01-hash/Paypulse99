import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl font-bold">404</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않습니다</p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium text-center"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/help"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            도움말 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
