"use client"

import { useState } from 'react'
import FileUpload from '@/components/upload/FileUpload'
import DataPreview from '@/components/upload/DataPreview'
import { Employee, Contractor, Agency } from '@/lib/types'

interface UploadedData {
  employees: Employee[]
  contractors: Contractor[]
  agencies: Agency[]
}

export default function UploadPage() {
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null)

  const handleDataUploaded = (data: UploadedData) => {
    setUploadedData(data)
    localStorage.setItem('paypulse_data', JSON.stringify(data))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">데이터 업로드</h1>
        <p className="text-gray-600 mt-2">엑셀 파일을 업로드하여 인건비 데이터를 관리하세요</p>
      </div>

      <div className="space-y-8">
        <FileUpload onDataUploaded={handleDataUploaded} />
        
        {uploadedData && (
          <DataPreview 
            employees={uploadedData.employees}
            contractors={uploadedData.contractors}
            agencies={uploadedData.agencies}
          />
        )}
      </div>
    </div>
  )
}


