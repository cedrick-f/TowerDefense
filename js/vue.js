class PathRenderer {
	
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
	}
	
	/**
	 * @param {Path} path
	 */
	render(path) {
		const width = this.canvas.width
		const height = this.canvas.height

		const keyPoints = path.keyPoints
		this.ctx.beginPath()
		this.ctx.moveTo(keyPoints[0].x * width, keyPoints[0].y * height)
		for (let i = 1; i < keyPoints.length; i++) {
			this.ctx.lineTo(keyPoints[i].x * width, keyPoints[i].y * height)
		}
		this.ctx.stroke()
	}
}
