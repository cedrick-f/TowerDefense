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
