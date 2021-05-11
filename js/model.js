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
