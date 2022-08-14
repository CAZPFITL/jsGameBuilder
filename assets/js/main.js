import App from './engine/App.js';
import Game from './games/baseGame/Game.js';

// Loading this a white screen should be displayed and no errors should be thrown
class Test {}

new App(true, Game);
