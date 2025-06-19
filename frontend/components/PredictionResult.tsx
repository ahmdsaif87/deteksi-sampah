import { CheckCircle, Info, AlertCircle } from "lucide-react";

export default function PredictionResult({ result }: { result: any }) {
    if (!result) return null;

    const getWasteTypeColor = (wasteType: string) => {
        switch (wasteType.toLowerCase()) {
            case 'cardboard':
            case 'kardus':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'plastic':
            case 'plastik':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'metal':
            case 'logam':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'organic':
            case 'organik':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'glass':
            case 'kaca':
                return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            default:
                return 'bg-purple-100 text-purple-800 border-purple-200';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Hasil Klasifikasi</h2>
            </div>

            <div className="space-y-6">
                {/* Waste Type Classification */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">Jenis Sampah:</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getWasteTypeColor(result.prediction || 'cardboard')}`}>
                            {result.prediction || 'cardboard'}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Deskripsi:</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                        {result.recommendation?.deskripsi || 'Kardus bekas dari kemasan, biasanya berbahan dasar kertas tebal.'}
                    </p>
                </div>

                {/* Handling Instructions */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Cara Penanganan:</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <ul className="space-y-3">
                            {(result.recommendation?.cara_penanganan || [
                                'Lipat agar hemat tempat.',
                                'Pastikan kering dan bersih dari minyak atau makanan.',
                                'Kumpulkan dan jual ke pengepul atau bank sampah.'
                            ]).map((step: string, i: number) => (
                                <li key={i} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-sm font-medium">{i + 1}</span>
                                    </div>
                                    <span className="text-gray-700">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Note/Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-800 mb-1">Catatan:</h4>
                            <p className="text-yellow-700 text-sm italic">
                                {result.recommendation?.catatan || 'Kardus basah atau berminyak sulit didaur ulang.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}