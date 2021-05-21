import { host, startUpdatingGame } from '../main.js';
import { positions, endPositionsRed, endPositionsBlue, endPositionsGreen, endPositionsYellow, startPositionsRed, startPositionsBlue, startPositionsGreen, startPositionsYellow } from './positions.js';
import Dice from './Dice.js';
import Timer from './Timer.js';

export default class Game {
    constructor(lobby) {
        this.room = lobby.room;
        this.player = lobby.player;
        this.colors = lobby.colors;
        this.color = lobby.color;
        this.playersData = "";
        this.intervals = [];
        this.positions = [];
        this.main = document.getElementById("main");
        this.gameContainer = document.createElement("div");
        this.board = document.createElement("div");
        this.dice = new Dice(this);
        this.timer = null;
    }
    start() {
        document.getElementById('ready').remove();
        this.makeBoard();
        this.makePins();

        const values = {
            "room": this.room,
            "colors": this.colors
        }
        fetch(host + '/server/start.php', {
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
                startUpdatingGame();
            });

    }
    makeBoard() {
        this.gameContainer.id = "gameContainer";
        this.board.id = "board";

        const boardCanvas = document.createElement("canvas");
        boardCanvas.id = "boardCanvas";
        boardCanvas.width = 500;
        boardCanvas.height = 500;

        const moveDiv = document.createElement("div");
        moveDiv.id = "moveDiv";

        this.board.appendChild(boardCanvas);
        this.gameContainer.appendChild(moveDiv);
        this.gameContainer.appendChild(this.board);
        this.main.appendChild(this.gameContainer);

        const ctx = document.getElementById('boardCanvas').getContext('2d');
        const img = new Image();
        img.src = 'gfx/board.png';
        img.onload = function () {
            ctx.drawImage(img, 0, 0, 500, 500);
        }
    }
    // makeDice() {
    //     if (!document.getElementById('moveDiv').firstChild) {
    //         document.getElementById('moveDiv').innerHTML = '<input id="move" type="number" min="1" max="7" value="1"><button id="btn">RZUT</button>'; //DO ZMIANY

    //         document.getElementById('btn').addEventListener('click', () => { this.showPossibleMoves() }); //DO ZMIANY
    //     }

    // }
    makePins() {
        const tempGame = this;
        window.addEventListener('resize', () => { tempGame.updateGame(this.playersData) });
        this.colors.forEach(color => {
            for (let o = 0; o < 4; o++) {
                const pin = document.createElement("div");
                pin.id = color + o;
                pin.classList.add("pin");
                pin.classList.add(color);
                pin.style.backgroundColor = color;
                this.board.appendChild(pin);
            }
        })
    }
    updateData(checkIfWon) {
        const values = {
            "room": this.room
        }
        fetch(host + '/server/updateDataGame.php', {
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
                this.playersData = res;
                this.updateGame();
                const status = res.find(item => item.color == this.color).status;
                if (status == 3) {
                    if (!document.getElementById('moveDiv').firstChild) {
                        this.dice.makeDice(document.getElementById('moveDiv'));
                    }
                } else if (status == 2) {
                    // while (document.getElementById('moveDiv').firstChild) {
                    //     document.getElementById('moveDiv').firstChild.remove();
                    // }
                    setTimeout(() => {
                        this.dice.removeDOM(document.getElementById('moveDiv'));
                    }, 1500);

                }
                if (checkIfWon) {
                    this.checkIfWon();
                }
                res.forEach(item => {
                    if (this.colors.indexOf(item.color) > -1) {
                        if (item.status == 3) {
                            if (!document.getElementById('timer')) {
                                this.timer = new Timer(item.name);
                                this.timer.makeDOM();
                                this.timer.startTimer();
                            } else if (this.timer) {
                                if (this.timer.player != item.name) {
                                    document.getElementById('timer').remove();
                                    document.getElementById('hidden').remove();
                                    this.timer.clear();
                                    this.timer = new Timer(item.name);
                                    this.timer.makeDOM();
                                    this.timer.startTimer();
                                } else if (this.timer.time == 0) {
                                    if (item.color == this.color) {
                                        const pins = Array.prototype.slice.call(document.getElementsByClassName(this.color));
                                        this.dice.removeDOM(document.getElementById('moveDiv'));
                                        this.move(pins[0], 0);
                                        this.timer = null;
                                    }
                                }
                            }
                        } else if (item.status == 4) {
                            this.colors.splice(this.colors.indexOf(item.color), 1);
                            if (item.color != this.color) {
                                if (item.place == 1) {
                                    alert(item.name + " has won. Place: " + item.place);
                                } else if (item.place) {
                                    alert(item.name + " has finished. Place: " + item.place);
                                }
                            } else {
                                this.end(item);
                            }
                        }
                    }
                })
            });
    }
    updateGame() {
        let boardOffsetTop = document.getElementById('boardCanvas').offsetTop;
        let boardOffsetLeft = document.getElementById('boardCanvas').offsetLeft;

        this.positions = [];
        this.playersData.forEach(obj => {
            this.positions.push([obj.color, obj.positions]);
        });
        this.positions.forEach(pos => {
            // console.log(pos[0], pos[1]);
            pos[1] = JSON.parse(pos[1]);
            const pins = document.getElementsByClassName(pos[0]);
            for (let o = 0; o < pins.length; o++) {
                //console.log(pos[1][o], pos[0], pins[o]);
                const position = this.convertPosition(pos[1][o], pos[0], o);
                // console.log(position.top, position.left)
                pins[o].style.top = position.top + boardOffsetTop + "px";
                // console.log(pins[o])
                pins[o].style.left = position.left + boardOffsetLeft + "px";
            }
        })
    }
    convertPosition(pos, color, index) {
        const colors = ["red", "blue", "green", "yellow"];
        const startPositions = [startPositionsRed, startPositionsBlue, startPositionsGreen, startPositionsYellow];
        const endPositions = [endPositionsRed, endPositionsBlue, endPositionsGreen, endPositionsYellow];
        const colorIndex = colors.indexOf(color)
        const offset = colorIndex * 10;
        // let startPositionsColor = startPositionsRed;
        // let endPositionsColor = endPositionsRed;
        // if (color == "blue") {
        //     offset = 10;
        //     startPositionsColor = startPositionsBlue;
        //     endPositionsColor = endPositionsBlue;
        // } else if (color == "green") {
        //     offset = 20;
        //     startPositionsColor = startPositionsGreen;
        //     endPositionsColor = endPositionsGreen;
        // } else if (color == "yellow") {
        //     offset = 30;
        //     startPositionsColor = startPositionsYellow;
        //     endPositionsColor = endPositionsYellow;
        // }
        if (pos == 0) {
            return startPositions[colorIndex][index];
        } else if (pos < 40) {
            return positions[pos + offset];
        } else {
            return endPositions[colorIndex][pos - 40];
        }
    }
    move(el, move) {
        const color = el.classList[1];
        const pins = Array.prototype.slice.call(document.getElementsByClassName(color));

        // console.log(pins)
        // console.log(color + pins.indexOf(el));

        if (color == this.color && move > 0) {
            this.checkIfKill(el, move);
            this.intervals.forEach(item => {
                clearInterval(item);
            })
            pins.forEach(item => {
                item.style.cursor = "default";
                // $(`#${item.id}`).off();
                $(`#${item.id}`).replaceWith($(`#${item.id}`).clone());
                $(`#${item.id}`).css("background-color", color);
            })
        }
        if (document.getElementById('preview')) {
            document.getElementById('preview').remove();
        }
        if (document.getElementById('timer')) {
            this.timer.clear();
            this.timer = null;
            document.getElementById('timer').remove();
            document.getElementById('hidden').remove();
        }

        const values = {
            "room": this.room,
            "color": color,
            "colors": this.colors,
            "move": [pins.indexOf(el), move]
        }
        // console.log([parseInt(pins.indexOf(el)), move])
        fetch(host + '/server/move.php', {
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
                const positions = JSON.parse(this.playersData.find(item => item.color == color).positions);
                // console.log(positions[pins.indexOf(el)]);
                if (positions[pins.indexOf(el)] + move == 1) {
                    this.updateData(true);
                } else {
                    this.updateData(false);
                }
            });
    }
    previewMove(el) {
        const boardOffsetTop = document.getElementById('boardCanvas').offsetTop;
        const boardOffsetLeft = document.getElementById('boardCanvas').offsetLeft;
        const pins = Array.prototype.slice.call(document.getElementsByClassName(this.color));

        // this.playersData.forEach(player => {
        //     if (player.color == color) {
        //         positions = JSON.parse(player.positions);
        //         positions = 
        //     }
        // })
        const positions = JSON.parse(this.playersData.find(item => item.color == this.color).positions);
        const currentPos = positions[pins.indexOf(el)];
        let previewPos;
        if (currentPos == 0) {
            previewPos = 1;
        } else if (currentPos + this.dice.value > 44) {
            previewPos = 44 - (this.dice.value - (44 - currentPos));
        } else {
            previewPos = currentPos + this.dice.value;
        }

        if (previewPos != currentPos) {
            const newPosition = this.convertPosition(previewPos, this.color, pins.indexOf(el))
            const preview = document.createElement('div');
            preview.id = "preview";
            preview.style.top = newPosition.top + boardOffsetTop + "px";
            preview.style.left = newPosition.left + boardOffsetLeft + "px";
            document.getElementById('board').appendChild(preview)
        }
    }
    showPossibleMoves() {
        // console.log(this.color)
        const positions = JSON.parse(this.playersData.find(item => item.color == this.color).positions);
        const pins = Array.prototype.slice.call(document.getElementsByClassName(this.color));
        let countPossibleMoves = 0;
        pins.forEach(pin => {
            if (positions[pins.indexOf(pin)] != 44) {
                if (this.dice.value == 1 || this.dice.value == 6) {
                    this.pulseAnimation(pin);
                    countPossibleMoves++;
                } else if (positions[pins.indexOf(pin)] > 0) {
                    this.pulseAnimation(pin);
                    countPossibleMoves++;
                }
            }
        })
        if (countPossibleMoves == 0) {
            this.move(pins[0], 0);
        }
    }
    pulseAnimation(pin) {
        const color = pin.style.backgroundColor;
        const tempGame = this;
        pin.addEventListener('click', (event) => { tempGame.move(event.target, this.dice.value) });
        pin.addEventListener('mouseover', (event) => { tempGame.previewMove(event.target) });
        pin.addEventListener('mouseout', () => {
            if (document.getElementById('preview')) {
                document.getElementById('preview').remove()
            }
        });
        pin.style.cursor = 'pointer';
        pin.style.backgroundColor = "white";
        setTimeout(() => {
            pin.style.backgroundColor = color;
        }, 500);
        const interval = setInterval(() => {
            pin.style.backgroundColor = "white";
            setTimeout(() => {
                pin.style.backgroundColor = color;
            }, 500);
        }, 1000);
        this.intervals.push(interval);
    }
    checkIfKill(el, move) {
        // console.log(this.positions);
        const pins = Array.prototype.slice.call(document.getElementsByClassName(this.color));
        const colors = ["red", "blue", "green", "yellow"];
        const takenPositions = [];
        let newPos;

        this.positions.forEach(item => {
            const color = item[0];
            const positions = item[1];
            if (color != this.color) {
                const tempPositions = [];
                positions.forEach(pos => {
                    if (pos > 0 && pos < 41) {
                        if (colors.indexOf(color) > colors.indexOf(this.color)) {
                            pos += (colors.indexOf(color) - colors.indexOf(this.color)) * 10;
                        } else {
                            pos += (colors.length - colors.indexOf(this.color) + colors.indexOf(color)) * 10;
                        }

                        if (pos > 40) {
                            tempPositions.push(pos - 40);
                        } else {
                            tempPositions.push(pos);
                        }
                    }
                });
                if (tempPositions.length > 0) {
                    takenPositions.push({ color: color, positions: tempPositions });
                }
            } else {
                newPos = positions[pins.indexOf(el)] + move;
            }

        });
        // console.log(takenPositions);
        takenPositions.forEach(pins => {
            if (pins.positions.indexOf(newPos) > -1) {
                // console.log("ZBITY " + pins.color + pins.positions.indexOf(newPos));
                // console.log(document.getElementById(pins.color + pins.positions.indexOf(newPos)));
                this.move(document.getElementById(pins.color + pins.positions.indexOf(newPos)), -1);
            }
        })
    }
    checkIfWon() {
        const positions = JSON.parse(this.playersData.find(item => item.color == this.color).positions);
        let sum = 0;
        positions.forEach(pos => {
            sum += pos;
        });
        if (sum == 44 * 4) {
            const values = {
                "room": this.room,
                "color": this.color
            }
            fetch(host + '/server/win.php', {
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
                });
        }
    }
    end(player) {
        if (player.place == 1) {
            document.getElementById("moveDiv").innerHTML = "You won!";
        } else if (player.place == null) {
            document.getElementById("moveDiv").innerHTML = "You lost.";
        } else {
            document.getElementById("moveDiv").innerHTML = "Place: " + player.place + ".";
        }

    }
}