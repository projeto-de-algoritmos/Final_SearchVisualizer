class Node extends Phaser.GameObjects.Image {
	constructor(scene, x, y, texture, id) {
		super(scene, x, y, texture);
		scene.children.add(this);
		this.color = 0xffffff;
		this.edge = [];
		this.id = id;
		
		this.setInteractive({cursor: 'pointer'});
		this.on('pointerover', () => {
			this.setTint('0xff0000');
			hoverOverNode = this;
		});
		
		this.on('pointerout', () => {
			this.setTint(this.color);
			hoverOverNode = null;
		});

		this.on('pointerdown', (e) => {
			if(activeTool == Tools.ADD_NODE) {
				scene.line = new Phaser.Geom.Line(e.position.x, e.position.y, e.position.x, e.position.y);
				scene.tempGraphics.strokeLineShape(scene.line);
				this.addEdge(scene.line);
				scene.isCreating = true;
				
				selectedNode = this.id;
			} else if(activeTool == Tools.SET_START){
				if(start_node){
					start_node.color = 0xffffff;
					start_node.clearTint();
				}
					
				start_node = this;
				this.color = 0xed8d8d;
				this.setTint(this.color);
				resetTools();
				
				if(last_node)
					setPlayButton(scene);
			} else if(activeTool == Tools.SET_END){
				if(last_node){
					last_node.color = 0xffffff;
					last_node.clearTint();
				}
					
				last_node = this;
				this.color = 0x8d6262;
				this.setTint(this.color);
				resetTools();
				
				if(start_node)
					setPlayButton(scene);
			}
		})
	}
	
	addEdge(line) {
		this.edge.push(line);
	}
}