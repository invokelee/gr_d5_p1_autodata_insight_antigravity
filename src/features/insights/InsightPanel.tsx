
import { Sparkles, AlertTriangle, Target } from 'lucide-react';

interface InsightPanelProps {
  insights: any;
  compact?: boolean;
}

export function InsightPanel({ insights, compact = false }: InsightPanelProps) {
  if (!insights) return null;

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm text-white h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-purple-200" />
          <h3 className="font-semibold text-lg">AI Quick Summary</h3>
        </div>
        <p className="text-sm text-indigo-50 leading-relaxed mb-4 line-clamp-3">
          {insights.features?.[0] || 'AI is analyzing your data to generate key insights and action plans.'}
        </p>
        <div className="text-xs bg-black/20 p-2 rounded inline-block">
          {insights.outliers?.length || 0} Outliers Detected
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
        <Sparkles size={20} className="text-purple-500" />
        <h3 className="font-bold text-lg text-slate-800">Generative AI Insights (Gemini)</h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Features */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <div className="bg-blue-100 p-1.5 rounded"><Sparkles size={16} /></div>
            <h4 className="font-semibold text-slate-800">Key Features</h4>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {insights.features?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outliers */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-amber-600">
            <div className="bg-amber-100 p-1.5 rounded"><AlertTriangle size={16} /></div>
            <h4 className="font-semibold text-slate-800">Notable Outliers</h4>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {insights.outliers?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Plan */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-emerald-600">
            <div className="bg-emerald-100 p-1.5 rounded"><Target size={16} /></div>
            <h4 className="font-semibold text-slate-800">Action Plan</h4>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {insights.action_plan?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
