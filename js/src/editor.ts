import { EmptyPuzzle } from "./shared/empty-puzzle";
import { PuzzleData } from "./shared/puzzle";

let puzzle = new EmptyPuzzle({ width: 10, height: 10 });

const main = async () => {

    puzzle.addEventListener('rerender', rerender);
    
    // clue dialog
    const clueDialog = document.querySelector('#clueDialog') as HTMLDialogElement;
    puzzle.addEventListener('wordSelected', (e: CustomEvent) => {
        document.querySelector('#clueDialogWord').textContent = e.detail.word;
        clueDialog.showModal();
    });
    document.querySelector('#clueDialogCancel').addEventListener('click', () => clueDialog.close());
    document.querySelector('#clueDialogForm').addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        let tf = form.elements[0] as HTMLInputElement;
        puzzle.addClue(tf.value);
        clueDialog.close();
        rerender();
    });

    // new puzzle
    document.querySelector('#new').addEventListener('click', () => {
        puzzle = new EmptyPuzzle({ width: 10, height: 10 });
        puzzle.addEventListener('rerender', rerender);
        puzzle.addEventListener('wordSelected', (e: CustomEvent) => {
            document.querySelector('#clueDialogWord').textContent = e.detail.word;
            clueDialog.showModal();
        });
        rerender();
    })

    // import
    const uploadDialog = document.querySelector('#importDialog') as HTMLDialogElement;
    document.querySelector('#import').addEventListener('click', () => uploadDialog.showModal());
    document.querySelector('#importDialogCancel').addEventListener('click', () => uploadDialog.close());
    document.querySelector('#importDialogForm').addEventListener('submit', async (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const upload = form.elements[0] as HTMLInputElement;
        const file = upload.files[0];
        const reader = file.stream().getReader();
        let contents = '';
        let decoder = new TextDecoder();
        while(true) {
            let res = await reader.read();
            if(res.done === true) {
                break;
            }
            contents += decoder.decode(res.value);
            //console.log(contents);
        }
        try {
            puzzle = new EmptyPuzzle(JSON.parse(contents));
            puzzle.addEventListener('rerender', rerender);
            puzzle.addEventListener('wordSelected', (e: CustomEvent) => {
                document.querySelector('#clueDialogWord').textContent = e.detail.word;
                clueDialog.showModal();
            });
            rerender();
            uploadDialog.close();
        } catch(e) {
            console.error(e);
        }
    });

    // export
    document.querySelector('#export').addEventListener('click', () => {
        const puzzleData: PuzzleData = puzzle.createDownloadData();
        const saveData = {
            title: document.querySelector('h1').textContent,
            ...puzzleData,
        }
        let download = document.createElement('a');
        download.download = "puzzle.json";
        download.href = URL.createObjectURL(new Blob([JSON.stringify(saveData)]));
        download.click();
        download.remove();
    })

    // publish
    const publishDialog = document.querySelector('#publishDialog') as HTMLDialogElement;
    document.querySelector('#publishDialogClose').addEventListener('click', () => publishDialog.close());
    document.querySelector('#publish').addEventListener('click', () => {
        const puzzleData: PuzzleData = puzzle.createDownloadData();
        const saveData = {
            title: document.querySelector('h1').textContent,
            ...puzzleData,
        }
        fetch('/api/publish', {
            method: 'POST',
            body: JSON.stringify(saveData),
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            if(res.status !== 200) {
                throw new Error("bad response");
            }
            return res.text();
        }).then(id => {
            let curUrl = new URL(document.URL);
            let link = `${curUrl.protocol}//${curUrl.hostname}:${curUrl.port}/puzzle/${id}`;
            console.log(link);
            let e = document.querySelector('#newPuzzleLink') as HTMLAnchorElement;
            e.textContent = link;
            e.href = link;
            publishDialog.showModal();
        }).catch(e => {
            console.error(e);
        })
    });

    // change puzzle dimensions
    document.querySelector('#resizePlusBottom').addEventListener('click', () => {
        puzzle.addBottomRow();
        rerender();
    });
    document.querySelector('#resizeMinusBottom').addEventListener('click', () => {
        puzzle.removeBottomRow();
        rerender();
    });
    document.querySelector('#resizePlusTop').addEventListener('click', () => {
        puzzle.addTopRow();
        rerender();
    });
    document.querySelector('#resizeMinusTop').addEventListener('click', () => {
        puzzle.removeTopRow();
        rerender();
    });
    document.querySelector('#resizePlusRight').addEventListener('click', () => {
        puzzle.addRightRow();
        rerender();
    });
    document.querySelector('#resizeMinusRight').addEventListener('click', () => {
        puzzle.removeRightRow();
        rerender();
    });
    document.querySelector('#resizePlusLeft').addEventListener('click', () => {
        puzzle.addLeftRow();
        rerender();
    });
    document.querySelector('#resizeMinusLeft').addEventListener('click', () => {
        puzzle.removeLeftRow();
        rerender();
    });

    // add resize listener to scale the puzzle according to the screen size
    window.addEventListener('resize', adjustCrosswordSize);

    // initial render
    rerender();
}

const rerender = () => {
    document.querySelector('.puzzleArea').innerHTML = '';
    document.querySelector('.puzzleArea').appendChild(puzzle.render());
    document.querySelector('.hintArea').innerHTML = '';
    document.querySelector('.hintArea').appendChild(puzzle.renderHintSection());
    adjustCrosswordSize();
}

const findRuleIndex = (selector: string) => {
    for(let i = 0; i < document.styleSheets[0].cssRules.length; i++) {
        const rules = document.styleSheets[0].cssRules[i];
        if(rules.cssText.includes(selector)) return i;
    }
    return -1;
}

const adjustCrosswordSize = () => {
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