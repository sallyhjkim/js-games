import { Player } from "./player.js";
import { Confetti } from "../confetti/confetti.js";
document.addEventListener("DOMContentLoaded", () => {
    const gridRow = 9;
    const gridCol = 9;
    const blockers = 10;

    const startLine = 0;
    const finishLine = gridRow - 1;
    const middlePoint = Math.floor(gridRow / 2);
    const gameSpace = document.getElementById("gameSpace");
    const playerOne = new Player(
        0,
        "White",
        middlePoint,
        startLine,
        blockers,
        startLine,
        finishLine
    );
    const playerTwo = new Player(
        1,
        "Black",
        middlePoint,
        finishLine,
        blockers,
        finishLine,
        startLine
    );
    const players = [playerOne, playerTwo];

    let playerTurn = 0;
    let blockerStore = [];
    let moveOptions = [];

    function createGameBorad() {
        for (let r = 0; r < gridRow; r++) {
            for (let c = 0; c < gridCol; c++) {
                let grid = document.createElement("div");
                grid.setAttribute("class", "grid");
                grid.setAttribute("id", `grid${c}-${r}`);
                gameSpace.appendChild(grid);

                // grid center
                let gridCenter = document.createElement("div");
                gridCenter.setAttribute("class", "gridCenter");
                gridCenter.setAttribute("id", `center${c}-${r}`);
                gridCenter.addEventListener("click", move);
                grid.appendChild(gridCenter);

                // grid right
                let gridRight = document.createElement("div");
                if (c !== startLine) {
                    gridRight.setAttribute("id", `right${c}-${r}`);
                    gridRight.setAttribute("class", "gridRight");
                    gridRight.addEventListener("click", putBlocker);
                } else {
                    gridRight.setAttribute("class", "gridRight staticBlocker");
                }
                grid.appendChild(gridRight);

                // grid down
                let gridDown = document.createElement("div");
                if (r !== finishLine) {
                    gridDown.setAttribute("id", `down${c}-${r}`);
                    gridDown.setAttribute("class", "gridDown");
                    gridDown.addEventListener("click", putBlocker);
                } else {
                    gridDown.setAttribute("class", "gridDown staticBlocker");
                }
                grid.appendChild(gridDown);
            }
        }
        players.forEach((p, i) => {
            const coord = p.getCoord();
            setIconOnGrid(coord, `url('assets/player${i}.png')`);
        });
        showBoundary();
    }

    function toggleTurn() {
        document.getElementById(`p${playerTurn}`).style.color = "black";
        playerTurn = playerTurn === 0 ? 1 : 0;
        document.getElementById(`p${playerTurn}`).style.color = "red";
        fillColorOptions("brown");
        showBoundary();
    }

    function setIconOnGrid(coord, img) {
        const coordId = `center${coord.x}-${coord.y}`;
        let posEle = document.getElementById(coordId);
        posEle.style.backgroundImage = img;
    }

    function putBlocker() {
        const curPlayer = players[playerTurn];
        let newCoordId = this.getAttribute("id");
        if (blockerStore.includes(newCoordId) || curPlayer.blockers === 0) {
            return;
        }
        curPlayer.blockers--;
        document.getElementById(`p${curPlayer.index}-blocker`).textContent =
            curPlayer.blockers;
        blockerStore.push(newCoordId);
        this.style.border = "1px solid black";
        this.style.backgroundColor = "darkorange";
        toggleTurn();
    }

    function populateOptions(coord, enemiesPos, curDir) {
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if (Math.abs(i) === Math.abs(j)) continue;
                let pos = { x: coord.x + j, y: coord.y + i };
                if (pos.x < 0 || pos.y < 0) {
                    continue;
                }
                const enemy = enemiesPos.find((enemyItem) => {
                    const e = enemyItem.getCoord();
                    return pos.x === e.x && pos.y === e.y;
                });
                let posid = `${pos.x}-${pos.y}`;
                let id = `center${posid}`;
                if (enemy) {
                    let hasId = enemyCheck(enemy, coord, pos, curDir);
                    if (hasId) moveOptions.push(hasId);
                    continue;
                }
                let hasBlocker = blockerChecker(coord, pos);
                if (!moveOptions.includes(id) && !hasBlocker) {
                    moveOptions.push(id);
                }
            }
        }
    }

    function enemyCheck(enemy, playerPos, futurePos, curDir) {
        const enemyDir = enemy.startPoint > enemy.goal ? 1 : -1;
        // check player is which side
        let enemyBackPos;
        if (enemy.x == playerPos.x) {
            //veritally blocked by enemy
            enemyBackPos = {
                x: futurePos.x,
                y: futurePos.y + 1 * enemyDir,
            };
        } else {
            //horizontally blocked by enemy
            let param = enemy.x > playerPos.pos ? -1 : 1;
            enemyBackPos = {
                x: futurePos.x + param,
                y: futurePos.y,
            };
        }

        if (enemyBackPos.x === playerPos.x && enemyBackPos.y === playerPos.y) {
            return false;
        }
        let hasBlocker = blockerChecker(playerPos, enemyBackPos);
        if (hasBlocker) return false;
        let id = `center${enemyBackPos.x}-${enemyBackPos.y}`;
        return id;
    }

    function blockerChecker(curPos, futurePos) {
        let blockerId;
        let hasBlocker = false;

        /**
         * left: check curPos's coordinate blocker
         * right: check futurePos's coordinate blocker
         * forward: check futurePos's coordinate blocker (if direction is -1)
         * backward: check curPos's coordinate blocker  (if direction is -1)
         * forward: check curPos's coordinate blocker (if direction is +1)
         * backward: check futurePos's coordinate blocker  (if direction is +1)
         */
        if (curPos.x === futurePos.x && curPos.y > futurePos.y) {
            // check forward-side blocker(for direction -1) / check backward-side blocker(for direction +1)
            blockerId = `down${futurePos.x}-${futurePos.y}`;
        } else if (curPos.x === futurePos.x && curPos.y < futurePos.y) {
            // check forward-side blocker(for direction +1) / check backward-side blocker(for direction -1)
            blockerId = `down${curPos.x}-${curPos.y}`;
        } else if (curPos.y === futurePos.y && curPos.x < futurePos.x) {
            // check right-side blocker
            blockerId = `right${futurePos.x}-${futurePos.y}`;
        } else if (curPos.y === futurePos.y && curPos.x > futurePos.x) {
            // check left-side blocker
            blockerId = `right${curPos.x}-${curPos.y}`;
        }

        hasBlocker = blockerStore.includes(blockerId);
        return hasBlocker;
    }

    function showBoundary() {
        moveOptions = [];
        const curPlayer = players[playerTurn];
        const curDir = curPlayer.startPoint < curPlayer.goal ? 1 : -1;
        const coord = curPlayer.getCoord();
        let enemies = players.filter((p) => {
            return curPlayer.name !== p.name;
        });
        populateOptions(coord, enemies, curDir);
        fillColorOptions("yellowgreen");
    }

    function fillColorOptions(color) {
        moveOptions.forEach((coordId) => {
            if (document.getElementById(coordId)) {
                document.getElementById(coordId).style.backgroundColor = color;
            }
        });
    }

    function move() {
        const thisId = this.getAttribute("id");
        if (!moveOptions.includes(thisId)) return;

        const curPlayer = players[playerTurn];
        // remove preivous one
        const coord = curPlayer.getCoord();
        setIconOnGrid(coord, "");
        // put in new position
        let newCoordId = thisId.split("center")[1];
        let newCoords = newCoordId.split("-");
        newCoords = curPlayer.setCoord(newCoords[0], newCoords[1]);
        setIconOnGrid(newCoords, `url('assets/player${playerTurn}.png')`);

        if (newCoords.y == curPlayer.goal) {
            document.getElementById(
                "winMsg"
            ).textContent = `Winner is ${curPlayer.name} 🙌!`;
            document.getElementById("winMsg").style.display = "inherit";
            let conf = new Confetti();
            conf.congrats();
        }
        toggleTurn();
    }

    createGameBorad();
});
