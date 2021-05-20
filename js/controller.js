class Controller {

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		this.canvas = document.createElement('canvas')
		container.appendChild(this.canvas)
		this.ctx = this.canvas.getContext('2d')

		/** @var {Path[]} */
		this.paths = [new Path(100, [new Point(0.1, 0.6), new Point(0.5, 0.3), new Point(0.9, 0.9)])]
		this.pathRenderer = new PathRenderer(this.ctx)

		/** @var {Entity[]} */
		this.entities = [new Entity(this.paths[0], 0, 0.05, 0.2)]
		this.entityRenderer = new EntityRenderer(this.ctx)
		
		/** @var {Tower[]} */
		this.towers = []
		this.towerRenderer = new TowerRenderer(this.ctx)

		this.tick = this.tick.bind(this)
		this.onResize = this.onResize.bind(this)
		window.addEventListener('resize', this.onResize)
		this.onResize()

		this.tick()
		
		this.canvas.addEventListener('click', this.onClick.bind(this))
		
		
	}

	tick() {
		for (const entity of this.entities) {
			entity.goAhead()
		}
		this.render()
		requestAnimationFrame(this.tick)
	}

	onResize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	render() {
		const width = this.canvas.width
		const height = this.canvas.height
		this.ctx.clearRect(0, 0, width, height)
		for (const path of this.paths) {
			this.pathRenderer.render(path, width, height)
		}
		for (const entity of this.entities) {
			this.entityRenderer.render(entity, width, height)
		}
		for (const tower of this.towers) {
			this.towerRenderer.render(tower, width, height)
		}
	}
	
	onClick(event) {
		let x = event.x / this.canvas.width
		let y = event.y / this.canvas.height
		let tower = new Tower(x, y, 0.1, 0.1)
		for (let existingTower of this.towers) {
			if (existingTower.hasCollisionWith(tower) || tower.hasCollisionWith(existingTower)) {
				return
			}
		}
		this.towers.push(tower)
	}
}
