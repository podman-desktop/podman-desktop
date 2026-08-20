"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[25081],{

/***/ 25081
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyDagreLayoutResult: () => (/* binding */ applyDagreLayoutResult),
/* harmony export */   getEdgesToRender: () => (/* binding */ getEdgesToRender),
/* harmony export */   measureDagreLayout: () => (/* binding */ measureDagreLayout),
/* harmony export */   prepareLayoutForDagre: () => (/* binding */ prepareLayoutForDagre),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   runDagreLayoutCore: () => (/* binding */ runDagreLayoutCore)
/* harmony export */ });
/* harmony import */ var _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77213);
/* harmony import */ var _chunk_JQ64N6SF_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62093);
/* harmony import */ var _chunk_R7TYR2AO_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62555);
/* harmony import */ var _chunk_OBVCFTLP_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49131);
/* harmony import */ var _chunk_TEH6E4GO_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(82081);
/* harmony import */ var _chunk_P2QGCYS3_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3079);
/* harmony import */ var _chunk_GMAD6QVW_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(67789);
/* harmony import */ var _chunk_PWAF6VOD_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(97584);
/* harmony import */ var _chunk_75Z2AOVW_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(72605);
/* harmony import */ var _chunk_DU6HZSFF_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4299);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(54681);
/* harmony import */ var dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(34363);
/* harmony import */ var dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(62499);













// src/rendering-util/layout-algorithms/dagre/index.js


var clamp = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((value, min, max) => Math.max(min, Math.min(max, value)), "clamp");
var getDefaultSelfLoopSide = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((rankdir = "TB") => {
  switch (rankdir) {
    case "BT":
      return "bottom";
    case "LR":
      return "right";
    case "RL":
      return "left";
    case "TB":
    default:
      return "top";
  }
}, "getDefaultSelfLoopSide");
var shouldMergeSelfLoopSegments = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((diagramType) => diagramType === "flowchart" || diagramType === "flowchart-v2" || diagramType === "stateDiagram" || diagramType === "er" || diagramType === "classDiagram", "shouldMergeSelfLoopSegments");
var DAGRE_NODE_LAYOUT_PROPERTIES = [
  "x",
  "y",
  "width",
  "height",
  "labelBBox",
  "intersect",
  "calcIntersect",
  "diff",
  "clusterNode"
];
var getSelfLoopSide = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((graph, node, segments, originalNodeId, rankdir) => {
  const layoutHints = [];
  const dummyNodeIds = /* @__PURE__ */ new Set();
  segments.forEach(({ start, end }) => {
    if (start !== originalNodeId) {
      dummyNodeIds.add(start);
    }
    if (end !== originalNodeId) {
      dummyNodeIds.add(end);
    }
  });
  dummyNodeIds.forEach((id) => {
    const dummyNode = graph.node(id);
    if (typeof dummyNode?.x === "number" && typeof dummyNode?.y === "number") {
      layoutHints.push(dummyNode);
    }
  });
  if (layoutHints.length === 0) {
    segments.forEach(({ edge }) => {
      (edge.points ?? []).forEach((point) => {
        if (typeof point?.x === "number" && typeof point?.y === "number") {
          layoutHints.push(point);
        }
      });
    });
  }
  if (layoutHints.length === 0) {
    return getDefaultSelfLoopSide(rankdir);
  }
  const center = layoutHints.reduce(
    (acc, point) => ({
      x: acc.x + point.x / layoutHints.length,
      y: acc.y + point.y / layoutHints.length
    }),
    { x: 0, y: 0 }
  );
  const dx = center.x - node.x;
  const dy = center.y - node.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  if (Math.abs(dy) > 0) {
    return dy > 0 ? "bottom" : "top";
  }
  return getDefaultSelfLoopSide(rankdir);
}, "getSelfLoopSide");
var getSelfLoopPoints = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((node, side = "top", yOffset = 0, labelWidth = 0) => {
  const x = node.x;
  const y = node.y - yOffset;
  const halfWidth = node.width / 2;
  const halfHeight = node.height / 2;
  const maxSpan = Math.max(36, Math.min(100, node.width * 0.8));
  const span = clamp(Math.max(labelWidth, node.width * 0.35), 36, maxSpan);
  const depth = clamp(Math.min(node.width, node.height) * 0.45, 24, 48);
  switch (side) {
    case "bottom": {
      const bottom = y + halfHeight;
      return [
        { x: x - span / 2, y: bottom },
        { x: x - span / 2, y: bottom + depth },
        { x: x + span / 2, y: bottom + depth },
        { x: x + span / 2, y: bottom }
      ];
    }
    case "right": {
      const right = x + halfWidth;
      return [
        { x: right, y: y - span / 2 },
        { x: right + depth, y: y - span / 2 },
        { x: right + depth, y: y + span / 2 },
        { x: right, y: y + span / 2 }
      ];
    }
    case "left": {
      const left = x - halfWidth;
      return [
        { x: left, y: y - span / 2 },
        { x: left - depth, y: y - span / 2 },
        { x: left - depth, y: y + span / 2 },
        { x: left, y: y + span / 2 }
      ];
    }
    case "top":
    default: {
      const top = y - halfHeight;
      return [
        { x: x - span / 2, y: top },
        { x: x - span / 2, y: top - depth },
        { x: x + span / 2, y: top - depth },
        { x: x + span / 2, y: top }
      ];
    }
  }
}, "getSelfLoopPoints");
var getSelfLoopLabelPosition = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((node, points, side = "top", yOffset = 0, label = {}) => {
  const gap = 4;
  const x = node.x;
  const y = node.y - yOffset;
  const labelWidth = label.width ?? 0;
  const labelHeight = label.height ?? 0;
  switch (side) {
    case "bottom":
      return { x, y: Math.max(...points.map((point) => point.y)) + labelHeight / 2 + gap };
    case "right":
      return { x: Math.max(...points.map((point) => point.x)) + labelWidth / 2 + gap, y };
    case "left":
      return { x: Math.min(...points.map((point) => point.x)) - labelWidth / 2 - gap, y };
    case "top":
    default:
      return { x, y: Math.min(...points.map((point) => point.y)) - labelHeight / 2 - gap };
  }
}, "getSelfLoopLabelPosition");
var getEdgesToRender = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((graph, yOffset = 0, { mergeSelfLoops = true } = {}) => {
  const selfLoopEdgeGroups = /* @__PURE__ */ new Map();
  const edgesToRender = [];
  const rankdir = graph.graph()?.rankdir;
  graph.edges().forEach((e) => {
    const edge = graph.edge(e);
    if (mergeSelfLoops && edge.selfLoop) {
      const key = edge.selfLoop.id;
      if (!selfLoopEdgeGroups.has(key)) {
        selfLoopEdgeGroups.set(key, []);
      }
      selfLoopEdgeGroups.get(key).push({ edge, start: e.v, end: e.w });
    } else {
      edgesToRender.push({ edge, start: e.v, end: e.w });
    }
  });
  selfLoopEdgeGroups.forEach((segments) => {
    if (segments.length !== 3) {
      segments.forEach((segment) => edgesToRender.push(segment));
      return;
    }
    segments.sort((a, b) => a.edge.selfLoop.order - b.edge.selfLoop.order);
    const [firstSegment, middleSegment, lastSegment] = segments;
    const originalEdge = firstSegment.edge.originalEdge ?? middleSegment.edge.originalEdge ?? lastSegment.edge.originalEdge ?? middleSegment.edge;
    const node = graph.node(originalEdge.start);
    if (!node) {
      segments.forEach((segment) => edgesToRender.push(segment));
      return;
    }
    const label = {
      width: middleSegment.edge.width,
      height: middleSegment.edge.height
    };
    const side = getSelfLoopSide(graph, node, segments, originalEdge.start, rankdir);
    const points = getSelfLoopPoints(node, side, yOffset, label.width ?? 0);
    const labelPosition = getSelfLoopLabelPosition(node, points, side, yOffset, label);
    const mergedEdge = {
      ...middleSegment.edge,
      ...originalEdge,
      id: originalEdge.id,
      points,
      start: originalEdge.start,
      end: originalEdge.end,
      x: labelPosition.x,
      y: labelPosition.y,
      width: label.width,
      height: label.height,
      labelStyle: middleSegment.edge.labelStyle,
      fromCluster: firstSegment.edge.fromCluster ?? middleSegment.edge.fromCluster ?? lastSegment.edge.fromCluster,
      toCluster: firstSegment.edge.toCluster ?? middleSegment.edge.toCluster ?? lastSegment.edge.toCluster
    };
    delete mergedEdge.selfLoop;
    delete mergedEdge.originalEdge;
    edgesToRender.push({ edge: mergedEdge, start: mergedEdge.start, end: mergedEdge.end });
  });
  return edgesToRender;
}, "getEdgesToRender");
var measureDagreGraph = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async ({
  element: _elem,
  graph,
  diagramType,
  id,
  parentCluster,
  siteConfig
}) => {
  const dir = graph.graph().rankdir;
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace("Dir in recursive render - dir:", dir);
  const {
    clusters,
    edgePaths,
    edgeLabels,
    nodes,
    rootGroups: elem
  } = (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .createLayoutElementGroups */ .B)(_elem, {
    edgePathsClass: "edgePaths"
  });
  if (!graph.nodes()) {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("No nodes found for", graph);
  } else {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Recursive render XXX", graph.nodes());
  }
  if (graph.edges().length > 0) {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Recursive edges", graph.edge(graph.edges()[0]));
  }
  const mergeSelfLoops = shouldMergeSelfLoopSegments(diagramType);
  await Promise.all(
    graph.nodes().map(async function(v) {
      const node = graph.node(v);
      if (parentCluster !== void 0) {
        const data = JSON.parse(JSON.stringify(parentCluster.clusterData));
        _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace(
          "Setting data for parent cluster XXX\n Node.id = ",
          v,
          "\n data=",
          data.height,
          "\nParent cluster",
          parentCluster.height
        );
        graph.setNode(parentCluster.id, data);
        if (!graph.parent(v)) {
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace("Setting parent", v, parentCluster.id);
          graph.setParent(v, parentCluster.id, data);
        }
      }
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("(Insert) Node XXX" + v + ": " + JSON.stringify(graph.node(v)));
      if (node?.clusterNode) {
        _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Cluster identified XBX", v, node.width, graph.node(v));
        const { ranksep, nodesep } = graph.graph();
        node.graph.setGraph({
          ...node.graph.graph(),
          ranksep: ranksep + 25,
          nodesep
        });
        const o = await renderDagreSubgraph({
          element: nodes,
          graph: node.graph,
          diagramType,
          id,
          parentCluster: graph.node(v),
          siteConfig
        });
        const newEl = o.elem;
        (0,_chunk_TEH6E4GO_mjs__WEBPACK_IMPORTED_MODULE_4__/* .updateNodeBounds */ .lC)(node, newEl);
        node.diff = o.diff || 0;
        _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
          "New compound node after recursive render XAX",
          v,
          "width",
          // node,
          node.width,
          "height",
          node.height
          // node.x,
          // node.y
        );
        (0,_chunk_OBVCFTLP_mjs__WEBPACK_IMPORTED_MODULE_3__/* .setNodeElem */ .U7)(newEl, node);
      } else {
        if (graph.children(v).length > 0) {
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace(
            "Cluster - the non recursive path XBX",
            v,
            node.id,
            node,
            node.width,
            "Graph:",
            graph
          );
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace((0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .findNonClusterChild */ .dc)(node.id, graph));
          _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.set(node.id, { id: (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .findNonClusterChild */ .dc)(node.id, graph), node });
        } else {
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace("Node - the non recursive path XAX", v, nodes, graph.node(v), dir);
          await (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .insertMeasuredNode */ .sv)(nodes, graph.node(v), { config: siteConfig, dir });
        }
      }
    })
  );
  const processEdges = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async () => {
    const edgePromises = graph.edges().map(async function(e) {
      const edge = graph.edge(e.v, e.w, e.name);
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Edge " + e.v + " -> " + e.w + ": ", e, " ", JSON.stringify(graph.edge(e)));
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
        "Fix",
        _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju,
        "ids:",
        e.v,
        e.w,
        "Translating: ",
        _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(e.v),
        _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(e.w)
      );
      if (mergeSelfLoops && edge.selfLoop) {
        if (edge.selfLoop.order !== 1) {
          return;
        }
        const labelEdge = {
          ...edge.originalEdge,
          ...edge,
          id: edge.selfLoop.id,
          startLabelLeft: edge.originalEdge?.startLabelLeft ?? edge.startLabelLeft,
          startLabelRight: edge.originalEdge?.startLabelRight ?? edge.startLabelRight,
          endLabelLeft: edge.originalEdge?.endLabelLeft ?? edge.endLabelLeft,
          endLabelRight: edge.originalEdge?.endLabelRight ?? edge.endLabelRight
        };
        await (0,_chunk_R7TYR2AO_mjs__WEBPACK_IMPORTED_MODULE_2__/* .insertEdgeLabel */ .jP)(edgeLabels, labelEdge);
        edge.width = labelEdge.width;
        edge.height = labelEdge.height;
        edge.labelStyle = labelEdge.labelStyle;
        return;
      }
      await (0,_chunk_R7TYR2AO_mjs__WEBPACK_IMPORTED_MODULE_2__/* .insertEdgeLabel */ .jP)(edgeLabels, edge);
    });
    await Promise.all(edgePromises);
  }, "processEdges");
  await processEdges();
  const { subGraphTitleTotalMargin } = (0,_chunk_OBVCFTLP_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getSubGraphTitleMargins */ .Oi)(siteConfig);
  return {
    elem,
    graph,
    groups: { clusters, edgePaths, edgeLabels, nodes, rootGroups: elem },
    diagramType,
    id,
    mergeSelfLoops,
    subGraphTitleTotalMargin
  };
}, "measureDagreGraph");
var runDagreGraphLayout = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((graph) => {
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("############################################# XXX");
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("###                Layout                 ### XXX");
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("############################################# XXX");
  if (false) // removed by dead control flow
{}
  (0,dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_12__/* .layout */ .Zp)(graph);
  if (false) // removed by dead control flow
{}
}, "runDagreGraphLayout");
var normalizeDagreNode = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((graph, nodeId, subGraphTitleTotalMargin) => {
  const node = graph.node(nodeId);
  if (!node) {
    return void 0;
  }
  const normalizedNode = { ...node };
  if (node?.clusterNode) {
    normalizedNode.y = (node.y ?? 0) + subGraphTitleTotalMargin;
  } else if (graph.children(nodeId).length > 0) {
    normalizedNode.height = (node.height ?? 0) + subGraphTitleTotalMargin;
  } else {
    normalizedNode.y = (node.y ?? 0) + subGraphTitleTotalMargin / 2;
  }
  return normalizedNode;
}, "normalizeDagreNode");
var applyDagreNodeLayout = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((targetNode, dagreNode) => {
  DAGRE_NODE_LAYOUT_PROPERTIES.forEach((property) => {
    if (dagreNode[property] !== void 0) {
      targetNode[property] = dagreNode[property];
    }
  });
}, "applyDagreNodeLayout");
var normalizeDagreEdge = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((edge, start, end, edgeOffsetY) => ({
  ...edge,
  start: edge.start ?? start,
  end: edge.end ?? end,
  points: (edge.points ?? []).map((point) => ({
    ...point,
    y: typeof point.y === "number" ? point.y + edgeOffsetY : point.y
  }))
}), "normalizeDagreEdge");
var applyDagreLayoutResult = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((data4Layout, measuredLayout) => {
  const { graph, mergeSelfLoops, subGraphTitleTotalMargin = 0 } = measuredLayout;
  const nodeById = new Map(data4Layout.nodes.map((node) => [node.id, node]));
  (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sortNodesByHierarchy */ .sc)(graph).forEach((nodeId) => {
    const dagreNode = normalizeDagreNode(graph, nodeId, subGraphTitleTotalMargin);
    if (!dagreNode) {
      return;
    }
    applyDagreNodeLayout(graph.node(nodeId), dagreNode);
    const targetNode = nodeById.get(nodeId);
    if (targetNode) {
      applyDagreNodeLayout(targetNode, dagreNode);
    }
  });
  const edgeOffsetY = subGraphTitleTotalMargin / 2;
  data4Layout.edges = getEdgesToRender(graph, edgeOffsetY, { mergeSelfLoops }).map(
    ({ edge, start, end }) => normalizeDagreEdge(edge, start, end, edgeOffsetY)
  );
  return data4Layout;
}, "applyDagreLayoutResult");
var paintDagreLayoutCore = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async ({
  elem,
  graph,
  groups: { clusters, edgePaths },
  diagramType,
  id,
  mergeSelfLoops,
  subGraphTitleTotalMargin
}) => {
  let diff = 0;
  await Promise.all(
    (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sortNodesByHierarchy */ .sc)(graph).map(async function(v) {
      const node = graph.node(v);
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
        "Position XBX => " + v + ": (" + node.x,
        "," + node.y,
        ") width: ",
        node.width,
        " height: ",
        node.height
      );
      if (node?.clusterNode) {
        node.y += subGraphTitleTotalMargin;
        _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
          "A tainted cluster node XBX1",
          v,
          node.id,
          node.width,
          node.height,
          node.x,
          node.y,
          graph.parent(v)
        );
        _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(node.id).node = node;
        (0,_chunk_OBVCFTLP_mjs__WEBPACK_IMPORTED_MODULE_3__/* .positionNode */ .U_)(node);
      } else {
        if (graph.children(v).length > 0) {
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
            "A pure cluster node XBX1",
            v,
            node.id,
            node.x,
            node.y,
            node.width,
            node.height,
            graph.parent(v)
          );
          node.height += subGraphTitleTotalMargin;
          graph.node(node.parentId);
          const halfPadding = node?.padding / 2 || 0;
          const labelHeight = node?.labelBBox?.height || 0;
          const offsetY = labelHeight - halfPadding || 0;
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.debug("OffsetY", offsetY, "labelHeight", labelHeight, "halfPadding", halfPadding);
          await (0,_chunk_JQ64N6SF_mjs__WEBPACK_IMPORTED_MODULE_1__/* .insertCluster */ .U)(clusters, node);
          _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(node.id).node = node;
        } else {
          const parent = graph.node(node.parentId);
          node.y += subGraphTitleTotalMargin / 2;
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(
            "A regular node XBX1 - using the padding",
            node.id,
            "parent",
            node.parentId,
            node.width,
            node.height,
            node.x,
            node.y,
            "offsetY",
            node.offsetY,
            "parent",
            parent,
            parent?.offsetY,
            node
          );
          (0,_chunk_OBVCFTLP_mjs__WEBPACK_IMPORTED_MODULE_3__/* .positionNode */ .U_)(node);
        }
      }
    })
  );
  const edgeOffsetY = subGraphTitleTotalMargin / 2;
  const edgesToRender = getEdgesToRender(graph, edgeOffsetY, { mergeSelfLoops });
  edgesToRender.forEach(function({ edge, start, end }) {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Edge " + start + " -> " + end + ": " + JSON.stringify(edge), edge);
    edge.points.forEach((point) => point.y += edgeOffsetY);
    const startNode = graph.node(start);
    const endNode = graph.node(end);
    const paths = (0,_chunk_R7TYR2AO_mjs__WEBPACK_IMPORTED_MODULE_2__/* .insertEdge */ .Jo)(edgePaths, edge, _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju, diagramType, startNode, endNode, id);
    (0,_chunk_R7TYR2AO_mjs__WEBPACK_IMPORTED_MODULE_2__/* .positionEdgeLabel */ .T_)(edge, paths);
  });
  graph.nodes().forEach(function(v) {
    const n = graph.node(v);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info(v, n.type, n.diff);
    if (n.isGroup) {
      diff = n.diff;
    }
  });
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.warn("Returning from recursive render XAX", elem, diff);
  return { elem, diff };
}, "paintDagreLayoutCore");
var renderDagreSubgraph = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async (options) => {
  const measuredLayout = await measureDagreGraph(options);
  runDagreGraphLayout(measuredLayout.graph);
  return await paintDagreLayoutCore(measuredLayout);
}, "renderDagreSubgraph");
var prepareLayoutForDagre = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((data4Layout) => {
  const graph = new dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_13__/* .Graph */ .T({
    multigraph: true,
    compound: true
  }).setGraph({
    rankdir: data4Layout.direction,
    // Precedence: an explicit top-level config override (only present when a
    // user sets it - it has no schema default) > the value the diagram's own
    // renderer put on data4Layout (usually derived from that diagram's config)
    // > the flowchart config as a generic fallback. The flowchart keys have
    // schema defaults and therefore always exist, so they must come last or
    // they silently shadow every diagram's own spacing (see #7932).
    nodesep: data4Layout.config?.nodeSpacing || data4Layout.nodeSpacing || data4Layout.config?.flowchart?.nodeSpacing,
    ranksep: data4Layout.config?.rankSpacing || data4Layout.rankSpacing || data4Layout.config?.flowchart?.rankSpacing,
    marginx: 8,
    marginy: 8
  }).setDefaultEdgeLabel(function() {
    return {};
  });
  data4Layout.nodes.forEach((node) => {
    graph.setNode(node.id, { ...node });
    if (node.parentId) {
      graph.setParent(node.id, node.parentId);
    }
  });
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.debug("Edges:", data4Layout.edges);
  data4Layout.edges.forEach((edge) => {
    if (edge.start === edge.end) {
      const nodeId = edge.start;
      const specialId1 = nodeId + "---" + nodeId + "---1";
      const specialId2 = nodeId + "---" + nodeId + "---2";
      const node = graph.node(nodeId);
      graph.setNode(specialId1, {
        domId: specialId1,
        id: specialId1,
        parentId: node.parentId,
        labelStyle: "",
        label: "",
        padding: 0,
        shape: "labelRect",
        // shape: 'rect',
        style: "",
        width: 10,
        height: 10
      });
      graph.setParent(specialId1, node.parentId);
      graph.setNode(specialId2, {
        domId: specialId2,
        id: specialId2,
        parentId: node.parentId,
        labelStyle: "",
        padding: 0,
        // shape: 'rect',
        shape: "labelRect",
        label: "",
        style: "",
        width: 10,
        height: 10
      });
      graph.setParent(specialId2, node.parentId);
      const originalEdge = structuredClone(edge);
      const edge1 = structuredClone(edge);
      const edgeMid = structuredClone(edge);
      const edge2 = structuredClone(edge);
      edge1.originalEdge = originalEdge;
      edge1.selfLoop = { id: originalEdge.id, order: 0 };
      edgeMid.originalEdge = originalEdge;
      edgeMid.selfLoop = { id: originalEdge.id, order: 1 };
      edge2.originalEdge = originalEdge;
      edge2.selfLoop = { id: originalEdge.id, order: 2 };
      edge1.label = "";
      edge1.arrowTypeEnd = "none";
      edge1.endLabelLeft = "";
      edge1.endLabelRight = "";
      edge1.startLabelLeft = "";
      edge1.id = nodeId + "-cyclic-special-1";
      edgeMid.startLabelRight = "";
      edgeMid.startLabelLeft = "";
      edgeMid.endLabelLeft = "";
      edgeMid.endLabelRight = "";
      edgeMid.arrowTypeStart = "none";
      edgeMid.arrowTypeEnd = "none";
      edgeMid.id = nodeId + "-cyclic-special-mid";
      edge2.label = "";
      edge2.startLabelRight = "";
      edge2.startLabelLeft = "";
      edge2.arrowTypeStart = "none";
      if (node.isGroup) {
        edge1.fromCluster = nodeId;
        edge2.toCluster = nodeId;
      }
      edge2.id = nodeId + "-cyclic-special-2";
      edge2.arrowTypeStart = "none";
      graph.setEdge(nodeId, specialId1, edge1, nodeId + "-cyclic-special-0");
      graph.setEdge(specialId1, specialId2, edgeMid, nodeId + "-cyclic-special-1");
      graph.setEdge(specialId2, nodeId, edge2, nodeId + "-cyclic-special-2");
    } else {
      graph.setEdge(edge.start, edge.end, { ...edge }, edge.id);
    }
  });
  (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .adjustClustersAndEdges */ .OS)(graph);
  return { graph };
}, "prepareLayoutForDagre");
var measureDagreLayout = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async (data4Layout, { element, preparedLayout }) => {
  const prepared = preparedLayout ?? prepareLayoutForDagre(data4Layout);
  const siteConfig = (0,_chunk_DU6HZSFF_mjs__WEBPACK_IMPORTED_MODULE_9__/* .getConfig2 */ .D7)();
  const measuredLayout = await measureDagreGraph({
    element,
    graph: prepared.graph,
    diagramType: data4Layout.type,
    id: data4Layout.diagramId,
    parentCluster: void 0,
    siteConfig
  });
  prepared.measuredLayout = measuredLayout;
  return measuredLayout;
}, "measureDagreLayout");
var runDagreLayoutCore = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((data4Layout, context) => {
  const measuredLayout = context.preparedLayout?.measuredLayout;
  if (!measuredLayout) {
    throw new Error("runDagreLayoutCore requires measureDagreLayout to run first");
  }
  runDagreGraphLayout(measuredLayout.graph);
  applyDagreLayoutResult(data4Layout, measuredLayout);
  return measuredLayout;
}, "runDagreLayoutCore");
var getDagrePaintNodes = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((_data4Layout, { measure }) => (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sortNodesByHierarchy */ .sc)(measure.graph).map((nodeId) => measure.graph.node(nodeId)).filter(Boolean), "getDagrePaintNodes");
var getDagreEdgeNode = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((nodeId, _edge, { measure }) => nodeId ? measure.graph.node(nodeId) : void 0, "getDagreEdgeNode");
var render = (0,_chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .createCommonLayoutRenderer */ .xY)({
  prepareLayout: prepareLayoutForDagre,
  measureLayout: measureDagreLayout,
  runLayoutCore: runDagreLayoutCore,
  paintOptions: {
    clusterDb: _chunk_DSNCTWBM_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju,
    getNodes: getDagrePaintNodes,
    getEdgeNode: getDagreEdgeNode,
    skipNode: /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((node, { measure }) => !measure.graph.hasNode(node.id), "skipNode"),
    isCluster: /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((node, { measure }) => measure.graph.hasNode(node.id) && (measure.graph.children(node.id) ?? []).length > 0, "isCluster")
  }
});



/***/ }

}]);