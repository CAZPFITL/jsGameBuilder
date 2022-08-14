import GameLevel from "./utils/components/GameLevel.js";
import Gui from "./utils/gui/Gui.js";
import States from "../../engine/utils/patterns/State.js";
import Player from "./utils/components/Player.js";
import {
    LOAD_GAME_DATA,
    LOAD_GAME_LEVEL,
    GAME_OVER,
    PLAY,
    MAIN_MENU,
    NETWORK
} from "./env.js";

export default class BaseGame {
    constructor(app, loadCallback) {
        this.app = app;
        this.useMusicBox = true;
        this.loadCallback = loadCallback;
        this.gui = new Gui(this.app, this);
        this.app.factory.addGameEntity(this.gui);
        this.state = new States(app, this, LOAD_GAME_DATA, [LOAD_GAME_DATA, LOAD_GAME_LEVEL, PLAY, MAIN_MENU, NETWORK]);
        this.app.factory.addGameEntity(this);
    }
    /**
     * Private methods
     */
    #loadData() {
        // Load name
        this.name = this.constructor.name;
        // Load Player Controls
        this.app.player = new Player(this.app, this);
        // load Controls listeners
        this.app.controls.addListeners();
        // Run Load Callback From Engine
        this.loadCallback();
        // Set State to LOAD_GAME_LEVEL
        this.state.setState(LOAD_GAME_LEVEL)
    }

    #loadGameLevel() {
        // this.level = new GameLevel({
        //     app,
        //     game: this,
        //     width: 2000,
        //     height: 1800
        // })
        this.state.setState(MAIN_MENU);
    }

    #restart() {
        this.app.factory.binnacle = { GameObjects: this.app.factory.binnacle.GameObjects };
    }

    /**
     * Draw and Update methods
     */
    update() {
        (this.state.state === LOAD_GAME_DATA) && this.#loadData();
        (this.state.state === LOAD_GAME_LEVEL) && this.#loadGameLevel();
    }
}