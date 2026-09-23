import { GraphData, Vertex, Edge, DegreeInfo } from '../types/graph';

/**
 * Sinh nhãn tự động cho đỉnh: A, B, C... Z, A1, B1...
 */
export function generateVertexLabel(index: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < 26) {
    return letters[index];
  }
  const prefix = letters[index % 26];
  const suffix = Math.floor(index / 26);
  return `${prefix}${suffix}`;
}

/**
 * Kiểm tra xem cạnh u-v đã tồn tại chưa (vô hướng, u !== v)
 */
export function edgeExists(edges: Edge[], uId: string, vId: string): boolean {
  return edges.some(
    e => (e.source === uId && e.target === vId) || (e.source === vId && e.target === uId)
  );
}

/**
 * Tìm ID của cạnh nối giữa u và v
 */
export function findEdgeId(edges: Edge[], uId: string, vId: string): string | undefined {
  const edge = edges.find(
    e => (e.source === uId && e.target === vId) || (e.source === vId && e.target === uId)
  );
  return edge?.id;
}

/**
 * Xây dựng danh sách kề cho đồ thị vô hướng
 */
export function buildAdjacencyList(graph: GraphData): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) {
    adj.set(v.id, []);
  }

  for (const e of graph.edges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      adj.get(e.target)!.push(e.source);
    }
  }

  return adj;
}

/**
 * Tính bậc và thông tin chi tiết của tất cả các đỉnh
 */
export function calculateDegrees(graph: GraphData): DegreeInfo[] {
  const adj = buildAdjacencyList(graph);
  const vertexMap = new Map(graph.vertices.map(v => [v.id, v]));

  return graph.vertices.map(v => {
    const neighbors = adj.get(v.id) || [];
    const neighborLabels = neighbors
      .map(id => vertexMap.get(id)?.label || id)
      .sort();

    return {
      vertexId: v.id,
      label: v.label,
      degree: neighbors.length,
      isEven: neighbors.length % 2 === 0,
      neighbors: neighborLabels,
      neighborIds: neighbors,
    };
  });
}

/**
 * Tìm các thành phần liên thông sử dụng BFS
 * @param graph Đồ thị
 * @param nonZeroOnly Chỉ xét các đỉnh có bậc > 0
 */
export function findConnectedComponents(
  graph: GraphData,
  nonZeroOnly = false
): string[][] {
  const adj = buildAdjacencyList(graph);
  const degrees = calculateDegrees(graph);
  const degreeMap = new Map(degrees.map(d => [d.vertexId, d.degree]));

  const targetVertices = nonZeroOnly
    ? graph.vertices.filter(v => (degreeMap.get(v.id) || 0) > 0)
    : graph.vertices;

  const targetSet = new Set(targetVertices.map(v => v.id));
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const v of targetVertices) {
    if (!visited.has(v.id)) {
      const comp: string[] = [];
      const queue: string[] = [v.id];
      visited.add(v.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        comp.push(curr);

        const neighbors = adj.get(curr) || [];
        for (const n of neighbors) {
          if (targetSet.has(n) && !visited.has(n)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }

      components.push(comp);
    }
  }

  return components;
}

/**
 * Tự động sắp xếp các đỉnh theo hình tròn đẹp mắt
 */
export function applyCircularLayout(
  vertices: Vertex[],
  width = 600,
  height = 500,
  padding = 80
): Vertex[] {
  const count = vertices.length;
  if (count === 0) return [];
  if (count === 1) {
    return [{ ...vertices[0], x: width / 2, y: height / 2 }];
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX - padding, centerY - padding);

  return vertices.map((v, i) => {
    // Góc xoay bắt đầu từ trên cùng (-PI/2) và đi theo chiều kim đồng hồ
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      ...v,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
    };
  });
}

/**
 * Phân tích danh sách cạnh từ văn bản
 * Hỗ trợ các định dạng:
 * "A B"
 * "A - B"
 * "A, B"
 * "(A, B)"
 * "1 2\n2 3"
 */
export function parseEdgeList(
  input: string,
  width = 600,
  height = 500
): { graph?: GraphData; error?: string } {
  const lines = input
    .split(/[\n;]/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) {
    return { error: 'Dữ liệu nhập rỗng. Vui lòng nhập danh sách cạnh!' };
  }

  const rawEdges: [string, string][] = [];
  const vertexLabelsSet = new Set<string>();

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    // Chuẩn hóa dòng: bỏ dấu ngoặc đơn, ngoặc vuông
    const cleaned = line.replace(/[()[\]{}]/g, '').trim();
    // Tách theo khoảng trắng, dấu gạch ngang '-', dấu phẩy ',' hoặc '->'
    const parts = cleaned.split(/[\s,–—\-]+/).filter(Boolean);

    if (parts.length === 0) continue;

    if (parts.length === 1) {
      // Đỉnh cô lập (chỉ khai báo đỉnh)
      vertexLabelsSet.add(parts[0]);
      continue;
    }

    if (parts.length >= 2) {
      const u = parts[0];
      const v = parts[1];

      if (u === v) {
        return {
          error: `Dòng ${idx + 1}: Không hỗ trợ cạnh khuyên (${u} - ${v}). Đồ thị vô hướng không có khuyên.`,
        };
      }

      vertexLabelsSet.add(u);
      vertexLabelsSet.add(v);
      rawEdges.push([u, v]);
    }
  }

  if (vertexLabelsSet.size === 0) {
    return { error: 'Không tìm thấy đỉnh hợp lệ nào trong văn bản.' };
  }

  // Tạo danh sách đỉnh
  const labelList = Array.from(vertexLabelsSet).sort((a, b) => {
    // Sắp xếp tự nhiên (số hoặc chữ)
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const labelToId = new Map<string, string>();
  const vertices: Vertex[] = labelList.map((label, i) => {
    const id = `v_${Date.now()}_${i}`;
    labelToId.set(label, id);
    return {
      id,
      label,
      x: 0,
      y: 0,
    };
  });

  // Áp dụng bố cục hình tròn
  const positionedVertices = applyCircularLayout(vertices, width, height);

  // Tạo danh sách cạnh, loại trừ trùng lặp
  const edges: Edge[] = [];
  const edgePairKeys = new Set<string>();

  for (const [uLabel, vLabel] of rawEdges) {
    const uId = labelToId.get(uLabel)!;
    const vId = labelToId.get(vLabel)!;

    // Khóa chuẩn hóa cho cạnh vô hướng
    const key = uId < vId ? `${uId}__${vId}` : `${vId}__${uId}`;
    if (!edgePairKeys.has(key)) {
      edgePairKeys.add(key);
      edges.push({
        id: `e_${Date.now()}_${edges.length}`,
        source: uId,
        target: vId,
      });
    }
  }

  return {
    graph: {
      vertices: positionedVertices,
      edges,
    },
  };
}

/**
 * Xuất đồ thị ra định dạng danh sách cạnh text
 */
export function exportToEdgeList(graph: GraphData): string {
  const vertexMap = new Map(graph.vertices.map(v => [v.id, v.label]));
  const lines: string[] = [];

  for (const e of graph.edges) {
    const u = vertexMap.get(e.source) || e.source;
    const v = vertexMap.get(e.target) || e.target;
    lines.push(`${u} ${v}`);
  }

  // Thêm các đỉnh cô lập (nếu có)
  const degs = calculateDegrees(graph);
  for (const d of degs) {
    if (d.degree === 0) {
      lines.push(`${d.label}`);
    }
  }

  return lines.join('\n');
}
