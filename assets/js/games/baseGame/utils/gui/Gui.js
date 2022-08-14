import AppGui from '../../../../engine/utils/gui/Gui.js';
import Screen from './Screen.js';

/**
 * This is the controls canvas this won't move along with the viewport
 */
export default class Gui {
    constructor(app, game) {
        this.app = app
        this.no_update = false;
        this.no_draw = false;
        this.controlsCtx = AppGui.createCanvas('controlsCanvas');
        this.screens = {
            [game.name]: Screen
        }
        this.screen = new this.screens[game.name](this.app, this);
    }

    hoverStateIn() {
        if (this.controlsCtx.canvas.style.cursor !== 'pointer') {
            this.controlsCtx.canvas.style.cursor = 'pointer';
        }
    }

    hoverStateOut() {
        if (this.controlsCtx.canvas.style.cursor === 'pointer') {
            this.controlsCtx.canvas.style.cursor = 'default';
        }
    }

    update() {
        if (!this.no_update) {
            this.screen.update();
            this.controlsCtx.canvas.height = window.innerHeight;
            this.controlsCtx.canvas.width = window.innerWidth;
            this.controlsCtx.save();
        }
    }

    draw() {
        if (!this.no_draw) {
            this.screen.draw();
            this.controlsCtx.restore();
        }
    }
}