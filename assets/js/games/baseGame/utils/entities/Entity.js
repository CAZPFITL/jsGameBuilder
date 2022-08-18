import {GAME_OVER, PLAY} from "../../env.js";

export default class Entity {
    constructor({app, game, x = 0, y = 0, color = '#000', angle = 0}) {
        this.app = app;
        this.game = game;
        // Booleans
        this.no_update = false;
        this.no_draw = false;
        // Measurements
        this.color = color;
        this.coords = {x, y};
        this.size = {
            height: app.tools.random(8, 8),
            width: app.tools.random(8, 8)
        }
        // State and capabilities
        this.player = Boolean(this.app.player?.controls);
        // physics
        this.speed = 0;
        this.angle = angle;
        // referencable objects
        this.acceleration = 0.3;
        this.friction = 0.040;
        this.maxSpeed = 0.6;
        this.turnSpeed = 0.05;
        this._acceleration = this.acceleration;
        this._friction = this.friction;
        this._maxSpeed = this.maxSpeed;
        this._turnSpeed = this.turnSpeed;

        // Shape
        this.polygons = [];
        // Control
        this.controls = {
            forward: 0,
            reverse: 0,
            right: 0,
            left: 0,
            run: 0
        }
        this.app.player.entity = this;
    }

    #move() {
        const controls = this.player ? this.app.controls.getControls(this) : this.controls;
        // update referencable data
        this.acceleration = this._acceleration * this.app.gameSpeed;
        this.turnSpeed = this._turnSpeed * this.app.gameSpeed
        this.maxSpeed = this._maxSpeed * this.app.gameSpeed;
        this.friction = this._friction / this.app.gameSpeed;

        // Trigger Movement
        if (controls.reverse) this.app.physics.slowdown(this);
        if (controls.left) this.app.physics.turnLeft(this);
        if (controls.right) this.app.physics.turnRight(this);
        if (controls.forward) this.app.physics.speedup(this);
        if (controls.run) (this.maxSpeed = this.maxSpeed * 2);
        if (!controls.run) (this.maxSpeed = this.maxSpeed);

        // Make Move
        this.app.physics.move(this)
    }

    #highlight() {
        this.color = (this.app.player.entity === this) ? 'rgb(25,203,159)' : 'rgba(0,0,0,0.35)';
    }

    shape() {
        const rad = Math.hypot(this.size.width, this.size.height) / 2;
        const alpha = Math.atan2(this.size.width, this.size.height);
        return [
            {
                x: this.coords.x - Math.sin(this.angle - alpha) * rad,
                y: this.coords.y - Math.cos(this.angle - alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(this.angle) * rad * 0.8,
                y: this.coords.y - Math.cos(this.angle) * rad * 0.8
            },
            {
                x: this.coords.x - Math.sin(this.angle + alpha) * rad,
                y: this.coords.y - Math.cos(this.angle + alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(Math.PI + this.angle - alpha) * rad,
                y: this.coords.y - Math.cos(Math.PI + this.angle - alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(Math.PI + this.angle + alpha) * rad,
                y: this.coords.y - Math.cos(Math.PI + this.angle + alpha) * rad
            }
        ]
    }

    update() {
        if (!this.no_update && this.app.game.state.state === PLAY || this.app.game.state.state === GAME_OVER) {
            // Draw me
            this.app.gui.get.createPolygon(this);
            // Let's think
            this.#move();
            // Let's highlight
            this.#highlight();
        }
    }

    draw(ctx) {
        if (!this.no_draw && this.app.game.state.state === PLAY) {
            this.app.gui.get.drawPolygon(ctx, this);
        }
    }
}