"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

// CameraCapture Component
export function CameraCapture({ onResult }: { onResult: (data: any) => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);
    const [isWebcamActive, setIsWebcamActive] = useState(false);

    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();

        if (!imageSrc) return;

        // Convert Base64 to Blob
        const blob = await (await fetch(imageSrc)).blob();
        const formData = new FormData();
        formData.append("file", blob, "camera_capture.jpg");

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/v1/predict", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            onResult(data);
        } catch (err) {
            console.error("Gagal mendeteksi:", err);
            onResult({ error: "Gagal mendeteksi gambar dari kamera" });
        } finally {
            setLoading(false);
        }
    };

    const toggleWebcam = () => {
        setIsWebcamActive(!isWebcamActive);
    };

    return (
        <div className="space-y-4">
            {!isWebcamActive ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Aktifkan Kamera</h3>
                    <p className="text-sm text-gray-500 mb-6">Gunakan kamera untuk mengambil foto sampah secara langsung</p>
                    <button
                        onClick={toggleWebcam}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Buka Kamera</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={toggleWebcam}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                title="Tutup Kamera"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={capture}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium inline-flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    </svg>
                                    <span>Ambil Foto & Deteksi</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}