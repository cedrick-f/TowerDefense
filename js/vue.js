class PathRenderer {
	
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
	}
	
	/**
	 * @param {Path} path
	 */
	render(path) {
		const keyPoints = path.keyPoints
		this.ctx.beginPath()
		this.ctx.moveTo(keyPoints[0].x, keyPoints[0].y)
		for (let i = 1; i < keyPoints.length; i++) {
			this.ctx.lineTo(keyPoints[i].x, keyPoints[i].y)
		}
		this.ctx.stroke()
	}
}
