import { Confetti } from "../confetti/confetti.js";

document.addEventListener("DOMContentLoaded", () => {
    const EMPTY = "images/empty.png";
    const FOUND = "images/smile.png";
    const food = ["burger", "cake", "chips", "donut", "hotdog", "sushi"];
    const options = food.map((opt) => {
        return {
            name: opt,
            img: `images/${opt}.png`,
        };
    });

    let cardArray = [...options, ...options];
    // cardArray.sort(() => 0.5 - Math.random()); // shuffle the cards

    const grid = document.querySelector(".grid");
    let cardChosen = [];
    let cardChosenId = [];
    let cardWon = [];

    function createBorad() {
        cardArray.forEach((cardObj, i) => {
            let card = document.createElement("img");
            card.setAttribute("src", EMPTY);
            card.setAttribute("data-id", i);
            card.setAttribute("draggable", false);
            card.addEventListener("click", flipCard);
            grid.appendChild(card);
        });
    }

    function checkForMatch() {
        let cards = document.querySelectorAll("img");
        const optionOneId = cardChosenId[0];
        const optionTwoId = cardChosenId[1];

        if (cardChosen[0] === cardChosen[1]) {
            cards[optionOneId].setAttribute("src", FOUND);
            cards[optionTwoId].setAttribute("src", FOUND);
            cardWon = cardWon.concat(cardChosen);
        } else {
            cards[optionOneId].setAttribute("src", EMPTY);
            cards[optionTwoId].setAttribute("src", EMPTY);
        }
        cardChosen = [];
        cardChosenId = [];
        if (cardWon.length === cardArray.length) {
            let congratMsg = document.getElementById("congratMsg");
            congratMsg.style.display = "inherit";
            let conf = new Confetti();
            conf.congrats();
        }
    }

    function flipCard() {
        let cardId = this.getAttribute("data-id");
        let cardName = cardArray[cardId].name;
        // check if it is already clikced one or not!
        if (cardChosenId.includes(cardId) || cardWon.includes(cardName)) {
            return;
        }
        cardChosen.push(cardName);
        cardChosenId.push(cardId);
        this.setAttribute("src", cardArray[cardId].img);
        if (cardChosen.length === 2) {
            // checkForMatch()
            setTimeout(checkForMatch, 400);
        }
    }

    createBorad();
});
