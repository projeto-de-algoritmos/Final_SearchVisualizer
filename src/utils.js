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
		this.adjList.set(v, {...info, edges: []});
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
		this.adjList.get(v1).edges.push({edge: v2, weight: weight, line: line});
		this.edgeList.push({src: v1, dest: v2, weight: weight, line: line});
		this.edges++;
	}
}

function getDistance(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

var addNode = document.getElementById("addNode");
var nodeProperties = document.getElementById("nodeProperties");
var endNode = document.getElementById("endNode");
var startNode = document.getElementById("startNode");

function resetTools() {
	startNode.style.color = "#8d6262"
    startNode.style.color = "#8d6262"
    endNode.style.color = "#8d6262"
	nodeProperties.style.opacity = "1.0"
    nodeProperties.style.display = "none"
	activeTool = 0;
}

function setNode(){
    activeTool = 1;

    addNode.style.color = "#ed8d8d"
    startNode.style.color = "#8d6262"
    endNode.style.color = "#8d6262"

    nodeProperties.style.opacity = "1.0"
    nodeProperties.style.display = "block"
}

function setFinish(){
    endNode.style.color = "#ed8d8d"
    nodeProperties.style.opacity = "1.0"
    nodeProperties.style.display = "none"

    addNode.style.color = "#8d6262"    
    startNode.style.color = "#8d6262" 

    activeTool = 2;
}

function setStart(){
    
    startNode.style.color = "#ed8d8d"
    endNode.style.color = "#8d6262"
    addNode.style.color = "#8d6262"
    nodeProperties.style.opacity = "1.0"
    nodeProperties.style.display = "none"
    activeTool = 3;
}

function setElectrical() {
    var checkBox = document.getElementById("eletricalRoad");
	
    if (checkBox.checked == true){
        multiplier = -1;
    } else {
       multiplier = 1;
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
	priority_queue.push({index: start_node, node: graph.getVertex(start_node), priority: 0});

	graph.adjList.forEach((node, index) => {
		if(index != start_node)
			distance[index] = Infinity;
		previous[index] = null;
	});

	while(priority_queue.length) {
		let current_node = priority_queue.pop();
		
		for(edge of current_node.node.edges) {
			let cost = edge.weight + distance[current_node.index];

			if(cost < distance[edge.edge]) {
				distance[edge.edge] = cost;
				previous[edge.edge] = current_node.index;
				
				simulationGraphics.lineStyle(4, 0xFF0000);
				simulationGraphics.strokeLineShape(edge.line);
				await sleep(1000);

				priority_queue.push({index: edge.edge, node: graph.getVertex(edge.edge), priority: cost});
			}
			
			else {
				simulationGraphics.lineStyle(4, 0xFFFF00);
				simulationGraphics.strokeLineShape(edge.line);
				await sleep(1000);
			}
		}
	}

	let curN;
	let preN;
	simulationGraphics.lineStyle(4, 0x00FF00);
	
	curN = preN = last_node;
	
	while(curN != start_node) {
		if(!curN) {
			alert("Unreachable destination!");
			return;
		}
		
		curN = previous[curN];
		
		simulationGraphics.strokeLineShape(graph.getVertex(curN).edges.find(element => element.edge == preN).line);
		await sleep(500);
		
		preN = curN;
	}
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
		for(let v = 0; v < graph.size; v += 1) {
			let node = graph.getVertex(v);
			costM[i][v] = costM[i - 1][v];
			
			for(let edge of node.edges) {
				if(costM[i][v] > costM[i - 1][edge.edge] + edge.weight) {
					costM[i][v] = costM[i - 1][edge.edge] + edge.weight;
					
					sucessorM[v] = edge.edge;
					
					simulationGraphics.lineStyle(4, 0xFF0000);
					simulationGraphics.strokeLineShape(edge.line);
					await sleep(1000);
				}
				
				else {
					simulationGraphics.lineStyle(4, 0xFFFF00);
					simulationGraphics.strokeLineShape(edge.line);
					await sleep(1000);
				}
			}
		}
	}
}

