'use client'

import { FeeData, PayrollData, UploadHistory } from '@/types/payroll'
import * as ExcelJS from 'exceljs'
import { AlertCircle, CheckCircle, Eye, FileSpreadsheet, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface IntegratedFileUploadProps {
  onDataUploaded: (data: { payrollData: PayrollData[], feeData: FeeData[] }) => void
}

export default function IntegratedFileUpload({ onDataUploaded }: IntegratedFileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [currentData, setCurrentData] = useState<{ payrollData: PayrollData[], feeData: FeeData[] }>({
    payrollData: [],
    feeData: []
  })

  // 로컬 스토리지에서 기존 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem('integrated_paypulse_data')
    const savedHistory = localStorage.getItem('upload_history')

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        console.log('기존 데이터 로드:', parsedData)
        setCurrentData(parsedData)
        // 초기 로드 시에만 부모 컴포넌트에 데이터 전달
        if (parsedData.payrollData.length > 0 || parsedData.feeData.length > 0) {
          onDataUploaded(parsedData)
        }
      } catch (error) {
        console.error('저장된 데이터 파싱 오류:', error)
      }
    }

    if (savedHistory) {
      try {
        setUploadHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('업로드 히스토리 파싱 오류:', error)
      }
    }
  }, []) // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus('processing')
    setErrorMessage('')

    try {
      const newPayrollData: PayrollData[] = []
      const newFeeData: FeeData[] = []
      const newHistory: UploadHistory[] = []

      console.log('업로드된 파일들:', acceptedFiles.map(f => f.name))

      for (const file of acceptedFiles) {
        console.log(`파일 처리 중: ${file.name}`)
        const data = await parseExcelFile(file)
        console.log(`파일 ${file.name} 파싱 결과:`, data)

        // 파일 분류 로직 개선
        const isPayrollFile = isPayrollFileType(file.name, data)
        const isFeeFile = isFeeFileType(file.name, data)

        console.log(`파일 ${file.name} 분류:`, { isPayrollFile, isFeeFile })
        console.log(`파일 ${file.name} 상세 분석:`, {
          fileName: file.name,
          payrollDataCount: data.payrollData.length,
          feeDataCount: data.feeData.length,
          isPayrollFile,
          isFeeFile,
          reason: isPayrollFile ? '급여 파일로 분류됨' : isFeeFile ? '수수료 파일로 분류됨' : '분류 불가'
        })

        if (isPayrollFile) {
          newPayrollData.push(...data.payrollData)
          newHistory.push({
            id: `payroll_${Date.now()}_${Math.random()}`,
            fileName: file.name,
            fileType: 'payroll',
            uploadDate: new Date().toISOString(),
            recordCount: data.payrollData.length
          })
          console.log(`급여 파일 ${file.name}에서 ${data.payrollData.length}건의 데이터 추출`)
        } else if (isFeeFile) {
          newFeeData.push(...data.feeData)
          newHistory.push({
            id: `fee_${Date.now()}_${Math.random()}`,
            fileName: file.name,
            fileType: 'fee',
            uploadDate: new Date().toISOString(),
            recordCount: data.feeData.length
          })
          console.log(`수수료 파일 ${file.name}에서 ${data.feeData.length}건의 데이터 추출`)
        } else {
          console.warn(`파일 ${file.name}의 유형을 판별할 수 없습니다.`)
        }
      }

      // 기존 데이터와 새 데이터 합치기
      const updatedData = {
        payrollData: [...currentData.payrollData, ...newPayrollData],
        feeData: [...currentData.feeData, ...newFeeData]
      }

      console.log('업데이트된 데이터:', updatedData)
      console.log(`총 급여 데이터: ${updatedData.payrollData.length}건`)
      console.log(`총 수수료 데이터: ${updatedData.feeData.length}건`)

      // 로컬 스토리지에 저장
      localStorage.setItem('integrated_paypulse_data', JSON.stringify(updatedData))
      localStorage.setItem('upload_history', JSON.stringify([...uploadHistory, ...newHistory]))

      setCurrentData(updatedData)
      setUploadHistory(prev => [...prev, ...newHistory])
      setUploadStatus('success')

      // 부모 컴포넌트에 데이터 전달
      onDataUploaded(updatedData)

      console.log('데이터 업로드 완료 및 저장됨')

    } catch (error) {
      console.error('파일 처리 중 오류:', error)
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      setUploadStatus('error')
    }
  }, [currentData, uploadHistory, onDataUploaded])

  const deleteFile = (fileId: string) => {
    const fileToDelete = uploadHistory.find(f => f.id === fileId)
    if (!fileToDelete) return

    // 해당 파일의 데이터 제거
    let updatedData = { ...currentData }

    if (fileToDelete.fileType === 'payroll') {
      updatedData.payrollData = currentData.payrollData.filter(
        item => item.fileName !== fileToDelete.fileName
      )
    } else {
      updatedData.feeData = currentData.feeData.filter(
        item => item.fileName !== fileToDelete.fileName
      )
    }

    // 히스토리에서 완전히 제거
    const updatedHistory = uploadHistory.filter(f => f.id !== fileId)

    // 로컬 스토리지 업데이트
    localStorage.setItem('integrated_paypulse_data', JSON.stringify(updatedData))
    localStorage.setItem('upload_history', JSON.stringify(updatedHistory))

    setCurrentData(updatedData)
    setUploadHistory(updatedHistory)
    onDataUploaded(updatedData)
  }

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
    <div className="space-y-6">
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive
          ? 'border-orange-500 bg-orange-50'
          : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'processing' ? (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              <p className="text-lg font-medium text-orange-600">파일 처리 중...</p>
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
              <FileSpreadsheet className={`w-12 h-12 ${isDragActive ? 'text-orange-500' : 'text-gray-400'}`} />
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* 업로드 히스토리 */}
      {uploadHistory.length > 0 && (
        <div className="ok-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            업로드된 파일 목록
          </h3>
          <div className="space-y-3">
            {uploadHistory.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border bg-white border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${file.fileType === 'payroll' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {file.fileName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {file.fileType === 'payroll' ? '급여대장' : '수수료'} •
                      {file.recordCount}건 •
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="파일 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 파일 형식 가이드 */}
      <div className="ok-card bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-800 mb-3">📋 파일 형식 가이드</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">💰 급여대장 파일</h4>
            <p>이름, 부서, 직급, 기본급, 수당, 연장근무비, 연차수당, 4대보험, 상여금</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🏢 수수료 파일</h4>
            <p>업체명, 서비스내용, 계약금액, 수수료율, 월비용, 계약기간</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 엑셀 파일 파싱 함수
async function parseExcelFile(file: File): Promise<{ payrollData: PayrollData[], feeData: FeeData[] }> {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)

      const result = {
        payrollData: [] as PayrollData[],
        feeData: [] as FeeData[]
      }

      console.log(`파일 ${file.name}의 시트들:`, workbook.worksheets.map(ws => ws.name))

      for (const worksheet of workbook.worksheets) {
        const sheetName = worksheet.name
        const headers: string[] = []
        const dataRows: any[][] = []

        // 헤더와 데이터 추출
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) {
            // 첫 번째 행을 헤더로 사용
            const headerValues = row.values?.slice(1) || []
            headers.push(...headerValues.map((cell: any) => {
              if (cell && (typeof cell === 'string' || typeof cell === 'number')) {
                return cell.toString()
              }
              return ''
            }))
          } else {
            // 나머지 행을 데이터로 사용
            const rowValues = row.values?.slice(1) || []
            const rowData = rowValues.map((cell: any) => {
              if (cell !== null && cell !== undefined) {
                if (typeof cell === 'string' || typeof cell === 'number' || typeof cell === 'boolean') {
                  return cell
                }
                return ''
              }
              return ''
            })
            dataRows.push(rowData)
          }
        })

        // 충분한 데이터가 있는지 확인
        if (dataRows.length === 0) {
          console.log(`시트 ${sheetName}에 충분한 데이터가 없습니다.`)
          continue
        }

        console.log(`시트 ${sheetName}의 헤더:`, headers)
        console.log(`시트 ${sheetName}의 데이터 행 수:`, dataRows.length)

        // 헤더를 객체 키로 변환
        const processedData = dataRows.map(row => {
          const obj: any = {}
          headers.forEach((header, index) => {
            if (header && row[index] !== undefined && row[index] !== '') {
              obj[header.trim()] = row[index]
            }
          })
          return obj
        }).filter(row => Object.keys(row).length > 0)

        console.log(`시트 ${sheetName}의 처리된 데이터:`, processedData.slice(0, 2))

        // 시트명이나 컬럼에 따라 데이터 분류
        if (hasPayrollColumns(processedData, headers)) {
          const payrollData = parsePayrollData(processedData, file.name)
          result.payrollData.push(...payrollData)
          console.log(`시트 ${sheetName}에서 급여 데이터 ${payrollData.length}건 추출`)
        } else if (hasFeeColumns(processedData, headers)) {
          const feeData = parseFeeData(processedData, file.name)
          result.feeData.push(...feeData)
          console.log(`시트 ${sheetName}에서 수수료 데이터 ${feeData.length}건 추출`)
        } else {
          console.log(`시트 ${sheetName}의 컬럼을 확인할 수 없습니다.`)
          console.log('사용 가능한 컬럼들:', headers)
        }
      }

      console.log('파싱 결과:', result)
      resolve(result)
    } catch (error) {
      reject(new Error(`파일 파싱 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`))
    }
  })
}

// 파일 타입 판별 함수들
function isPayrollFileType(fileName: string, parsedData: { payrollData: PayrollData[], feeData: FeeData[] }): boolean {
  const fileNameLower = fileName.toLowerCase()
  const hasPayrollName = fileNameLower.includes('급여') ||
    fileNameLower.includes('급여대장') ||
    fileNameLower.includes('직원') ||
    fileNameLower.includes('인사') ||
    fileNameLower.includes('payroll') ||
    fileNameLower.includes('salary') ||
    fileNameLower.includes('월급') ||
    fileNameLower.includes('월급여')

  const hasPayrollData = parsedData.payrollData.length > 0

  console.log(`급여 파일 판별 - 파일명: ${hasPayrollName}, 데이터: ${hasPayrollData}`)
  console.log(`파일명: ${fileName}, 급여 데이터: ${parsedData.payrollData.length}건, 수수료 데이터: ${parsedData.feeData.length}건`)

  return hasPayrollName || hasPayrollData
}

function isFeeFileType(fileName: string, parsedData: { payrollData: PayrollData[], feeData: FeeData[] }): boolean {
  const fileNameLower = fileName.toLowerCase()
  const hasFeeName = fileNameLower.includes('수수료') ||
    fileNameLower.includes('도급') ||
    fileNameLower.includes('대행') ||
    fileNameLower.includes('개인사업자') ||
    fileNameLower.includes('계약') ||
    fileNameLower.includes('fee') ||
    fileNameLower.includes('contract') ||
    fileNameLower.includes('외주') ||
    fileNameLower.includes('업체') ||
    fileNameLower.includes('협력사')

  const hasFeeData = parsedData.feeData.length > 0

  console.log(`수수료 파일 판별 - 파일명: ${hasFeeName}, 데이터: ${hasFeeData}`)
  console.log(`파일명: ${fileName}, 급여 데이터: ${parsedData.payrollData.length}건, 수수료 데이터: ${parsedData.feeData.length}건`)

  return hasFeeName || hasFeeData
}

// 급여 데이터 파싱
function parsePayrollData(data: any[], fileName: string): PayrollData[] {
  if (!data || data.length === 0) {
    console.warn('급여 데이터가 비어있습니다.')
    return []
  }

  console.log('급여 데이터 파싱 시작:', data.slice(0, 2))

  return data.map((row, index) => {
    // 안전한 숫자 변환 함수
    const safeNumber = (value: any, defaultValue: number = 0): number => {
      if (value === null || value === undefined || value === '') return defaultValue
      const num = Number(value)
      return isNaN(num) ? defaultValue : num
    }

    // 다양한 컬럼명에 대응하며 안전한 숫자 변환
    const baseSalary = safeNumber(row['기본급'] || row['월급여'] || row['급여'] || row['본봉'] || row['기본급여'], 0)
    const allowances = safeNumber(row['수당'] || row['제수당'] || row['수당류'] || row['기타수당'] || row['추가수당'], 0)
    const overtimePay = safeNumber(row['연장근무비'] || row['초과근무수당'] || row['야근수당'] || row['연장수당'] || row['초과수당'], 0)
    const annualLeavePay = safeNumber(row['연차수당'] || row['연차'] || row['연차급여'] || row['휴가수당'], 0)
    const insurancePremiums = safeNumber(row['4대보험'] || row['보험료'] || row['공제액'] || row['공제'] || row['보험공제'], 0)
    const bonuses = safeNumber(row['상여금'] || row['보너스'] || row['성과금'] || row['성과상여'] || row['인센티브'], 0)

    const totalPayroll = baseSalary + allowances + overtimePay + annualLeavePay + insurancePremiums + bonuses

    const result = {
      id: `payroll_${Date.now()}_${index}`,
      employeeId: row['사번'] || row['직원번호'] || row['번호'] || row['ID'] || `EMP_${index + 1}`,
      employeeName: row['이름'] || row['성명'] || row['직원명'] || row['성명'] || row['직원이름'] || `직원_${index + 1}`,
      department: row['부서'] || row['소속'] || row['팀'] || row['본부'] || row['사업부'] || '미분류',
      position: row['직급'] || row['직책'] || row['직위'] || row['직무'] || row['직책'] || '사원',
      employeeType: determineEmployeeType(row['고용형태'] || row['구분'] || row['상태'] || row['고용구분'] || '정규직'),
      baseSalary,
      allowances,
      overtimePay,
      annualLeavePay,
      insurancePremiums,
      bonuses,
      totalPayroll,
      month: row['월'] || row['급여월'] || new Date().getMonth() + 1,
      year: row['년도'] || row['년'] || row['급여년도'] || new Date().getFullYear(),
      uploadDate: new Date().toISOString(),
      fileName
    }

    console.log(`직원 ${result.employeeName} 파싱 결과:`, result)
    return result
  }).filter(item => {
    // 유효한 데이터만 필터링 (이름이 있고 기본급이 0보다 큰 경우)
    const isValid = item.employeeName &&
      !item.employeeName.includes('직원_') &&
      item.baseSalary > 0 &&
      item.employeeName.trim() !== ''

    if (!isValid) {
      console.log(`유효하지 않은 데이터 제외:`, item)
    }

    return isValid
  })
}

// 수수료 데이터 파싱
function parseFeeData(data: any[], fileName: string): FeeData[] {
  if (!data || data.length === 0) {
    console.warn('수수료 데이터가 비어있습니다.')
    return []
  }

  console.log('수수료 데이터 파싱 시작:', data.slice(0, 2))

  return data.map((row, index) => {
    // 안전한 숫자 변환 함수
    const safeNumber = (value: any, defaultValue: number = 0): number => {
      if (value === null || value === undefined || value === '') return defaultValue
      const num = Number(value)
      return isNaN(num) ? defaultValue : num
    }

    // 이미지 데이터 구조에 맞춘 컬럼 매핑
    const personnel = safeNumber(row['인원'] || row['명'] || row['인력'] || row['직원수'], 0)
    const monthlyAmount = safeNumber(row['월금액'] || row['월비용'] || row['월수수료'] || row['월지급액'], 0)
    const annualAmount = safeNumber(row['년금액'] || row['년비용'] || row['년수수료'] || row['년지급액'], 0)

    // 월금액이 없고 년금액만 있는 경우 월금액 계산 (12개월로 나누기)
    const calculatedMonthlyAmount = monthlyAmount || (annualAmount / 12)

    // 구분에 따른 카테고리 분류
    const category = row['구분'] || row['카테고리'] || row['분류'] || '기타'
    const isDevelopment = category.includes('개발') || category.includes('Development')
    const isInfrastructure = category.includes('인프라') || category.includes('Infrastructure')

    // 업무 내용
    const serviceDescription = row['업무'] || row['서비스내용'] || row['업무내용'] || row['설명'] || row['내용'] || ''

    // 계약기간 파싱
    const contractPeriod = row['계약기간'] || row['기간'] || row['계약'] || ''
    const contractEntity = row['계약주체'] || row['계약업체'] || row['계약기관'] || row['발주처'] || ''
    const remarks = row['비고'] || row['특이사항'] || row['메모'] || ''

    // 계약기간에서 시작일과 종료일 추출
    let startDate = ''
    let endDate = ''
    if (contractPeriod) {
      const periodMatch = contractPeriod.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})\s*~\s*(\d{4})\.(\d{1,2})\.(\d{1,2})/)
      if (periodMatch) {
        const padZero = (num: string) => num.padStart(2, '0')
        startDate = `${periodMatch[1]}-${padZero(periodMatch[2])}-${padZero(periodMatch[3])}`
        endDate = `${periodMatch[4]}-${padZero(periodMatch[5])}-${padZero(periodMatch[6])}`
      }
    }

    const result = {
      id: `fee_${Date.now()}_${index}`,
      companyName: row['업체명'] || row['회사명'] || row['이름'] || row['업체'] || row['업체이름'] || row['계약업체'] || `업체_${index + 1}`,
      businessType: determineBusinessType(category),
      serviceDescription,
      contractAmount: annualAmount, // 년금액을 계약금액으로 사용
      feeRate: 0, // 수수료율은 별도로 계산
      monthlyFee: calculatedMonthlyAmount,
      contractPeriod,
      startDate,
      endDate,
      totalFee: annualAmount,
      month: row['월'] || row['계약월'] || new Date().getMonth() + 1,
      year: row['년도'] || row['년'] || row['계약년도'] || new Date().getFullYear(),
      uploadDate: new Date().toISOString(),
      fileName,
      // 추가 필드들
      personnel,
      category,
      contractEntity,
      remarks,
      isDevelopment,
      isInfrastructure
    }

    console.log(`업체 ${result.companyName} 파싱 결과:`, result)
    return result
  }).filter(item => {
    // 유효한 데이터만 필터링 (업체명이 있고 인원이나 월금액이 0보다 큰 경우)
    const isValid = item.companyName &&
      !item.companyName.includes('업체_') &&
      (item.personnel > 0 || item.monthlyFee > 0 || item.totalFee > 0) &&
      item.companyName.trim() !== ''

    if (!isValid) {
      console.log(`유효하지 않은 데이터 제외:`, item)
    }

    return isValid
  })
}

// 컬럼 판별 함수들 개선
function hasPayrollColumns(data: any[], headers: string[]): boolean {
  if (!data || data.length === 0) return false

  // 헤더에서 급여 관련 컬럼 찾기
  const payrollKeywords = ['이름', '성명', '직원명', '기본급', '월급여', '급여', '부서', '사번', '직원번호', '직급', '수당', '연장근무', '4대보험']
  const hasPayrollHeaders = payrollKeywords.some(keyword =>
    headers.some(header => header && header.toLowerCase().includes(keyword.toLowerCase()))
  )

  // 데이터에서도 확인
  const firstRow = data[0]
  const payrollKeys = ['이름', '성명', '직원명', '기본급', '월급여', '급여', '부서', '사번', '직원번호']
  const hasPayrollData = payrollKeys.some(key => key in firstRow)

  console.log('급여 컬럼 확인:', {
    headers,
    hasPayrollHeaders,
    firstRow,
    hasPayrollData,
    result: hasPayrollHeaders || hasPayrollData
  })

  return hasPayrollHeaders || hasPayrollData
}

function hasFeeColumns(data: any[], headers: string[]): boolean {
  if (!data || data.length === 0) return false

  // 헤더에서 수수료 관련 컬럼 찾기 (이미지 데이터 구조 포함)
  const feeKeywords = [
    '업체명', '회사명', '수수료율', '월비용', '계약금액', '금액', '서비스내용', '계약기간', '도급', '대행',
    // 이미지 데이터 구조에 맞는 컬럼들
    '인원', '월금액', '년금액', '구분', '업무', '계약주체', '비고', '외주', '인력비용'
  ]
  const hasFeeHeaders = feeKeywords.some(keyword =>
    headers.some(header => header && header.toLowerCase().includes(keyword.toLowerCase()))
  )

  // 데이터에서도 확인 (이미지 데이터 구조 포함)
  const firstRow = data[0]
  const feeKeys = [
    '업체명', '회사명', '수수료율', '월비용', '계약금액', '금액', '서비스내용',
    // 이미지 데이터 구조에 맞는 키들
    '인원', '월금액', '년금액', '구분', '업무', '계약주체', '비고'
  ]
  const hasFeeData = feeKeys.some(key => key in firstRow)

  console.log('수수료 컬럼 확인:', {
    headers,
    hasFeeHeaders,
    firstRow,
    hasFeeData,
    result: hasFeeHeaders || hasFeeData
  })

  return hasFeeHeaders || hasFeeData
}

function determineEmployeeType(type: string): 'regular' | 'contract' | 'part-time' {
  const normalized = type.toLowerCase()
  if (normalized.includes('계약') || normalized.includes('contract')) return 'contract'
  if (normalized.includes('시간') || normalized.includes('part')) return 'part-time'
  return 'regular'
}

function determineBusinessType(type: string): 'individual' | 'contractor' | 'agency' {
  const normalized = type.toLowerCase()
  if (normalized.includes('개인') || normalized.includes('individual')) return 'individual'
  if (normalized.includes('도급') || normalized.includes('contractor')) return 'contractor'
  if (normalized.includes('대행') || normalized.includes('agency')) return 'agency'
  return 'individual'
}
