let INF = 9999999999;
var resultBellman;
var resultDijkstra;
class WeightedGraph {
	constructor() {
		this.adjList = new Map();
		this.edgeList = [];
		this.size = 0;
		this.edges = 0;
		this.hasCycle = false;
		this.lowestWeight = 0;
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
	addEdge(v1, v2, weight) {
		this.adjList.get(v1).edges.push({edge: v2, weight: weight});
		this.edgeList.push({src: v1, dest: v2, weight: weight});
		this.edges++;
		
		if(weight < this.lowestWeight)
			this.lowestWeight = weight;
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

function dijkstra(graph, start_node, last_node) {
	let priority_queue = new TinyQueue([], function (a, b) {
		return a.priority - b.priority;
	});
	let distance = {};
	let previous = {};
	let nodeFound = false;

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

				if(edge.edge == last_node){
					nodeFound = true;
					dijkstraCost = cost;
				}
					
				
				priority_queue.push({index: edge.edge, node: graph.getVertex(edge.edge), priority: cost});
			}
		}
		
		if(nodeFound)
			break;
	}

	let best_path = [last_node];

	while(best_path[0] != start_node) {
		if(previous[best_path[0]] == null)
			return [];
		
		best_path.unshift(previous[best_path[0]]);
	}

	return best_path;
}

function bellmanFord(graph, start_node, last_node){
	let distance = {};
	let predecessor = {};
	let path = [];
	let target = last_node;

	for(let i = 0; i < graph.size; i++){
		distance[i] = INF;
	}
	distance[start_node] = 0;

	for(let i = 1; i < graph.size; i++){
		for(let j = 0; j < graph.edges; j++){
			let edge = graph.edgeList[j]
			let u = edge.src;
			let v = edge.dest;
			let w = edge.weight;

			if(distance[u] != INF && distance[u] + w < distance[v]){
				distance[v] = distance[u] + w;
				predecessor[v] = u;
			}
		}
	}

	for(let i = 0; i < graph.edges; i ++){
		let edge = graph.edgeList[i]
		let u = edge.src;
		let v = edge.dest;
		let w = edge.weight;
		
		if(distance[u] != INF && distance[u] + w < distance[v]){
			
			graph.hasCycle = true;
		}
				
	}

	if(graph.hasCycle){
		console.log("Ciclo negativo");
	}
		
	else{
		bellmanCost = distance[last_node];
		while(target != null){
			path.unshift(target);
			target = predecessor[target]
		}
	}
	return path;
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
		let bellmanFordPath = bellmanFord(graph, start_node.id, last_node.id);
		let dijkstraPath = dijkstra(graph, start_node.id, last_node.id)

		let bellmanNode = graph.getVertex(bellmanFordPath.shift());
		let dijkstraNode = graph.getVertex(dijkstraPath.shift());
		
		let bellmanNextNode;
		let dijkstraNextNode;
		
		let bellmanTweens = scene.tweens.createTimeline();
		let dijkstraTweens = scene.tweens.createTimeline();
		
		if(dijkstraPath.length) {
			if(bellmanFordPath.length) {
				if(setPlayButton.carOne) {
					setPlayButton.carOne.destroy();
					setPlayButton.carTwo.destroy();
				}
				
				setPlayButton.bellmanCar = scene.add.image(start_node.x, start_node.y, 'bball');
				setPlayButton.dijkstraCar = scene.add.image(start_node.x, start_node.y, 'dball');
				
				
				while(bellmanFordPath.length) {
					bellmanNextNode = graph.getVertex(bellmanFordPath.shift());
					
					bellmanTweens.add({
						targets: setPlayButton.bellmanCar,
						duration: getDistance({x: bellmanNode.x, y: bellmanNode.y}, {x: bellmanNextNode.x, y: bellmanNextNode.y})/0.1,
						x: bellmanNextNode.x,
						y: bellmanNextNode.y,
						paused: true
					});
					
					bellmanNode = bellmanNextNode;
				}
				
				while(dijkstraPath.length) {
					dijkstraNextNode = graph.getVertex(dijkstraPath.shift());
					
					dijkstraTweens.add({
						targets: setPlayButton.dijkstraCar,
						duration: getDistance({x: dijkstraNode.x, y: dijkstraNode.y}, {x: dijkstraNextNode.x, y: dijkstraNextNode.y})/0.1,
						x: dijkstraNextNode.x,
						y: dijkstraNextNode.y,
						paused: true
					});
					
					dijkstraNode = dijkstraNextNode;
				}
				
				bellmanTweens.play();
				dijkstraTweens.play();
				if(resultBellman || resultDijkstra){
					resultBellman.destroy();
					resultDijkstra.destroy();
				}
					
				resultBellman = scene.add.text(0, 680, "Bellman-Ford total weight: "+ bellmanCost.toFixed(3), { font: "20px Arial", fill: "#ffffff", align: "center" });
				resultDijkstra = resultBellman = scene.add.text(0, 700, "Dijkstra total weight: "+ dijkstraCost.toFixed(3), { font: "20px Arial", fill: "#ffffff", align: "center" });
				
			}
			
			else
				alert('Negative cycle found!');
		}
		
		else
			alert('Unreachable last node or start node and last node are the same!');
	});
}