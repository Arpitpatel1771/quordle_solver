import { words } from "./words";

let original_words = [...words];

function lg(){
    console.log(...arguments)
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

let alphabets = new Set()
Object.keys(keyboard).filter(el=>el!=='backspace'&&el!=='enter').forEach(char=>alphabets.add(char))

class Solution {
    constructor(name=undefined) {
        this.words = words;
        this.length = 5;
        // this.known_letters = [-1, -1, -1, -1, -1];
        // this.blacklisted_letters = [];
        // this.misplaced_letters = [[], [], [], [], []];
        this.name = name
        if(name){
            this.getDomBoard()
        }
        this.init()
    }

    init(){
        this.word_information = []
        for(let i = 0; i < this.length; i++){
            this.word_information.push({
                possible_alphabets: alphabets
            })
        }
    }

    addBlacklistLetter(char) {
        if(!this.blacklisted_letters.includes(char) && !this.known_letters.includes(char) && !this.checkMisplacedLetter(char)){
            this.blacklisted_letters.push(char)
        }
        this.removeBlacklistedWords()
        return true
    }

    addBlacklistLetters() {
        [...arguments].forEach(char=>{
            this.addBlacklistLetter(char)
        })
        return true
    }

    removeBlacklistedWords() {
        this.blacklisted_letters.forEach((letter) => {
            this.words = this.words.filter(word=>{
                return !word.split('').includes(letter)
            })
        });
    }

    checkMisplacedLetter(char){
        let exists = false
        this.misplaced_letters.forEach(arr=>{
            arr.forEach(letter=>{
                if(letter===char){
                    exists = true
                }
            })
        })
        return exists
    }

    addKnownLetter(char, position){
        this.known_letters[position] = char.toLowerCase()
        this.removeWordsBasedOnKnownLetters()
        return true
    }

    removeWordsBasedOnKnownLetters(){
        this.words = this.words.filter(word=>{
            let letters = word.split('');
            let validity = true
            
            this.known_letters.forEach((known_letter, index)=>{
                if (known_letter === -1){
                    return
                }

                if (known_letter !== letters[index]){
                    validity = false
                }
            })

            return validity
        })
    }

    addMisplacedLetter(char, position){
        if(!this.misplaced_letters[position].includes(char.toLowerCase())){
            this.misplaced_letters[position].push(char.toLowerCase())
        }
        this.removeWordsBasedOnMisplacedLetters()
        return true
    }

    removeWordsBasedOnMisplacedLetters(){
        this.words = this.words.filter(word=>{
            let letters = word.split('');
            let validity = true

            for (let i = 0; i < this.misplaced_letters.length; i++){
                this.misplaced_letters[i].forEach((char)=>{
                    if(letters[i]===char){
                        validity = false
                        return
                    }
    
                    if(!letters.includes(char)){
                        validity = false
                        return
                    }
                })
            }
            
            return validity
        })
    }

    getDomBoard(){
        this.board = document.querySelectorAll(`[aria-label="${this.name}"]`)[0]
        this.rows = this.board.children
    }

    syncWithDOM(){
        let blacklisted = []
        let misplaced = []
        let known = []
        Array.prototype.slice.call(this.rows).forEach(row=>{
            let cells = row.children
            Array.prototype.slice.call(cells).forEach((cell,index)=>{
                if(cell.classList.contains("bg-gray-200")){
                    blacklisted.push(cell.children[0].textContent.toLowerCase())
                }else if(cell.classList.contains("bg-box-diff")){
                    misplaced.push({char: cell.children[0].textContent.toLowerCase(), index: index})
                }else if(cell.classList.contains("bg-box-correct")){
                    known.push({char: cell.children[0].textContent.toLowerCase(), index: index})
                }
            })
        })

        known.forEach(letter=>{
            this.addKnownLetter(
                letter.char,
                letter.index
            )
        })

        misplaced.forEach(letter=>{
            this.addMisplacedLetter(
                letter.char,
                letter.index
            )
        })

        blacklisted.forEach(letter=>{
            this.addBlacklistLetter(letter)
        })
    }
}



function typeWord(word) {
    // word = word.split('');
    for (let i = 0; i < word.length; i++) {
        const element = word[i];
        keyboard[element].click();
    }
    keyboard.enter.click();
}

function getRandomWordFromList(list) {
    return list[Math.floor(0 + Math.random()*(list.length))]
}

let b1 = new Solution("Game Board 1")
let b2 = new Solution("Game Board 2")
let b3 = new Solution("Game Board 3")
let b4 = new Solution("Game Board 4")

let boards = [b1, b2, b3, b4]

typeWord('serai')
typeWord('until')

boards.forEach(board=>board.syncWithDOM())


for(let i = 0;i < 15; i++){
    let mostInfoBoard = boards[0]
    boards.forEach(board=>{
        if(board.words.length < mostInfoBoard.words.length){
            mostInfoBoard = board
        }
    })
    lg(mostInfoBoard, 'asdasd')
    let word = getRandomWordFromList(mostInfoBoard.words)
    lg(word)
    typeWord(word)
    boards.forEach(board=>board.syncWithDOM())
    boards = boards.filter(board=>{
        if(board.known_letters.indexOf(-1)===-1){
            return false
        }
        return true
    })
}

