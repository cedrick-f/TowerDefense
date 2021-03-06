class Positionnable {
	constructor(width, height) {
	this.width = width
	this.height = height
	this.halfWidth = width/2
	this.halfHeight = height/2
	}
}

class Entity extends Positionnable{

	/**
	 * @param {Path} path Chemin où est l'entité
	 * @param {number} abscissa Abscisse curviligne entre 0 et 1 sur le chemin
	 * @param {EntityType} type Type de l'entité
	 */
	constructor(path, abscissa, type = entityTypes.normal) {
		super(type.width, type.height)
		if (abscissa < 0 || abscissa > 1) {
			throw new RangeError('The abscissa must be between 0 and 1.')
		}
		this.path = path
		this.abscissa = abscissa
		this.style = type.style
		this.life = type.life
		this.speed = type.speed || 0.002
	}

	/**
	 * @param {number} delay
	 */
	tick(delay) {
		this.abscissa = Math.min(this.abscissa + this.speed * (delay >> 4), 1)
	}

	/**
	 * @return {Point}
	 */
	getAbsolutePosition() {
		return this.path.computeCoordinates(this.abscissa)
	}

	/**
	 * @param {Wave} wave
	 * @param {Path[]} paths
	 */
	static fromWave(wave, paths) {
		return new Entity(paths[wave.path || 0], typeof wave.count === 'number' ? Math.random() / 10 : 0, entityTypes[wave.entity])
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

class Tower extends Positionnable{
	
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {TowerType} type Type de la tour
	 */
	constructor(x, y, type) {
		super(type.width, type.height)
		this.x = x
		this.y = y
		this.level = 0

		/** @var {Entity|null} */
		this.locked = null
		this.attackDelay = type.attack_delay
		this.range = 0.2
		this.lastShot = 0
		this.style = type.style
	}
	
	/**
	 * @param {Entity[]} entities
	 * @param {number} timestamp
	 */
	checkRange(entities, timestamp) {
		if (this.locked === null || this.locked.life < 1) {
			this.locked = null
			for (const e of entities) {
				let pos = e.getAbsolutePosition()
				if ((pos.x-this.x)**2 + (pos.y-this.y)**2 <= this.range**2) {
					this.locked = e
				}
			}
		} else {
			if (timestamp - this.lastShot >= this.attackDelay) {
				this.locked.life -= 40
				this.lastShot = timestamp
			}
			let pos = this.locked.getAbsolutePosition()
			if ((pos.x-this.x)**2 + (pos.y-this.y)**2 > this.range**2) {
				this.locked = null
			}
		}
	}
	
	/** 
	 * @param {Tower} tower
	 * @return {boolean}
	 */
	hasCollisionWith(tower) {
		if (tower.x <= this.x + this.width && tower.x + tower.width >= this.x) {
			if (tower.y <= this.y + this.height && tower.y >= this.y) {
				return true
			}
		}
		return false
	}
}

class MessageLogger {

	constructor() {
		/** @type {LoggedMessage[]} */
		this.queue = []
	}

	/**
	 * @param {'info'|'warn'|'error'} level
	 * @param {string} content
	 * @param {number} [duration]
	 */
	pushMessage(level, content, duration = 5000) {
		this.queue.push({ level, content, end_at: performance.now() + duration })
	}

	/**
	 * @param {string} message
	 * @param {number} [duration]
	 */
	error(message, duration) {
		this.pushMessage('error', message, duration)
	}
}
