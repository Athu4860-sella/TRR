/**
 * Các định nghĩa kiểu dữ liệu cho đồ thị và thuật toán Euler / Hamilton
 */

export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string; // Vertex ID
  target: string; // Vertex ID
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
}

export interface DegreeInfo {
  vertexId: string;
  label: string;
  degree: number;
  isEven: boolean;
  neighbors: string[]; // labels of neighbor vertices
  neighborIds: string[]; // ids of neighbor vertices
}

export type EulerType = 'circuit' | 'path' | 'none';

export interface EulerAnalysis {
  type: EulerType;
  isAllConnectedNonZero: boolean;
  oddDegreeCount: number;
  oddDegreeVertices: Vertex[];
  evenDegreeVertices: Vertex[];
  zeroDegreeVertices: Vertex[];
  componentsCountNonZero: number;
  totalComponentsCount: number;
  reason: string;
  hasEuler: boolean;
  description: string;
  startVertexId?: string;
  endVertexId?: string;
}

export interface HamiltonAnalysis {
  hasCycle: boolean;
  cycle: string[]; // vertex IDs in order, returning to start
  cycleLabels: string[]; // labels
  edgeIdsInCycle: string[];
  reason: string;
  diracSatisfied: boolean;
  oreSatisfied: boolean;
  theoreticalNotes: string[];
  minDegree: number;
  hasDegreeLessThanTwo: boolean;
}

export type StepStatus = 
  | 'starting'
  | 'visiting'
  | 'traversing'
  | 'backtracking'
  | 'deadend'
  | 'success'
  | 'failed';

export interface TraversedEdgeInfo {
  edgeId: string;
  order: number;
  from: string;
  to: string;
}

export interface SimulationStep {
  stepIndex: number;
  algorithm: 'euler' | 'hamilton';
  status: StepStatus;
  message: string;
  detail?: string;
  activeVertexId?: string;
  targetVertexId?: string;
  activeEdgeId?: string;
  currentPath: string[]; // Vertex IDs in current tour/path
  visitedVertexIds: string[];
  visitedEdgeIds: string[];
  traversedEdges: TraversedEdgeInfo[];
  stack: string[]; // For Hierholzer stack or Hamilton backtrack call stack
  circuit: string[]; // For Hierholzer formed circuit
  backtrackedVertexId?: string;
}

export type CanvasTool = 'select' | 'add_vertex' | 'add_edge' | 'delete';
