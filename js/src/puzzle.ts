import { Puzzle } from "./shared/puzzle";
import { Settings } from "./shared/settings";

import p404 from "./shared/404.json";

const createErrorDiv = (message: string) => {
    document.querySelector('.puzzleArea').removeChild(document.querySelector('.loadingZone'));
    const div = document.createElement('div');
    div.innerHTML = message;
    document.querySelector('.puzzleArea').appendChild(div);
}

const main = async () => {
    const puzzleId = document.URL.split('/').at(-1);
    const res = await fetch(`/api/puzzle/${puzzleId}`).catch(e => {
        createErrorDiv("Der Server antwortet nicht.");
    });
    if(!res) return;
    let data = null;
    switch(res.status) {
        case 200:
            data = await res.json();
            break;
        case 404:
            data = p404;
            break;
        case 501:
            createErrorDiv("Ein Server-Fehler ist aufgetreten.");
            return;
        default:
            createErrorDiv("Ein unbekannter Fehler ist aufgetreten.");
            return;
    }
    const crossword = new Puzzle(data);
    try {
        const saveState = window.localStorage.getItem(`save-state-${puzzleId}`);
        if(saveState) {
            crossword.importState(saveState);
        }
    } catch(e) {
        console.warn('Error accessing local storage')
    }
    crossword.addEventListener('change', () => {
        try {
            window.localStorage.setItem(`save-state-${puzzleId}`, crossword.exportState());
        } catch(e) {
            console.warn('Error accessing local storage')
        }
    })
    if(data.title) document.querySelector('h1').textContent = data.title;
    document.querySelector('.puzzleArea').removeChild(document.querySelector('.loadingZone'));
    document.querySelector('.puzzleArea').appendChild(crossword.render());
    document.querySelector('.hintArea').appendChild(crossword.renderHintSection());
    document.querySelector('#autocheck').addEventListener('change', (e: Event) => {
        if((e.target as HTMLInputElement).checked) {
            crossword.checkCells();
            Settings.autocheck = true;
        } else {
            Settings.autocheck = false;
        }
    });
    document.querySelector('#check').addEventListener('click', crossword.checkCells);
    document.querySelector('#restart').addEventListener('click', crossword.restart);
    const wrongDialog = document.querySelector('#wrongAlert') as HTMLDialogElement;
    document.querySelector('#wrongAlert>button').addEventListener('click', () => wrongDialog.close());
    const correctDialog = document.querySelector('#correctAlert') as HTMLDialogElement;
    document.querySelector('#correctAlert>button').addEventListener('click', () => correctDialog.close());
    adjustCrosswordSize(crossword);
    window.addEventListener('resize', () => adjustCrosswordSize(crossword));
}

const findRuleIndex = (selector: string) => {
    for(let i = 0; i < document.styleSheets[0].cssRules.length; i++) {
        const rules = document.styleSheets[0].cssRules[i];
        if(rules.cssText.includes(selector)) return i;
    }
    return -1;
}

const adjustCrosswordSize = (puzzle: Puzzle) => {
    const area = document.querySelector('.puzzleArea');
    const cellSize = Math.max(30, Math.min(60, Math.min(area.clientWidth / puzzle.width, area.clientHeight / puzzle.height)));
    const i = findRuleIndex('td.size');
    if(i >= 0) {
        document.styleSheets[0].deleteRule(i);
        document.styleSheets[0].insertRule(`td.size { width: ${cellSize}px; height: ${cellSize}px; }`);
    }
    const j = findRuleIndex('input.size');
    if(j >= 0) {
        document.styleSheets[0].deleteRule(j);
        document.styleSheets[0].insertRule(`input.size { font-size: ${cellSize * 0.75}px; }`);
    }
    const k = findRuleIndex('span.size');
    if(k >= 0) {
        document.styleSheets[0].deleteRule(k);
        document.styleSheets[0].insertRule(`span.size { font-size: ${cellSize * 0.25}px; }`);
    }
}

main();