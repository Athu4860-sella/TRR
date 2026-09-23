import React from 'react';
import { SimulationStep } from '../types/graph';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Gauge, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ListOrdered
} from 'lucide-react';

interface SimulationControlsProps {
  algorithmName: 'Euler (Hierholzer)' | 'Hamilton (Quay lui Backtracking)';
  totalSteps: number;
  currentStepIndex: number;
  currentStep?: SimulationStep;
  isPlaying: boolean;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  onSeek: (stepIndex: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  algorithmName,
  totalSteps,
  currentStepIndex,
  currentStep,
  isPlaying,
  speedMs,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onSeek,
}) => {
  const isFinished = currentStepIndex >= totalSteps - 1 && totalSteps > 0;
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < totalSteps - 1;

  const getStatusBadge = () => {
    if (!currentStep) return null;
    switch (currentStep.status) {
      case 'starting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Khởi tạo
          </span>
        );
      case 'traversing':
      case 'visiting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            Đang duyệt cạnh
          </span>
        );
      case 'backtracking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Quay lui (Backtrack)
          </span>
        );
      case 'deadend':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Bế tắc nhánh
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tìm thấy kết quả
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Không tồn tại
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Tiêu đề & Thông tin tiến độ */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-700">
            {algorithmName}
          </span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>
            Bước <strong className="text-slate-900 font-semibold">{totalSteps > 0 ? currentStepIndex + 1 : 0}</strong> / {totalSteps}
          </span>
        </div>
      </div>

      {/* Hộp giải thích bước hiện tại */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 min-h-[70px] flex flex-col justify-center">
        {currentStep ? (
          <div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <span>{currentStep.message}</span>
            </div>
            {currentStep.detail && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentStep.detail}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Chưa bắt đầu mô phỏng. Bấm "Bắt đầu" để chạy từng bước thuật toán.
          </p>
        )}
      </div>

      {/* Hiển thị đường đi / chu trình hình thành đến thời điểm hiện tại */}
      {currentStep && currentStep.currentPath && currentStep.currentPath.length > 0 && (
        <div className="flex items-center gap-2 text-xs overflow-x-auto py-1 px-2.5 bg-slate-50/70 rounded-lg border border-slate-200/80">
          <span className="text-slate-600 font-medium shrink-0 flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
            Đường đi:
          </span>
          <div className="flex items-center gap-1 font-mono text-indigo-700">
            {currentStep.currentPath.map((label, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />}
                <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-xs font-semibold text-indigo-700">
                  {label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Thanh trượt tiến trình bước (Scrubber) */}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          disabled={totalSteps <= 1}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
        />
      </div>

      {/* Các nút điều khiển & Tốc độ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Nhóm nút tua / phát */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            disabled={totalSteps === 0 || currentStepIndex === 0}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            title="Đặt lại về bước đầu tiên"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            title="Bước trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Tạm dừng mô phỏng"
            >
              <Pause className="w-4 h-4" />
              <span>Tạm dừng</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={totalSteps === 0 || isFinished}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
              title={isFinished ? 'Đã hoàn thành' : 'Bắt đầu / Tiếp tục mô phỏng'}
            >
              <Play className="w-4 h-4" />
              <span>{currentStepIndex === 0 ? 'Bắt đầu' : 'Tiếp tục'}</span>
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            title="Bước tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Điều chỉnh tốc độ */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          <Gauge className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">
            Tốc độ:
          </span>
          <select
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-transparent text-xs text-indigo-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value={1500} className="text-slate-800">0.25x (Chậm - 1.5s)</option>
            <option value={900} className="text-slate-800">0.5x (Vừa - 0.9s)</option>
            <option value={500} className="text-slate-800">1x (Chuẩn - 0.5s)</option>
            <option value={200} className="text-slate-800">2x (Nhanh - 0.2s)</option>
            <option value={80} className="text-slate-800">5x (Cực nhanh - 0.08s)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
