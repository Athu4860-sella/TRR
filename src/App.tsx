import React, { useState, useEffect, useMemo } from 'react';
import { GraphData, SimulationStep } from './types/graph';
import { PRESET_GRAPHS } from './data/presetGraphs';
import { calculateDegrees } from './utils/graphModel';
import { analyzeEuler, runHierholzerSimulation } from './algorithms/euler';
import { analyzeHamilton, runHamiltonSimulation } from './algorithms/hamilton';

import { GraphCanvas } from './components/GraphCanvas';
import { SimulationControls } from './components/SimulationControls';
import { AnalysisCards } from './components/AnalysisCards';
import { DegreeTable } from './components/DegreeTable';
import { PresetSelector } from './components/PresetSelector';
import { ImportExportModal } from './components/ImportExportModal';
import { TheoryModal } from './components/TheoryModal';
import { AlgorithmStepList } from './components/AlgorithmStepList';

import { 
  Network, 
  BookOpen, 
  FileCode
} from 'lucide-react';

export default function App() {
  // Trạng thái đồ thị (khởi tạo với Đồ thị Ngũ giác K5)
  const [graph, setGraph] = useState<GraphData>(() => PRESET_GRAPHS[0].graph);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_GRAPHS[0].id);

  // Tab phân tích đang chọn ('euler' | 'hamilton')
  const [activeTab, setActiveTab] = useState<'euler' | 'hamilton'>('euler');

  // Trạng thái thuật toán đang mô phỏng
  const [activeAlgorithm, setActiveAlgorithm] = useState<'euler' | 'hamilton' | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(500);

  // Các hộp thoại Modal
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);

  // Tính toán các thông số đồ thị tự động khi đồ thị thay đổi
  const degrees = useMemo(() => calculateDegrees(graph), [graph]);
  const eulerAnalysis = useMemo(() => analyzeEuler(graph), [graph]);
  const hamiltonResult = useMemo(() => analyzeHamilton(graph), [graph]);

  // Cập nhật kết quả Hamilton đầy đủ khi chạy hoặc phân tích
  const [hamiltonAnalysisState, setHamiltonAnalysisState] = useState(hamiltonResult.analysis);

  useEffect(() => {
    const runResult = runHamiltonSimulation(graph);
    setHamiltonAnalysisState(runResult.analysis);
  }, [graph]);

  // Reset mô phỏng khi sửa đồ thị
  const handleResetSimulation = () => {
    setIsPlaying(false);
    setActiveAlgorithm(null);
    setSimulationSteps([]);
    setCurrentStepIndex(0);
  };

  // Cập nhật đồ thị từ người dùng
  const handleUpdateGraph = (newGraph: GraphData) => {
    setGraph(newGraph);
    setSelectedPresetId('');
    handleResetSimulation();
  };

  // Chọn đồ thị mẫu
  const handleSelectPreset = (presetGraph: GraphData, presetId: string) => {
    setGraph(presetGraph);
    setSelectedPresetId(presetId);
    handleResetSimulation();
  };

  // Chạy mô phỏng thuật toán
  const handleRunSimulation = (algorithm: 'euler' | 'hamilton') => {
    setIsPlaying(false);
    setActiveAlgorithm(algorithm);
    setActiveTab(algorithm);

    if (algorithm === 'euler') {
      const { steps } = runHierholzerSimulation(graph);
      setSimulationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      const { steps, analysis } = runHamiltonSimulation(graph);
      setSimulationSteps(steps);
      setHamiltonAnalysisState(analysis);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  };

  // Vòng lặp phát mô phỏng tự động (Playback Loop)
  useEffect(() => {
    if (!isPlaying) return;

    if (simulationSteps.length === 0 || currentStepIndex >= simulationSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => {
        if (prev < simulationSteps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, simulationSteps.length, speedMs]);

  const currentStep = simulationSteps[currentStepIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* HEADER ỨNG DỤNG - SÁNG, HIỆN ĐẠI, GỌN GÀNG */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 backdrop-blur-md px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                MÔ PHỎNG ĐỒ THỊ EULER VÀ HAMILTON
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Toán Rời Rạc • Thuật toán Hierholzer & Quay lui Backtracking
              </p>
            </div>
          </div>

          {/* Các nút công cụ bổ trợ trên Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lý thuyết</span>
            </button>

            <button
              onClick={() => setIsImportExportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Nhập hoặc xuất danh sách cạnh bằng văn bản"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Nhập / Xuất cạnh</span>
            </button>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH (MAIN DASHBOARD) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRUNG TÂM & MÔ PHỎNG (Chiếm 7/12 trên Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Khu vực vẽ đồ thị SVG tương tác */}
          <div className="h-[460px] sm:h-[500px]">
            <GraphCanvas
              graph={graph}
              degrees={degrees}
              currentStep={currentStep}
              activeAlgorithm={activeAlgorithm}
              onUpdateGraph={handleUpdateGraph}
              onResetSimulation={handleResetSimulation}
            />
          </div>

          {/* Bảng điều khiển mô phỏng từng bước */}
          {activeAlgorithm && (
            <SimulationControls
              algorithmName={
                activeAlgorithm === 'euler'
                  ? 'Euler (Hierholzer)'
                  : 'Hamilton (Quay lui Backtracking)'
              }
              totalSteps={simulationSteps.length}
              currentStepIndex={currentStepIndex}
              currentStep={currentStep}
              isPlaying={isPlaying}
              speedMs={speedMs}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onNext={() => {
                setIsPlaying(false);
                if (currentStepIndex < simulationSteps.length - 1) {
                  setCurrentStepIndex(prev => prev + 1);
                }
              }}
              onPrev={() => {
                setIsPlaying(false);
                if (currentStepIndex > 0) {
                  setCurrentStepIndex(prev => prev - 1);
                }
              }}
              onReset={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              onSpeedChange={(newSpeed) => setSpeedMs(newSpeed)}
              onSeek={(idx) => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
            />
          )}

          {/* Danh sách các bước lịch sử */}
          {activeAlgorithm && simulationSteps.length > 1 && (
            <AlgorithmStepList
              steps={simulationSteps}
              currentStepIndex={currentStepIndex}
              onSelectStep={(idx) => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
            />
          )}

          {/* Thống kê bậc và đỉnh */}
          <DegreeTable
            vertices={graph.vertices}
            edges={graph.edges}
            degrees={degrees}
          />
        </div>

        {/* CỘT BÊN PHẢI (Chiếm 5/12 trên Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Thẻ kiểm tra tính chất Euler & Hamilton và kích hoạt thuật toán */}
          <AnalysisCards
            eulerAnalysis={eulerAnalysis}
            hamiltonAnalysis={hamiltonAnalysisState}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
            }}
            onRunSimulation={handleRunSimulation}
          />

          {/* Thư viện Đồ thị mẫu */}
          <PresetSelector
            currentGraphId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        Mô Phỏng Đồ Thị Euler & Hamilton • Toán Rời Rạc
      </footer>

      {/* MODAL LÝ THUYẾT */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* MODAL NHẬP / XUẤT CẠNH */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        currentGraph={graph}
        onClose={() => setIsImportExportOpen(false)}
        onImportGraph={handleUpdateGraph}
      />
    </div>
  );
}
