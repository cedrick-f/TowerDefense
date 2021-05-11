class PathRenderer {
	
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
	}
	
	/**
	 * @param {Path} path
	 */
	render(path) {
		for (const point of path.keyPoints) {
			this.ctx.beginPath();
			this.ctx.moveTo(point.x, point.y);
			this.ctx.lineTo(point.x, point.y + 1);
			this.ctx.stroke();
		}
	}
}
