import NeuralNetwork from "../../../games/baseGame/utils/components/Network.js";
import Brain from "../../../games/baseGame/utils/components/Brain.js";

export default class Parser {
    constructor(app) {
        this.app = app;
    }

    static save(collection) {
        const saveData = collection.map((ant) => ant.brain.brain);

        const cache = (localStorage.getItem('bestBrain'))
            ? JSON.parse(localStorage.getItem('bestBrain'))
            : saveData[0];

        if (saveData.length > 1) {
            // if brain saved then remove the loaded brain from the collection
            // since it is the cache already
            (!localStorage.getItem('bestBrain')) && saveData.shift();
            // loop all brains and merge them into one
            saveData.forEach((brain, index) => {
                console.log(cache, brain);
                Brain.pairBrains(cache, brain, 0.02);
            });

        }
        console.log('saved', cache);
        localStorage.setItem('bestBrain', JSON.stringify(cache));
    }

    static load() {
        if (localStorage.getItem('bestBrain')) {
            console.log('loaded', JSON.parse(localStorage.getItem('bestBrain')));
            return JSON.parse(localStorage.getItem('bestBrain'));
        }
    }
}