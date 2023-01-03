// import { words } from "./words";

function lg() {
    console.log(...arguments);
}

const keyboard = {
    q: document.getElementsByClassName("quordle-key").item(0),
    w: document.getElementsByClassName("quordle-key").item(1),
    e: document.getElementsByClassName("quordle-key").item(2),
    r: document.getElementsByClassName("quordle-key").item(3),
    t: document.getElementsByClassName("quordle-key").item(4),
    y: document.getElementsByClassName("quordle-key").item(5),
    u: document.getElementsByClassName("quordle-key").item(6),
    i: document.getElementsByClassName("quordle-key").item(7),
    o: document.getElementsByClassName("quordle-key").item(8),
    p: document.getElementsByClassName("quordle-key").item(9),

    a: document.getElementsByClassName("quordle-key").item(10),
    s: document.getElementsByClassName("quordle-key").item(11),
    d: document.getElementsByClassName("quordle-key").item(12),
    f: document.getElementsByClassName("quordle-key").item(13),
    g: document.getElementsByClassName("quordle-key").item(14),
    h: document.getElementsByClassName("quordle-key").item(15),
    j: document.getElementsByClassName("quordle-key").item(16),
    k: document.getElementsByClassName("quordle-key").item(17),
    l: document.getElementsByClassName("quordle-key").item(18),

    backspace: document.getElementsByClassName("quordle-key").item(19),
    z: document.getElementsByClassName("quordle-key").item(20),
    x: document.getElementsByClassName("quordle-key").item(21),
    c: document.getElementsByClassName("quordle-key").item(22),
    v: document.getElementsByClassName("quordle-key").item(23),
    b: document.getElementsByClassName("quordle-key").item(24),
    n: document.getElementsByClassName("quordle-key").item(25),
    m: document.getElementsByClassName("quordle-key").item(26),
    enter: document.getElementsByClassName("quordle-key").item(27),
};

let alphabets = new Set();
Object.keys(keyboard)
    .filter((el) => el !== "backspace" && el !== "enter")
    .forEach((char) => alphabets.add(char));

class Solution {
    constructor(name = undefined) {
        this.words = [...words];
        this.length = 5;
        this.name = name;
        this.misplaced_letters = [];
        if (name) {
            this.getDomBoard();
        }
        this.init();
    }

    init() {
        this.word_information = [];
        for (let i = 0; i < this.length; i++) {
            this.word_information.push({
                possible_alphabets: new Set(alphabets),
            });
        }
    }

    getDomBoard() {
        this.board = document.querySelectorAll(
            `[aria-label="${this.name}"]`
        )[0];
        this.rows = this.board.children;
    }

    syncWithDOM() {
        Array.prototype.slice.call(this.rows).forEach((row) => {
            let cells = row.children;
            Array.prototype.slice.call(cells).forEach((cell, index) => {
                if (cell.classList.contains("bg-gray-200")) {
                    let char = cell.children[0].textContent.toLowerCase();
                    if(this.misplaced_letters.includes(char)){
                        this.word_information[index].possible_alphabets.delete(
                            char
                        );
                    }else{
                        this.word_information.forEach((char_information) => {
                            char_information.possible_alphabets.delete(char);
                        });
                    }
                } else if (cell.classList.contains("bg-box-diff")) {
                    let char = cell.children[0].textContent.toLowerCase();
                    this.misplaced_letters.push(char)
                    this.word_information[index].possible_alphabets.delete(
                        char
                    );
                } else if (cell.classList.contains("bg-box-correct")) {
                    let char = cell.children[0].textContent.toLowerCase();
                    let temp_object = this.word_information[index];
                    this.word_information[index] = {
                        status: "known",
                        char: char,
                        possible_alphabets: temp_object.possible_alphabets,
                    };
                }
            });
        });
    }

    filterPossibleWords() {
        this.words = this.words.filter((word) => {
            let letters = word.split("");
            let validity = true;
            let information = this.word_information;
            for (let i = 0; i < this.length; i++) {
                if (information[i].status === "known") {
                    if (information[i].char !== letters[i]) {
                        validity = false;
                        break;
                    }
                } else {
                    if (!information[i].possible_alphabets.has(letters[i])) {
                        validity = false;
                        break;
                    }
                }
            }
            return validity;
        });
    }
}

function typeWord(word) {
    for (let i = 0; i < word.length; i++) {
        const element = word[i];
        keyboard[element].click();
    }
    keyboard.enter.click();
}

function endGame(){
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
    typeWord('heave')
}

function getRandomWordFromList(list) {
    return list[Math.floor(0 + Math.random() * list.length)];
}

let b1 = new Solution("Game Board 1");
let b2 = new Solution("Game Board 2");
let b3 = new Solution("Game Board 3");
let b4 = new Solution("Game Board 4");

let boards = [b1, b2, b3, b4];

typeWord("salet");
typeWord("adieu");

boards.forEach((board) => {
    board.syncWithDOM();
    board.filterPossibleWords();
});

for (let i = 0; i < 15; i++) {
    let mostInfoBoard = boards[0];
    boards.forEach((board) => {
        if (board.words.length < mostInfoBoard.words.length) {
            mostInfoBoard = board;
        }
    });
    lg(mostInfoBoard, "asdasd");
    let word = getRandomWordFromList(mostInfoBoard.words);
    lg(word);
    typeWord(word);

    boards.forEach((board) => {
        board.syncWithDOM();
        board.filterPossibleWords();
    });
    lg(boards)
    boards = boards.filter((board) => {
        let number_of_known_characters = 0;
        board.word_information.forEach((char_information) => {
            if (char_information.status === "known") {
                number_of_known_characters++;
            }
        });

        if (number_of_known_characters === 5) {
            return false;
        }
        return true;
    });
}
