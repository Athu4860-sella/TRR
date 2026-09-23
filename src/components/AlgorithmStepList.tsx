import React from 'react';
import { SimulationStep } from '../types/graph';
import { ListFilter } from 'lucide-react';

interface AlgorithmStepListProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const AlgorithmStepList: React.FC<AlgorithmStepListProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
}) => {
  if (steps.length <= 1) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900">
            Nhật Ký Từng Bước ({steps.length} bước)
          </h4>
        </div>
        <span className="text-[11px] text-slate-500">
          Nhấp bước để xem lại
        </span>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-0.5 font-mono text-xs">
        {steps.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;

          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (step.status === 'traversing' || step.status === 'visiting') {
            badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
          } else if (step.status === 'backtracking') {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
          } else if (step.status === 'deadend') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (step.status === 'success') {
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectStep(idx)}
              className={`w-full text-left p-2 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                  : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${badgeColor}`}
              >
                #{idx + 1}
              </span>

              <div className="flex-1 min-w-0 font-sans text-xs">
                <p className="font-semibold truncate text-slate-900">
                  {step.message}
                </p>
                {step.currentPath && step.currentPath.length > 0 && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                    Đường đi: {step.currentPath.join(' → ')}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
