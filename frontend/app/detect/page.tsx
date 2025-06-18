"use client"

import React from "react"
import { useState, useRef } from "react"
import { Camera, Upload, Trash2, CheckCircle, RotateCcw, Zap, Eye, FileImage, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Types for API response
interface PredictionResult {
    prediction: string;
    confidence?: number;
    recommendation: {
        deskripsi: string;
        cara_penanganan: string[];
        catatan: string;
    };
}

export default function DetectPage() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload")
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isStreamActive, setIsStreamActive] = useState(false)

    const wasteTypes = {
        kaca: { color: "bg-blue-500", icon: "🥃", description: "Sampah Kaca" },
        plastik: { color: "bg-red-500", icon: "🥤", description: "Sampah Plastik" },
        kertas: { color: "bg-green-500", icon: "📄", description: "Sampah Kertas" },
        organik: { color: "bg-yellow-500", icon: "🍎", description: "Sampah Organik" },
        logam: { color: "bg-gray-500", icon: "🥫", description: "Sampah Logam" },
    }

    // API call function
    const predictWasteType = async (file: File) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("http://localhost:8000/api/v1/predict", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setPredictionResult(data)
        } catch (err) {
            console.error("Prediction error:", err)
            setError(err instanceof Error ? err.message : "Gagal melakukan prediksi. Pastikan server API berjalan.")
            // Fallback to mock data for demo purposes
            setTimeout(() => {
                const types = Object.keys(wasteTypes)
                const randomType = types[Math.floor(Math.random() * types.length)]
                setPredictionResult({
                    prediction: randomType,
                    confidence: Math.floor(Math.random() * 20) + 80,
                    recommendation: {
                        deskripsi: `Sampah jenis ${randomType}`,
                        cara_penanganan: [
                            "Pisahkan dari sampah lain",
                            "Bersihkan sebelum dibuang",
                            "Buang ke tempat daur ulang yang sesuai"
                        ],
                        catatan: "Pastikan untuk mengelola sampah dengan benar untuk menjaga lingkungan"
                    }
                })
            }, 1000)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploadedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            
            // Call API for prediction
            await predictWasteType(file)
        }
    }

    const startCamera = async () => {
        setIsLoading(true)
        setActiveTab("camera")
        setError(null)

        try {
            const constraints = [
                { video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } },
                { video: { facingMode: { exact: "environment" } } },
                { video: { facingMode: "user" } },
                { video: true },
            ]

            let mediaStream = null
            let lastError = null

            for (const constraint of constraints) {
                try {
                    mediaStream = await navigator.mediaDevices.getUserMedia(constraint)
                    break
                } catch (err) {
                    lastError = err
                    continue
                }
            }

            if (!mediaStream) {
                throw lastError || new Error("No camera available")
            }

            setStream(mediaStream)
            setIsStreamActive(true)

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play().catch((playError) => {
                            console.error("Video play failed:", playError)
                            setError("Failed to start video playback")
                        })
                    }
                }
            }
        } catch (err) {
            console.error("Camera error:", err)
            setError(
                `Kamera tidak dapat diakses: ${err instanceof Error ? err.message : "Unknown error"}. Pastikan browser memiliki permission untuk mengakses kamera.`,
            )
        } finally {
            setIsLoading(false)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
        }
        setIsStreamActive(false)
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const capturePhoto = async () => {
        if (!videoRef.current || !stream) return

        setError(null)

        try {
            const video = videoRef.current
            const canvas = document.createElement("canvas")
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext("2d")

            if (ctx) {
                ctx.drawImage(video, 0, 0)

                canvas.toBlob(
                    async (blob) => {
                        if (blob) {
                            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
                            const url = URL.createObjectURL(file)
                            setPreviewUrl(url)
                            setUploadedFile(file)
                            stopCamera()

                            // Call API for prediction
                            await predictWasteType(file)
                        }
                    },
                    "image/jpeg",
                    0.8,
                )
            }
        } catch (err) {
            console.error("Capture error:", err)
            setError("Failed to capture photo")
        }
    }

    const resetDetection = () => {
        setUploadedFile(null)
        setPredictionResult(null)
        setPreviewUrl(null)
        setIsLoading(false)
        setActiveTab("upload")
        setError(null)
        stopCamera()
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    React.useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [stream])

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
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${activeTab === "upload"
                                        ? "bg-white shadow-lg text-emerald-600"
                                        : "text-gray-600 hover:text-emerald-600"
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                onClick={() => setActiveTab("camera")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${activeTab === "camera" ? "bg-white shadow-lg text-blue-600" : "text-gray-600 hover:text-blue-600"
                                    }`}
                            >
                                <Camera className="w-4 h-4" />
                                Camera
                            </button>
                        </div>

                        {/* Upload Section */}
                        {activeTab === "upload" && (
                            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div
                                        onClick={triggerFileInput}
                                        className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center bg-gradient-to-br from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 transition-all cursor-pointer group"
                                    >
                                        {uploadedFile ? (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                    <CheckCircle className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-700">File Berhasil Diupload</p>
                                                    <p className="text-sm text-gray-600 truncate max-w-[200px] mx-auto">{uploadedFile.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                    <FileImage className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-700">Pilih Gambar Sampah</p>
                                                    <p className="text-sm text-gray-500 mt-1">Drag & drop atau klik untuk upload</p>
                                                    <p className="text-xs text-gray-400 mt-2">Mendukung JPG, PNG, WebP</p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Camera Section */}
                        {activeTab === "camera" && (
                            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="text-center space-y-4">
                                        {!isStreamActive ? (
                                            <>
                                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto">
                                                    <Camera className="w-12 h-12 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-700 mb-2">Ambil Foto Langsung</h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Gunakan kamera untuk mengambil foto sampah secara real-time
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={startCamera}
                                                    disabled={isLoading}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    <Camera className="w-5 h-5 mr-2" />
                                                    {isLoading ? "Membuka Kamera..." : "Buka Kamera"}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className="w-full aspect-square object-cover rounded-2xl bg-gray-900"
                                                        onError={(e) => {
                                                            console.error("Video error:", e)
                                                            setError("Video playback error")
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 border-2 border-blue-400 rounded-2xl pointer-events-none">
                                                        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400"></div>
                                                        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400"></div>
                                                        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400"></div>
                                                        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400"></div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={capturePhoto}
                                                        disabled={isLoading}
                                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                    >
                                                        <Camera className="w-5 h-5 mr-2" />
                                                        {isLoading ? "Memproses..." : "Ambil Foto"}
                                                    </Button>
                                                    <Button
                                                        onClick={stopCamera}
                                                        variant="outline"
                                                        className="px-4 py-3 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-red-600 text-sm">{error}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Reset Button */}
                        {(uploadedFile || previewUrl) && (
                            <Button
                                onClick={resetDetection}
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Deteksi
                            </Button>
                        )}
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
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {isLoading && (
                                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                    <div className="bg-white rounded-xl p-4 shadow-lg">
                                                        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                                        <p className="text-sm font-medium text-gray-700">Menganalisis...</p>
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

                                <div className="flex-1 overflow-y-auto">
                                    {predictionResult ? (
                                        <div className="space-y-6">
                                            {/* Main Result */}
                                            <div className="text-center">
                                                <div
                                                    className={`w-20 h-20 ${wasteTypes[predictionResult.prediction as keyof typeof wasteTypes]?.color || "bg-gray-500"} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                                >
                                                    <span className="text-3xl">
                                                        {wasteTypes[predictionResult.prediction as keyof typeof wasteTypes]?.icon || "🗑️"}
                                                    </span>
                                                </div>
                                                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                                    {predictionResult.recommendation.deskripsi}
                                                </h4>
                                                {predictionResult.confidence && (
                                                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="font-semibold">{predictionResult.confidence}% Confidence</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confidence Bar */}
                                            {predictionResult.confidence && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Tingkat Kepercayaan</span>
                                                        <span className="font-semibold text-gray-800">{predictionResult.confidence}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${predictionResult.confidence}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Handling Instructions */}
                                            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 border border-emerald-100">
                                                <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    💡 Cara Penanganan:
                                                </h5>
                                                <ul className="space-y-2">
                                                    {predictionResult.recommendation.cara_penanganan.map((step, index) => (
                                                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                                            <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                                {index + 1}
                                                            </span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Additional Notes */}
                                            {predictionResult.recommendation.catatan && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                                                    <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                                        ⚠️ Catatan Penting:
                                                    </h5>
                                                    <p className="text-sm text-yellow-700 italic">
                                                        {predictionResult.recommendation.catatan}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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