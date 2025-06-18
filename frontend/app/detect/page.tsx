"use client";

import { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import { CameraCapture } from "@/components/CameraCapture";
import PredictionResult from "@/components/PredictionResult";
import clsx from "clsx";
import React from "react";

type CardProps = {
    title: string;
    iconColor: keyof typeof bgColorMap;
    icon: string;
    children: React.ReactNode;
};

type SectionHeaderProps = {
    title: string;
    iconColor: keyof typeof bgColorMap;
    icon: string;
};

type SectionDividerProps = {
    label: string;
};

// Mapping warna
const bgColorMap = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    emerald: "bg-emerald-100",
};

const textColorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    emerald: "text-emerald-600",
};

function Card({ title, iconColor, icon, children }: CardProps) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 border hover:shadow-lg transition-shadow">
            <SectionHeader title={title} iconColor={iconColor} icon={icon} />
            {children}
        </div>
    );
}

function SectionHeader({ title, iconColor, icon }: SectionHeaderProps) {
    return (
        <div className="flex items-center mb-4">
            <div
                className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    bgColorMap[iconColor] || "bg-gray-100"
                )}
            >
                <div className={clsx("text-xl", textColorMap[iconColor] || "text-gray-500")}>
                    {icon}
                </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
    );
}

function SectionDivider({ label }: SectionDividerProps) {
    return (
        <div className="relative my-8">
            <div className="border-t border-gray-200"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 px-4 text-sm text-gray-500">
                {label}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🔍
            </div>
            <h3 className="text-lg font-medium mb-2">Belum Ada Hasil</h3>
            <p>Upload gambar atau ambil foto untuk memulai deteksi sampah</p>
        </div>
    );
}

export default function DetectPage() {
    const [result, setResult] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    🗂️ Deteksi Sampah
                </h1>
                <p className="text-lg text-gray-600 mb-12">
                    Upload gambar atau gunakan kamera untuk mendeteksi jenis sampah
                </p>

                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    <Card title="Upload Gambar" iconColor="blue" icon="📁">
                        <UploadForm onResult={setResult} />
                    </Card>
                    <Card title="Ambil Foto" iconColor="green" icon="📷">
                        <CameraCapture onResult={setResult} />
                    </Card>
                </div>

                <SectionDivider label="Hasil Deteksi" />

                <div className="bg-white rounded-2xl shadow border border-gray-100">
                    {result ? (
                        <div className="p-6">
                            <SectionHeader title="Hasil Prediksi" iconColor="emerald" icon="📊" />
                            <PredictionResult result={result} />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}
