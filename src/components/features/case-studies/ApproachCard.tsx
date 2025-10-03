import { Search, Wrench, BarChart3 } from 'lucide-react';
import { ApproachItem } from '@/components/features/types';
import { JSX } from 'react';

interface ApproachCardProps {
  item: ApproachItem;
}

export const ApproachCard: React.FC<ApproachCardProps> = ({ item }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    search: <Search className="w-8 h-8" />,
    wrench: <Wrench className="w-8 h-8" />,
    chart: <BarChart3 className="w-8 h-8" />,
  };

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full text-orange-500 mb-4">
        {iconMap[item.icon]}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
      <p className="text-slate-400 text-sm">{item.description}</p>
    </div>
  );
};