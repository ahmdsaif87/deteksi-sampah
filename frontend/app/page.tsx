"use client";

import { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import { RotateCcw } from "lucide-react"
import CameraCapture from "@/components/CameraCapture";
import PredictionResult from "@/components/PredictionResult";
import { Button } from "@/components/ui/button"
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
  const resetDetection = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      -<div className="items-center justify-center flex flex-col px-4 py-8  text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🗂️ Deteksi Sampah
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Upload gambar atau gunakan kamera untuk mendeteksi jenis sampah
        </p>

        <div className="grid grid-cols-3 gap-6 mb-10 w-7xl ">
          <Card title="Upload Gambar" iconColor="blue" icon="📁" >
            <UploadForm onResult={setResult} />
          </Card>
          <Card title="Ambil Foto" iconColor="green" icon="📷">
            <CameraCapture onResult={setResult} />
          </Card>
          <Card title="Hasil Deteksi" iconColor="emerald" icon="📊">
            {result ? (
              <div className="p-6">
                <PredictionResult result={result} />
              </div>
            ) : (
              <EmptyState />
            )}
          </Card>
        </div>

        {result && (
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
    </div>
  );
}