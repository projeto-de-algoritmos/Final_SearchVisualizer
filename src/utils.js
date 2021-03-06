let INF = 9999999999;

class WeightedGraph {
  constructor() {
    this.adjList = new Map();
    this.edgeList = [];
    this.size = 0;
    this.edges = 0;
    this.hasCycle = false;
  }

  addVertex(v, info = {}) {
    this.adjList.set(v, { ...info, edges: [] });
    this.size++;
  }

  getVertex(v) {
    return this.adjList.get(v);
  }

  getSize() {
    return this.adjList.size;
  }
}

class DirectedGraph extends WeightedGraph {
  addEdge(v1, v2, weight, line) {
    this.adjList.get(v1).edges.push({ edge: v2, weight: weight, line: line });
    this.edgeList.push({ src: v1, dest: v2, weight: weight, line: line });
    this.edges++;
  }
}

function getDistance(pointA, pointB) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}

var addNode = document.getElementById("addNode");
var nodeProperties = document.getElementById("nodeProperties");
var endNode = document.getElementById("endNode");
var startNode = document.getElementById("startNode");

function resetTools() {
  startNode.style.color = "#8d6262";
  startNode.style.color = "#8d6262";
  endNode.style.color = "#8d6262";
  nodeProperties.style.opacity = "1.0";
  nodeProperties.style.display = "none";
  activeTool = 0;
}

function setNode() {
  activeTool = 1;

  addNode.style.color = "#ed8d8d";
  startNode.style.color = "#8d6262";
  endNode.style.color = "#8d6262";

  nodeProperties.style.opacity = "1.0";
  nodeProperties.style.display = "block";
}

function setFinish() {
  endNode.style.color = "#ed8d8d";
  nodeProperties.style.opacity = "1.0";
  nodeProperties.style.display = "none";

  addNode.style.color = "#8d6262";
  startNode.style.color = "#8d6262";

  activeTool = 2;
}

function setStart() {
  startNode.style.color = "#ed8d8d";
  endNode.style.color = "#8d6262";
  addNode.style.color = "#8d6262";
  nodeProperties.style.opacity = "1.0";
  nodeProperties.style.display = "none";
  activeTool = 3;
}

function setElectrical() {
  var checkBox = document.getElementById("eletricalRoad");

  if (checkBox.checked == true) {
    multiplier = -1;
  } else {
    multiplier = 1;
  }
}

function toggleModal() {
	toggleModal.visible = !toggleModal.visible;
	
	if(!toggleModal.modal) {
		toggleModal.modal = document.getElementById('modal');
		toggleModal.backdrop = document.getElementById('backdrop');
	}
	
	if(toggleModal.visible) {
		toggleModal.modal.style.pointerEvents = 'auto';
		toggleModal.modal.style.opacity = '1';
		toggleModal.backdrop.style.pointerEvents = 'auto';
		toggleModal.backdrop.style.opacity = '0.2';
	}
	
	else {
		toggleModal.modal.style.pointerEvents = 'none';
		toggleModal.modal.style.opacity = '0';
		toggleModal.backdrop.style.pointerEvents = 'none';
		toggleModal.backdrop.style.opacity = '0';
	}
}

function sleep(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

async function getDijkstraPath(graph, start_node, last_node) {
  let priority_queue = new TinyQueue([], function (a, b) {
    return a.priority - b.priority;
  });
  let distance = {};
  let previous = {};

  distance[start_node] = 0;
  priority_queue.push({
    index: start_node,
    node: graph.getVertex(start_node),
    priority: 0,
  });

  graph.adjList.forEach((node, index) => {
    if (index != start_node) distance[index] = Infinity;
    previous[index] = null;
  });

  while (priority_queue.length) {
    let current_node = priority_queue.pop();

    for (edge of current_node.node.edges) {
      let cost = edge.weight + distance[current_node.index];

      if (cost < distance[edge.edge]) {
        distance[edge.edge] = cost;
        previous[edge.edge] = current_node.index;

        simulationGraphics.lineStyle(4, 0xff0000);
        simulationGraphics.strokeLineShape(edge.line);
        await sleep(1000);

        priority_queue.push({
          index: edge.edge,
          node: graph.getVertex(edge.edge),
          priority: cost,
        });
      } else {
        simulationGraphics.lineStyle(4, 0xffff00);
        simulationGraphics.strokeLineShape(edge.line);
        await sleep(1000);
      }
    }
  }

  let curN;
  let preN;
  simulationGraphics.lineStyle(4, 0x00ff00);

  curN = preN = last_node;

  while (curN != start_node) {
    if (!curN) {
      alert("Unreachable destination!");
      return;
    }

    curN = previous[curN];

    simulationGraphics.strokeLineShape(
      graph.getVertex(curN).edges.find((element) => element.edge == preN).line
    );
    await sleep(500);

    preN = curN;
  }
}

function HSLToHex(h, s, l) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	
	return `0x${f(0)}${f(8)}${f(4)}`;
}

function randomHSL() {
	if(!randomHSL.h)
		randomHSL.h = 100;
	
	let h = 100;
	while((h > 85 && h < 160) || Math.abs(randomHSL.h - h) < 40) {
		h = parseInt(Math.random() * 360);
	}
	
	randomHSL.h = h;
	
	return {h: h, s: 90, l: 50}
}

function setPlayButton(scene) {
	if(setPlayButton.play_button)
		return;
	
	setPlayButton.play_button = scene.add.image(640, 710, 'play').setOrigin(0.5, 1).setScale(0.5);
	setPlayButton.play_button.setInteractive();
	
	setPlayButton.play_button.on('pointerover', () => {
		setPlayButton.play_button.setTint(0xed8d8d);
	});
	
	setPlayButton.play_button.on('pointerout', () => {
		setPlayButton.play_button.clearTint();
	});
	
	setPlayButton.play_button.on('pointerup', () => {
		toggleModal();
	});
}

async function getBellmanFordPath(graph, start_node, last_node) {
	let costM = [];
	let sucessorM = [];
	const maxEdges = graph.size - 1;
	
	costM[0] = [];
	for(let c = 0; c < graph.size; c += 1)
		costM[0][c] = Infinity;
		
	for(let c = 0; c <= maxEdges; c += 1) {
		if(c != 0)
			costM[c] = [];
		costM[c][last_node] = 0;
	}
	
	for(let i = 1; i <= maxEdges; i += 1) {
		let layerColor = randomHSL();
		layerColor = HSLToHex(layerColor.h, layerColor.s, layerColor.l);
		
		for(let v = 0; v < graph.size; v += 1) {
			let node = graph.getVertex(v);
			costM[i][v] = costM[i - 1][v];
			
			for(let edge of node.edges) {
				if(costM[i][v] > costM[i - 1][edge.edge] + edge.weight) {
					costM[i][v] = costM[i - 1][edge.edge] + edge.weight;
					
					sucessorM[v] = edge;
					
					simulationGraphics.lineStyle(4, layerColor);
					simulationGraphics.strokeLineShape(edge.line);
					await sleep(1000);
				}
			}
		}
	}
	
	let currentNode = start_node;
	let nodeEdge = sucessorM[currentNode];
	simulationGraphics.lineStyle(4, 0x00FF00);
	
	while(currentNode != last_node) {
		simulationGraphics.strokeLineShape(nodeEdge.line);
		await sleep(500);
		
		currentNode = nodeEdge.edge;
		nodeEdge = sucessorM[currentNode];
	}
}

const shortestPathBfs = async (graph, startNode, stopNode) => {
  const previous = new Map();
  const visited = new Set();
  const queue = [];
  queue.push({ node: startNode, dist: 0 });
  visited.add(startNode);

  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    if (node === stopNode) {
      let curN;
      let preN;
      simulationGraphics.lineStyle(4, 0x00ff00);

      curN = preN = stopNode;

      while (curN != startNode) {
        if (!curN) {
          alert("Unreachable destination!");
          return;
        }

        curN = previous.get(curN);

        simulationGraphics.strokeLineShape(
          graph.getVertex(curN).edges.find((element) => element.edge == preN)
            .line
        );
        await sleep(500);

        preN = curN;
      }
      return { shortestDistande: dist, previous };
    }

    for (let neighbour of graph.adjList.get(node).edges) {
      if (!visited.has(neighbour.edge)) {
        previous.set(neighbour.edge, node);
        queue.push({ node: neighbour.edge, dist: dist + 1 });
        visited.add(neighbour.edge);
        simulationGraphics.lineStyle(4, 0xff0000);
        simulationGraphics.strokeLineShape(neighbour.line);
        await sleep(1000);
      }
    }
  }
  return { shortestDistance: -1, previous };
};

const shortestPathDfs = async (graph, startNode, stopNode) => {
  const previous = new Map();
  let shortestDistance = -1;
  const dfs = async (currentNode, depth) => {
    if (currentNode === stopNode) {
      shortestDistance = depth;
      return new Promise((resolve, reject) => resolve());
    } else {
      for (let neighbour of graph.adjList.get(currentNode).edges) {
        simulationGraphics.lineStyle(4, 0xff0000);
        simulationGraphics.strokeLineShape(neighbour.line);
        await sleep(1000);
        previous.set(neighbour.edge, currentNode);
        await dfs(neighbour.edge, depth + 1);
      }
    }
  };
  await dfs(startNode, 0);

  let curN;
  let preN;
  simulationGraphics.lineStyle(4, 0x00ff00);

  curN = preN = stopNode;

  while (curN != startNode) {
    if (!curN) {
      alert("Unreachable destination!");
      return;
    }

    curN = previous.get(curN);

    simulationGraphics.strokeLineShape(
      graph.getVertex(curN).edges.find((element) => element.edge == preN).line
    );
    await sleep(500);

    preN = curN;
  }

  return { shortestDistance, previous };
};

async function setAlgorithm(algorithm) {
	toggleModal();
	simulationGraphics.clear();
	await sleep(500);
	
	switch(algorithm) {
		case 0:
			console.log('bfs')
			if(graphContainsNegativeWeight)
				alert("Graph contains negative weight!");
				
			else
				shortestPathBfs(graph, start_node.id, last_node.id);
			break;
		case 1:
			console.log('dfs')
			if(graphContainsNegativeWeight)
				alert("Graph contains negative weight!");
				
			else
				shortestPathDfs(graph, start_node.id, last_node.id);
			break;
		case 2:
			console.log('dj')
			if(graphContainsNegativeWeight)
				alert("Graph contains negative weight!");
				
			else
				getDijkstraPath(graph, start_node.id, last_node.id);
			break;
		case 3:
			console.log('bellman')
			getBellmanFordPath(graph, start_node.id, last_node.id);
			break;
	}
}