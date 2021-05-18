class Controller {

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		this.canvas = document.createElement('canvas')
		container.appendChild(this.canvas)

		this.path = new Path(100, [new Point(0.1, 0.6), new Point(0.5, 0.3), new Point(0.9, 0.9)])
		this.pathRenderer = new PathRenderer(this.canvas)

		this.onResize = this.onResize.bind(this)
		window.addEventListener('resize', this.onResize)
		this.onResize()
	}

	onResize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.pathRenderer.render(this.path)
	}
}
