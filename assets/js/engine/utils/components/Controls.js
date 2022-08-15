export default class Controls {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.listeners = [];
        callback(()=> {
            this.app.log.registerEvent(
                'New Controls Created',
                '\x1b[32;1m| \x1b[0mNew \x1b[32;1mControls\x1b[0m Created'
            );
        });
    }

    getControls(entity) {
        return this.app.player.entity === entity
            ? this.app.player.controls
            : entity.controls;
    }

    pushListener(caller, event, fn) {
        this.app.log.registerEvent(
            `Listener added for ${event} from ${caller.constructor.name}`,
            `\x1b[33;1m| \x1b[0mNew listener \x1b[33;1m${event} \x1b[0mfrom \x1b[33;1m${caller.constructor.name}`
        );
        !this.listeners[event] ?
            (this.listeners[event] = [fn]) :
            (this.listeners[event].push(fn));

    }

    addListeners() {
        for ( let listener in this.listeners ) {
            document.addEventListener(listener, (e) =>
                this.listeners[listener].forEach(fn => fn(e))
            );
        }
    }
}
