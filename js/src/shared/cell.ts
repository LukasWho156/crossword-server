import { Puzzle } from "./puzzle";
import { Settings } from "./settings";

const LIGHT_OUTLINE = "1px";
const HEAVY_OUTLINE = "3px";

type CellInfo = {
    target: Cell;
    repeated?: boolean;
    targetX?: number;
    targetY?: number;
}

class Cell extends EventTarget {
    
    readonly x: number;
    readonly y: number;
    readonly solution: string;

    private clue: number;
    private connections: number;

    get clueNumber() {
        return this.clue;
    }

    get isClue() {
        return !!this.clue;
    }

    get value() {
        return this.input.value;
    }

    set value(v: string) {
        this.input.value = v;
    }

    private readonly element: HTMLElement;
    private readonly input: HTMLInputElement;

    constructor(x: number, y: number, solution: string) {
        super();
        this.x = x;
        this.y = y;
        this.solution = solution;
        this.connections = 0;

        this.element = document.createElement('td');
        this.input = document.createElement('input');
    }

    private updateContents = (e: InputEvent) => {
        const input = e.target as HTMLInputElement;
        if(e.inputType !== 'insertText') {
            this.input.classList.remove('correct', 'wrong');
            return;
        }
        if(!e.data.match(/^[A-Za-z]$/)) {
            if(input.value.length > e.data.length) {
                input.value = input.value[0];
            } else {
                input.value = "";
            }
            return;
        }
        this.input.classList.remove('correct', 'wrong');
        input.value = e.data.toUpperCase();
        if(Settings.autocheck) {
            this.check();
        }
        this.dispatchEvent(new CustomEvent<CellInfo>('filled', {detail: {target: this}}));
    }

    private onFocus = (e: InputEvent) => {
        this.dispatchEvent(new CustomEvent<CellInfo>('clicked', {detail: {target: this, repeated: false}}));
    }

    private onBlur = () => {
        this.dispatchEvent(new CustomEvent<CellInfo>('blur', {detail: {target: this}}));
    }

    private onMouseDown = () => {
        if(document.activeElement === this.input) {
            this.dispatchEvent(new CustomEvent<CellInfo>('clicked', {detail: {target: this, repeated: true}}))
        }
    }

    private onMouseUp = () => {
        this.dispatchEvent(new CustomEvent<CellInfo>('mouseup', {detail: {target: this}}));
    }

    private onMouseEnter = (e: MouseEvent) => {
        if((e.buttons & 1) > 0) {
            this.dispatchEvent(new CustomEvent<CellInfo>('dragged', {detail: {target: this}}));
        }
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if(e.code === 'Tab') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('filled', {detail: {target: this}}));
        }
        if(e.code === 'Backspace' && this.input.value === '') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('retract', {detail: {target: this}}));
        }
        if(e.code === 'ArrowLeft') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('move', {detail: {target: this, targetX: this.x - 1, targetY: this.y}}))
        }
        if(e.code === 'ArrowRight') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('move', {detail: {target: this, targetX: this.x + 1, targetY: this.y}}))
        }
        if(e.code === 'ArrowUp') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('move', {detail: {target: this, targetX: this.x, targetY: this.y - 1}}))
        }
        if(e.code === 'ArrowDown') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent<CellInfo>('move', {detail: {target: this, targetX: this.x, targetY: this.y + 1}}))
        }
    }

    public markAsClue = (clue: number) => {
        this.clue = clue;
    }

    public render = () => {

        this.element.className = 'size';
        this.element.style.borderWidth = HEAVY_OUTLINE;
        if((this.connections & 0b1) > 0) {
            this.element.style.borderLeftWidth = LIGHT_OUTLINE;
        }
        if((this.connections & 0b10) > 0) {
            this.element.style.borderRightWidth = LIGHT_OUTLINE;
        }
        if((this.connections & 0b100) > 0) {
            this.element.style.borderTopWidth = LIGHT_OUTLINE;
        }
        if((this.connections & 0b1000) > 0) {
            this.element.style.borderBottomWidth = LIGHT_OUTLINE;
        }

        if(this.isClue) {
            const clueSpan = document.createElement('span');
            clueSpan.className = 'clue size';
            clueSpan.innerHTML = this.clue.toFixed(0);
            this.element.appendChild(clueSpan);
        }

        this.input.setAttribute('type', 'text');
        this.input.setAttribute('autocomplete', 'off');
        this.input.className = 'size';
        this.input.addEventListener('mousedown', this.onMouseDown);
        this.input.addEventListener('mouseup', this.onMouseUp);
        this.input.addEventListener('mouseenter', this.onMouseEnter);
        this.input.addEventListener('focus', this.onFocus);
        this.input.addEventListener('blur', this.onBlur);
        this.input.addEventListener('input', this.updateContents);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.element.appendChild(this.input);

        return this.element;
    }

    public addConnection = (c: number) => {
        this.connections += c;
    }

    public resetConnections = () => {
        this.connections = 0;
    }

    public focus = () => {
        this.input.focus();
    }

    public clear = () => {
        this.input.classList.remove('correct', 'wrong');
        this.input.value = '';
    }

    public select = () => {
        this.input.classList.add('selected');
    }

    public deselect = () => {
        this.input.classList.remove('selected');
    }

    public check = () => {
        if(!this.isFilled) {
            this.input.classList.remove('correct', 'wrong');
            return;
        }
        if(this.isCorrect) {
            this.input.classList.add('correct');
        } else {
            this.input.classList.add('wrong');
        }
    }

    get isFilled() {
        return this.input.value.length > 0;
    }

    get isCorrect() {
        return this.input.value === this.solution;
    }

}

export { CellInfo, Cell }