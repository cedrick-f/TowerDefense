class Entity {

	/**
	 * @param {Point} pos
	 * @param {number} width
	 * @param {number} height
	 * @param {string} [style]
	 */
	constructor(pos, width, height, style = 'red') {
		this.pos = pos
		this.width = width
		this.height = height
		this.style = style;
	}
}

class Path {

	/**
	 * @param {number} width
	 * @param {Point[]} keyPoints
	 */
	constructor(width, keyPoints) {
		if (keyPoints.length < 2) {
			throw new Error("Not enough keypoints")
		}
		this.width = width
		this.branchs = []
		this.keyPoints = keyPoints
	}
}

class Point {

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}
