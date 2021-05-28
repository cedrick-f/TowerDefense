/**
 * @typedef {object} EntityType
 * @property {number} life La vie de l'entité lorsqu'elle apparaît
 * @property {number} width La largeur de l'entité, entre 0 et 1 (0.25 signifie un quart de l'écran)
 * @property {number} height La hauteur de l'entité, entre 0 et 1
 * @property {string} [style] Le style de l'entité, pour {@link CanvasRenderingContext2D#fillStyle}
 * @property {number} [speed] La vitesse de l'entité
 */

/**
 * @typedef {object} TowerType
 * @property {number} width La largeur de la tour, entre 0 et 1
 * @property {number} height La hauteur de la tour, entre 0 et 1
 * @property {number} attack_delay Le délai entre chaque attaque, en millisecondes
 * @property {string} [style] Le style de la tour, pour {@link CanvasRenderingContext2D#fillStyle}
 */

/**
 * @typedef {object} Wave
 * @property {number} time Le moment d'apparition, en millisecondes, depuis le début du niveau
 * @property {string} entity L'entité à faire apparaître
 * @property {number} [count] Le nombre d'entités, par défaut 1
 * @property {number} [path] L'index du chemin sur lequel commencer
 */

/**
 * @typedef {object} LevelData
 * @property {Point[][]} paths
 * @property {Wave[]} waves
 */

/** @type {Object.<string, EntityType>} */
const entityTypes = {
	normal: {life: 100, width: 0.1, height: 0.1, style: 'red'}
}

/** @type {Object.<string, TowerType>} */
const towerTypes = {
	normal: {width: 0.1, height: 0.1, attack_delay: 1000, style: 'rgb(255, 240, 0)'}
}

/** @type {Wave[]} */
const level = [
	{ time: 10, entity: entityTypes.normal },
	{ time: 4000, entity: entityTypes.normal },
	{ time: 10000, entity: entityTypes.normal, count: 2 },
]
