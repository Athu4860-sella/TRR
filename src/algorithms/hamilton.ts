import { GraphData, HamiltonAnalysis, SimulationStep, TraversedEdgeInfo } from '../types/graph';
import { calculateDegrees, findConnectedComponents, findEdgeId, buildAdjacencyList } from '../utils/graphModel';

/**
 * Phân tích lý thuyết tính chất Hamilton của đồ thị
 */
export function analyzeHamilton(graph: GraphData): {
  analysis: HamiltonAnalysis;
} {
  const { vertices, edges } = graph;
  const n = vertices.length;
  const vertexMap = new Map(vertices.map(v => [v.id, v]));

  // Đồ thị dưới 3 đỉnh
  if (n < 3) {
    return {
      analysis: {
        hasCycle: false,
        cycle: [],
        cycleLabels: [],
        edgeIdsInCycle: [],
        reason: n === 0
          ? 'Đồ thị rỗng (0 đỉnh).'
          : `Đồ thị chỉ có ${n} đỉnh (${vertices.map(v => v.label).join(', ')}). Chu trình Hamilton yêu cầu ít nhất 3 đỉnh (n ≥ 3).`,
        diracSatisfied: false,
        oreSatisfied: false,
        theoreticalNotes: ['Chu trình đơn yêu cầu độ dài tối thiểu là 3.'],
        minDegree: 0,
        hasDegreeLessThanTwo: true,
      },
    };
  }

  const degreeInfos = calculateDegrees(graph);
  const degrees = new Map(degreeInfos.map(d => [d.vertexId, d.degree]));
  const minDegree = Math.min(...degreeInfos.map(d => d.degree));
  const hasDegreeLessThanTwo = minDegree < 2;

  // Kiểm tra tính liên thông
  const components = findConnectedComponents(graph, false);
  const isConnected = components.length <= 1;

  // Kiểm tra Định lý Dirac: Nếu n >= 3 và deg(v) >= n / 2 với mọi v, đồ thị có chu trình Hamilton
  const diracThreshold = n / 2;
  const diracSatisfied = isConnected && degreeInfos.every(d => d.degree >= diracThreshold);

  // Kiểm tra Định lý Ore: Nếu n >= 3 và deg(u) + deg(v) >= n với mọi cặp đỉnh không kề nhau
  const adj = buildAdjacencyList(graph);
  let oreSatisfied = isConnected;
  if (isConnected) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const uId = vertices[i].id;
        const vId = vertices[j].id;
        const areNeighbors = adj.get(uId)?.includes(vId);
        if (!areNeighbors) {
          const sumDeg = (degrees.get(uId) || 0) + (degrees.get(vId) || 0);
          if (sumDeg < n) {
            oreSatisfied = false;
            break;
          }
        }
      }
      if (!oreSatisfied) break;
    }
  }

  const theoreticalNotes: string[] = [];
  if (diracSatisfied) {
    theoreticalNotes.push(
      `Thỏa mãn Định lý Dirac: Mọi đỉnh đều có bậc ≥ ${diracThreshold} (n/2 = ${n}/2). Đảm bảo tồn tại Chu trình Hamilton.`
    );
  } else {
    theoreticalNotes.push(
      `Không thỏa Định lý Dirac (đòi hỏi mọi đỉnh bậc ≥ ${diracThreshold}, bậc nhỏ nhất hiện tại là ${minDegree}).`
    );
  }

  if (oreSatisfied) {
    theoreticalNotes.push(
      `Thỏa mãn Định lý Ore: Mọi cặp đỉnh không kề nhau đều có tổng bậc ≥ ${n}. Đảm bảo tồn tại Chu trình Hamilton.`
    );
  } else {
    theoreticalNotes.push(
      `Không thỏa Định lý Ore (tồn tại cặp đỉnh không kề nhau có tổng bậc < ${n}).`
    );
  }

  if (!isConnected) {
    theoreticalNotes.push(
      `Đồ thị không liên thông (có ${components.length} thành phần rời rạc). Không thể có chu trình Hamilton đi qua tất cả các đỉnh.`
    );
  }

  if (hasDegreeLessThanTwo) {
    const lowDegreeVertices = degreeInfos
      .filter(d => d.degree < 2)
      .map(d => `${d.label} (bậc ${d.degree})`)
      .join(', ');
    theoreticalNotes.push(
      `Điều kiện cần bị vi phạm: Có đỉnh bậc nhỏ hơn 2 (${lowDegreeVertices}). Mọi đỉnh trong chu trình Hamilton đều phải có ít nhất 2 cạnh liên thuộc.`
    );
  }

  return {
    analysis: {
      hasCycle: false, // Sẽ được cập nhật sau khi chạy thuật toán
      cycle: [],
      cycleLabels: [],
      edgeIdsInCycle: [],
      reason: '',
      diracSatisfied,
      oreSatisfied,
      theoreticalNotes,
      minDegree,
      hasDegreeLessThanTwo,
    },
  };
}

/**
 * Thuật toán Quay lui (Backtracking) tìm Chu trình Hamilton
 * Sinh chi tiết từng bước mô phỏng
 */
export function runHamiltonSimulation(graph: GraphData): {
  steps: SimulationStep[];
  cycleVertexIds: string[];
  cycleLabels: string[];
  cycleEdgeIds: string[];
  hasCycle: boolean;
  analysis: HamiltonAnalysis;
} {
  const { analysis } = analyzeHamilton(graph);
  const steps: SimulationStep[] = [];
  const { vertices, edges } = graph;
  const n = vertices.length;
  const vertexMap = new Map(vertices.map(v => [v.id, v]));

  // Nếu n < 3
  if (n < 3) {
    steps.push({
      stepIndex: 0,
      algorithm: 'hamilton',
      status: 'failed',
      message: 'Không thể tìm chu trình Hamilton',
      detail: analysis.reason,
      currentPath: [],
      visitedVertexIds: [],
      visitedEdgeIds: [],
      traversedEdges: [],
      stack: [],
      circuit: [],
    });
    return {
      steps,
      cycleVertexIds: [],
      cycleLabels: [],
      cycleEdgeIds: [],
      hasCycle: false,
      analysis,
    };
  }

  // Nếu vi phạm điều kiện cần (không liên thông hoặc đỉnh có bậc < 2)
  const components = findConnectedComponents(graph, false);
  if (components.length > 1 || analysis.hasDegreeLessThanTwo) {
    let failReason = '';
    if (components.length > 1) {
      failReason = `Đồ thị không liên thông (gồm ${components.length} thành phần). Chu trình Hamilton đòi hỏi phải đi qua mọi đỉnh trong một chu trình đơn khép kín.`;
    } else {
      failReason = `Đồ thị chứa đỉnh có bậc nhỏ hơn 2. Không thể tạo chu trình Hamilton vì mỗi đỉnh trong chu trình cần đúng 2 cạnh kề (1 cạnh vào, 1 cạnh ra).`;
    }

    steps.push({
      stepIndex: 0,
      algorithm: 'hamilton',
      status: 'failed',
      message: 'Đồ thị vi phạm điều kiện cần cơ bản của Chu trình Hamilton',
      detail: failReason,
      currentPath: [],
      visitedVertexIds: [],
      visitedEdgeIds: [],
      traversedEdges: [],
      stack: [],
      circuit: [],
    });

    analysis.reason = failReason;
    return {
      steps,
      cycleVertexIds: [],
      cycleLabels: [],
      cycleEdgeIds: [],
      hasCycle: false,
      analysis,
    };
  }

  const adj = buildAdjacencyList(graph);
  const startVertex = vertices[0];
  const path: string[] = [startVertex.id];
  const inPath = new Set<string>([startVertex.id]);
  const traversedEdges: TraversedEdgeInfo[] = [];
  const visitedEdgeIds: string[] = [];

  let stepCounter = 0;
  let orderCounter = 1;
  const MAX_STEPS = 600; // Giới hạn số bước mô phỏng tránh quá tải trình duyệt trên đồ thị lớn

  steps.push({
    stepIndex: stepCounter++,
    algorithm: 'hamilton',
    status: 'starting',
    activeVertexId: startVertex.id,
    message: `Bắt đầu thuật toán Quay lui từ đỉnh ${startVertex.label}.`,
    detail: `Chọn đỉnh xuất phát ${startVertex.label}. Chu trình Hamilton cần đi qua tất cả ${n} đỉnh đúng một lần và quay lại ${startVertex.label}.`,
    currentPath: [startVertex.label],
    visitedVertexIds: [startVertex.id],
    visitedEdgeIds: [],
    traversedEdges: [],
    stack: [startVertex.label],
    circuit: [],
  });

  let foundCycle = false;
  let finalCycleIds: string[] = [];

  function backtrack(currId: string): boolean {
    if (steps.length >= MAX_STEPS) {
      return false; // Ngừng sinh thêm bước nếu đã đạt giới hạn an toàn
    }

    const currVertex = vertexMap.get(currId)!;

    // Nếu đã đi qua tất cả n đỉnh
    if (path.length === n) {
      // Kiểm tra xem có cạnh nối từ đỉnh hiện tại về đỉnh xuất phát không
      const closeEdgeId = findEdgeId(edges, currId, startVertex.id);
      if (closeEdgeId) {
        // Tìm thấy chu trình Hamilton!
        finalCycleIds = [...path, startVertex.id];
        traversedEdges.push({
          edgeId: closeEdgeId,
          order: orderCounter++,
          from: currId,
          to: startVertex.id,
        });
        visitedEdgeIds.push(closeEdgeId);

        steps.push({
          stepIndex: stepCounter++,
          algorithm: 'hamilton',
          status: 'success',
          activeVertexId: currId,
          targetVertexId: startVertex.id,
          activeEdgeId: closeEdgeId,
          message: `Thành công! Khép kín chu trình bằng cạnh (${currVertex.label} – ${startVertex.label}).`,
          detail: `Đã đi qua đủ ${n} đỉnh. Tồn tại cạnh nối về đỉnh xuất phát ${startVertex.label}. Tìm thấy chu trình Hamilton!`,
          currentPath: [...path.map(id => vertexMap.get(id)?.label || id), startVertex.label],
          visitedVertexIds: Array.from(inPath),
          visitedEdgeIds: [...visitedEdgeIds],
          traversedEdges: [...traversedEdges],
          stack: path.map(id => vertexMap.get(id)?.label || id),
          circuit: [...path.map(id => vertexMap.get(id)?.label || id), startVertex.label],
        });

        foundCycle = true;
        return true;
      } else {
        // Đã qua n đỉnh nhưng không có cạnh khép về đỉnh xuất phát -> Bế tắc
        steps.push({
          stepIndex: stepCounter++,
          algorithm: 'hamilton',
          status: 'deadend',
          activeVertexId: currId,
          targetVertexId: startVertex.id,
          message: `Bế tắc: Đã thăm đủ ${n} đỉnh nhưng KHÔNG có cạnh nối từ ${currVertex.label} về ${startVertex.label}.`,
          detail: `Không thể khép kín chu trình về đỉnh xuất phát. Tiến hành quay lui (Backtracking).`,
          currentPath: path.map(id => vertexMap.get(id)?.label || id),
          visitedVertexIds: Array.from(inPath),
          visitedEdgeIds: [...visitedEdgeIds],
          traversedEdges: [...traversedEdges],
          stack: path.map(id => vertexMap.get(id)?.label || id),
          circuit: [],
        });
        return false;
      }
    }

    // Duyệt qua các đỉnh kề của currId
    const neighbors = adj.get(currId) || [];

    for (const nextId of neighbors) {
      if (steps.length >= MAX_STEPS) return false;

      const nextVertex = vertexMap.get(nextId)!;
      const edgeId = findEdgeId(edges, currId, nextId)!;

      if (!inPath.has(nextId)) {
        // Thử chọn đỉnh nextId
        inPath.add(nextId);
        path.push(nextId);
        visitedEdgeIds.push(edgeId);

        const edgeOrder = orderCounter++;
        traversedEdges.push({
          edgeId,
          order: edgeOrder,
          from: currId,
          to: nextId,
        });

        steps.push({
          stepIndex: stepCounter++,
          algorithm: 'hamilton',
          status: 'visiting',
          activeVertexId: currId,
          targetVertexId: nextId,
          activeEdgeId: edgeId,
          message: `Thử đỉnh ${nextVertex.label}: Đi qua cạnh (${currVertex.label} – ${nextVertex.label}) [Bước ${path.length}/${n}].`,
          detail: `Đỉnh ${nextVertex.label} chưa nằm trong đường đi hiện tại. Mở rộng đường đi và tiếp tục tìm kiếm.`,
          currentPath: path.map(id => vertexMap.get(id)?.label || id),
          visitedVertexIds: Array.from(inPath),
          visitedEdgeIds: [...visitedEdgeIds],
          traversedEdges: [...traversedEdges],
          stack: path.map(id => vertexMap.get(id)?.label || id),
          circuit: [],
        });

        if (backtrack(nextId)) {
          return true;
        }

        // Quay lui (Backtrack): rút lui khỏi nextId
        inPath.delete(nextId);
        path.pop();
        // Xóa cạnh vừa đi khỏi traversedEdges
        const edgeIdx = traversedEdges.findIndex(e => e.edgeId === edgeId);
        if (edgeIdx !== -1) traversedEdges.splice(edgeIdx, 1);
        const vEdgeIdx = visitedEdgeIds.lastIndexOf(edgeId);
        if (vEdgeIdx !== -1) visitedEdgeIds.splice(vEdgeIdx, 1);

        steps.push({
          stepIndex: stepCounter++,
          algorithm: 'hamilton',
          status: 'backtracking',
          activeVertexId: currId,
          backtrackedVertexId: nextId,
          message: `Quay lui từ ${nextVertex.label} về lại ${currVertex.label}.`,
          detail: `Nhánh tìm kiếm qua đỉnh ${nextVertex.label} không dẫn đến Chu trình Hamilton hợp lệ. Rút lui để thử đỉnh kề khác của ${currVertex.label}.`,
          currentPath: path.map(id => vertexMap.get(id)?.label || id),
          visitedVertexIds: Array.from(inPath),
          visitedEdgeIds: [...visitedEdgeIds],
          traversedEdges: [...traversedEdges],
          stack: path.map(id => vertexMap.get(id)?.label || id),
          circuit: [],
        });
      }
    }

    return false;
  }

  backtrack(startVertex.id);

  if (foundCycle) {
    const cycleLabels = finalCycleIds.map(id => vertexMap.get(id)?.label || id);
    const cycleEdgeIds: string[] = [];
    for (let i = 0; i < finalCycleIds.length - 1; i++) {
      const eId = findEdgeId(edges, finalCycleIds[i], finalCycleIds[i + 1]);
      if (eId) cycleEdgeIds.push(eId);
    }

    analysis.hasCycle = true;
    analysis.cycle = finalCycleIds;
    analysis.cycleLabels = cycleLabels;
    analysis.edgeIdsInCycle = cycleEdgeIds;
    analysis.reason = `Tìm thấy Chu trình Hamilton thành công: ${cycleLabels.join(' → ')}. Chu trình đi qua tất cả ${n} đỉnh mỗi đỉnh đúng 1 lần và quay về đỉnh ban đầu.`;

    return {
      steps,
      cycleVertexIds: finalCycleIds,
      cycleLabels,
      cycleEdgeIds,
      hasCycle: true,
      analysis,
    };
  } else {
    // Không tìm thấy chu trình Hamilton
    const failMessage = steps.length >= MAX_STEPS
      ? `Đã dừng sau ${MAX_STEPS} bước duyệt: Không tìm thấy Chu trình Hamilton trong phạm vi tìm kiếm.`
      : 'Thuật toán quay lui đã duyệt hết toàn bộ không gian nhánh khả dĩ và KHÔNG TÌM THẤY chu trình Hamilton.';

    steps.push({
      stepIndex: stepCounter++,
      algorithm: 'hamilton',
      status: 'failed',
      activeVertexId: startVertex.id,
      message: 'Kết thúc tìm kiếm: Đồ thị không có Chu trình Hamilton.',
      detail: `${failMessage} (Lưu ý: Không tìm thấy bằng thuật toán duyệt toàn bộ khẳng định đồ thị này không chứa chu trình Hamilton).`,
      currentPath: [],
      visitedVertexIds: [],
      visitedEdgeIds: [],
      traversedEdges: [],
      stack: [],
      circuit: [],
    });

    analysis.hasCycle = false;
    analysis.cycle = [];
    analysis.cycleLabels = [];
    analysis.edgeIdsInCycle = [];
    analysis.reason = failMessage;

    return {
      steps,
      cycleVertexIds: [],
      cycleLabels: [],
      cycleEdgeIds: [],
      hasCycle: false,
      analysis,
    };
  }
}
