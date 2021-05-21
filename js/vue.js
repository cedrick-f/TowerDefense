class PathRenderer {

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx
	}
	
	/**
	 * @param {Path} path
	 * @param {number} width
	 * @param {number} height
	 */
	render(path, width, height) {
		const keyPoints = path.keyPoints
		this.ctx.strokeStyle = 'black'
		this.ctx.beginPath()
		this.ctx.moveTo(keyPoints[0].x * width, keyPoints[0].y * height)
		for (let i = 1; i < keyPoints.length; i++) {
			this.ctx.lineTo(keyPoints[i].x * width, keyPoints[i].y * height)
		}
		this.ctx.closePath()
		this.ctx.stroke()
	}
}

class EntityRenderer {

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx
	}

	/**
	 * @param {Entity} entity
	 * @param {number} width
	 * @param {number} height
	 */
	render(entity, width, height) {
		this.ctx.fillStyle = entity.style
		const pos = entity.getAbsolutePosition()
		this.ctx.fillRect(pos.x * width, pos.y * height, entity.width * width, entity.height * height)
	}
}

class TowerRenderer {
	
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx
	}
	
	/**
	 *
	 */
	render(tower, width, height) {
		this.ctx.fillStyle = ['rgb(255, 240, 0)', 'rgb(255, 220, 0)', 'rgb(255, 200, 0)', 'rgb(255, 180, 0)'][tower.type]
		this.ctx.fillRect((tower.x-tower.width/2) * width, (tower.y-tower.height/2) * height, tower.width * width, tower.height * height)
	}
}