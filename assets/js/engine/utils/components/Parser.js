export default class Parser {
    constructor(app) {
        this.app = app;
    }

    static save(collection) {
        const saveData = {}
        console.log('saved', saveData);
        localStorage.setItem('saveData', JSON.stringify(saveData));
    }

    static load() {
        if (localStorage.getItem('saveData')) {
            console.log('loaded', JSON.parse(localStorage.getItem('saveData')));
            return JSON.parse(localStorage.getItem('saveData'));
        }
    }
}