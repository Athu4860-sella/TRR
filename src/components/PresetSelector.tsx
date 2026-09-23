import React, { useState } from 'react';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { GraphData } from '../types/graph';
import { FolderGit2 } from 'lucide-react';

interface PresetSelectorProps {
  currentGraphId?: string;
  onSelectPreset: (graph: GraphData, presetId: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentGraphId,
  onSelectPreset,
}) => {
  const [filter, setFilter] = useState<'all' | 'euler' | 'hamilton' | 'edge_case'>('all');

  const filteredPresets = PRESET_GRAPHS.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'euler') return p.category === 'euler' || p.category === 'both';
    if (filter === 'hamilton') return p.category === 'hamilton' || p.category === 'both';
    if (filter === 'edge_case') return p.category === 'edge_case';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Thư Viện Đồ Thị Mẫu
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Tất cả ({PRESET_GRAPHS.length})
        </button>
        <button
          onClick={() => setFilter('euler')}
          className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${
            filter === 'euler'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Euler
        </button>
        <button
          onClick={() => setFilter('hamilton')}
          className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${
            filter === 'hamilton'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Hamilton
        </button>
        <button
          onClick={() => setFilter('edge_case')}
          className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${
            filter === 'edge_case'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rời rạc & Biên
        </button>
      </div>

      {/* Preset List */}
      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-0.5">
        {filteredPresets.map(preset => {
          const isSelected = currentGraphId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.graph, preset.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-400 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  {preset.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white text-indigo-700 border border-slate-200 font-mono font-medium shadow-2xs">
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
