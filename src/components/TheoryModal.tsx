import React, { useState } from 'react';
import { X, BookOpen, Route, Compass, CheckCircle2 } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'euler' | 'hamilton' | 'comparison'>('euler');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">
              Lý Thuyết & Thuật Toán: Euler và Hamilton
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('euler')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'euler'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Đồ thị Euler & Hierholzer</span>
          </button>
          <button
            onClick={() => setActiveTab('hamilton')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hamilton'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Đồ thị Hamilton & Quay lui</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Bảng So Sánh Euler vs Hamilton</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'euler' && (
            <div className="space-y-4">
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  1. Khái niệm Đồ thị Euler
                </h4>
                <p>
                  Đồ thị Euler là đồ thị vô hướng trong đó ta có thể vẽ qua <strong>mọi cạnh đúng một lần</strong>.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
                  <li>
                    <strong className="text-slate-900">Chu trình Euler:</strong> Là chu trình đơn đi qua tất cả các cạnh của đồ thị, mỗi cạnh đúng một lần và quay về đỉnh xuất phát.
                  </li>
                  <li>
                    <strong className="text-slate-900">Đường đi Euler:</strong> Là đường đi đơn đi qua tất cả các cạnh của đồ thị, mỗi cạnh đúng một lần (đỉnh đầu khác đỉnh cuối).
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  2. Định lý Euler (Điều kiện Cần và Đủ)
                </h4>
                <ul className="space-y-2">
                  <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <strong className="text-emerald-700">Chu trình Euler:</strong> Đồ thị vô hướng G có chu trình Euler khi và chỉ khi G liên thông trên các đỉnh có bậc khác 0 và <strong>tất cả các đỉnh đều có bậc chẵn</strong> (deg(v) là số chẵn).
                  </li>
                  <li className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <strong className="text-indigo-700">Đường đi Euler:</strong> Đồ thị vô hướng G có đường đi Euler khi và chỉ khi G liên thông trên các đỉnh có bậc khác 0 và có <strong>đúng 2 đỉnh bậc lẻ</strong> (đường đi sẽ bắt đầu từ một đỉnh bậc lẻ và kết thúc ở đỉnh bậc lẻ còn lại).
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  3. Thuật toán Hierholzer (Độ phức tạp O(|E|))
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Bắt đầu tại đỉnh có bậc lẻ (nếu tìm đường đi) hoặc đỉnh bậc chẵn bất kỳ (nếu tìm chu trình).</li>
                  <li>Sử dụng cấu trúc Ngăn xếp (Stack) để duyệt qua các cạnh chưa được đánh dấu.</li>
                  <li>Nếu từ đỉnh hiện tại còn cạnh chưa đi, đẩy đỉnh kề vào ngăn xếp và đánh dấu cạnh đã dùng.</li>
                  <li>Nếu không còn cạnh chưa đi, lấy đỉnh ra khỏi ngăn xếp và đưa vào chuỗi kết quả.</li>
                  <li>Khi ngăn xếp rỗng, chuỗi kết quả đảo ngược chính là Chu trình/Đường đi Euler hoàn chỉnh.</li>
                </ol>
              </section>
            </div>
          )}

          {activeTab === 'hamilton' && (
            <div className="space-y-4">
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  1. Khái niệm Đồ thị Hamilton
                </h4>
                <p>
                  Đồ thị Hamilton tập trung vào <strong>đỉnh</strong> thay vì cạnh:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
                  <li>
                    <strong className="text-slate-900">Chu trình Hamilton:</strong> Chu trình đơn đi qua <strong>tất cả các đỉnh</strong> của đồ thị, mỗi đỉnh đúng một lần, rồi trở về đỉnh ban đầu (yêu cầu số đỉnh n &ge; 3).
                  </li>
                  <li>
                    <strong className="text-slate-900">Đường đi Hamilton:</strong> Đường đi đơn đi qua mọi đỉnh của đồ thị mỗi đỉnh đúng một lần.
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  2. Các Định lý Kinh điển (Điều kiện Đủ)
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <strong className="text-amber-700">Định lý Dirac (1952):</strong> Cho đồ thị đơn vô hướng G có n &ge; 3 đỉnh. Nếu với mọi đỉnh v thuộc V, deg(v) &ge; n / 2 thì G có chu trình Hamilton.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <strong className="text-amber-700">Định lý Ore (1960):</strong> Cho đồ thị đơn vô hướng G có n &ge; 3 đỉnh. Nếu với mọi cặp đỉnh không kề nhau u, v, ta có deg(u) + deg(v) &ge; n thì G có chu trình Hamilton.
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                    <strong>Điều kiện Cần:</strong> Nếu tồn tại đỉnh v có bậc nhỏ hơn 2 (deg(v) &lt; 2) hoặc đồ thị không liên thông, đồ thị chắc chắn không thể chứa chu trình Hamilton.
                  </div>
                </div>
              </section>

              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-sm text-indigo-900 mb-1.5">
                  3. Thuật toán Quay lui (Backtracking)
                </h4>
                <p>
                  Vì bài toán Chu trình Hamilton thuộc lớp <strong>NP-đầy đủ</strong>, không tồn tại thuật toán đa thức tổng quát. Ứng dụng triển khai thuật toán Quay lui:
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-1.5 text-slate-700">
                  <li>Khởi tạo đường đi từ đỉnh đầu tiên v0. Đánh dấu đã thăm.</li>
                  <li>Tại mỗi bước, thử mở rộng tới các đỉnh kề chưa nằm trong đường đi.</li>
                  <li>Nếu đã đi qua đủ n đỉnh, kiểm tra cạnh nối từ đỉnh cuối về v0 để khép chu trình.</li>
                  <li>Nếu gặp bế tắc, rút lui khỏi đỉnh hiện tại (quay lui) và thử các nhánh khác.</li>
                </ol>
              </section>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Tiêu chí</th>
                      <th className="py-2.5 px-3 font-semibold text-indigo-700">Đồ thị Euler</th>
                      <th className="py-2.5 px-3 font-semibold text-amber-700">Đồ thị Hamilton</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Đối tượng duyệt</td>
                      <td className="py-2 px-3">Đi qua tất cả các <strong>CẠNH</strong> đúng 1 lần</td>
                      <td className="py-2 px-3">Đi qua tất cả các <strong>ĐỈNH</strong> đúng 1 lần</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Điều kiện Cần & Đủ</td>
                      <td className="py-2 px-3 text-emerald-700 font-semibold">Có định lý đơn giản (bậc chẵn/lẻ)</td>
                      <td className="py-2 px-3 text-amber-700 font-semibold">Không có điều kiện cần và đủ đơn giản</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Độ phức tạp tính toán</td>
                      <td className="py-2 px-3">Lớp P - Tuyến tính O(|E|)</td>
                      <td className="py-2 px-3">Lớp NP-đầy đủ (NP-complete) - Vét cạn O(n!)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Thuật toán mô phỏng</td>
                      <td className="py-2 px-3">Hierholzer / Fleury</td>
                      <td className="py-2 px-3">Quay lui (Backtracking) / Quy hoạch động</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-slate-700">
                <strong className="text-slate-900 block mb-1">Ý nghĩa giáo dục:</strong>
                Sự so sánh giữa Euler và Hamilton là minh chứng kinh điển trong Khoa học Máy tính về ranh giới giữa một bài toán giải được nhanh chóng trong thời gian đa thức (Euler) và một bài toán khó đòi hỏi tìm kiếm vét cạn (Hamilton).
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
