import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

interface UploadAreaProps {
  onUpload: (file: File) => void;
}

export function UploadArea({ onUpload }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center mb-4 text-blue-500">
          <UploadCloud size={48} />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          {isDragActive ? 'Drop the CSV file here' : 'Drag & Drop your CSV file'}
        </h3>
        <p className="text-slate-500 mb-6">or click to browse from your computer</p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <FileSpreadsheet size={16} />
          <span>Supported format: .csv</span>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
        <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside">
          <li>Upload your raw dataset (CSV).</li>
          <li>Our Python engine performs automatic Exploratory Data Analysis (EDA).</li>
          <li>Gemini AI analyzes the distributions and patterns to generate business insights.</li>
          <li>Explore interactive charts and the generated report instantly.</li>
        </ul>
      </div>
    </div>
  );
}
