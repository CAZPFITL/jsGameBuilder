export default class Camera {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.fieldOfView = Math.PI / 4.0;
        this.lookAt = [0, 0];
        this.rate = 120;
        this.viewport = {
            bounds: [-2000, -2000, 2000, 2000], // [left, top, right, bottom]
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0]
        };
        this.maxZoom = 2500;
        this.minZoom = 200;
        this.zoom = this.maxZoom / 2;
        this.#addListeners();
        callback(()=> {
            this.app.log.registerEvent(
                'New Camera Created',
                '\x1b[32;1m| \x1b[0mNew \x1b[32;1mCamera\x1b[0m Created'
            );
        });
    }

    /**
     * Private
     */
    #scaleAndTranslate() {
        this.app.gui.ctx.scale(this.viewport.scale[0], this.viewport.scale[1]);
        this.app.gui.ctx.translate(-this.viewport.left, -this.viewport.top);
    }

    #zoomTo(z) {
        this.zoom = z;
        this.#updateViewportData();
    }

    #moveTo([x, y]) {
        this.lookAt = [x, y];
        this.#updateViewportData();
    }

    #updateViewportData() {
        this.aspectRatio = this.app.gui.ctx.canvas.width / this.app.gui.ctx.canvas.height;
        this.viewport.width = this.zoom * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookAt[0] - (this.viewport.width / 2.0);
        this.viewport.top = this.lookAt[1] - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale = [
            this.app.gui.ctx.canvas.width / this.viewport.width,
            this.app.gui.ctx.canvas.height / this.viewport.height
        ];
    }

    #addListeners() {
        this.app.controls.pushListener(this,'wheel', (event) => {
            const deltaY = Math.max(-this.rate, Math.min(this.rate, event.deltaY));
            const deltaX = Math.max(-this.rate, Math.min(this.rate, event.deltaX));

            if (event.ctrlKey) {
                let zoomLevel = this.zoom + Math.floor(deltaY);
                this.#zoomTo(
                    (zoomLevel <= this.minZoom) ?
                        this.minZoom :
                        (zoomLevel >= this.maxZoom) ?
                            this.maxZoom :
                            zoomLevel
                );
            } else {
                this.#moveTo([
                    this.lookAt[0] + Math.floor(deltaX),
                    this.lookAt[1] + Math.floor(deltaY)
                ]);
            }
        });
        this.app.controls.pushListener(this,'keydown', (event) => {
            if (event.key === 'r') {
                this.#zoomTo(this.maxZoom);
                this.#moveTo([0, 0]);
            }
        });
    }

    follow(entity) {
        this.#moveTo([entity.x, entity.y]);
    }
    /**
     * Draw and Update methods
     */
    begin() {
        this.#updateViewportData()
        this.app.gui.ctx.canvas.height = window.innerHeight;
        this.app.gui.ctx.canvas.width = window.innerWidth;
        this.app.gui.ctx.save();
        this.#scaleAndTranslate();
    }

    end() {
        this.app.gui.ctx.restore();
        this.app.request = requestAnimationFrame(this.loop);
    }

    loop = () => {
        this.begin();
        this.app.stats.begin();
        this.app.update();
        this.app.draw();
        this.app.stats.end();
        this.end();
    }
};
