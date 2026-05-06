
import { DataChart } from '../charts/DataChart';
import { InsightPanel } from '../insights/InsightPanel';
import { ArrowLeft, Database, Search } from 'lucide-react';

interface DashboardProps {
  data: any;
  onReset: () => void;
}

export function Dashboard({ data, onReset }: DashboardProps) {
  const { eda, insights } = data;
  
  if (!eda) return null;

  const { dataset_info, missing_values, distributions, preview } = eda;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300"
        >
          <ArrowLeft size={16} />
          Analyze Another File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dataset Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Database size={24} />
            <h3 className="font-semibold text-lg text-slate-800">Dataset Overview</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Rows</span>
              <span className="font-medium">{dataset_info?.num_rows?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Columns</span>
              <span className="font-medium">{dataset_info?.num_cols?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Numeric Cols</span>
              <span className="font-medium">{dataset_info?.numeric_columns?.length || 0}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-slate-500">Categorical Cols</span>
              <span className="font-medium">{dataset_info?.categorical_columns?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Missing Values */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-amber-500">
            <Search size={24} />
            <h3 className="font-semibold text-lg text-slate-800">Missing Values</h3>
          </div>
          <div className="max-h-36 overflow-y-auto pr-2 text-sm">
            {Object.keys(missing_values || {}).length === 0 ? (
              <p className="text-slate-500 italic">No missing values found.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(missing_values).map(([col, count]: [string, any]) => (
                  <div key={col} className="flex justify-between bg-amber-50 p-2 rounded">
                    <span className="text-slate-700 truncate max-w-[120px]" title={col}>{col}</span>
                    <span className="font-semibold text-amber-700">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Panel (Summary) */}
        <div className="md:col-span-1">
            <InsightPanel insights={insights} compact={true} />
        </div>
      </div>

      {/* Main Insights Panel */}
      <InsightPanel insights={insights} />

      {/* Charts Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Data Distributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(distributions || {}).map(([colName, distData]: [string, any]) => (
            <div key={colName} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h4 className="font-semibold text-slate-700 mb-4 text-center">{colName}</h4>
              <DataChart data={distData.data} type={distData.type} />
            </div>
          ))}
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <h3 className="font-bold text-slate-800 mb-4">Data Preview (Top 5 Rows)</h3>
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              {eda.columns?.slice(0, 15).map((col: string) => (
                <th key={col} className="px-4 py-3 whitespace-nowrap">{col}</th>
              ))}
              {eda.columns?.length > 15 && <th className="px-4 py-3">...</th>}
            </tr>
          </thead>
          <tbody>
            {preview?.map((row: any, i: number) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                {eda.columns?.slice(0, 15).map((col: string) => (
                  <td key={col} className="px-4 py-2 truncate max-w-[150px]">{String(row[col] ?? '')}</td>
                ))}
                {eda.columns?.length > 15 && <td className="px-4 py-2">...</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
