import { GraphData } from '../types/graph';

export interface PresetGraphItem {
  id: string;
  name: string;
  category: 'euler' | 'hamilton' | 'both' | 'edge_case';
  badge: string;
  description: string;
  graph: GraphData;
}

export const PRESET_GRAPHS: PresetGraphItem[] = [
  {
    id: 'k5_complete',
    name: 'Đồ thị Đầy đủ K5 (Euler + Hamilton)',
    category: 'both',
    badge: 'Cả Euler & Hamilton',
    description: '5 đỉnh, 10 cạnh. Mọi đỉnh đều có bậc 4 (chẵn). Có cả Chu trình Euler và Chu trình Hamilton.',
    graph: {
      vertices: [
        { id: 'v_A', label: 'A', x: 300, y: 80 },
        { id: 'v_B', label: 'B', x: 470, y: 200 },
        { id: 'v_C', label: 'C', x: 410, y: 390 },
        { id: 'v_D', label: 'D', x: 190, y: 390 },
        { id: 'v_E', label: 'E', x: 130, y: 200 },
      ],
      edges: [
        { id: 'e_AB', source: 'v_A', target: 'v_B' },
        { id: 'e_BC', source: 'v_B', target: 'v_C' },
        { id: 'e_CD', source: 'v_C', target: 'v_D' },
        { id: 'e_DE', source: 'v_D', target: 'v_E' },
        { id: 'e_EA', source: 'v_E', target: 'v_A' },
        { id: 'e_AC', source: 'v_A', target: 'v_C' },
        { id: 'e_AD', source: 'v_A', target: 'v_D' },
        { id: 'e_BD', source: 'v_B', target: 'v_D' },
        { id: 'e_BE', source: 'v_B', target: 'v_E' },
        { id: 'e_CE', source: 'v_C', target: 'v_E' },
      ],
    },
  },
  {
    id: 'house_graph',
    name: 'Đồ thị Ngôi nhà (Đường đi Euler)',
    category: 'euler',
    badge: 'Đường đi Euler',
    description: '5 đỉnh, 6 cạnh. Đỉnh D và E có bậc 3 (lẻ), các đỉnh khác bậc chẵn. Tồn tại Đường đi Euler từ D đến E.',
    graph: {
      vertices: [
        { id: 'v_A', label: 'A', x: 300, y: 90 }, // Chóp mái
        { id: 'v_B', label: 'B', x: 200, y: 200 }, // Mái trái
        { id: 'v_C', label: 'C', x: 400, y: 200 }, // Mái phải
        { id: 'v_D', label: 'D', x: 200, y: 370 }, // Đáy trái (bậc 3)
        { id: 'v_E', label: 'E', x: 400, y: 370 }, // Đáy phải (bậc 3)
      ],
      edges: [
        { id: 'e_AB', source: 'v_A', target: 'v_B' },
        { id: 'e_AC', source: 'v_A', target: 'v_C' },
        { id: 'e_BC', source: 'v_B', target: 'v_C' },
        { id: 'e_BD', source: 'v_B', target: 'v_D' },
        { id: 'e_CE', source: 'v_C', target: 'v_E' },
        { id: 'e_DE', source: 'v_D', target: 'v_E' },
        { id: 'e_BE', source: 'v_B', target: 'v_E' }, // chéo tạo bậc 3 ở D, E và bậc chẵn ở B, C
      ],
    },
  },
  {
    id: 'petersen',
    name: 'Đồ thị Petersen (Không có Chu trình Hamilton)',
    category: 'hamilton',
    badge: 'Không có Hamilton',
    description: '10 đỉnh, 15 cạnh. Đồ thị 3-chính quy nổi tiếng. Có đường đi Hamilton nhưng KHÔNG THỂ có chu trình Hamilton.',
    graph: {
      vertices: [
        // Vòng ngoài ngũ giác
        { id: 'v_0', label: '0', x: 300, y: 70 },
        { id: 'v_1', label: '1', x: 480, y: 200 },
        { id: 'v_2', label: '2', x: 410, y: 400 },
        { id: 'v_3', label: '3', x: 190, y: 400 },
        { id: 'v_4', label: '4', x: 120, y: 200 },
        // Ngôi sao bên trong
        { id: 'v_5', label: '5', x: 300, y: 170 },
        { id: 'v_6', label: '6', x: 400, y: 240 },
        { id: 'v_7', label: '7', x: 360, y: 340 },
        { id: 'v_8', label: '8', x: 240, y: 340 },
        { id: 'v_9', label: '9', x: 200, y: 240 },
      ],
      edges: [
        // Vòng ngoài
        { id: 'e_01', source: 'v_0', target: 'v_1' },
        { id: 'e_12', source: 'v_1', target: 'v_2' },
        { id: 'e_23', source: 'v_2', target: 'v_3' },
        { id: 'e_34', source: 'v_3', target: 'v_4' },
        { id: 'e_40', source: 'v_4', target: 'v_0' },
        // Nối ngoài vào trong
        { id: 'e_05', source: 'v_0', target: 'v_5' },
        { id: 'e_16', source: 'v_1', target: 'v_6' },
        { id: 'e_27', source: 'v_2', target: 'v_7' },
        { id: 'e_38', source: 'v_3', target: 'v_8' },
        { id: 'e_49', source: 'v_4', target: 'v_9' },
        // Ngôi sao trong
        { id: 'e_57', source: 'v_5', target: 'v_7' },
        { id: 'e_79', source: 'v_7', target: 'v_9' },
        { id: 'e_96', source: 'v_9', target: 'v_6' },
        { id: 'e_68', source: 'v_6', target: 'v_8' },
        { id: 'e_85', source: 'v_8', target: 'v_5' },
      ],
    },
  },
  {
    id: 'octahedron',
    name: 'Đồ thị Bát diện (Octahedral Graph)',
    category: 'both',
    badge: 'Cả Euler & Hamilton',
    description: '6 đỉnh, 12 cạnh. Mọi đỉnh đều có bậc 4. Tồn tại cả Chu trình Euler và Chu trình Hamilton.',
    graph: {
      vertices: [
        { id: 'v_A', label: 'A', x: 300, y: 70 }, // Đỉnh trên
        { id: 'v_B', label: 'B', x: 300, y: 410 }, // Đỉnh dưới
        { id: 'v_C', label: 'C', x: 160, y: 240 }, // Vòng xích đạo trái
        { id: 'v_D', label: 'D', x: 260, y: 200 }, // Vòng xích đạo giữa trái
        { id: 'v_E', label: 'E', x: 440, y: 240 }, // Vòng xích đạo phải
        { id: 'v_F', label: 'F', x: 340, y: 280 }, // Vòng xích đạo giữa phải
      ],
      edges: [
        // Vòng 4 đỉnh xích đạo (C-D-E-F-C)
        { id: 'e_CD', source: 'v_C', target: 'v_D' },
        { id: 'e_DE', source: 'v_D', target: 'v_E' },
        { id: 'e_EF', source: 'v_E', target: 'v_F' },
        { id: 'e_FC', source: 'v_F', target: 'v_C' },
        // Đỉnh A nối cả 4 đỉnh xích đạo
        { id: 'e_AC', source: 'v_A', target: 'v_C' },
        { id: 'e_AD', source: 'v_A', target: 'v_D' },
        { id: 'e_AE', source: 'v_A', target: 'v_E' },
        { id: 'e_AF', source: 'v_A', target: 'v_F' },
        // Đỉnh B nối cả 4 đỉnh xích đạo
        { id: 'e_BC', source: 'v_B', target: 'v_C' },
        { id: 'e_BD', source: 'v_B', target: 'v_D' },
        { id: 'e_BE', source: 'v_B', target: 'v_E' },
        { id: 'e_BF', source: 'v_B', target: 'v_F' },
      ],
    },
  },
  {
    id: 'konigsberg_model',
    name: 'Mô hình 7 cây cầu Königsberg',
    category: 'euler',
    badge: 'Không có Euler',
    description: '4 đỉnh (vùng đất). Cả 4 đỉnh đều có bậc lẻ. Euler đã chứng minh không thể đi qua mỗi cầu đúng một lần.',
    graph: {
      vertices: [
        { id: 'v_A', label: 'Bắc (A)', x: 300, y: 80 },
        { id: 'v_B', label: 'Nam (B)', x: 300, y: 400 },
        { id: 'v_C', label: 'Đảo (C)', x: 200, y: 240 },
        { id: 'v_D', label: 'Đông (D)', x: 420, y: 240 },
      ],
      edges: [
        { id: 'e_AC', source: 'v_A', target: 'v_C' },
        { id: 'e_AD', source: 'v_A', target: 'v_D' },
        { id: 'e_BC', source: 'v_B', target: 'v_C' },
        { id: 'e_BD', source: 'v_B', target: 'v_D' },
        { id: 'e_CD', source: 'v_C', target: 'v_D' },
      ],
    },
  },
  {
    id: 'disconnected_triangles',
    name: 'Đồ thị Không liên thông (2 Tam giác rời)',
    category: 'edge_case',
    badge: 'Không liên thông',
    description: '6 đỉnh, 2 thành phần liên thông riêng biệt (A-B-C và D-E-F). Không có đường đi qua toàn bộ đồ thị.',
    graph: {
      vertices: [
        // Tam giác 1
        { id: 'v_A', label: 'A', x: 190, y: 140 },
        { id: 'v_B', label: 'B', x: 110, y: 310 },
        { id: 'v_C', label: 'C', x: 270, y: 310 },
        // Tam giác 2
        { id: 'v_D', label: 'D', x: 430, y: 140 },
        { id: 'v_E', label: 'E', x: 350, y: 310 },
        { id: 'v_F', label: 'F', x: 510, y: 310 },
      ],
      edges: [
        { id: 'e_AB', source: 'v_A', target: 'v_B' },
        { id: 'e_BC', source: 'v_B', target: 'v_C' },
        { id: 'e_CA', source: 'v_C', target: 'v_A' },
        { id: 'e_DE', source: 'v_D', target: 'v_E' },
        { id: 'e_EF', source: 'v_E', target: 'v_F' },
        { id: 'e_FD', source: 'v_F', target: 'v_D' },
      ],
    },
  },
  {
    id: 'star_graph',
    name: 'Đồ thị Hình sao K1,4 (Star Graph)',
    category: 'both',
    badge: 'Không Euler, không Hamilton',
    description: '5 đỉnh, đỉnh tâm O nối 4 đỉnh lá A, B, C, D. Các đỉnh lá có bậc 1, vi phạm cả Euler lẫn Hamilton.',
    graph: {
      vertices: [
        { id: 'v_O', label: 'Tâm O', x: 300, y: 240 },
        { id: 'v_A', label: 'A', x: 300, y: 90 },
        { id: 'v_B', label: 'B', x: 450, y: 240 },
        { id: 'v_C', label: 'C', x: 300, y: 390 },
        { id: 'v_D', label: 'D', x: 150, y: 240 },
      ],
      edges: [
        { id: 'e_OA', source: 'v_O', target: 'v_A' },
        { id: 'e_OB', source: 'v_O', target: 'v_B' },
        { id: 'e_OC', source: 'v_O', target: 'v_C' },
        { id: 'e_OD', source: 'v_O', target: 'v_D' },
      ],
    },
  },
  {
    id: 'cycle_c6',
    name: 'Chu trình đơn C6 (6 đỉnh)',
    category: 'both',
    badge: 'Chu trình đơn',
    description: '6 đỉnh nối vòng tròn. Mỗi đỉnh bậc 2. Đồ thị cơ bản nhất thỏa mãn cả Euler và Hamilton.',
    graph: {
      vertices: [
        { id: 'v_1', label: 'v1', x: 300, y: 80 },
        { id: 'v_2', label: 'v2', x: 440, y: 160 },
        { id: 'v_3', label: 'v3', x: 440, y: 320 },
        { id: 'v_4', label: 'v4', x: 300, y: 400 },
        { id: 'v_5', label: 'v5', x: 160, y: 320 },
        { id: 'v_6', label: 'v6', x: 160, y: 160 },
      ],
      edges: [
        { id: 'e_12', source: 'v_1', target: 'v_2' },
        { id: 'e_23', source: 'v_2', target: 'v_3' },
        { id: 'e_34', source: 'v_3', target: 'v_4' },
        { id: 'e_45', source: 'v_4', target: 'v_5' },
        { id: 'e_56', source: 'v_5', target: 'v_6' },
        { id: 'e_61', source: 'v_6', target: 'v_1' },
      ],
    },
  },
  {
    id: 'single_vertex',
    name: 'Đồ thị 1 đỉnh (Biên)',
    category: 'edge_case',
    badge: 'Trường hợp biên',
    description: 'Đồ thị chỉ gồm 1 đỉnh cô lập duy nhất. Không có cạnh.',
    graph: {
      vertices: [
        { id: 'v_solo', label: 'A', x: 300, y: 240 },
      ],
      edges: [],
    },
  },
];
