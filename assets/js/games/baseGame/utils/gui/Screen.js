import {PLAY, MAIN_MENU, GAME_OVER, COLORS} from "../../env.js";

export default class Screen {
    constructor(app, gui) {
        this.app = app;
        this.gui = gui;
        this.hoverCollection = {};
        this.decorations = {};
        this.buttonsStates = {};
        this.buttonsCollection = {};
        this.colors = {};
        this.#addListeners();
    }

    /**
     * Private methods
     */
    #addListeners() {
        this.app.controls.pushListener(this, 'mousemove', (event) => {
            // HOVER COLLECTION
            this.app.gui.get.checkHoverCollection({
                collection: this.hoverCollection,
                event,
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
                caller: this.hoverCaller,
            });
        });
        this.app.controls.pushListener(this, 'mouseup', (event) => {
            const coords = {x: event.offsetX, y: event.offsetY};
            const viewportCtx = this.app.gui.get.clickCoords(event, this.app.camera.viewport);
            const buttons = {
                start: {coords: viewportCtx, ...this.buttonsCollection.MAIN_MENU.start}
            }
            Object.keys(buttons).forEach(key => {
                this.app.gui.get.isClicked(
                    buttons[key].props,
                    buttons[key].coords,
                    () => {
                        this.buttonsStates[key] = 'normal';
                        buttons[key].props?.callbacks?.mouseup && buttons[key].props.callbacks.mouseup();
                    }
                )
            });
            this.buttonsStates.start = 'normal'
        });
        this.app.controls.pushListener(this, 'mousedown', (event) => {
            const coords = {x: event.offsetX, y: event.offsetY};
            const viewportCoords = this.app.gui.get.clickCoords(event, this.app.camera.viewport);
            const buttons = {
                start: {coords: viewportCoords, ...this.buttonsCollection.MAIN_MENU.start}
            }
            Object.keys(buttons).forEach(key => {
                this.app.gui.get.isClicked(
                    buttons[key].props,
                    buttons[key].coords,
                    () => {
                        this.buttonsStates[key] = 'click';
                        buttons[key].props?.callbacks?.mousedown && buttons[key].props.callbacks.mousedown();
                    }
                )
            });
        });
        this.app.controls.pushListener(this, 'click', (event) => {
            const coords = {x: event.offsetX, y: event.offsetY};
            const buttons = {}
            Object.keys(buttons).forEach(key => {
                this.app.gui.get.isClicked(
                    buttons[key].props,
                    buttons[key].coords,
                    () => {
                        this.buttonsStates[key] = this.buttonsStates[key] === 'click' ? 'normal' : 'click';
                        buttons[key].props?.callbacks?.click && buttons[key].props.callbacks.click();
                    }
                )
            });
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
                        position: 'viewport',
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
                        widthStroke: 8,
                        callbacks: {
                            mouseup: () => {
                                this.app.game.state.setState(PLAY);
                            }
                        }
                    }
                }
            },
        }
        this.decorations = {
            MAIN_MENU: {
                title: {
                    type: 'text',
                    props:{
                        ctx: this.app.gui.ctx,
                            font: "72px Mouse",
                        text: this.app.game.constructor.name,
                        x: -300,
                        y: -100,
                        color: this.colors.MAIN_MENU.mainCard.text,
                        width: 600,
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
        // HOVER EVENTS
        Object.entries(this.buttonsCollection[this.app.game.state.state] ?? {}).forEach(key => {
            this.hoverCollection[key[0]] = key[1].props;
        });
        // CANVAS BACKGROUND
        this.app.gui.ctx.canvas.style.backgroundColor =
            this.colors[this.app.game.state.state].background;
    }
}