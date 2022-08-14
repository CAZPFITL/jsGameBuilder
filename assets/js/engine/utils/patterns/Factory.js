export default class Factory {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.binnacle = {};
        callback(()=> {
            this.app.log.registerEvent(
                `New Factory Created`,
                `\x1b[32;1m| \x1b[0mNew \x1b[32;1mFactory\x1b[0m Created`
            );
        });
    }

    create(object, props) {
        // Create an object collection if it doesn't exist
        (!this.binnacle[object.name]) && (this.binnacle[object.name] = []);
        // Create an id to be asigned to the object
        const id = this.binnacle[object.name].length;
        // Instantiate the object
        const instanceFromType = new object({id, ...props})
        // Object registration in factory binnacle
        this.binnacle[object.name].push(instanceFromType);
        this.app.log.registerEvent(
            `Factory Produced ${object.name}`,
            `\x1b[32;1m| \x1b[0mFactory Produced \x1b[32;1m${object.name}${props.id ? ` #${props.id}` : ''}`
        );
        // Return the object
        return instanceFromType;
    }

    remove(object) {
        const id = object.constructor.name;
        this.binnacle[id] = this.binnacle[id] instanceof Array && this.binnacle[id].filter(item => item !== object);
        this.app.log.registerEvent(
            `Factory ${object.constructor.name} removed`,
            `\x1b[31;1m| \x1b[0mFactory Removed \x1b[31;1m${object.constructor.name}${object.id ? ` #${object.id}` : ''}`
        );
    }

    restart(){
        for (let key in this.app.factory.binnacle) {
            this.app.factory.binnacle[key] instanceof Array &&
            this.app.factory.binnacle[key].forEach((entity) => {
                if (key !== 'GameObjects') {
                    this.app.factory.remove(entity);
                }
            });
        }
    }

    // These objects are used to create instances of objects used in games like games in screen controls.
    addGameEntity(entity) {
        if (!(this.binnacle.GameObjects instanceof Array)) {
            this.binnacle.GameObjects = [];
        }
        this.binnacle.GameObjects.push(entity);
    }
}
