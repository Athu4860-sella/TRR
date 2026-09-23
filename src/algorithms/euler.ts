import { GraphData, Vertex, EulerAnalysis, SimulationStep, TraversedEdgeInfo } from '../types/graph';
import { calculateDegrees, findConnectedComponents, findEdgeId } from '../utils/graphModel';

/**
 * Phân tích tính chất Euler của đồ thị
 */
export function analyzeEuler(graph: GraphData): EulerAnalysis {
  const { vertices, edges } = graph;

  if (vertices.length === 0) {
    return {
      type: 'none',
      isAllConnectedNonZero: false,
      oddDegreeCount: 0,
      oddDegreeVertices: [],
      evenDegreeVertices: [],
      zeroDegreeVertices: [],
      componentsCountNonZero: 0,
      totalComponentsCount: 0,
      reason: 'Đồ thị rỗng (không có đỉnh).',
      hasEuler: false,
      description: 'Chưa có đỉnh nào trên đồ thị.',
    };
  }

  if (edges.length === 0) {
    return {
      type: 'none',
      isAllConnectedNonZero: false,
      oddDegreeCount: 0,
      oddDegreeVertices: [],
      evenDegreeVertices: [],
      zeroDegreeVertices: [...vertices],
      componentsCountNonZero: 0,
      totalComponentsCount: vertices.length,
      reason: 'Đồ thị không có cạnh nào. Không tồn tại đường đi hay chu trình Euler.',
      hasEuler: false,
      description: 'Đồ thị chỉ chứa các đỉnh cô lập (bậc 0).',
    };
  }

  const degreeInfos = calculateDegrees(graph);
  const vertexMap = new Map(vertices.map(v => [v.id, v]));

  const oddDegreeVertices: Vertex[] = [];
  const evenDegreeVertices: Vertex[] = [];
  const zeroDegreeVertices: Vertex[] = [];

  for (const d of degreeInfos) {
    const v = vertexMap.get(d.vertexId)!;
    if (d.degree === 0) {
      zeroDegreeVertices.push(v);
    } else if (d.degree % 2 !== 0) {
      oddDegreeVertices.push(v);
    } else {
      evenDegreeVertices.push(v);
    }
  }

  // Kiểm tra tính liên thông trên các đỉnh có bậc khác 0
  const nonZeroComponents = findConnectedComponents(graph, true);
  const totalComponents = findConnectedComponents(graph, false);
  const isConnectedNonZero = nonZeroComponents.length <= 1;

  const oddCount = oddDegreeVertices.length;

  if (!isConnectedNonZero) {
    const componentStr = nonZeroComponents
      .map(
        (c, idx) =>
          `Nhóm ${idx + 1} (${c.map(id => vertexMap.get(id)?.label).join(', ')})`
      )
      .join('; ');

    return {
      type: 'none',
      isAllConnectedNonZero: false,
      oddDegreeCount: oddCount,
      oddDegreeVertices,
      evenDegreeVertices,
      zeroDegreeVertices,
      componentsCountNonZero: nonZeroComponents.length,
      totalComponentsCount: totalComponents.length,
      reason: `Các cạnh thuộc về ${nonZeroComponents.length} thành phần liên thông riêng biệt (${componentStr}). Đồ thị không liên thông trên các đỉnh bậc > 0.`,
      hasEuler: false,
      description: 'Đồ thị không có đường đi hay chu trình Euler do bị ngắt kết nối.',
    };
  }

  // Nếu liên thông trên các đỉnh bậc > 0
  if (oddCount === 0) {
    // Tìm đỉnh bắt đầu có bậc > 0
    const startV = evenDegreeVertices[0];
    return {
      type: 'circuit',
      isAllConnectedNonZero: true,
      oddDegreeCount: 0,
      oddDegreeVertices: [],
      evenDegreeVertices,
      zeroDegreeVertices,
      componentsCountNonZero: nonZeroComponents.length,
      totalComponentsCount: totalComponents.length,
      reason: 'Đồ thị liên thông trên các đỉnh bậc > 0 và TẤT CẢ các đỉnh đều có bậc chẵn.',
      hasEuler: true,
      description: 'Tồn tại CHU TRÌNH EULER (Eulerian Circuit) đi qua mỗi cạnh đúng một lần và quay về điểm xuất phát.',
      startVertexId: startV?.id,
      endVertexId: startV?.id,
    };
  }

  if (oddCount === 2) {
    const v1 = oddDegreeVertices[0];
    const v2 = oddDegreeVertices[1];
    return {
      type: 'path',
      isAllConnectedNonZero: true,
      oddDegreeCount: 2,
      oddDegreeVertices,
      evenDegreeVertices,
      zeroDegreeVertices,
      componentsCountNonZero: nonZeroComponents.length,
      totalComponentsCount: totalComponents.length,
      reason: `Đồ thị liên thông trên các đỉnh bậc > 0 và có ĐÚNG 2 ĐỈNH BẬC LẺ (${v1.label} bậc ${degreeInfos.find(d => d.vertexId === v1.id)?.degree}, ${v2.label} bậc ${degreeInfos.find(d => d.vertexId === v2.id)?.degree}).`,
      hasEuler: true,
      description: `Tồn tại ĐƯỜNG ĐI EULER (Eulerian Path) bắt đầu tại ${v1.label} và kết thúc tại ${v2.label} (hoặc ngược lại).`,
      startVertexId: v1.id,
      endVertexId: v2.id,
    };
  }

  // Nhiều hơn 2 đỉnh bậc lẻ
  const oddList = oddDegreeVertices
    .map(v => `${v.label} (bậc ${degreeInfos.find(d => d.vertexId === v.id)?.degree})`)
    .join(', ');

  return {
    type: 'none',
    isAllConnectedNonZero: true,
    oddDegreeCount: oddCount,
    oddDegreeVertices,
    evenDegreeVertices,
    zeroDegreeVertices,
    componentsCountNonZero: nonZeroComponents.length,
    totalComponentsCount: totalComponents.length,
    reason: `Đồ thị có ${oddCount} đỉnh bậc lẻ: ${oddList}. Theo định lý Euler, đồ thị chỉ có đường đi/chu trình Euler khi số đỉnh bậc lẻ là 0 hoặc 2.`,
    hasEuler: false,
    description: 'Không tồn tại đường đi hay chu trình Euler.',
  };
}

/**
 * Thuật toán Hierholzer tìm Chu trình hoặc Đường đi Euler
 * Trả về danh sách đầy đủ các bước mô phỏng
 */
export function runHierholzerSimulation(graph: GraphData): {
  steps: SimulationStep[];
  tourVertexIds: string[];
  tourLabels: string[];
  tourEdgeIds: string[];
} {
  const analysis = analyzeEuler(graph);
  const steps: SimulationStep[] = [];
  const vertexMap = new Map(graph.vertices.map(v => [v.id, v]));

  if (!analysis.hasEuler || graph.edges.length === 0) {
    steps.push({
      stepIndex: 0,
      algorithm: 'euler',
      status: 'failed',
      message: 'Không thể thực thi thuật toán Hierholzer',
      detail: analysis.reason,
      currentPath: [],
      visitedVertexIds: [],
      visitedEdgeIds: [],
      traversedEdges: [],
      stack: [],
      circuit: [],
    });
    return { steps, tourVertexIds: [], tourLabels: [], tourEdgeIds: [] };
  }

  // Xác định đỉnh xuất phát:
  // Nếu là đường đi (2 đỉnh bậc lẻ): bắt đầu tại một trong hai đỉnh bậc lẻ
  // Nếu là chu trình (0 đỉnh bậc lẻ): bắt đầu tại bất kỳ đỉnh nào có cạnh nối
  const startId = analysis.startVertexId || graph.edges[0].source;
  const startVertex = vertexMap.get(startId)!;

  // Cấu trúc cạnh chưa dùng: Edge ID -> { source, target, used: boolean }
  const unusedEdges = new Map<string, { id: string; u: string; v: string; used: boolean }>();
  // Danh sách kề chứa cạnh: vertexId -> list of edgeIds
  const vertexEdges = new Map<string, string[]>();

  for (const v of graph.vertices) {
    vertexEdges.set(v.id, []);
  }

  for (const e of graph.edges) {
    unusedEdges.set(e.id, { id: e.id, u: e.source, v: e.target, used: false });
    vertexEdges.get(e.source)?.push(e.id);
    vertexEdges.get(e.target)?.push(e.id);
  }

  const stack: string[] = [startId];
  const circuit: string[] = []; // Thu thập các đỉnh khi pop khỏi stack
  const traversedEdgesList: TraversedEdgeInfo[] = [];
  const visitedEdgeSet = new Set<string>();
  const visitedVertexSet = new Set<string>([startId]);

  let stepCounter = 0;

  // Bước 0: Khởi tạo
  steps.push({
    stepIndex: stepCounter++,
    algorithm: 'euler',
    status: 'starting',
    activeVertexId: startId,
    message: `Khởi tạo thuật toán Hierholzer tại đỉnh ${startVertex.label}.`,
    detail: analysis.type === 'circuit'
      ? `Đồ thị có mọi đỉnh bậc chẵn. Bắt đầu tìm Chu trình Euler từ đỉnh ${startVertex.label}. Đưa ${startVertex.label} vào ngăn xếp.`
      : `Đồ thị có 2 đỉnh bậc lẻ. Bắt đầu tìm Đường đi Euler từ đỉnh bậc lẻ ${startVertex.label}. Đưa ${startVertex.label} vào ngăn xếp.`,
    currentPath: [startId],
    visitedVertexIds: Array.from(visitedVertexSet),
    visitedEdgeIds: [],
    traversedEdges: [],
    stack: [startVertex.label],
    circuit: [],
  });

  // Tiến hành Hierholzer
  let orderNumber = 1;

  while (stack.length > 0) {
    const currId = stack[stack.length - 1];
    const currVertex = vertexMap.get(currId)!;

    // Tìm cạnh kề chưa sử dụng
    const incidentEdges = vertexEdges.get(currId) || [];
    let nextEdgeId: string | null = null;
    let nextVertexId: string | null = null;

    for (const edgeId of incidentEdges) {
      const edge = unusedEdges.get(edgeId);
      if (edge && !edge.used) {
        nextEdgeId = edgeId;
        nextVertexId = edge.u === currId ? edge.v : edge.u;
        break;
      }
    }

    if (nextEdgeId && nextVertexId) {
      // Có cạnh chưa dùng: đi tiếp theo cạnh này
      const edge = unusedEdges.get(nextEdgeId)!;
      edge.used = true;
      visitedEdgeSet.add(nextEdgeId);
      visitedVertexSet.add(nextVertexId);
      stack.push(nextVertexId);

      const nextVertex = vertexMap.get(nextVertexId)!;
      traversedEdgesList.push({
        edgeId: nextEdgeId,
        order: orderNumber++,
        from: currId,
        to: nextVertexId,
      });

      steps.push({
        stepIndex: stepCounter++,
        algorithm: 'euler',
        status: 'traversing',
        activeVertexId: currId,
        targetVertexId: nextVertexId,
        activeEdgeId: nextEdgeId,
        message: `Duyệt cạnh (${currVertex.label} – ${nextVertex.label}) [Thứ tự #${orderNumber - 1}].`,
        detail: `Từ đỉnh ${currVertex.label}, còn cạnh chưa dùng nối đến ${nextVertex.label}. Đánh dấu cạnh đã dùng và đẩy ${nextVertex.label} vào đỉnh ngăn xếp.`,
        currentPath: stack.map(id => vertexMap.get(id)?.label || id),
        visitedVertexIds: Array.from(visitedVertexSet),
        visitedEdgeIds: Array.from(visitedEdgeSet),
        traversedEdges: [...traversedEdgesList],
        stack: stack.map(id => vertexMap.get(id)?.label || id),
        circuit: circuit.map(id => vertexMap.get(id)?.label || id),
      });
    } else {
      // Không còn cạnh nào chưa dùng xuất phát từ currId:
      // Pop khỏi stack và thêm vào circuit
      const poppedId = stack.pop()!;
      const poppedVertex = vertexMap.get(poppedId)!;
      circuit.push(poppedId);

      steps.push({
        stepIndex: stepCounter++,
        algorithm: 'euler',
        status: 'backtracking',
        activeVertexId: poppedId,
        message: `Đỉnh ${poppedVertex.label} không còn cạnh nào chưa đi. Lấy ${poppedVertex.label} ra khỏi ngăn xếp.`,
        detail: `Lấy ${poppedVertex.label} khỏi ngăn xếp và nối vào chuỗi kết quả Euler. Ngăn xếp hiện còn ${stack.length} đỉnh.`,
        currentPath: stack.map(id => vertexMap.get(id)?.label || id),
        visitedVertexIds: Array.from(visitedVertexSet),
        visitedEdgeIds: Array.from(visitedEdgeSet),
        traversedEdges: [...traversedEdgesList],
        stack: stack.map(id => vertexMap.get(id)?.label || id),
        circuit: circuit.map(id => vertexMap.get(id)?.label || id),
      });
    }
  }

  // Kết quả cuối cùng là chuỗi circuit đảo ngược lại theo thuật toán Hierholzer
  const finalTourVertexIds = [...circuit].reverse();
  const finalTourLabels = finalTourVertexIds.map(id => vertexMap.get(id)?.label || id);

  // Xác định danh sách cạnh theo đúng thứ tự của finalTour
  const finalTourEdgeIds: string[] = [];
  for (let i = 0; i < finalTourVertexIds.length - 1; i++) {
    const eId = findEdgeId(graph.edges, finalTourVertexIds[i], finalTourVertexIds[i + 1]);
    if (eId) finalTourEdgeIds.push(eId);
  }

  // Bước hoàn tất
  steps.push({
    stepIndex: stepCounter++,
    algorithm: 'euler',
    status: 'success',
    activeVertexId: finalTourVertexIds[0],
    message: `Đã tìm thấy ${analysis.type === 'circuit' ? 'Chu trình Euler' : 'Đường đi Euler'} thành công!`,
    detail: `Hành trình qua tất cả ${graph.edges.length} cạnh: ${finalTourLabels.join(' → ')}. Mỗi cạnh được đi qua chính xác một lần.`,
    currentPath: finalTourLabels,
    visitedVertexIds: Array.from(visitedVertexSet),
    visitedEdgeIds: Array.from(visitedEdgeSet),
    traversedEdges: [...traversedEdgesList],
    stack: [],
    circuit: finalTourLabels,
  });

  return {
    steps,
    tourVertexIds: finalTourVertexIds,
    tourLabels: finalTourLabels,
    tourEdgeIds: finalTourEdgeIds,
  };
}
