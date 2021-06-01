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
		this.ctx.fillRect((pos.x-entity.width/2) * width, (pos.y-entity.height/2) * height, entity.width * width, entity.height * height)
	}
}

class TowerRenderer {
	
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx
	}

	/**
	 * @param {Tower} tower
	 * @param {number} width
	 * @param {number} height
	 */
	render(tower, width, height) {
		this.ctx.fillStyle = tower.style
		this.ctx.fillRect((tower.x-tower.width/2) * width, (tower.y-tower.height/2) * height, tower.width * width, tower.height * height)
	}
}

class RayRenderer {

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
	this.ctx = ctx
	}

	render(tower, entity, width, height){
		this.ctx.beginPath()
		this.ctx.strokeStyle = "blue"
		this.ctx.moveTo(tower.x * width,tower.y * height)
		let pos = entity.getAbsolutePosition()
		this.ctx.lineTo(pos.x * width, pos.y * height)
		this.ctx.stroke()
	}
	
}

class MessageView {

	/**
	 * @param {HTMLElement} hud
	 * @param {HTMLElement} messagesList
	 */
	constructor(hud, messagesList) {
		this.hud = hud
		this.messagesList = messagesList
		/** @type {string|null} */
		this.prevHudText = null
		/** @type {Map<LoggedMessage, HTMLElement>} */
		this.messages = new Map()
	}

	/**
	 * @param {string} hudText Texte à afficher au joueur sur les points de vie et d'ennemis...
	 * @param {MessageLogger} logger Enregistreur de messages
	 * @param {number} timestamp Le temps écoulé depuis le début du jeu, en millisecondes
	 */
	write(hudText, logger, timestamp) {
		// Pour chaque message...
		for (let i = logger.queue.length-1; i >= 0; i--) {
			const message = logger.queue[i]
			let div = this.messages.get(message) // On récupère l'élément HTML associé

			if (timestamp > message.end_at) {
				// Le message a suffisamment été affiché
				if (div) {
					div.remove()
					this.messages.delete(message)
				}
				logger.queue.splice(i, 1)
			} else if (!div) {
				// Le message devrait être affiché et ne l'est pas
				div = document.createElement('div')
				div.classList.add('message', `is-${message.level}`)
				div.append(message.content)
				this.messagesList.appendChild(div)
				this.messages.set(message, div)
			}
		}

		// Mise à jour du texte HUD
		if (hudText !== this.prevHudText) {
			this.hud.textContent = hudText
			this.prevHudText = hudText
		}
	}
}
