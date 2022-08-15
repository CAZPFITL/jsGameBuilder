import {GAME_OVER, PLAY} from "../../env.js";

export default class GameLevel {
    constructor({app, game, id = 0, width, height, addedRules }) {
        this.app = app;
        this.game = game;
        this.name = 'GameLevel #' + id;
        this.coords = { x: -width / 2, y: -height / 2 };
        this.size = { width, height }
        this.color = '#595959';
        this.boundTargets = {};
        this.addedRules = addedRules;
        this.loadEntitiesList = [];
        this.loadEntities();
    }

    /**
     * Private Methods
     */
    #getBordersEdges() {
        const [ topLeft, bottomLeft, topRight, bottomRight ] = [
            { x: (-this.size.width) / 2, y: (-this.size.height) / 2 },
            { x: (-this.size.width) / 2, y: (this.size.height) / 2 },
            { x: (this.size.width) / 2, y: (- this.size.height) / 2 },
            { x: (this.size.width) / 2, y: (this.size.height) / 2 }
        ];
        this.boundTargets = {
            // These are the bounds for the ants sensors
            polygons: [
                // Left
                { x: topLeft.x, y: topLeft.y },
                { x: bottomLeft.x, y: topLeft.y },
                { x: bottomLeft.x - 1, y: bottomLeft.y },
                { x: topLeft.x - 1, y: topLeft.y },
                // Right
                { x: topRight.x, y: bottomRight.y },
                { x: bottomRight.x, y: bottomRight.y },
                { x: bottomRight.x + 1, y: bottomRight.y },
                { x: topRight.x + 1, y: topRight.y },
                // Top
                { x: topLeft.x, y: topLeft.y },
                { x: topRight.x, y: topRight.y },
                { x: topRight.x, y: topRight.y - 1 },
                { x: topLeft.x, y: topLeft.y - 1 },
                // Bottom
                { x: bottomLeft.x, y: bottomLeft.y },
                { x: bottomRight.x, y: bottomRight.y },
                { x: bottomRight.x, y: bottomRight.y + 1 },
                { x: bottomLeft.x, y: bottomLeft.y + 1 }
            ]
        }
    }

    /**
     * Load methods
     */
    loadEntities() {
        for (let entity of this.loadEntitiesList) {
            entity?.name && this[entity.name](entity?.props);
        }
    }

    #loadOutsideRules() {
        for (let rule of this.addedRules) {
            if (this.app.factory.binnacle[rule.name]) {
                this.app.factory.binnacle[rule.name].forEach(entity => {
                    if (entity instanceof Array) return;
                    rule.rule(entity);
                })
            }
        }
    }

    update() {
        this.#getBordersEdges();
        if (this.game.constructor.name === 'Ants2Trainer') {
            this.#loadOutsideRules();
        }

    }
    /**
     * Draw and Update methods
     */
    draw() {
        if (this.app.game.state.state === PLAY ||
            this.app.game.state.state === GAME_OVER) {
            // TODO change this to get the level
            this.app.gui.ctx.fillStyle = this.color;
            this.app.gui.ctx.fillRect(this.coords.x, this.coords.y, this.size.width, this.size.height);
        }
    }
}