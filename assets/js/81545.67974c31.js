"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[81545],{

/***/ 81545
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEdgesToRender: () => (/* binding */ getEdgesToRender),
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57494);
/* harmony import */ var _chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(77044);
/* harmony import */ var _chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62085);
/* harmony import */ var _chunk_C7G6YPKG_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31699);
/* harmony import */ var _chunk_7BUUIJ7U_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4515);
/* harmony import */ var _chunk_OGEWGWER_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(24862);
/* harmony import */ var _chunk_Q4XR5HBZ_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(89520);
/* harmony import */ var _chunk_HOUHSVGY_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(67119);
/* harmony import */ var _chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(86924);
/* harmony import */ var _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(79773);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(54681);
/* harmony import */ var dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(39035);
/* harmony import */ var dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(46591);
/* harmony import */ var dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(62499);













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
var shouldMergeSelfLoopSegments = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)((diagramType) => diagramType === "flowchart" || diagramType === "flowchart-v2" || diagramType === "stateDiagram", "shouldMergeSelfLoopSegments");
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
var recursiveRender = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async (_elem, graph, diagramType, id, parentCluster, siteConfig) => {
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.warn("Graph in recursive render:XAX", dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__/* .write */ .M(graph), parentCluster);
  const dir = graph.graph().rankdir;
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace("Dir in recursive render - dir:", dir);
  const elem = _elem.insert("g").attr("class", "root");
  if (!graph.nodes()) {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("No nodes found for", graph);
  } else {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Recursive render XXX", graph.nodes());
  }
  if (graph.edges().length > 0) {
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Recursive edges", graph.edge(graph.edges()[0]));
  }
  const clusters = elem.insert("g").attr("class", "clusters");
  const edgePaths = elem.insert("g").attr("class", "edgePaths");
  const edgeLabels = elem.insert("g").attr("class", "edgeLabels");
  const nodes = elem.insert("g").attr("class", "nodes");
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
        const o = await recursiveRender(
          nodes,
          node.graph,
          diagramType,
          id,
          graph.node(v),
          siteConfig
        );
        const newEl = o.elem;
        (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .updateNodeBounds */ .lC)(node, newEl);
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
        (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .setNodeElem */ .U7)(newEl, node);
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
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace((0,_chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .findNonClusterChild */ .dc)(node.id, graph));
          _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.set(node.id, { id: (0,_chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .findNonClusterChild */ .dc)(node.id, graph), node });
        } else {
          _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.trace("Node - the non recursive path XAX", v, nodes, graph.node(v), dir);
          await (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .insertNode */ .on)(nodes, graph.node(v), { config: siteConfig, dir });
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
        _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju,
        "ids:",
        e.v,
        e.w,
        "Translating: ",
        _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(e.v),
        _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(e.w)
      );
      if (mergeSelfLoops && edge.selfLoop) {
        if (edge.selfLoop.order !== 1) {
          return;
        }
        const segmentId = edge.id;
        edge.id = edge.selfLoop.id;
        await (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .insertEdgeLabel */ .jP)(edgeLabels, edge);
        edge.id = segmentId;
        return;
      }
      await (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .insertEdgeLabel */ .jP)(edgeLabels, edge);
    });
    await Promise.all(edgePromises);
  }, "processEdges");
  await processEdges();
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Graph before layout:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__/* .write */ .M(graph)));
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("############################################# XXX");
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("###                Layout                 ### XXX");
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("############################################# XXX");
  (0,dagre_d3_es_src_dagre_index_js__WEBPACK_IMPORTED_MODULE_12__/* .layout */ .Zp)(graph);
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.info("Graph after layout:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__/* .write */ .M(graph)));
  let diff = 0;
  let { subGraphTitleTotalMargin } = (0,_chunk_OGEWGWER_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getSubGraphTitleMargins */ .O)(siteConfig);
  await Promise.all(
    (0,_chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sortNodesByHierarchy */ .sc)(graph).map(async function(v) {
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
        _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(node.id).node = node;
        (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .positionNode */ .U_)(node);
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
          await (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .insertCluster */ .U)(clusters, node);
          _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju.get(node.id).node = node;
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
          (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .positionNode */ .U_)(node);
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
    const paths = (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .insertEdge */ .Jo)(edgePaths, edge, _chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clusterDb */ .ju, diagramType, startNode, endNode, id);
    (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .positionEdgeLabel */ .T_)(edge, paths);
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
}, "recursiveRender");
var render = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_11__/* .__name */ .K)(async (data4Layout, svg) => {
  const graph = new dagre_d3_es_src_graphlib_index_js__WEBPACK_IMPORTED_MODULE_14__/* .Graph */ .T({
    multigraph: true,
    compound: true
  }).setGraph({
    rankdir: data4Layout.direction,
    nodesep: data4Layout.config?.nodeSpacing || data4Layout.config?.flowchart?.nodeSpacing || data4Layout.nodeSpacing,
    ranksep: data4Layout.config?.rankSpacing || data4Layout.config?.flowchart?.rankSpacing || data4Layout.rankSpacing,
    marginx: 8,
    marginy: 8
  }).setDefaultEdgeLabel(function() {
    return {};
  });
  const element = svg.select("g");
  (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .markers_default */ .g0)(element, data4Layout.markers, data4Layout.type, data4Layout.diagramId);
  (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .clear2 */ .gh)();
  (0,_chunk_52WLFC77_mjs__WEBPACK_IMPORTED_MODULE_1__/* .clear */ .IU)();
  (0,_chunk_ZGVPDNZ5_mjs__WEBPACK_IMPORTED_MODULE_2__/* .clear */ .IU)();
  (0,_chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clear */ .IU)();
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
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.warn("Graph at first:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__/* .write */ .M(graph)));
  (0,_chunk_RYQCIY6F_mjs__WEBPACK_IMPORTED_MODULE_0__/* .adjustClustersAndEdges */ .OS)(graph);
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_10__/* .log */ .R.warn("Graph after XAX:", JSON.stringify(dagre_d3_es_src_graphlib_json_js__WEBPACK_IMPORTED_MODULE_13__/* .write */ .M(graph)));
  const siteConfig = (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_9__/* .getConfig2 */ .D7)();
  await recursiveRender(
    element,
    graph,
    data4Layout.type,
    data4Layout.diagramId,
    void 0,
    siteConfig
  );
}, "render");



/***/ }

}]);