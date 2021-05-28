/**
 * @param {RequestInfo} input
 * @return {Promise<LevelData>}
 */
async function fetchJson(input) {
    return await (await fetch(input)).json()
}

fetchJson('levels/level1.json')
    .then(levelData => new Controller(document.body, levelData))

