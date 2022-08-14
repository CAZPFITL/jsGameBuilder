export default class State {
    constructor(app, caller, initialState, states, callback = (fn) => fn()) {
        this.app = app;
        this.caller = caller;
        this.states = [];
        this.state = '';
        callback(()=> {
            this.app.log.registerEvent(
                `New ${this.caller.constructor.name} State Created`,
                `\x1b[32;1m| \x1b[0mNew \x1b[32;1m${this.caller.constructor.name}\x1b[0m State Created`
            );
            this.addStates(states);
            this.setState(initialState);
        });
    }

    addStates(states) {
        for (let i = 0; i < states.length; i++) {
            this.states.push(states[i]);
        }
    }

    setState(state) {
        if (this.states.includes(state)) {
            this.app.log.registerEvent(
                `${this.caller.constructor.name} State Changed to ${state}`,
                `\x1b[35;1m| \x1b[0mSet \x1b[35;1m${this.caller.constructor.name}\x1b[0m State\x1b[35;1m ${state}`
            );
            this.state = state;
        }
    }
}