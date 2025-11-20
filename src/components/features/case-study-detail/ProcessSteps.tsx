import { ProcessStep } from '@/components/features/types/caseStudyDetail';

interface ProcessStepsProps {
  steps: ProcessStep[];
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-8">
      {steps.map((step) => (
        <div key={step.number} className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-gray-900 dark:text-white flex items-center justify-center font-bold">
              {step.number}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-slate-300">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};