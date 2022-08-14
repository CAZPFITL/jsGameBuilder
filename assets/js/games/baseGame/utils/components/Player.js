export default class Player {
    constructor(app, game) {
        this.app = app;
        this.game = game;
        this.entity = null;
        this.controls = {
            forward: 0,
            reverse: 0,
            right: 0,
            left: 0,
            pick: 0,
            drop: 0,
            eat: 0,
            run: 0,
        };
        // this.app.camera.follow(this.entity);
    }

}