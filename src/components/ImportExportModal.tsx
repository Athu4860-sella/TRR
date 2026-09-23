import React, { useState } from 'react';
import { GraphData } from '../types/graph';
import { parseEdgeList, exportToEdgeList } from '../utils/graphModel';
import { X, FileText, Check, AlertTriangle, Copy, Upload } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  currentGraph: GraphData;
  onClose: () => void;
  onImportGraph: (importedGraph: GraphData) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  currentGraph,
  onClose,
  onImportGraph,
}) => {
  const [inputText, setInputText] = useState(() => exportToEdgeList(currentGraph));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleImport = () => {
    setErrorMessage(null);
    const result = parseEdgeList(inputText, 600, 500);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    if (result.graph) {
      onImportGraph(result.graph);
      onClose();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Nhập / Xuất Danh Sách Cạnh Đồ Thị
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hướng dẫn định dạng */}
        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <strong className="text-slate-900 block mb-1">Quy cách định dạng:</strong>
          Mỗi dòng biểu diễn một cạnh gồm hai đỉnh cách nhau bởi dấu cách hoặc dấu gạch nối. Ví dụ:
          <pre className="font-mono text-indigo-700 mt-1.5 p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
{`A B
B C
C A
D`}
          </pre>
          <em className="text-slate-500 mt-1 block">* Ghi chú: Dòng chỉ có một đỉnh đại diện cho đỉnh cô lập (như đỉnh D). Đồ thị vô hướng không cho phép cạnh khuyên (A A).</em>
        </div>

        {/* Khu vực nhập văn bản */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Danh sách cạnh:
          </label>
          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Ví dụ:&#10;1 2&#10;2 3&#10;3 1"
            className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Hành động */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nạp vào Đồ Thị</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
