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
        this.#addListeners({
            mousemove: (event) => true,
            mousedown: (event) => true,
            mouseup: (event) => true,
            click: (event) => true,
        });
    }

    /**
     * Private methods
     */
    #addListeners(abstractEvents) {
        this.app.controls.pushListener(this, 'mousemove', (event) => {
            this.app.gui.get.checkHoverCollection({
                collection: this.hoverCollection,
                event,
                viewport: this.app.camera.viewport,
                isHover: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'hover') {
                        this.buttonsStates[key] = 'hover';
                        this.hoverCaller = key;
                        this.gui.hoverStateIn();
                    }
                },
                isOut: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'normal') {
                        this.buttonsStates[key] = 'normal';
                        this.hoverCaller = null;
                        this.gui.hoverStateOut();
                    }
                },
                caller: this.hoverCaller,
            });
            abstractEvents.mousemove(event, this.app.gui.get.viewportCoords({
                x: event.offsetX,
                y: event.offsetY
            }, this.app.camera.viewport));
        });
        this.app.controls.pushListener(this, 'mouseup', (event) => {
            const buttons = this.#getButtons()

            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.ctx === this.app.gui.ctx
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mouseup && buttons[key].props.callbacks.mouseup()
                )
            });

            abstractEvents.mouseup(event);
        });
        this.app.controls.pushListener(this, 'mousedown', (event) => {
            const buttons = this.#getButtons()

            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.ctx === this.app.gui.ctx
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mousedown && buttons[key].props.callbacks.mousedown()
                )
            });
            abstractEvents.mousedown(event);
        });
        this.app.controls.pushListener(this, 'click', (event) => {
            const buttons = this.#getButtons()

            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.ctx === this.app.gui.ctx
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.click && buttons[key].props.callbacks.click()
                )
            });

            abstractEvents.click(event);
        });
    }

    #getButtons() {
        const output = {};
        Object.entries(this.buttonsCollection).forEach(key =>
            Object.entries(key[1]).forEach(button => output[button[0]] = button[1]));
        return output;
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
                                this.buttonsStates.start = 'normal';
                                this.app.game.state.setState(PLAY);
                                this.gui.hoverStateOut();
                            }
                        }
                    }
                }
            }
        }
        this.decorations = {
            MAIN_MENU: {
                title: {
                    type: 'text',
                    props: {
                        position: 'viewport',
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
                        position: 'viewport',
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
            try {
                const item = collection[i];
                if (typeof this.app.gui.get[item.type] === 'function') {
                    this.app.gui.get[item.type](item.props);
                }
            } catch (error) {
                console.error(
                    'verify item.props are provided with next keys:' +
                    'position, ctx, x, y, width, height, text, font, bg, stroke, widthStroke, callbacks' +
                    error
                );
                debugger;
            }
        }
        // CLEAR HOVER COLLECTION
        this.hoverCollection = {};
        // HOVER EVENTS
        Object.entries(this.buttonsCollection[this.app.game.state.state] ?? {}).forEach(key => {
            if (!key[0] || !key[1]) return;
            this.hoverCollection[key[0]] = key[1].props;
        });
        // CANVAS BACKGROUND
        this.app.gui.ctx.canvas.style.backgroundColor = this.colors[this.app.game.state.state].background;
    }
}