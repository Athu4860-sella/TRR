import React from 'react';
import { EulerAnalysis, HamiltonAnalysis } from '../types/graph';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Play, 
  ArrowRight, 
  Lightbulb, 
  BookOpen,
  Route,
  Compass
} from 'lucide-react';

interface AnalysisCardsProps {
  eulerAnalysis: EulerAnalysis;
  hamiltonAnalysis: HamiltonAnalysis;
  activeTab: 'euler' | 'hamilton';
  onSelectTab: (tab: 'euler' | 'hamilton') => void;
  onRunSimulation: (algorithm: 'euler' | 'hamilton') => void;
}

export const AnalysisCards: React.FC<AnalysisCardsProps> = ({
  eulerAnalysis,
  hamiltonAnalysis,
  activeTab,
  onSelectTab,
  onRunSimulation,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Thanh chọn Tab */}
      <div className="grid grid-cols-2 bg-slate-50/80 border-b border-slate-200/80">
        <button
          onClick={() => onSelectTab('euler')}
          className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'euler'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Kiểm tra Euler</span>
          {eulerAnalysis.hasEuler ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-300 ml-1" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('hamilton')}
          className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'hamilton'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Kiểm tra Hamilton</span>
          {hamiltonAnalysis.hasCycle ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-300 ml-1" />
          )}
        </button>
      </div>

      {/* Nội dung Tab */}
      <div className="p-4 flex flex-col gap-3.5">
        {activeTab === 'euler' ? (
          /* TAB EULER */
          <div className="flex flex-col gap-3">
            {/* Thẻ trạng thái kết quả */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                eulerAnalysis.type === 'circuit'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : eulerAnalysis.type === 'path'
                  ? 'bg-sky-50/80 border-sky-200 text-sky-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {eulerAnalysis.hasEuler ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {eulerAnalysis.type === 'circuit' && 'Có Chu trình Euler'}
                    {eulerAnalysis.type === 'path' && 'Có Đường đi Euler'}
                    {eulerAnalysis.type === 'none' && 'Không có Chu trình hay Đường đi Euler'}
                  </span>
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
                  {eulerAnalysis.type === 'circuit' && 'Eulerian Circuit'}
                  {eulerAnalysis.type === 'path' && 'Eulerian Trail'}
                  {eulerAnalysis.type === 'none' && 'Non-Eulerian'}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {eulerAnalysis.reason}
              </p>
            </div>

            {/* Chi tiết điều kiện định lý Euler */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs flex flex-col gap-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Kiểm tra Định lý Euler:
              </span>

              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-start gap-2">
                  {eulerAnalysis.isAllConnectedNonZero ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                  )}
                  <span>
                    <strong className="text-slate-900">Tính liên thông:</strong>{' '}
                    {eulerAnalysis.isAllConnectedNonZero
                      ? 'Liên thông trên tất cả đỉnh có bậc > 0.'
                      : `Không liên thông (${eulerAnalysis.componentsCountNonZero} thành phần).`}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 ${
                      eulerAnalysis.oddDegreeCount === 0 || eulerAnalysis.oddDegreeCount === 2
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {eulerAnalysis.oddDegreeCount}
                  </span>
                  <span>
                    <strong className="text-slate-900">Số đỉnh bậc lẻ:</strong> {eulerAnalysis.oddDegreeCount} đỉnh.{' '}
                    {eulerAnalysis.oddDegreeCount === 0 && 'Tất cả đỉnh đều bậc chẵn → Chu trình Euler.'}
                    {eulerAnalysis.oddDegreeCount === 2 && (
                      <>
                        Đúng 2 đỉnh bậc lẻ ({eulerAnalysis.oddDegreeVertices.map(v => v.label).join(', ')}) → Đường đi Euler.
                      </>
                    )}
                    {eulerAnalysis.oddDegreeCount > 2 && (
                      <span className="text-rose-700">
                        Nhiều hơn 2 đỉnh bậc lẻ ({eulerAnalysis.oddDegreeVertices.map(v => v.label).join(', ')}).
                      </span>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            {/* Nút kích hoạt mô phỏng Hierholzer */}
            <button
              onClick={() => onRunSimulation('euler')}
              disabled={!eulerAnalysis.hasEuler}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                {eulerAnalysis.hasEuler
                  ? 'Mô phỏng thuật toán Hierholzer từng bước'
                  : 'Không thể mô phỏng (Đồ thị không Euler)'}
              </span>
            </button>
          </div>
        ) : (
          /* TAB HAMILTON */
          <div className="flex flex-col gap-3">
            {/* Thẻ trạng thái kết quả */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                hamiltonAnalysis.hasCycle
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {hamiltonAnalysis.hasCycle ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {hamiltonAnalysis.hasCycle
                      ? 'Tìm thấy Chu trình Hamilton'
                      : 'Không tìm thấy Chu trình Hamilton'}
                  </span>
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
                  {hamiltonAnalysis.hasCycle ? 'Hamiltonian' : 'Non-Hamiltonian'}
                </span>
              </div>

              {hamiltonAnalysis.hasCycle && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 overflow-x-auto py-1">
                  <strong>Chu trình:</strong>
                  {hamiltonAnalysis.cycleLabels.map((lbl, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />}
                      <span className="px-1.5 py-0.5 bg-emerald-100 rounded border border-emerald-200 text-emerald-800 font-bold">
                        {lbl}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {hamiltonAnalysis.reason || 'Dùng thuật toán quay lui (Backtracking) để tìm chu trình qua tất cả các đỉnh.'}
              </p>
            </div>

            {/* Ghi chú lý thuyết & Định lý Dirac / Ore */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs flex flex-col gap-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Đánh giá Lý thuyết:
              </span>

              <ul className="space-y-1.5 text-slate-700">
                {hamiltonAnalysis.theoreticalNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-1 pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Lưu ý:</strong> Bài toán tìm chu trình Hamilton thuộc lớp NP-đầy đủ (NP-complete). Thuật toán quay lui duyệt vét cạn để tìm kiếm chu trình hoặc chứng thực không tồn tại.
              </div>
            </div>

            {/* Nút kích hoạt mô phỏng Backtracking Hamilton */}
            <button
              onClick={() => onRunSimulation('hamilton')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Mô phỏng thuật toán Quay lui (Backtracking)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
