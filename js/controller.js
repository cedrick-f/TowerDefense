class Controller {

	/**
	 * @param {HTMLElement} container
	 * @param {LevelData} levelData
	 */
	constructor(container, levelData) {
		// Initialisation du DOM
		this.canvas = document.createElement('canvas')
		container.appendChild(this.canvas)
		this.ctx = this.canvas.getContext('2d')

		// Création des chemins d'après les données du niveau, listés dans un tableau
		/** @var {Path[]} */
		this.paths = []
		this.pathRenderer = new PathRenderer(this.ctx)
		for (const path of levelData.paths) {
			const keyPoints = []
			for (const point of path) {
				keyPoints.push(new Point(point.x, point.y))
			}
			this.paths.push(new Path(100, keyPoints))
		}

		// Liste des entités encore en vie
		/** @var {Entity[]} */
		this.entities = []
		this.entityRenderer = new EntityRenderer(this.ctx)

		// Liste des tours placées par le joueur
		/** @var {Tower[]} */
		this.towers = []
		this.towerRenderer = new TowerRenderer(this.ctx)

		// Liste des vagues d'ennemis
		/** @var {Wave[]} */
		this.waves = levelData.waves

		// Validation des types d'ennemis
		for (const wave of levelData.waves) {
			if (!(wave.entity in entityTypes)) {
				throw new Error('Invalid entity type (' + wave.entity + ')');
			}
		}

		this.life = 100
		this.money = 100
		this.logger = new MessageLogger()
		this.messageView = new MessageView(container.querySelector('#hud'), container.querySelector('#messages'))

		// Re-contextualisation du this
		this.tick = this.tick.bind(this)
		this.onResize = this.onResize.bind(this)

		// Réadapte la taille du canevas lors du redimensionnement
		window.addEventListener('resize', this.onResize)
		this.onResize()

		this.canvas.addEventListener('click', this.onClick.bind(this))

		this.lastTick = 0
		this.startTick = performance.now()
		requestAnimationFrame(this.tick)
	}

	/**
	 * @param {number} timestamp
	 */
	tick(timestamp) {
		// Différence de temps en millisecondes depuis le dernier tick
		const diff = timestamp - this.lastTick

		// Pour chaque vague, si une vient d'être dépassée, faire apparaître les entités
		for (const wave of this.waves) {
			if ((this.lastTick - this.startTick) >= wave.time || (timestamp - this.startTick) < wave.time) {
				continue
			}
			if (wave.count) {
				for (let i = 0; i < wave.count; i++) {
					this.entities.push(Entity.fromWave(wave, this.paths))
				}
			} else {
				this.entities.push(Entity.fromWave(wave, this.paths))
			}
		}

		// Met à jour les attributs des entités comme leur position
		for (let i = this.entities.length-1; i >= 0; i--) {
			const entity = this.entities[i]
			entity.tick(diff)
			if (entity.abscissa >= 1) {
				// L'entité a fini le parcours, le joueur perd des points
				this.life -= 10
				this.entities.splice(i, 1)
			} else if (entity.life <= 0) {
				if (entity.abscissa < 1) {
					this.money += 10;
				}
				// Les retirer de la liste comme elle n'existe plus
				this.entities.splice(i, 1)
			}
		}

		// Met à jour les tirs des tours
		for (const tower of this.towers) {
			tower.checkRange(this.entities, timestamp)
		}

		// Rendre le jeu visuellement
		this.render(timestamp)

		// Planification du tick suivant
		this.lastTick = timestamp
		requestAnimationFrame(this.tick)
	}

	onResize() {
		// Dimensions de base du canevas, qui seront modifiées en respectant le ratio existant
		const baseWidth = 400
		const baseHeight = 175

		// On prend le minimum entre ce que l'on peut étendre en largeur et en hauteur
		const factor = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight)

		// On affecte les nouvelles dimensions calculées d'après les dimensions de la fenêtre
		this.canvas.width = baseWidth * factor
		this.canvas.height = baseHeight * factor
	}

	/**
	 * @param {number} timestamp
	 */
	render(timestamp) {
		const width = this.canvas.width
		const height = this.canvas.height
		this.ctx.clearRect(0, 0, width, height)
		for (const path of this.paths) {
			this.pathRenderer.render(path, width, height)
		}
		for (const entity of this.entities) {
			this.entityRenderer.render(entity, width, height)
		}
		for (const tower of this.towers) {
			this.towerRenderer.render(tower, width, height)
		}
		this.messageView.write(`Score : ${this.life} - Argent : ${this.money}`, this.logger, timestamp)
	}

	/**
	 * @param {MouseEvent} event
	 */
	onClick(event) {
		if (this.money < 50) {
			this.logger.error('Monnaie insuffisante.')
			return
		}
		let x = event.offsetX / this.canvas.width
		let y = event.offsetY / this.canvas.height
		let tower = new Tower(x, y, towerTypes.normal)
		for (let existingTower of this.towers) {
			if (existingTower.hasCollisionWith(tower) || tower.hasCollisionWith(existingTower)) {
				return
			}
		}
		this.towers.push(tower)
		this.money -= 50
	}
}
