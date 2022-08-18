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
            run: 0,
        };
        this.#addListeners();
        // this.app.camera.follow(this.entity);
    }
    #addListeners() {
        // Move Player Down events
        this.app.controls.pushListener(this,'keydown', (event) => {
            switch (true) {
                case event.key === 'ArrowUp':
                    this.controls.forward = 1;
                    break;
                case event.key === 'ArrowDown':
                    this.controls.reverse = 1;
                    break;
                case event.key === 'ArrowRight':
                    this.controls.right = 1;
                    break;
                case event.key === 'ArrowLeft':
                    this.controls.left = 1;
                    break;
                case event.key === 'Shift':
                    this.controls.run = 1;
                    break;
            }
        });
        // Move Player Up Events
        this.app.controls.pushListener(this,'keyup', (event) => {
            switch (true) {
                case event.key === 'ArrowUp':
                    this.controls.forward = 0;
                    break;
                case event.key === 'ArrowDown':
                    this.controls.reverse = 0;
                    break;
                case event.key === 'ArrowRight':
                    this.controls.right = 0;
                    break;
                case event.key === 'ArrowLeft':
                    this.controls.left = 0;
                    break;
                case event.key === 'Shift':
                    this.controls.run = 0;
            }
        });
    }
}