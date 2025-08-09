'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Employee, Contractor, Agency } from '@/types/payroll'

interface UploadedData {
  employees: Employee[]
  contractors: Contractor[]
  agencies: Agency[]
}

interface FileUploadProps {
  onDataUploaded: (data: UploadedData) => void
}

export default function FileUpload({ onDataUploaded }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus('processing')
    setErrorMessage('')
    const fileNames: string[] = []

    try {
      const allData: UploadedData = {
        employees: [],
        contractors: [],
        agencies: []
      }

      for (const file of acceptedFiles) {
        fileNames.push(file.name)
        const data = await parseExcelFile(file)
        
        // 파일명에 따라 데이터 분류
        if (file.name.includes('직원') || file.name.includes('급여')) {
          allData.employees.push(...data.employees)
        } else if (file.name.includes('도급') || file.name.includes('외주')) {
          allData.contractors.push(...data.contractors)
        } else if (file.name.includes('대행') || file.name.includes('수수료')) {
          allData.agencies.push(...data.agencies)
        } else {
          // 기본적으로 모든 데이터 합치기
          allData.employees.push(...data.employees)
          allData.contractors.push(...data.contractors)
          allData.agencies.push(...data.agencies)
        }
      }

      setUploadedFiles(fileNames)
      setUploadStatus('success')
      onDataUploaded(allData)
      
    } catch (error) {
      console.error('파일 처리 중 오류:', error)
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      setUploadStatus('error')
    }
  }, [onDataUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: true
  })

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        데이터 업로드
      </h2>

      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadStatus === 'success'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'processing' ? (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-lg font-medium text-blue-600">파일 처리 중...</p>
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-lg font-medium text-green-600">업로드 완료!</p>
            </>
          ) : uploadStatus === 'error' ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-lg font-medium text-red-600">업로드 실패</p>
            </>
          ) : (
            <>
              <FileSpreadsheet className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? '파일을 여기에 놓아주세요' : '엑셀 파일을 드래그하거나 클릭하세요'}
              </p>
            </>
          )}
          
          <p className="text-sm text-gray-500">
            지원 형식: .xlsx, .xls, .csv (최대 10MB)
          </p>
        </div>
      </div>

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">업로드된 파일:</h3>
          <ul className="space-y-1">
            {uploadedFiles.map((fileName, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {fileName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 파일 형식 가이드 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">📋 파일 형식 가이드</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>직원 급여:</strong> 이름, 부서, 직급, 기본급, 수당, 연장근무비, 연차수당</p>
          <p><strong>도급사:</strong> 업체명, 계약금액, 계약기간, 업무내용</p>
          <p><strong>대행사:</strong> 업체명, 서비스종류, 수수료율, 월비용</p>
        </div>
      </div>
    </div>
  )
}

// 엑셀 파일 파싱 함수
async function parseExcelFile(file: File): Promise<UploadedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const result: UploadedData = {
          employees: [],
          contractors: [],
          agencies: []
        }

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          // 시트명이나 컬럼에 따라 데이터 분류
          if (sheetName.includes('직원') || sheetName.includes('급여') || hasEmployeeColumns(jsonData)) {
            result.employees.push(...parseEmployeeData(jsonData))
          } else if (sheetName.includes('도급') || sheetName.includes('외주') || hasContractorColumns(jsonData)) {
            result.contractors.push(...parseContractorData(jsonData))
          } else if (sheetName.includes('대행') || sheetName.includes('수수료') || hasAgencyColumns(jsonData)) {
            result.agencies.push(...parseAgencyData(jsonData))
          }
        })

        resolve(result)
      } catch (error) {
        reject(new Error(`파일 파싱 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`))
      }
    }

    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsArrayBuffer(file)
  })
}

// 데이터 파싱 헬퍼 함수들
function parseEmployeeData(data: any[]): Employee[] {
  return data.map((row, index) => ({
    id: `emp_${Date.now()}_${index}`,
    name: row['이름'] || row['성명'] || row['직원명'] || `직원_${index + 1}`,
    department: row['부서'] || row['소속'] || '미분류',
    position: row['직급'] || row['직책'] || '사원',
    employeeType: determineEmployeeType(row['고용형태'] || row['구분'] || '정규직'),
    baseSalary: Number(row['기본급'] || row['월급여'] || 0),
    allowances: Number(row['수당'] || row['제수당'] || 0),
    overtimePay: Number(row['연장근무비'] || row['초과근무수당'] || 0),
    annualLeavePay: Number(row['연차수당'] || 0),
    insurancePremiums: Number(row['4대보험'] || 0),
    totalCost: 0 // 계산해서 채움
  })).map(emp => ({
    ...emp,
    totalCost: emp.baseSalary + emp.allowances + emp.overtimePay + emp.annualLeavePay + emp.insurancePremiums
  }))
}

function parseContractorData(data: any[]): Contractor[] {
  return data.map((row, index) => ({
    id: `cont_${Date.now()}_${index}`,
    name: row['업체명'] || row['회사명'] || row['이름'] || `업체_${index + 1}`,
    type: row['구분'] === '개인사업자' ? 'individual' : 'company',
    contractAmount: Number(row['계약금액'] || row['금액'] || 0),
    period: row['계약기간'] || row['기간'] || '1개월',
    description: row['업무내용'] || row['설명'] || ''
  }))
}

function parseAgencyData(data: any[]): Agency[] {
  return data.map((row, index) => ({
    id: `agency_${Date.now()}_${index}`,
    name: row['업체명'] || row['대행사명'] || `대행사_${index + 1}`,
    serviceType: row['서비스종류'] || row['업무유형'] || '기타',
    feeRate: Number(row['수수료율'] || row['요율'] || 0) / 100,
    monthlyCost: Number(row['월비용'] || row['월수수료'] || 0)
  }))
}

// 컬럼 판별 함수들
function hasEmployeeColumns(data: any[]): boolean {
  if (!data.length) return false
  const firstRow = data[0]
  const employeeKeys = ['이름', '성명', '직원명', '기본급', '월급여', '부서']
  return employeeKeys.some(key => key in firstRow)
}

function hasContractorColumns(data: any[]): boolean {
  if (!data.length) return false
  const firstRow = data[0]
  const contractorKeys = ['업체명', '회사명', '계약금액', '계약기간']
  return contractorKeys.some(key => key in firstRow)
}

function hasAgencyColumns(data: any[]): boolean {
  if (!data.length) return false
  const firstRow = data[0]
  const agencyKeys = ['대행사명', '수수료율', '월비용', '서비스종류']
  return agencyKeys.some(key => key in firstRow)
}

function determineEmployeeType(type: string): 'regular' | 'contract' | 'part-time' {
  const normalized = type.toLowerCase()
  if (normalized.includes('계약') || normalized.includes('contract')) return 'contract'
  if (normalized.includes('시간') || normalized.includes('part')) return 'part-time'
  return 'regular'
}


