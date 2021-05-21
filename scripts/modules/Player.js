import { host, startUpdatingLobby } from '../main.js';
import Lobby from './Lobby.js';

export default class Player {
    constructor(name) {
        this.name = name;
        this.lobby = "";
        this.room = "";
        this.main = this.main = document.getElementById("main");
    }
    joinLobby() {
        const values = {
            "name": this.name
        }
        fetch(host + '/server/join.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => res.text())
            .then(res => {
                this.room = res;
                // playerName = document.getElementById("nick").value;
                if (this.room.slice(0, 4) == "room") {
                    this.lobby = new Lobby(this);
                    this.lobby.create();
                    startUpdatingLobby(this.lobby);
                } else {
                    alert(res);
                }
            });

    }
    ready() {
        const values = {
            "name": this.name,
            "room": this.room
        }
        fetch(host + '/server/ready.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => res.text())
            .then(res => {
                // console.log(res);
                this.lobby.updateData();
            });
    }
}