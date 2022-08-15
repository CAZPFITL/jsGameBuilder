export default class Physics {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.stopRange = 0.05 * this.app.gameSpeed;
        callback(()=> {
            this.app.log.registerEvent(
                `New Physics Created`,
                `\x1b[32;1m| \x1b[0mNew \x1b[32;1mPhysics\x1b[0m Created`
            );
        });
    }
    /**
     * Class methods
     */
    // calculate acceleration with physics and not from the ant
    speedup(entity) {
        entity.speed += entity.acceleration;
    }

    slowdown(entity) {
        entity.speed -= entity.acceleration;
    }

    turnLeft(entity) {
        entity.angle += entity.turnSpeed;
    }

    turnRight(entity) {
        entity.angle -= entity.turnSpeed;
    }

    // TODO remove entity and create methods for calculations
    move(entity) {
        // limit the speed to maxSpeed
        (entity.speed > entity.maxSpeed) && (entity.speed = entity.maxSpeed);
        (entity.speed < -entity.maxSpeed) && (entity.speed = -entity.maxSpeed);

        // add friction and absolute repose in lower ranges
        (entity.speed > 0) && (entity.speed -= entity.friction);
        (entity.speed < 0) && (entity.speed += entity.friction);

        // absolute stop the entity
        if ((entity.speed > -this.stopRange) && (entity.speed < this.stopRange)) {
            entity.speed = 0;
        }

        // this works under the unit circle logic using sin or cos multiplied by speed to get the translation
        this.worldLimits({
            x: Math.sin(entity.angle) * entity.speed,
            y: Math.cos(entity.angle) * entity.speed
        }, entity);
    }

    worldLimits({x, y}, entity) {
        const coords = entity.coords;
        // Limit Movement
        (
            !this.app.gui.get.polysIntersect(entity.polygons, this.app.game.level.boundTargets.polygons.slice(0, 4)) &&
            !this.app.gui.get.polysIntersect(entity.polygons, this.app.game.level.boundTargets.polygons.slice(5, 8))
        ) ? (coords.x -= x) : (coords.x -= coords.x > 0 ? 0.1 : -0.1);
        (
            !this.app.gui.get.polysIntersect(entity.polygons, this.app.game.level.boundTargets.polygons.slice(8, 11)) &&
            !this.app.gui.get.polysIntersect(entity.polygons, this.app.game.level.boundTargets.polygons.slice(12, 15))
        ) ? (coords.y -= y) : (coords.y -= coords.y > 0 ? 0.1 : -0.1);
    }

    isInBound(entity) {
        const limits = this.app.game.level.size;
        return !(entity.x > -limits.width / 2 && entity.x < limits.width / 2) ||
            !(entity.y > -limits.height / 2 && entity.y < limits.height / 2);
    }
}