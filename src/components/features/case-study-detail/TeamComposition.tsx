import { Users, MapPin } from 'lucide-react';

interface TeamMember {
  role: string;
  count?: number;
  location?: string;
  responsibilities?: string[];
}

interface TeamCompositionProps {
  size: string;
  structure: TeamMember[];
  collaboration?: string;
}

export const TeamComposition: React.FC<TeamCompositionProps> = ({ 
  size, 
  structure, 
  collaboration 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/20 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-orange-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Composition</h3>
        <span className="text-sm text-gray-500 dark:text-slate-400">({size})</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {structure.map((member, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-800/40 rounded-lg p-3 border border-gray-100 dark:border-slate-700"
          >
            <div className="font-medium text-gray-900 dark:text-white text-sm">
              {member.count && member.count > 1 ? `${member.count}× ` : ''}{member.role}
            </div>
            {member.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 mt-1">
                <MapPin size={12} />
                {member.location}
              </div>
            )}
          </div>
        ))}
      </div>

      {collaboration && (
        <p className="text-sm text-gray-600 dark:text-slate-300 italic border-t border-gray-200 dark:border-slate-700 pt-3">
          {collaboration}
        </p>
      )}
    </div>
  );
};