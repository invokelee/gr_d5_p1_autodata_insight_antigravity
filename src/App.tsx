import { useState } from 'react';
import axios from 'axios';
import { UploadArea } from './features/upload/UploadArea';
import { Dashboard } from './features/dashboard/Dashboard';
import { Activity } from 'lucide-react';

function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send to FastAPI backend
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AutoData Insight</h1>
          <p className="text-sm text-slate-500">Automated Exploratory Data Analysis & AI Insights</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {!data && !loading && <UploadArea onUpload={handleUpload} />}
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 font-medium animate-pulse">Analyzing data and generating AI insights...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">Error analyzing data:</p>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-3 bg-white text-red-600 px-4 py-2 rounded border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {data && !loading && (
          <Dashboard data={data} onReset={() => setData(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
