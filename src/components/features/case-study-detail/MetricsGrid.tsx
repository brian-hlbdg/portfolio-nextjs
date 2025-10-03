import { Metric } from '@/components/features/types/caseStudyDetail';

interface MetricsGridProps {
  metrics: Metric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const colorMap = {
    orange: 'text-orange-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">{metric.label}</div>
          <div className={`text-4xl font-bold mb-1 ${colorMap[metric.color]}`}>
            {metric.value}
          </div>
          <div className="text-slate-300 text-sm mb-1">{metric.change}</div>
          <div className="text-slate-500 text-xs">{metric.description}</div>
        </div>
      ))}
    </div>
  );
};