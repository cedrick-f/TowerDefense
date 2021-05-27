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
		this.entities = []
		this.entityRenderer = new EntityRenderer(this.ctx)
		
		/** @var {Tower[]} */
		this.towers = []
		this.towerRenderer = new TowerRenderer(this.ctx)

		this.tick = this.tick.bind(this)
		this.onResize = this.onResize.bind(this)
		window.addEventListener('resize', this.onResize)
		this.onResize()

		this.canvas.addEventListener('click', this.onClick.bind(this))

		this.lastTick = 0
		requestAnimationFrame(this.tick)
	}

	/**
	 * @param {number} timestamp
	 */
	tick(timestamp) {
		const diff = timestamp - this.lastTick

		for (const wave of level) {
			if (this.lastTick >= wave.time || timestamp < wave.time) {
				continue
			}
			if (wave.count) {
				for (let i = 0; i < wave.count; i++) {
					this.entities.push(Entity.fromWave(wave, this.paths))
				}
			} else {
				this.entities.push(Entity.fromWave(wave, this.paths))
			}
		}

		for (let i = this.entities.length-1; i >= 0; i--) {
			this.entities[i].tick(diff)
			if (this.entities[i].life <= 0) {
				this.entities.splice(i, 1)
			}
		}
		for (const tower of this.towers) {
			tower.checkRange(this.entities, timestamp)
		}
		this.render()
		this.lastTick = timestamp
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

	/**
	 * @param {MouseEvent} event
	 */
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
