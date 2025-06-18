// PredictionResult.tsx
export default function PredictionResult({ result }: { result: any }) {
    if (!result) return null;

    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl font-bold">Hasil Klasifikasi</h2>
            <p><strong>Jenis Sampah:</strong> {result.prediction}</p>
            <p><strong>Deskripsi:</strong> {result.recommendation.deskripsi}</p>
            <ul className="list-disc ml-6">
                {result.recommendation.cara_penanganan.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>
            <p className="italic text-sm text-gray-500">Catatan: {result.recommendation.catatan}</p>
        </div>
    );
}
