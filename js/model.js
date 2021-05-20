class Entity {

	/**
	 * @param {Path} path Chemin où est l'entité
	 * @param {number} abscissa Abscisse curviligne entre 0 et 1 sur le chemin
	 * @param {number} width Largeur
	 * @param {number} height Hauteur
	 * @param {string} [style]
	 */
	constructor(path, abscissa, width, height, style = 'red') {
		if (abscissa < 0 || abscissa > 1) {
			throw new RangeError('The abscissa must be between 0 and 1.')
		}
		this.path = path
		this.abscissa = abscissa
		this.width = width
		this.height = height
		this.style = style
	}

	goAhead() {
		this.abscissa = Math.min(this.abscissa + 0.002, 1)
	}

	/**
	 * @return {Point}
	 */
	getAbsolutePosition() {
		return this.path.computeCoordinates(this.abscissa)
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

		this.distanceKeyPoints = []
		let prev = keyPoints[0]
		for (let i = 1; i < keyPoints.length; i++) {
			this.distanceKeyPoints.push((prev.x-keyPoints[i].x)**2 + (prev.y-keyPoints[i].y)**2)
			prev = keyPoints[i]
		}
		this.distance = this.distanceKeyPoints.reduce((acc, distance) => acc + distance, 0)
	}

	/**
	 * @param {number} abscissa
	 * @return {Point}
	 */
	computeCoordinates(abscissa) {
		let pos = 0
		let ratio = 0;
		const keyPointIndex = this.distanceKeyPoints.findIndex(localDistance => {
			ratio = localDistance / this.distance
			pos += ratio
			return pos >= abscissa
		})
		const prevKeyPoint = this.keyPoints[keyPointIndex]
		const nextKeyPoint = this.keyPoints[keyPointIndex + 1]
		const pFactor = (abscissa - pos + ratio) / ratio
		const dx = nextKeyPoint.x - prevKeyPoint.x
		const dy = nextKeyPoint.y - prevKeyPoint.y
		return new Point(prevKeyPoint.x + dx * pFactor, prevKeyPoint.y + dy * pFactor)
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

class Tower {
	
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width Largeur
	 * @param {number} height Hauteur
	 * @param {0|1|2|3} type
	 * @param {1|2|3|4} level
	 */
	constructor(x, y, width, height, type = 0, level = 1) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.type = type
		this.level = level
	}
}
