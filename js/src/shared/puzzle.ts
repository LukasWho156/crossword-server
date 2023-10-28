import { Cell, CellInfo } from "./cell";
import { Word, WordData } from "./word";

type PuzzleData = {
    width: number,
    height: number,
    solution: string[],
    clues: {
        horizontal: WordData[],
        vertical: WordData[],
    },
}

class Puzzle extends EventTarget {

    readonly width: number;
    readonly height: number;
    private cells: Cell[];

    private horizontalWords: Word[];
    private verticalWords: Word[];
    private mode: 'h' | 'v';
    private curWord: Word;

    private alertOpened: boolean = false;

    constructor(data: PuzzleData) {

        super();

        this.width = data.width;
        this.height = data.height;
        this.cells = [];

        for(let x = 0; x < data.width; x++) {
            for(let y = 0; y < data.height; y++) {
                if(data.solution[y][x].match(/[A-Z]/)) {
                    this.cells.push(new Cell(x, y, data.solution[y][x]));
                }
            }
        }

        this.horizontalWords = [];
        this.verticalWords = [];

        let curClue = 1;
        for(let y = 0; y < data.height; y++) {
            for(let x = 0; x < data.width; x++) {
                const cell = this.findCell(x, y);
                if(!cell) continue;
                cell.addEventListener('clicked', this.onCellClick);
                cell.addEventListener('filled', this.advance);
                cell.addEventListener('retract', this.retract);
                cell.addEventListener('move', this.move);
                cell.addEventListener('blur', () => {
                    if(this.curWord)  {
                        this.curWord.deselect();
                        this.curWord = null;
                    }
                });
                const hWord = data.clues.horizontal.find(w => w.x === x && w.y === y);
                const vWord = data.clues.vertical.find(w => w.x === x && w.y === y);
                if(hWord || vWord) {
                    cell.markAsClue(curClue);
                    if(hWord) {
                        this.horizontalWords.push(new Word(this, curClue, hWord, 'h'));
                    }
                    if(vWord) {
                        this.verticalWords.push(new Word(this, curClue, vWord, 'v'));
                    }
                    curClue++;
                }
            }
        }

    }

    public render = () => {
        const table = document.createElement('table');
        for(let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
            table.appendChild(row);
            for(let x = 0; x < this.width; x++) {
                const cell = this.findCell(x, y);
                if(cell) {
                    row.appendChild(cell.render());
                } else {
                    row.appendChild(document.createElement('td'));
                }
            }
        }
        return table;
    }

    public renderHintSection = () => {
        const section = document.createElement('div');
        section.className = 'hintSection';
        if(this.horizontalWords.length > 0) {
            const heading = document.createElement('div');
            heading.className = 'hintHeading';
            heading.innerHTML = 'Horizontal:';
            section.appendChild(heading);
            for(const w of this.horizontalWords) {
                w.addEventListener('selected', (e: CustomEvent) => this.selectWord(w, true))
                section.appendChild(w.renderHint());
            }
        }
        if(this.verticalWords.length > 0) {
            const heading = document.createElement('div');
            heading.className = 'hintHeading';
            heading.innerHTML = 'Vertikal:';
            section.appendChild(heading);
            for(const w of this.verticalWords) {
                w.addEventListener('selected', (e: CustomEvent) => this.selectWord(w, true))
                section.appendChild(w.renderHint());
            }
        }
        return section;
    }

    public findCell = (x: number, y: number) => {
        for(const cell of this.cells) {
            if(cell.x === x && cell.y === y) {
                return cell;
            }
        }
        return null;
    }

    public onCellClick = (e: CustomEvent<CellInfo>) => {
        let hContainer;
        let vContainer;
        for(const w of this.horizontalWords) {
            if(w.containsCell(e.detail.target)) {
                hContainer = w;
            }
        }
        for(const w of this.verticalWords) {
            if(w.containsCell(e.detail.target)) {
                vContainer = w;
            }
        }
        if(this.mode === 'h' || !this.mode) {
            if(hContainer) {
                if(hContainer === this.curWord) {
                    if(vContainer && e.detail.repeated) {
                        this.selectWord(vContainer);
                    }
                } else {
                    this.selectWord(hContainer);
                }
            } else if(vContainer) {
                this.selectWord(vContainer);
            }
        } else {
            if(vContainer) {
                if(vContainer === this.curWord) {
                    if(hContainer && e.detail.repeated) {
                        this.selectWord(hContainer);
                    }
                } else {
                    this.selectWord(vContainer);
                }
            } else if(hContainer) {
                this.selectWord(hContainer);
            }
        }
    }

    private selectWord = (word: Word, selectFirstCell?: boolean) => {
        if(this.curWord) this.curWord.deselect();
        this.curWord = word;
        this.mode = word.direction;
        word.select(selectFirstCell);
    }

    private advance = (e: CustomEvent<CellInfo>) => {
        this.dispatchEvent(new CustomEvent('change'));
        if(!this.curWord) return;
        if(!this.curWord.advance(e.detail.target)) {
            if(this.mode === 'h') {
                const i = this.horizontalWords.findIndex(w => w === this.curWord);
                if(i === this.horizontalWords.length - 1) {
                    this.selectWord(this.verticalWords[0], true);
                } else {
                    this.selectWord(this.horizontalWords[i + 1], true);
                }
            } else {
                const i = this.verticalWords.findIndex(w => w === this.curWord);
                if(i === this.verticalWords.length - 1) {
                    this.selectWord(this.horizontalWords[0], true);
                } else {
                    this.selectWord(this.verticalWords[i + 1], true);
                }
            }
        }
        this.checkForCompletition();
    }

    private checkForCompletition() {
        for(const cell of this.cells) {
            if(!cell.isFilled) return;
        }
        for(const cell of this.cells) {
            if(!cell.isCorrect) {
                if(!this.alertOpened) {
                    (document.querySelector('#wrongAlert') as HTMLDialogElement).showModal();
                    this.alertOpened = true;
                }
                return;
            }
        }
        (document.querySelector('#correctAlert') as HTMLDialogElement).showModal();
    }

    private retract = (e: CustomEvent<CellInfo>) => {
        this.dispatchEvent(new CustomEvent('change'));
        if(!this.curWord) return;
        this.curWord.retract(e.detail.target);
    }

    private move = (e: CustomEvent<CellInfo>) => {
        const cell = this.findCell(e.detail.targetX, e.detail.targetY);
        if(cell) cell.focus();
    }

    public restart = () => {
        for(const cell of this.cells) {
            cell.clear();
        }
    }

    public checkCells = () => {
        for(const cell of this.cells) {
            cell.check();
        }
    }

    public exportState = () => {
        return this.cells.reduce((prev, cur) => {
            if(!cur.isFilled) {
                return prev + '.';
            }
            return prev + cur.value;
        }, '');
    }

    public importState = (state: string) => {
        if(state.length != this.cells.length) {
            return;
        }
        if(state.match(/^[A-Z\.]*$/).length === 0) {
            return;
        }
        this.cells.forEach((cell, i) => {
            const letter = state[i];
            if(letter === '.') {
                cell.clear();
                return;
            }
            cell.value = letter;
        })
    }

}

export { Puzzle, PuzzleData }