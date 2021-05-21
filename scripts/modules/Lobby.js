import { host, createGame } from '../main.js';

export default class Lobby {
    constructor(player) {
        this.player = player;
        this.room = player.room;
        this.players = "";
        this.color = "";
        this.colors = [];
        this.main = document.getElementById("main");

    }
    create() {
        while (this.main.firstChild) {
            this.main.removeChild(this.main.firstChild);
        }
        const topPanel = document.createElement("div");
        topPanel.id = "top";

        const playersDiv = document.createElement("div");
        playersDiv.id = "players";

        const readyBtn = document.createElement("div");
        readyBtn.id = "ready";
        readyBtn.innerHTML = "READY";
        readyBtn.addEventListener("click", () => { this.player.ready(); });

        topPanel.appendChild(playersDiv);
        topPanel.appendChild(readyBtn);
        this.main.appendChild(topPanel);

    }
    updateData() {
        const values = {
            "room": this.room
        }
        fetch(host + '/server/updateDataLobby.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                this.players = res[1];
                this.updateDOM();
                if (res[0] == "start") {
                    this.color = this.players.find(item => item.name == this.player.name).color;
                    // console.log(this.color)
                    this.makeColorList();
                    createGame(this);
                }
            });
    }
    updateDOM() {
        const colors = ["red", "blue", "green", "yellow"];
        const tempData = this.players;
        document.getElementById("players").innerHTML = "";
        colors.forEach(function (color) {
            const player = tempData.find(item => item.color == color);
            if (player) {
                const playerDiv = document.createElement("div");
                playerDiv.classList.add("player");
                playerDiv.id = player.name;
                playerDiv.innerHTML = `<h3>${player.name}</h3>`;
                if (player.status > 0) {
                    playerDiv.style.backgroundColor = player.color;
                } else {
                    playerDiv.style.backgroundColor = "gray";
                }
                document.getElementById("players").appendChild(playerDiv);
            }
            // const playerDiv = document.createElement("div");
            // playerDiv.classList.add("player");
            // playerDiv.innerHTML = item.name;
            // if (item.status > 0) {
            //     playerDiv.style.backgroundColor = item.color;
            // } else {
            //     playerDiv.style.backgroundColor = "gray";
            // }
            // document.getElementById("players").appendChild(playerDiv);
        });
    }
    makeColorList() {
        const colors = ["red", "blue", "green", "yellow"];
        const tempData = this.players;
        colors.forEach(color => {
            const player = tempData.find(item => item.color == color);
            if (player) {
                this.colors.push(color);
            }
        })
    }
}