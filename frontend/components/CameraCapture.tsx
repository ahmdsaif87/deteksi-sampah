"use client"

import { useRef, useState } from "react"
import Webcam from "react-webcam"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onResult: (data: any) => void
  onLoading?: (loading: boolean) => void
  onError?: (error: string | null) => void
}

export function CameraCapture({ onResult, onLoading, onError }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [loading, setLoading] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return

    // Convert Base64 to Blob
    const blob = await (await fetch(imageSrc)).blob()
    const formData = new FormData()
    formData.append("file", blob, "camera_capture.jpg")

    setLoading(true)
    onLoading?.(true)
    onError?.(null)

    try {
      // Direct call ke FastAPI Anda
      const res = await fetch("http://localhost:8000/api/v1/predict", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      // Create preview URL for the captured image
      const previewUrl = URL.createObjectURL(blob)

      onResult({
        ...data,
        previewUrl: previewUrl,
        file: new File([blob], "camera_capture.jpg", { type: "image/jpeg" }),
      })
    } catch (err) {
      console.error("Gagal mendeteksi:", err)
      const errorMessage = "Gagal mendeteksi gambar dari kamera"
      onResult({ error: errorMessage })
      onError?.(errorMessage)
    } finally {
      setLoading(false)
      onLoading?.(false)
    }
  }

  const toggleWebcam = () => {
    setIsWebcamActive(!isWebcamActive)
    if (isWebcamActive) {
      onError?.(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {!isWebcamActive ? (
        <div className="flex-1 flex flex-col justify-center text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <Camera className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Ambil Foto Langsung</h3>
            <p className="text-sm text-gray-500 mb-4">Gunakan kamera untuk mengambil foto sampah secara real-time</p>
          </div>
          <Button
            onClick={toggleWebcam}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Camera className="w-5 h-5 mr-2" />
            Buka Kamera
          </Button>
        </div>
      ) : (
        <div className="h-full flex flex-col space-y-4">
          <div className="flex-1 relative">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg h-full">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="w-full h-full object-cover"
              />

              {/* Camera overlay corners */}
              <div className="absolute inset-0 border-2 border-green-400 rounded-2xl pointer-events-none">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-green-400"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-green-400"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-green-400"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-green-400"></div>
              </div>

              {/* Close button */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  onClick={toggleWebcam}
                  size="sm"
                  variant="destructive"
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 border-0"
                  title="Tutup Kamera"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Capture button */}
          <div className="flex gap-3">
            <Button
              onClick={capture}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-blue-300 disabled:to-purple-300 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Camera className="w-5 h-5 mr-2" />
              {loading ? "Memproses..." : "Ambil Foto & Deteksi"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraCapture
