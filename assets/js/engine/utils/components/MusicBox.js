import States from "../patterns/State.js";
import {STOP, PLAY, PAUSE} from "../../env.js";

export default class MusicBox {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.state = new States(app, this, STOP, [PLAY, PAUSE, STOP]);
        this.song = null;
        this.volume = 1;
        this.songs = [];
        app.factory.addGameEntity(this);
        callback(() => {
            this.app.log.registerEvent(
                'New MusicBox Created',
                '\x1b[32;1m| \x1b[0mNew MusicBox Created'
            );
        });
    }

    /**
     * Class methods
     */
    addSong(listOfSongs) {
        for (let song of listOfSongs) {
            if (this.songs.find(element => element.name === song.name)) {
                console.warn(`\x1b[35;1m| \x1b[0mSong ${song.name} already exists`);
                continue;
            }

            this.songs.push({
                name: song.name,
                song: new Audio(song.file)
            });

            this.songs[this.songs.length - 1].song.volume = 0;

            this.song = this.songs[this.songs.length - 1];

            this.song.song.volume = 1;

            this.app.log.registerEvent(`Song ${song.name} added`, `\x1b[35;1m| \x1b[0mSong ${song.name} added`);
        }
    }

    changeSong(song, cache = this.song.song.volume ?? 0) {
        this.song.song.volume = 0;
        this.song = this.songs.find(element => (element.name === song || element === song));
        this.song.song.volume = cache;
        this.app.log.registerEvent(
            `New Song to play - ${this.song.name}`,
            `\x1b[35;1m| \x1b[0mNew Song to play - ${this.song.name}`
        );
    }

    play() {
        this.song.song.play()
            .catch(err => {
                console.error(err);
            })
            .then(() => {
                this.state.setState(PLAY);
                this.app.log.registerEvent(
                    `Now playing ${this.song.name}`,
                    `\x1b[35;1m| \x1b[0mNow playing ${this.song.name}`
                );
            })
    }

    pause() {
        this.song.song.pause()
    }

    playNextSong(index = this.songs.findIndex(element => element === this.song)) {
        this.pause();
        index = this.songs[index + 1] ? index + 1 : 0;
        this.changeSong(this.songs[index]);
        this.play();
    }

    autoplay() {
        this.song.song.addEventListener('ended', () => {
            this.playNextSong();
            this.autoplay();
            this.app.log.registerEvent('Song ended', '\x1b[35;1m| \x1b[0mSong ended');
        });
    }

    toggle() {
        this.state.setState(this.song.paused ? PLAY : PAUSE);
        this.state.state === PLAY ? this.song.play() : this.song.pause();
    }
}