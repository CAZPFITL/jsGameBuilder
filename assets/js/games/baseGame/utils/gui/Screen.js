import {PLAY, MAIN_MENU, GAME_OVER, COLORS} from "../../env.js";

export default class Screen {
    constructor(app, gui) {
        this.app = app;
        this.gui = gui;
        this.buttonsCollection = {}
        this.hoverCollection = {};
        this.decorations = {};
        this.buttonsStates = {
            'start': 'normal'
        }
        this.colors = {}
        this.#addListeners();
    }
    /**
     * Private methods
     */
    #addListeners() {
        this.app.controls.pushListener(this,'mousemove', (e) => {
            const hoverTranslatedCoords = this.app.gui.get.viewportCoords(e, this.app.camera.viewport);
            // HOVER COLLECTION
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
        this.app.controls.pushListener(this,'click', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
        });
        this.app.controls.pushListener(this,'mouseup', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
            // START GAME
            this.app.gui.get.isClicked(
                this.buttonsCollection.MAIN_MENU.start.props,
                click,
                () => this.app.game.state.setState(PLAY)
            );
            // CLEAR CLICKS
            this.buttonsStates.start = 'normal'
        });
        this.app.controls.pushListener(this,'mousedown', (e) => {
            const click = this.app.gui.get.clickCoords(e, this.app.camera.viewport);
            // SHOW FPS
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
            // CLICK ON START
            this.app.gui.get.isClicked(
                this.buttonsCollection.MAIN_MENU.start.props,
                click,
                () => this.buttonsStates.start = 'click'
            );
        });
    }

    update() {
        this.colors = {
            MAIN_MENU: {
                background: COLORS.PURPLE[0],
                buttons: {
                    variation1: {
                        hover: COLORS.YELLOW[0],
                        click: COLORS.GREEN[0],
                        normal: COLORS.GREEN[1],
                        stroke: COLORS.BLACK[0],
                    },
                },
                mainCard: {
                    text: COLORS.WHITE[0],
                    background: COLORS.BLACK[4],
                    color: COLORS.GREEN[0],
                    width: 5
                }
            },
            PLAY: {
                background: COLORS.BLACK[0],
            }
        }

        this.buttonsCollection = {
            MAIN_MENU: {
                start: {
                    type: 'button',
                    props: {
                        ctx: this.app.gui.ctx,
                        x: -200,
                        y: -0,
                        width: 400,
                        height: 100,
                        text: 'Start',
                        font: '16px Mouse',
                        bg: this.buttonsStates.start === 'hover' ? this.colors.MAIN_MENU.buttons.variation1.hover
                            : this.buttonsStates.start === 'click' ? this.colors.MAIN_MENU.buttons.variation1.click
                                : this.colors.MAIN_MENU.buttons.variation1.normal,
                        stroke: this.colors.MAIN_MENU.buttons.variation1.stroke,
                        widthStroke: 8
                    }
                }
            }
        }

        this.decorations = {
            MAIN_MENU: {
                title: {
                    type: 'text',
                    props:{
                        ctx: this.app.gui.ctx,
                            font: "72px Mouse",
                        text: this.app.game.constructor.name,
                        x: 0,
                        y: -100,
                        color: this.colors.MAIN_MENU.mainCard.text,
                        width: this.app.gui.ctx.measureText(this.app.game.constructor.name).width,
                        height: 30,
                        center: true
                    }
                },
                mainCard: {
                    type: 'square',
                    props: {
                        ctx: this.app.gui.ctx,
                            x: -300,
                        y: -200,
                        width: 600,
                        height: 400,
                        color: this.colors.MAIN_MENU.mainCard.background,
                        stroke: this.colors.MAIN_MENU.mainCard.color,
                        widthStroke: this.colors.MAIN_MENU.mainCard.width
                    }
                }
            }
        }
    }

    draw() {
        // DECLARE COLLECTION
        const collection = [
            ...Object.values(this.decorations[this.app.game.state.state] ?? {}),
            ...Object.values(this.buttonsCollection[this.app.game.state.state] ?? {}),
        ];
        // DRAW COLLECTION
        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            this.app.gui.get[item.type](item.props);
        }
        // CANVAS BACKGROUND
        this.app.gui.ctx.canvas.style.backgroundColor =
            this.colors[this.app.game.state.state].background;
        // HOVER EVENTS
        Object.entries(this.buttonsCollection[this.app.game.state.state] ?? {}).forEach(key => {
            this.hoverCollection[key[0]] = key[1].props;
        });
    }
}