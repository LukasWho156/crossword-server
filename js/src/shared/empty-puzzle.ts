import { Cell, CellInfo } from "./cell";
import { PuzzleData } from "./puzzle";
import { Word, WordData } from "./word";

class EmptyPuzzle extends EventTarget {

    public width;
    public height;
    private cells: Cell[];
    private currentCell: Cell;
    private currentWordData: WordData;
    private currentWordDirection: 'v' | 'h';
    private horizontalWords: Word[];
    private verticalWords: Word[];

    constructor(data: {width: number, height: number} | PuzzleData) {
        super();

        this.width = data.width;
        this.height = data.height;
        this.cells = [];
        this.currentCell = null;
        this.currentWordData = null;
        this.currentWordDirection = null;
        this.horizontalWords = [];
        this.verticalWords = [];

        const pd = data as PuzzleData;

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const c = this.createCell(x, y);
                if(pd.solution) {
                    const letter = pd.solution[y][x];
                    if(letter !== '.') {
                        c.value = letter;
                    }
                }
            }
        }

        if(pd.clues) {
            for(let y = 0; y < this.height; y++) {
                for(let x = 0; x < this.width; x++) {
                    const hWord = pd.clues.horizontal.find(w => w.x === x && w.y === y);
                    const vWord = pd.clues.vertical.find(w => w.x === x && w.y === y);
                    if(hWord || vWord) {
                        //cell.markAsClue(curClue);
                        if(hWord) {
                            this.horizontalWords.push(new Word(this, 0, hWord, 'h'));
                        }
                        if(vWord) {
                            this.verticalWords.push(new Word(this, 0, vWord, 'v'));
                        }
                        //curClue++;
                    }
                }
            }
        }
        
    }

    public render = () => {
        this.cells.forEach(c => c.resetConnections());
        this.horizontalWords.forEach(w => w.initCells(this, w.wordData.x, w.wordData.y, 'h', w.wordData.length));
        this.verticalWords.forEach(w => w.initCells(this, w.wordData.x, w.wordData.y, 'v', w.wordData.length));
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

    public findCell = (x: number, y: number) => {
        for(const cell of this.cells) {
            if(cell.x === x && cell.y === y) {
                return cell;
            }
        }
        return null;
    }

    private createCell(x: number, y: number) {
        const cell = new Cell(x, y, "?");
        cell.addEventListener('clicked', this.markAsCurrent);
        cell.addEventListener('mouseup', this.finishSelection);
        cell.addEventListener('blur', this.unmark);
        cell.addEventListener('dragged', this.dragOnto);
        cell.addEventListener('filled', this.advance);
        cell.addEventListener('retract', this.retract);
        cell.addEventListener('move', this.move);
        this.cells.push(cell);
        return cell;
    }

    public addBottomRow = () => {
        this.height++;
        for(let x = 0; x < this.width; x++) {
            this.createCell(x, this.height - 1);
        }
    }

    public removeBottomRow = () => {
        this.height--;
        this.cells = this.cells.filter(c => c.y < this.height);
        this.verticalWords = this.verticalWords.filter(w => w.wordData.y + w.wordData.length < this.height);
        this.horizontalWords = this.horizontalWords.filter(w => w.wordData.y < this.height);
    }

    public addTopRow = () => {
        this.height++;
        this.cells = this.cells.map(c => {
            const newCell = this.createCell(c.x, c.y + 1);
            newCell.value = c.value;
            return newCell;
        });
        for(let x = 0; x < this.width; x++) {
            this.createCell(x, 0);
        }
        this.verticalWords = this.verticalWords.map(w => new Word(this, 0, {... w.wordData, y: w.wordData.y + 1 }, 'v'));
        this.horizontalWords = this.horizontalWords.map(w => new Word(this, 0, {... w.wordData, y: w.wordData.y + 1 }, 'h'));
    }

    public removeTopRow = () => {
        this.height--;
        this.cells = this.cells.filter(c => c.y > 0);
        this.cells = this.cells.map(c => {
            const newCell = this.createCell(c.x, c.y - 1);
            newCell.value = c.value;
            return newCell;
        });
        this.verticalWords = this.verticalWords.filter(w => w.wordData.y > 0)
            .map(w => new Word(this, 0, {... w.wordData, y: w.wordData.y - 1 }, 'v'));
        this.horizontalWords = this.horizontalWords.filter(w => w.wordData.y > 0)
            .map(w => new Word(this, 0, {... w.wordData, y: w.wordData.y - 1 }, 'h'));
    }

    public addRightRow = () => {
        this.width++;
        for(let y = 0; y < this.height; y++) {
            this.createCell(this.width - 1, y);
        }
    }

    public removeRightRow = () => {
        this.width--;
        this.cells = this.cells.filter(c => c.x < this.width);
        this.verticalWords = this.verticalWords.filter(w => w.wordData.x < this.width);
        this.horizontalWords = this.horizontalWords.filter(w => w.wordData.x + w.wordData.length <= this.width);
    }

    public addLeftRow = () => {
        this.width++;
        this.cells = this.cells.map(c => {
            const newCell = this.createCell(c.x + 1, c.y);
            newCell.value = c.value;
            return newCell;
        });
        for(let y = 0; y < this.height; y++) {
            this.createCell(0, y);
        }
        this.verticalWords = this.verticalWords.map(w => new Word(this, 0, {... w.wordData, x: w.wordData.x + 1 }, 'v'));
        this.horizontalWords = this.horizontalWords.map(w => new Word(this, 0, {... w.wordData, x: w.wordData.x + 1 }, 'v'));
    }

    public removeLeftRow = () => {
        this.width--;
        this.cells = this.cells.filter(c => c.x > 0);
        this.cells = this.cells.map(c => {
            const newCell = this.createCell(c.x - 1, c.y);
            newCell.value = c.value;
            return newCell;
        });
        this.verticalWords = this.verticalWords.filter(w => w.wordData.x > 0)
            .map(w => new Word(this, 0, {... w.wordData, x: w.wordData.x - 1 }, 'v'));
        this.horizontalWords = this.horizontalWords.filter(w => w.wordData.x > 0)
            .map(w => new Word(this, 0, {... w.wordData, x: w.wordData.x - 1 }, 'h'));
    }

    private advance = (e: CustomEvent<CellInfo>) => {
        let cell = e.detail.target;
        const x = cell.x;
        const y = cell.y;
        if(x < this.width - 1) {
            cell = this.findCell(x + 1, y);
        } else {
            if(y < this.height - 1) {
                cell = this.findCell(0, y + 1);
            } else {
                cell = this.findCell(0, 0);
            }
        }
        cell.focus();
    }

    private retract = (e: CustomEvent<CellInfo>) => {
        let cell = e.detail.target;
        const x = cell.x;
        const y = cell.y;
        if(x > 0) {
            cell = this.findCell(x - 1, y);
        } else {
            if(y > 0) {
                cell = this.findCell(this.width - 1, y - 1);
            } else {
                cell = this.findCell(this.width - 1, this.height - 1);
            }
        }
        cell.clear();
        cell.focus();
    }

    private move = (e: CustomEvent<CellInfo>) => {
        const cell = this.findCell(e.detail.targetX, e.detail.targetY);
        if(cell) cell.focus();
    }

    private markAsCurrent = (e: CustomEvent<CellInfo>) => {
        this.currentCell = e.detail.target;
    }

    private unmark = () => {
        this.cells.forEach(c => c.deselect());
        this.currentCell = null;
    }

    private finishSelection = (e: CustomEvent<CellInfo>) => {
        if(!this.currentCell) return;
        const targetCell = e.detail.target;
        let word = "";
        let wordData: WordData = {
            x: this.currentCell.x,
            y: this.currentCell.y,
            length: 0,
            clue: "",
        };
        if(targetCell.x === wordData.x && targetCell.y === wordData.y) return;
        if(targetCell.x === wordData.x) {
            for(let y = wordData.y; y <= targetCell.y; y++) {
                const cell = this.findCell(targetCell.x, y);
                if(!cell.value.match(/^[A-Z]$/)) return;
                word += cell.value;
            }
            wordData.length = targetCell.y - wordData.y + 1;
            this.currentWordDirection = 'v';
        }
        if(targetCell.y === wordData.y) {
            for(let x = wordData.x; x <= targetCell.x; x++) {
                const cell = this.findCell(x, targetCell.y);
                if(!cell.value.match(/^[A-Z]$/)) return;
                word += cell.value;
            }
            wordData.length = targetCell.x - wordData.x + 1;
            this.currentWordDirection = 'h';
        }
        if(word === "") return;
        this.currentWordData = wordData;
        this.dispatchEvent(new CustomEvent("wordSelected", { detail: { word: word }}))
    }

    private dragOnto = (e: CustomEvent<CellInfo>) => {
        if(!this.currentCell) return;
        this.cells.forEach(c => c.deselect());
        const targetCell = e.detail.target;
        if(targetCell.x === this.currentCell.x) {
            for(let y = this.currentCell.y; y <= targetCell.y; y++) {
                const cell = this.findCell(targetCell.x, y);
                cell.select();
            }
        }
        if(targetCell.y === this.currentCell.y) {
            for(let x = this.currentCell.x; x <= targetCell.x; x++) {
                const cell = this.findCell(x, targetCell.y);
                cell.select();
            }
        }
    }

    public addClue = (clue: string) => {
        if(!this.currentWordData) return;
        this.currentWordData.clue = clue;
        const word = new Word(this, 0, this.currentWordData, this.currentWordDirection);
        if(this.currentWordDirection === 'h') this.horizontalWords.push(word);
        if(this.currentWordDirection === 'v') this.verticalWords.push(word);
    }

    private selectWord = (word: Word) => {
        this.horizontalWords.forEach(w => w.deselect());
        this.verticalWords.forEach(w => w.deselect());
        this.cells.forEach(c => c.deselect());
        word.select(false);
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
                w.addEventListener('selected', (e: CustomEvent) => this.selectWord(w));
                w.addEventListener('rightclicked', (e: CustomEvent) => {
                    this.horizontalWords = this.horizontalWords.filter(w2 => w2 !== w);
                    this.verticalWords = this.verticalWords.filter(w2 => w2 !== w);
                    this.dispatchEvent(new CustomEvent('rerender'));
                });
                section.appendChild(w.renderHint());
            }
        }
        if(this.verticalWords.length > 0) {
            const heading = document.createElement('div');
            heading.className = 'hintHeading';
            heading.innerHTML = 'Vertikal:';
            section.appendChild(heading);
            for(const w of this.verticalWords) {
                w.addEventListener('selected', (e: CustomEvent) => this.selectWord(w))
                section.appendChild(w.renderHint());
            }
        }
        return section;
    }

    public createDownloadData = () => {
        const solution = [];
        for(let y = 0; y < this.height; y++) {
            let line = "";
            for(let x = 0; x < this.width; x++) {
                const value = this.findCell(x, y).value;
                line += value.match(/^[A-Z]$/) ? value : '.';
            }
            solution.push(line);
        };
        return {
            width: this.width,
            height: this.height,
            solution: solution,
            clues: {
                horizontal: this.horizontalWords.map(w => w.wordData),
                vertical: this.verticalWords.map(w => w.wordData),
            }
        }
    }

}

export { EmptyPuzzle };