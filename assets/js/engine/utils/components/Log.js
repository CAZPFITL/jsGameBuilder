export default class Log {

    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.fadeSpeed = 30;
        this.n = 6;
        this.lineHeight = 26;
        this.cleared = true;
        this.log = [];
        this.registeredEvents = [];
        this.consoleEvents = [];
        callback(()=> {
            this.registerEvent(
                'New Log Created',
                '\x1b[32;1m| \x1b[0mNew \x1b[32;1mLog\x1b[0m Created'
            );
        });
    }

    registerEvent(event, _console) {
        // GLOBAL HISTORY
        this.consoleEvents.push(_console);
        this.registeredEvents.push(event);
        // TRIGGER VERBOSE MODE IN CONSOLE
        (this.app.verbose) && console.log(_console);
        // PRINT LOG (TEMPORAL HISTORY)
        (this.log.length <= this.n) && this.log.push(event);
        this.cleared = false;
    }

    printLog(ctx, font = '20px Mouse') {
        if (this.cleared) {
            return;
        }

        if (this.app.request - this.app.game.flags.logFlag > 100 - this.fadeSpeed) {
            this.app.game.flags.logFlag = this.app.request;
            ++this.app.game.flags.logCounter;

            if (this.app.game.flags.logCounter > this.n) {
                this.app.game.flags.logCounter = 0;
                this.cleared = true;
            }

            this.log.shift();
        }

        const logHeight = this.log.length * this.lineHeight;
        const logY = window.innerHeight - logHeight + 10;

        this.log.forEach((message, index) => {
            this.app.gui.get.text({
                ctx,
                font,
                text: `${message}...`,
                x: 16,
                y: logY + (index * this.lineHeight) + 1,
                color: `rgba(0,0,0,${0.46 - ((this.log.length - index) * (this.n/100))})`,
                width: this.app.gui.ctx.measureText(message).width,
                height: this.lineHeight
            });
            this.app.gui.get.text({
                ctx,
                font,
                text: `${message}...`,
                x: 15,
                y: logY + (index * this.lineHeight),
                color: `rgba(255,0,115,${0.54 - ((this.log.length - index) * (this.n/100))})`,
                width: this.app.gui.ctx.measureText(message).width,
                height: this.lineHeight
            });
        });
    }
}