"use client"

import { useState } from "react"
import { UploadForm } from "@/components/UploadForm"
import { CameraCapture } from "@/components/CameraCapture"
import PredictionResult from "@/components/PredictionResult"
import { Camera, Upload, Trash2, Zap, Eye, FileImage } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DetectPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleResult = (data: any) => {
    setResult(data)
    if (data.previewUrl) {
      setPreviewUrl(data.previewUrl)
    }
    setError(null)
  }

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  AI Waste Detection
                </h1>
                <p className="text-sm text-gray-600">Deteksi jenis sampah dengan teknologi AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Ready
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Input Methods */}
          <div className="lg:col-span-4 space-y-4">
            {/* Method Selector */}
            <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "upload"
                    ? "bg-white shadow-lg text-emerald-600"
                    : "text-gray-600 hover:text-emerald-600"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("camera")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "camera" ? "bg-white shadow-lg text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Camera className="w-4 h-4" />
                Camera
              </button>
            </div>

            {/* Content Area */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl h-full">
              <CardContent className="p-6 h-full">
                {activeTab === "upload" ? (
                  <UploadForm onResult={handleResult} onLoading={handleLoading} onError={handleError} />
                ) : (
                  <CameraCapture onResult={handleResult} onLoading={handleLoading} onError={handleError} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Image Preview */}
          <div className="lg:col-span-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Preview Gambar</h3>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  {previewUrl ? (
                    <div className="relative w-full max-w-sm">
                      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <div className="bg-white rounded-xl p-4 shadow-lg">
                            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-sm font-medium text-gray-700">Menganalisis dengan AI...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <FileImage className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada gambar</p>
                      <p className="text-sm text-gray-400 mt-1">Upload atau ambil foto untuk memulai</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Hasil Deteksi AI</h3>
                </div>

                <div className="flex-1">
                  {result ? (
                    <PredictionResult result={result} />
                  ) : isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse space-y-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-3xl mx-auto"></div>
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                      </div>
                      <p className="text-gray-500 mt-4 font-medium">AI sedang menganalisis gambar...</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Menunggu Input</p>
                      <p className="text-sm text-gray-400 mt-1">Upload gambar atau ambil foto untuk memulai deteksi</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
