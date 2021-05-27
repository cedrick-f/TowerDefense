/**
 * @typedef {object} EntityType
 * @property {number} life La vie de l'entité lorsqu'elle apparaît
 * @property {number} width La largeur de l'entité, entre 0 et 1 (0.25 signifie un quart de l'écran).
 * @property {number} height La hauteur de l'entité, entre 0 et 1
 * @property {string} [style] Le style de l'entité, pour {@link CanvasRenderingContext2D#fillStyle}
 * @property {number} [speed] La vitesse de l'entité
 */

/** @type {Object.<string, EntityType>} */
const entityTypes = {
	normal: {life: 100, width: 0.1, height: 0.1, style: 'red'}
}