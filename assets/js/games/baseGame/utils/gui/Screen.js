import {PLAY, MAIN_MENU, GAME_OVER} from "../../env.js";

export default class Screen {
    constructor(app, gui) {
        this.app = app;
        this.gui = gui;
        this.hoverCollection = {};
        this.buttonsStates = {
            start: 'normal'
        }
        this.buttonsCollection = {
            'start': {}
        }
        this.#updateControlsData();
        this.#addListeners();
    }
    /**
     * Private methods
     */
    #addListeners() {
        // HOVER EVENT -----------------------------------
        this.app.controls.pushListener(this,'mousemove', (e) => {
            // TRANSLATE COORDS - general process
            const hoverTranslatedCoords = this.app.gui.get.viewportCoords(e, this.app.camera.viewport);
            // HOVER COLLECTION - general process
            this.app.gui.get.checkHoverCollection({
                collection: this.hoverCollection,
                event: e,
                viewport: this.app.camera.viewport,
                isHover: (key) => {
                    (this.buttonsStates[key] !== 'click') && (this.buttonsStates[key] = 'hover');
                    this.hoverCaller = key;
                    this.gui.hoverStateIn();
                },
                isOut: (key) => {
                    (this.buttonsStates[key] !== 'click') && (this.buttonsStates[key] = 'normal');
                    this.hoverCaller = null;
                    this.gui.hoverStateOut();
                },
                caller: this.hoverCaller
            });
        });
        // CLICK EVENT -----------------------------------
        this.app.controls.pushListener(this,'click', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
        });
        // MOUSE UP EVENT --------------------------------
        this.app.controls.pushListener(this,'mouseup', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
            // START GAME --------------------------------
            this.app.gui.get.isClicked(
                this.buttonsCollection.start,
                click,
                () => this.app.game.state.setState(PLAY)
            );
            // CLEAR CLICKS ------------------------------
            this.buttonsStates.start = 'normal'
        });
        // MOUSE DOWN EVENT ------------------------------
        this.app.controls.pushListener(this,'mousedown', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
            // SHOW FPS ----------------------------------
            (e.which === 2) && this.app.gui.get.isClicked(
                {
                    x: 0,
                    y: 0,
                    width: this.app.gui.ctx.canvas.width,
                    height: this.app.gui.ctx.canvas.height
                },
                {x: e.offsetX, y: e.offsetY},
                () => this.app.toggleStats()
            );
            // CLICK ON START ----------------------------
            this.app.gui.get.isClicked(
                this.buttonsCollection.start,
                click,
                () => this.buttonsStates.start = 'click'
            );
        });
    }

    #updateControlsData() {
        const font = "16px Mouse";
        this.buttonsCollection = {
            'start': {
                x: -200,
                y: -0,
                width: 400,
                height: 100,
                text: 'Start',
                font,
                bg: this.buttonsStates.start === 'hover' ? '#d2cf00'
                    : this.buttonsStates.start === 'click' ? '#456c00'
                        : '#90d901',
            }
        }
    }

    drawDecorations() {
        if (this.app.game.state.state === MAIN_MENU) {
            this.app.gui.get.square({
                ctx: this.app.gui.ctx,
                x: -300,
                y: -200,
                width: 600,
                height: 400,
                color: 'rgba(0,0,0,0.6)',
                stroke: '#90d901',
                widthStroke: 5
            });
            this.app.gui.get.text({
                ctx: this.app.gui.ctx,
                font: "72px Mouse",
                text: this.app.game.constructor.name,
                x: 0,
                y: -100,
                color: '#ffffff',
                width: this.app.gui.ctx.measureText(this.app.game.constructor.name).width,
                height: 30,
                center: true
            });
            this.app.gui.ctx.canvas.style.backgroundColor = 'rgb(74,0,159)';
        }
        if (this.app.game.state.state === PLAY) { }
    }

    /**
     * Draw Decoration / Controls
     */
    drawControls() {
        const ctx = this.app.gui.ctx;

        const menu = this.app.game.state.state === MAIN_MENU;

        const looper = (menu) ? {
            start: {ctx, ...this.buttonsCollection.start},
        } : {};

        this.hoverCollection = {};

        Object.keys(looper).forEach(key => {
            if (Object.keys(looper[key]).length > 0) {
                this.app.gui.get.button({...looper[key], stroke: '#000000', widthStroke: 8});
            }

            this.hoverCollection[key] = looper[key];
        });
    }

    /**
     * Draw and Update methods
     */
    update() {
        this.#updateControlsData();
    }

    draw() {
        // MAIN MENU SCREEN ELEMENTS
        this.drawDecorations();
        this.drawControls();
    }
}