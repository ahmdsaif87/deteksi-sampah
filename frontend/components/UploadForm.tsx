// UploadForm.tsx
import { useState } from "react";

export default function UploadForm({ onResult }: { onResult: (data: any) => void }) {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/v1/predict", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            onResult(data); // kirim hasil ke komponen lain (PredictionResult misalnya)
        } catch (err) {
            console.error("Gagal mengunggah gambar:", err);
        }
    };

    return (
        <div className="space-y-4">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
                Upload
            </button>
        </div>
    );
}
