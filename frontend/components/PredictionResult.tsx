// PredictionResult Component
export default function PredictionResult({ result }: { result: any }) {
    if (!result) return null;

    if (result.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                        <p className="text-red-700">{result.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const getWasteTypeIcon = (prediction: string) => {
        const type = prediction?.toLowerCase();
        if (type?.includes('organic') || type?.includes('organik')) {
            return (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                    </svg>
                </div>
            );
        } else if (type?.includes('plastic') || type?.includes('plastik')) {
            return (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Prediction Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                    {getWasteTypeIcon(result.prediction)}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Hasil Deteksi</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Jenis Sampah:</p>
                            <p className="text-2xl font-bold text-emerald-700">{result.prediction}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Rekomendasi Pengelolaan</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-amber-800">
                        <strong>Tips:</strong> Selalu pastikan sampah sudah bersih sebelum didaur ulang, dan pisahkan sesuai jenisnya untuk hasil terbaik.
                    </p>
                </div>
            </div>
        </div>
    );
}