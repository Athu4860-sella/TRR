import React from 'react';
import { DegreeInfo, Edge, Vertex } from '../types/graph';
import { Network, Hash, GitBranch } from 'lucide-react';

interface DegreeTableProps {
  vertices: Vertex[];
  edges: Edge[];
  degrees: DegreeInfo[];
  onDeleteVertex?: (vertexId: string) => void;
  onDeleteEdge?: (edgeId: string) => void;
}

export const DegreeTable: React.FC<DegreeTableProps> = ({
  vertices,
  edges,
  degrees,
}) => {
  const totalDegree = degrees.reduce((acc, curr) => acc + curr.degree, 0);
  const oddCount = degrees.filter(d => !d.isEven).length;
  const evenCount = degrees.filter(d => d.isEven).length;

  const vertexMap = new Map(vertices.map(v => [v.id, v.label]));

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3.5">
      {/* Tiêu đề & Thống kê cơ bản */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Thông số Đồ thị & Bậc Đỉnh
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-mono">
            Bậc lẻ: <strong className="text-amber-600 font-bold">{oddCount}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-mono">
            Bậc chẵn: <strong className="text-slate-800 font-bold">{evenCount}</strong>
          </span>
        </div>
      </div>

      {/* Thẻ định lý bắt tay Euler Handshaking Lemma */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[11px] font-medium">Số đỉnh |V|</span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {vertices.length}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[11px] font-medium">Số cạnh |E|</span>
          <span className="text-base font-bold text-indigo-600 font-mono">
            {edges.length}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2" title="Định lý bắt tay: Tổng bậc các đỉnh = 2 * Số cạnh">
          <span className="text-slate-500 block text-[11px] font-medium">Tổng bậc ∑deg</span>
          <span className="text-base font-bold text-emerald-600 font-mono">
            {totalDegree}
          </span>
        </div>
      </div>

      {/* Bảng bậc của từng đỉnh */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-slate-500" />
          Bảng Bậc & Đỉnh kề:
        </span>

        {degrees.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">Chưa có đỉnh nào.</p>
        ) : (
          <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 font-semibold">Đỉnh</th>
                  <th className="py-2 px-3 font-semibold">Bậc (deg)</th>
                  <th className="py-2 px-3 font-semibold">Tính chất</th>
                  <th className="py-2 px-3 font-semibold">Đỉnh kề</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {degrees.map(d => (
                  <tr key={d.vertexId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-slate-900">
                      {d.label}
                    </td>
                    <td className="py-1.5 px-3 font-bold">
                      <span className={d.degree === 0 ? 'text-slate-400' : d.isEven ? 'text-slate-800' : 'text-amber-600'}>
                        {d.degree}
                      </span>
                    </td>
                    <td className="py-1.5 px-3">
                      {d.degree === 0 ? (
                        <span className="text-slate-500 text-[11px] font-sans">Cô lập</span>
                      ) : d.isEven ? (
                        <span className="text-slate-600 text-[11px] font-sans">Chẵn</span>
                      ) : (
                        <span className="text-amber-700 text-[11px] font-sans font-semibold">Lẻ</span>
                      )}
                    </td>
                    <td className="py-1.5 px-3 text-slate-600 font-sans text-[11px] truncate max-w-[140px]" title={d.neighbors.join(', ')}>
                      {d.neighbors.length > 0 ? d.neighbors.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danh sách các cạnh */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-slate-500" />
          Danh sách cạnh ({edges.length}):
        </span>

        {edges.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">Chưa có cạnh nào.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200/80">
            {edges.map(e => {
              const u = vertexMap.get(e.source) || e.source;
              const v = vertexMap.get(e.target) || e.target;
              return (
                <span
                  key={e.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-slate-700 text-xs font-mono border border-slate-200 shadow-2xs"
                >
                  ({u} – {v})
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
