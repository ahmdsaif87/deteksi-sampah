"use client"

import type React from "react"
import { useState, useRef } from "react"
import { CheckCircle, FileImage } from "lucide-react"

interface UploadFormProps {
  onResult: (data: any) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
}

export function UploadForm({ onResult, onLoading, onError }: UploadFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const predictWaste = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Direct call ke FastAPI Anda (sama seperti CameraCapture)
      const response = await fetch("http://localhost:8000/api/v1/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to backend. Make sure the server is running on http://localhost:8000")
      }
      throw error
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      onError("File size must be less than 10MB")
      return
    }

    setUploadedFile(file)
    const url = URL.createObjectURL(file)
    onLoading(true)
    onError(null)

    try {
      const result = await predictWaste(file)
      onResult({
        ...result,
        previewUrl: url,
        file: file,
      })
    } catch (err) {
      console.error("Prediction error:", err)
      onError(err instanceof Error ? err.message : "Failed to predict waste type")
    } finally {
      onLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="h-full flex flex-col">
      <div
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex-1 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-emerald-400 bg-emerald-50"
            : uploadedFile
              ? "border-emerald-300 bg-emerald-50"
              : "border-emerald-300 bg-gradient-to-br from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100"
        }`}
      >
        {uploadedFile ? (
          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-700">File Berhasil Diupload</p>
              <p className="text-sm text-gray-600 truncate max-w-[200px] mx-auto">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pilih Gambar Sampah</p>
              <p className="text-sm text-gray-500 mt-1">Drag & drop atau klik untuk upload</p>
              <p className="text-xs text-gray-400 mt-2">Mendukung JPG, PNG, WebP (Max 10MB)</p>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  )
}
