class Controller {

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		this.canvas = document.createElement('canvas')
		container.appendChild(this.canvas)

		const renderer = new PathRenderer(this.canvas)
		renderer.render(new Path(100, [new Point(5, 0), new Point(5, 100)]))
	}
}
