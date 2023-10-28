import { Cell } from "./cell";
import { EmptyPuzzle } from "./empty-puzzle";
import { Puzzle } from "./puzzle";

type WordData = {
    x: number,
    y: number,
    length: number,
    clue: string
};

class Word extends EventTarget {

    readonly number: number;
    readonly desc: string;
    readonly direction: 'h' | 'v';
    readonly wordData: WordData;

    private cells: Cell[];
    private readonly hintDiv: HTMLElement;

    constructor(puzzle: Puzzle | EmptyPuzzle, clue: number, data: WordData, direction: 'h' | 'v') {
        super();
        this.wordData = data;
        this.number = clue;
        this.desc = data.clue;
        this.direction = direction;
        this.cells = [];
        if(puzzle) this.initCells(puzzle, data.x, data.y, direction, data.length);
        this.hintDiv = document.createElement('div');
    }

    public initCells = (puzzle: Puzzle | EmptyPuzzle, startX: number, startY: number, dir: 'h' | 'v', length: number) => {
        this.cells = [];
        for(let i = 0; i < length; i++) {
            const x = startX + (dir === 'h' ? i : 0);
            const y = startY + (dir === 'v' ? i : 0);
            const cell = puzzle.findCell(x, y);
            this.cells.push(cell);
            if(i > 0) {
                cell.addConnection(dir === 'h' ? 0b1 : 0b100);
            }
            if(i < length - 1) {
                cell.addConnection(dir === 'h' ? 0b10 : 0b1000);
            }
        }
    }

    public renderHint = () => {
        this.hintDiv.className = 'clue';
        this.hintDiv.textContent = `${this.number}: ${this.desc}`;
        this.hintDiv.addEventListener('mousedown', this.onClick);
        this.hintDiv.addEventListener('contextmenu', this.onContextMenu);
        return this.hintDiv;
    }

    private onClick = () => {
        setTimeout(() => this.dispatchEvent(new CustomEvent('selected', {detail: {word: this}})));
    }

    private onContextMenu = (e: Event) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('rightclicked', {detail: {word: this}}))
    }

    public containsCell = (cell: Cell) => {
        for(const c of this.cells) {
            if(c === cell) {
                return true;
            }
        }
        return false;
    }

    public select = (focusFirstCell?: boolean) => {
        this.hintDiv.classList.add('selected');
        for(const c of this.cells) {
            c.select();
        }
        if(focusFirstCell) {
            this.cells[0].focus();
        }
    }

    public deselect = () => {
        this.hintDiv.classList.remove('selected');
        for(const c of this.cells) {
            c.deselect();
        }
    }

    public advance = (curCell: Cell) => {
        const i = this.cells.findIndex(c => c === curCell);
        if(i < 0) return false;
        if(i === this.cells.length - 1) {
            return false;
        }
        this.cells[i + 1].focus();
        return true;
    }

    public retract = (curCell: Cell) => {
        const i = this.cells.findIndex(c => c === curCell);
        if(i < 0) return false;
        if(i === 0) {
            return false;
        }
        this.cells[i - 1].clear();
        this.cells[i - 1].focus();
        return true;
    }

}

export { Word, WordData }