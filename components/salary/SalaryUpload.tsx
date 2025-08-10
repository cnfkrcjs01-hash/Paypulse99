'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { SalaryData } from '@/types/payroll'

interface SalaryUploadProps {
  onUpload: (data: SalaryData[]) => void
  onClose: () => void
}

export default function SalaryUpload({ onUpload, onClose }: SalaryUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]
      return validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
    })

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return

    setUploadStatus('uploading')
    setUploadMessage('파일을 처리하는 중...')

    try {
      // 실제로는 파일을 서버에 업로드하고 처리하는 로직이 들어갑니다
      // 여기서는 샘플 데이터를 생성합니다
      await new Promise(resolve => setTimeout(resolve, 2000))

      const sampleData: SalaryData[] = uploadedFiles.flatMap((file, fileIndex) => {
        const departments = ['개발팀', '마케팅팀', '영업팀', '인사팀', '재무팀', '기획팀']
        const positions = ['팀장', '과장', '대리', '사원', '인턴']
        const employeeTypes = ['regular', 'contract', 'part-time']
        
        return Array.from({ length: 5 }, (_, i) => {
          const baseSalary = 3000000 + (i * 200000) + (fileIndex * 500000)
          const overtimePay = 150000 + (i * 10000)
          const allowances = 200000 + (i * 15000)
          const bonuses = 500000 + (i * 50000)
          const deductions = 300000 + (i * 20000)
          const netSalary = baseSalary + overtimePay + allowances + bonuses - deductions
          
          return {
            id: `uploaded-${fileIndex}-${i}`,
            employeeId: `EMP-${fileIndex}${i.toString().padStart(2, '0')}`,
            employeeName: `${departments[i % departments.length]} ${positions[i % positions.length]} ${i + 1}`,
            department: departments[i % departments.length],
            position: positions[i % positions.length],
            employeeType: employeeTypes[i % employeeTypes.length] as 'regular' | 'contract' | 'part-time',
            baseSalary,
            overtimePay,
            allowances,
            bonuses,
            deductions,
            netSalary,
            month: '12',
            year: 2024,
            uploadDate: new Date().toISOString().split('T')[0],
            fileName: file.name
          }
        })
      })

      setUploadStatus('success')
      setUploadMessage(`${uploadedFiles.length}개 파일에서 ${sampleData.length}건의 급여 데이터를 성공적으로 처리했습니다.`)
      
      // 부모 컴포넌트에 데이터 전달
      onUpload(sampleData)
      
      // 3초 후 자동으로 닫기
      setTimeout(() => {
        onClose()
      }, 3000)

    } catch (error) {
      setUploadStatus('error')
      setUploadMessage('파일 처리 중 오류가 발생했습니다.')
    }
  }

  const downloadTemplate = () => {
    // 실제로는 템플릿 파일을 다운로드하는 로직이 들어갑니다
    const templateContent = `직원ID,직원명,부서,직급,고용형태,기본급,초과근무수당,제수당,상여금,공제액
EMP001,홍길동,개발팀,팀장,regular,5000000,200000,300000,800000,400000
EMP002,김철수,개발팀,과장,regular,4000000,150000,250000,600000,350000`
    
    const blob = new Blob([templateContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '급여_템플릿.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">급여 데이터 업로드</h2>
            <p className="text-gray-600">엑셀 또는 CSV 파일을 업로드하여 급여 데이터를 추가하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 업로드 영역 */}
        <div className="p-6 space-y-6">
          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              파일을 여기에 드래그하거나 클릭하여 선택하세요
            </p>
            <p className="text-gray-500 mb-4">
              지원 형식: .xlsx, .xls, .csv (최대 10MB)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="ok-btn-primary px-6 py-2"
            >
              파일 선택
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 템플릿 다운로드 */}
          <div className="text-center">
            <button
              onClick={downloadTemplate}
              className="ok-btn-outline inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              급여 템플릿 다운로드
            </button>
          </div>

          {/* 업로드된 파일 목록 */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">업로드된 파일</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 상태 메시지 */}
          {uploadStatus !== 'idle' && (
            <div className={`p-4 rounded-lg ${
              uploadStatus === 'success' ? 'bg-green-50 text-green-800' :
              uploadStatus === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <div className="flex items-center gap-2">
                {uploadStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                {uploadStatus === 'error' && <AlertCircle className="w-5 h-5" />}
                {uploadStatus === 'uploading' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>}
                <span>{uploadMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="ok-btn-outline px-6 py-2"
          >
            취소
          </button>
          <button
            onClick={processFiles}
            disabled={uploadedFiles.length === 0 || uploadStatus === 'uploading'}
            className="ok-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === 'uploading' ? '처리 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  )
}
