/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/editor.ts":
/*!***********************!*\
  !*** ./src/editor.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_empty_puzzle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/empty-puzzle */ \"./src/shared/empty-puzzle.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nlet puzzle = new _shared_empty_puzzle__WEBPACK_IMPORTED_MODULE_0__.EmptyPuzzle({ width: 10, height: 10 });\nconst main = () => __awaiter(void 0, void 0, void 0, function* () {\n    puzzle.addEventListener('rerender', rerender);\n    // clue dialog\n    const clueDialog = document.querySelector('#clueDialog');\n    puzzle.addEventListener('wordSelected', (e) => {\n        document.querySelector('#clueDialogWord').textContent = e.detail.word;\n        clueDialog.showModal();\n    });\n    document.querySelector('#clueDialogCancel').addEventListener('click', () => clueDialog.close());\n    document.querySelector('#clueDialogForm').addEventListener('submit', (e) => {\n        e.preventDefault();\n        let form = e.target;\n        let tf = form.elements[0];\n        puzzle.addClue(tf.value);\n        clueDialog.close();\n        rerender();\n    });\n    // new puzzle\n    document.querySelector('#new').addEventListener('click', () => {\n        puzzle = new _shared_empty_puzzle__WEBPACK_IMPORTED_MODULE_0__.EmptyPuzzle({ width: 10, height: 10 });\n        puzzle.addEventListener('rerender', rerender);\n        puzzle.addEventListener('wordSelected', (e) => {\n            document.querySelector('#clueDialogWord').textContent = e.detail.word;\n            clueDialog.showModal();\n        });\n        rerender();\n    });\n    // import\n    const uploadDialog = document.querySelector('#importDialog');\n    document.querySelector('#import').addEventListener('click', () => uploadDialog.showModal());\n    document.querySelector('#importDialogCancel').addEventListener('click', () => uploadDialog.close());\n    document.querySelector('#importDialogForm').addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {\n        e.preventDefault();\n        const form = e.target;\n        const upload = form.elements[0];\n        const file = upload.files[0];\n        const reader = file.stream().getReader();\n        let contents = '';\n        let decoder = new TextDecoder();\n        while (true) {\n            let res = yield reader.read();\n            if (res.done === true) {\n                break;\n            }\n            contents += decoder.decode(res.value);\n            //console.log(contents);\n        }\n        try {\n            puzzle = new _shared_empty_puzzle__WEBPACK_IMPORTED_MODULE_0__.EmptyPuzzle(JSON.parse(contents));\n            puzzle.addEventListener('rerender', rerender);\n            puzzle.addEventListener('wordSelected', (e) => {\n                document.querySelector('#clueDialogWord').textContent = e.detail.word;\n                clueDialog.showModal();\n            });\n            rerender();\n            uploadDialog.close();\n        }\n        catch (e) {\n            console.error(e);\n        }\n    }));\n    // export\n    document.querySelector('#export').addEventListener('click', () => {\n        const puzzleData = puzzle.createDownloadData();\n        const saveData = Object.assign({ title: document.querySelector('h1').textContent }, puzzleData);\n        let download = document.createElement('a');\n        download.download = \"puzzle.json\";\n        download.href = URL.createObjectURL(new Blob([JSON.stringify(saveData)]));\n        download.click();\n        download.remove();\n    });\n    // publish\n    const publishDialog = document.querySelector('#publishDialog');\n    document.querySelector('#publishDialogClose').addEventListener('click', () => publishDialog.close());\n    document.querySelector('#publish').addEventListener('click', () => {\n        const puzzleData = puzzle.createDownloadData();\n        const saveData = Object.assign({ title: document.querySelector('h1').textContent }, puzzleData);\n        fetch('/api/publish', {\n            method: 'POST',\n            body: JSON.stringify(saveData),\n            headers: { \"Content-Type\": \"application/json\" }\n        }).then(res => {\n            if (res.status !== 200) {\n                throw new Error(\"bad response\");\n            }\n            return res.text();\n        }).then(id => {\n            let curUrl = new URL(document.URL);\n            let link = `${curUrl.protocol}//${curUrl.hostname}:${curUrl.port}/puzzle/${id}`;\n            console.log(link);\n            let e = document.querySelector('#newPuzzleLink');\n            e.textContent = link;\n            e.href = link;\n            publishDialog.showModal();\n        }).catch(e => {\n            console.error(e);\n        });\n    });\n    // change puzzle dimensions\n    document.querySelector('#resizePlusBottom').addEventListener('click', () => {\n        puzzle.addBottomRow();\n        rerender();\n    });\n    document.querySelector('#resizeMinusBottom').addEventListener('click', () => {\n        puzzle.removeBottomRow();\n        rerender();\n    });\n    document.querySelector('#resizePlusTop').addEventListener('click', () => {\n        puzzle.addTopRow();\n        rerender();\n    });\n    document.querySelector('#resizeMinusTop').addEventListener('click', () => {\n        puzzle.removeTopRow();\n        rerender();\n    });\n    document.querySelector('#resizePlusRight').addEventListener('click', () => {\n        puzzle.addRightRow();\n        rerender();\n    });\n    document.querySelector('#resizeMinusRight').addEventListener('click', () => {\n        puzzle.removeRightRow();\n        rerender();\n    });\n    document.querySelector('#resizePlusLeft').addEventListener('click', () => {\n        puzzle.addLeftRow();\n        rerender();\n    });\n    document.querySelector('#resizeMinusLeft').addEventListener('click', () => {\n        puzzle.removeLeftRow();\n        rerender();\n    });\n    // add resize listener to scale the puzzle according to the screen size\n    window.addEventListener('resize', adjustCrosswordSize);\n    // initial render\n    rerender();\n});\nconst rerender = () => {\n    document.querySelector('.puzzleArea').innerHTML = '';\n    document.querySelector('.puzzleArea').appendChild(puzzle.render());\n    document.querySelector('.hintArea').innerHTML = '';\n    document.querySelector('.hintArea').appendChild(puzzle.renderHintSection());\n    adjustCrosswordSize();\n};\nconst findRuleIndex = (selector) => {\n    for (let i = 0; i < document.styleSheets[0].cssRules.length; i++) {\n        const rules = document.styleSheets[0].cssRules[i];\n        if (rules.cssText.includes(selector))\n            return i;\n    }\n    return -1;\n};\nconst adjustCrosswordSize = () => {\n    const area = document.querySelector('.puzzleArea');\n    const cellSize = Math.max(30, Math.min(60, Math.min(area.clientWidth / puzzle.width, area.clientHeight / puzzle.height)));\n    const i = findRuleIndex('td.size');\n    if (i >= 0) {\n        document.styleSheets[0].deleteRule(i);\n        document.styleSheets[0].insertRule(`td.size { width: ${cellSize}px; height: ${cellSize}px; }`);\n    }\n    const j = findRuleIndex('input.size');\n    if (j >= 0) {\n        document.styleSheets[0].deleteRule(j);\n        document.styleSheets[0].insertRule(`input.size { font-size: ${cellSize * 0.75}px; }`);\n    }\n    const k = findRuleIndex('span.size');\n    if (k >= 0) {\n        document.styleSheets[0].deleteRule(k);\n        document.styleSheets[0].insertRule(`span.size { font-size: ${cellSize * 0.25}px; }`);\n    }\n};\nmain();\n\n\n//# sourceURL=webpack://kreuzwortraetsel/./src/editor.ts?");

/***/ }),

/***/ "./src/shared/cell.ts":
/*!****************************!*\
  !*** ./src/shared/cell.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Cell\": () => (/* binding */ Cell)\n/* harmony export */ });\n/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ \"./src/shared/settings.ts\");\n\nconst LIGHT_OUTLINE = \"1px\";\nconst HEAVY_OUTLINE = \"3px\";\nclass Cell extends EventTarget {\n    get clueNumber() {\n        return this.clue;\n    }\n    get isClue() {\n        return !!this.clue;\n    }\n    get value() {\n        return this.input.value;\n    }\n    set value(v) {\n        this.input.value = v;\n    }\n    constructor(x, y, solution) {\n        super();\n        this.updateContents = (e) => {\n            const input = e.target;\n            if (e.inputType !== 'insertText') {\n                this.input.classList.remove('correct', 'wrong');\n                return;\n            }\n            if (!e.data.match(/^[A-Za-z]$/)) {\n                if (input.value.length > e.data.length) {\n                    input.value = input.value[0];\n                }\n                else {\n                    input.value = \"\";\n                }\n                return;\n            }\n            this.input.classList.remove('correct', 'wrong');\n            input.value = e.data.toUpperCase();\n            if (_settings__WEBPACK_IMPORTED_MODULE_0__.Settings.autocheck) {\n                this.check();\n            }\n            this.dispatchEvent(new CustomEvent('filled', { detail: { target: this } }));\n        };\n        this.onFocus = (e) => {\n            this.dispatchEvent(new CustomEvent('clicked', { detail: { target: this, repeated: false } }));\n        };\n        this.onBlur = () => {\n            this.dispatchEvent(new CustomEvent('blur', { detail: { target: this } }));\n        };\n        this.onMouseDown = () => {\n            if (document.activeElement === this.input) {\n                this.dispatchEvent(new CustomEvent('clicked', { detail: { target: this, repeated: true } }));\n            }\n        };\n        this.onMouseUp = () => {\n            this.dispatchEvent(new CustomEvent('mouseup', { detail: { target: this } }));\n        };\n        this.onMouseEnter = (e) => {\n            if ((e.buttons & 1) > 0) {\n                this.dispatchEvent(new CustomEvent('dragged', { detail: { target: this } }));\n            }\n        };\n        this.onKeyDown = (e) => {\n            if (e.code === 'Tab') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('filled', { detail: { target: this } }));\n            }\n            if (e.code === 'Backspace' && this.input.value === '') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('retract', { detail: { target: this } }));\n            }\n            if (e.code === 'ArrowLeft') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('move', { detail: { target: this, targetX: this.x - 1, targetY: this.y } }));\n            }\n            if (e.code === 'ArrowRight') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('move', { detail: { target: this, targetX: this.x + 1, targetY: this.y } }));\n            }\n            if (e.code === 'ArrowUp') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('move', { detail: { target: this, targetX: this.x, targetY: this.y - 1 } }));\n            }\n            if (e.code === 'ArrowDown') {\n                e.preventDefault();\n                this.dispatchEvent(new CustomEvent('move', { detail: { target: this, targetX: this.x, targetY: this.y + 1 } }));\n            }\n        };\n        this.markAsClue = (clue) => {\n            this.clue = clue;\n        };\n        this.render = () => {\n            this.element.className = 'size';\n            this.element.style.borderWidth = HEAVY_OUTLINE;\n            if ((this.connections & 0b1) > 0) {\n                this.element.style.borderLeftWidth = LIGHT_OUTLINE;\n            }\n            if ((this.connections & 0b10) > 0) {\n                this.element.style.borderRightWidth = LIGHT_OUTLINE;\n            }\n            if ((this.connections & 0b100) > 0) {\n                this.element.style.borderTopWidth = LIGHT_OUTLINE;\n            }\n            if ((this.connections & 0b1000) > 0) {\n                this.element.style.borderBottomWidth = LIGHT_OUTLINE;\n            }\n            if (this.isClue) {\n                const clueSpan = document.createElement('span');\n                clueSpan.className = 'clue size';\n                clueSpan.innerHTML = this.clue.toFixed(0);\n                this.element.appendChild(clueSpan);\n            }\n            this.input.setAttribute('type', 'text');\n            this.input.setAttribute('autocomplete', 'off');\n            this.input.className = 'size';\n            this.input.addEventListener('mousedown', this.onMouseDown);\n            this.input.addEventListener('mouseup', this.onMouseUp);\n            this.input.addEventListener('mouseenter', this.onMouseEnter);\n            this.input.addEventListener('focus', this.onFocus);\n            this.input.addEventListener('blur', this.onBlur);\n            this.input.addEventListener('input', this.updateContents);\n            this.input.addEventListener('keydown', this.onKeyDown);\n            this.element.appendChild(this.input);\n            return this.element;\n        };\n        this.addConnection = (c) => {\n            this.connections += c;\n        };\n        this.resetConnections = () => {\n            this.connections = 0;\n        };\n        this.focus = () => {\n            this.input.focus();\n        };\n        this.clear = () => {\n            this.input.classList.remove('correct', 'wrong');\n            this.input.value = '';\n        };\n        this.select = () => {\n            this.input.classList.add('selected');\n        };\n        this.deselect = () => {\n            this.input.classList.remove('selected');\n        };\n        this.check = () => {\n            if (!this.isFilled) {\n                this.input.classList.remove('correct', 'wrong');\n                return;\n            }\n            if (this.isCorrect) {\n                this.input.classList.add('correct');\n            }\n            else {\n                this.input.classList.add('wrong');\n            }\n        };\n        this.x = x;\n        this.y = y;\n        this.solution = solution;\n        this.connections = 0;\n        this.element = document.createElement('td');\n        this.input = document.createElement('input');\n    }\n    get isFilled() {\n        return this.input.value.length > 0;\n    }\n    get isCorrect() {\n        return this.input.value === this.solution;\n    }\n}\n\n\n\n//# sourceURL=webpack://kreuzwortraetsel/./src/shared/cell.ts?");

/***/ }),

/***/ "./src/shared/empty-puzzle.ts":
/*!************************************!*\
  !*** ./src/shared/empty-puzzle.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"EmptyPuzzle\": () => (/* binding */ EmptyPuzzle)\n/* harmony export */ });\n/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ \"./src/shared/cell.ts\");\n/* harmony import */ var _word__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./word */ \"./src/shared/word.ts\");\n\n\nclass EmptyPuzzle extends EventTarget {\n    constructor(data) {\n        super();\n        this.render = () => {\n            this.cells.forEach(c => c.resetConnections());\n            this.horizontalWords.forEach(w => w.initCells(this, w.wordData.x, w.wordData.y, 'h', w.wordData.length));\n            this.verticalWords.forEach(w => w.initCells(this, w.wordData.x, w.wordData.y, 'v', w.wordData.length));\n            const table = document.createElement('table');\n            for (let y = 0; y < this.height; y++) {\n                const row = document.createElement('tr');\n                table.appendChild(row);\n                for (let x = 0; x < this.width; x++) {\n                    const cell = this.findCell(x, y);\n                    if (cell) {\n                        row.appendChild(cell.render());\n                    }\n                    else {\n                        row.appendChild(document.createElement('td'));\n                    }\n                }\n            }\n            return table;\n        };\n        this.findCell = (x, y) => {\n            for (const cell of this.cells) {\n                if (cell.x === x && cell.y === y) {\n                    return cell;\n                }\n            }\n            return null;\n        };\n        this.addBottomRow = () => {\n            this.height++;\n            for (let x = 0; x < this.width; x++) {\n                this.createCell(x, this.height - 1);\n            }\n        };\n        this.removeBottomRow = () => {\n            this.height--;\n            this.cells = this.cells.filter(c => c.y < this.height);\n            this.verticalWords = this.verticalWords.filter(w => w.wordData.y + w.wordData.length < this.height);\n            this.horizontalWords = this.horizontalWords.filter(w => w.wordData.y < this.height);\n        };\n        this.addTopRow = () => {\n            this.height++;\n            this.cells = this.cells.map(c => {\n                const newCell = this.createCell(c.x, c.y + 1);\n                newCell.value = c.value;\n                return newCell;\n            });\n            for (let x = 0; x < this.width; x++) {\n                this.createCell(x, 0);\n            }\n            this.verticalWords = this.verticalWords.map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { y: w.wordData.y + 1 }), 'v'));\n            this.horizontalWords = this.horizontalWords.map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { y: w.wordData.y + 1 }), 'h'));\n        };\n        this.removeTopRow = () => {\n            this.height--;\n            this.cells = this.cells.filter(c => c.y > 0);\n            this.cells = this.cells.map(c => {\n                const newCell = this.createCell(c.x, c.y - 1);\n                newCell.value = c.value;\n                return newCell;\n            });\n            this.verticalWords = this.verticalWords.filter(w => w.wordData.y > 0)\n                .map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { y: w.wordData.y - 1 }), 'v'));\n            this.horizontalWords = this.horizontalWords.filter(w => w.wordData.y > 0)\n                .map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { y: w.wordData.y - 1 }), 'h'));\n        };\n        this.addRightRow = () => {\n            this.width++;\n            for (let y = 0; y < this.height; y++) {\n                this.createCell(this.width - 1, y);\n            }\n        };\n        this.removeRightRow = () => {\n            this.width--;\n            this.cells = this.cells.filter(c => c.x < this.width);\n            this.verticalWords = this.verticalWords.filter(w => w.wordData.x < this.width);\n            this.horizontalWords = this.horizontalWords.filter(w => w.wordData.x + w.wordData.length <= this.width);\n        };\n        this.addLeftRow = () => {\n            this.width++;\n            this.cells = this.cells.map(c => {\n                const newCell = this.createCell(c.x + 1, c.y);\n                newCell.value = c.value;\n                return newCell;\n            });\n            for (let y = 0; y < this.height; y++) {\n                this.createCell(0, y);\n            }\n            this.verticalWords = this.verticalWords.map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { x: w.wordData.x + 1 }), 'v'));\n            this.horizontalWords = this.horizontalWords.map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { x: w.wordData.x + 1 }), 'v'));\n        };\n        this.removeLeftRow = () => {\n            this.width--;\n            this.cells = this.cells.filter(c => c.x > 0);\n            this.cells = this.cells.map(c => {\n                const newCell = this.createCell(c.x - 1, c.y);\n                newCell.value = c.value;\n                return newCell;\n            });\n            this.verticalWords = this.verticalWords.filter(w => w.wordData.x > 0)\n                .map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { x: w.wordData.x - 1 }), 'v'));\n            this.horizontalWords = this.horizontalWords.filter(w => w.wordData.x > 0)\n                .map(w => new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, Object.assign(Object.assign({}, w.wordData), { x: w.wordData.x - 1 }), 'h'));\n        };\n        this.advance = (e) => {\n            let cell = e.detail.target;\n            const x = cell.x;\n            const y = cell.y;\n            if (x < this.width - 1) {\n                cell = this.findCell(x + 1, y);\n            }\n            else {\n                if (y < this.height - 1) {\n                    cell = this.findCell(0, y + 1);\n                }\n                else {\n                    cell = this.findCell(0, 0);\n                }\n            }\n            cell.focus();\n        };\n        this.retract = (e) => {\n            let cell = e.detail.target;\n            const x = cell.x;\n            const y = cell.y;\n            if (x > 0) {\n                cell = this.findCell(x - 1, y);\n            }\n            else {\n                if (y > 0) {\n                    cell = this.findCell(this.width - 1, y - 1);\n                }\n                else {\n                    cell = this.findCell(this.width - 1, this.height - 1);\n                }\n            }\n            cell.clear();\n            cell.focus();\n        };\n        this.move = (e) => {\n            const cell = this.findCell(e.detail.targetX, e.detail.targetY);\n            if (cell)\n                cell.focus();\n        };\n        this.markAsCurrent = (e) => {\n            this.currentCell = e.detail.target;\n        };\n        this.unmark = () => {\n            this.cells.forEach(c => c.deselect());\n            this.currentCell = null;\n        };\n        this.finishSelection = (e) => {\n            if (!this.currentCell)\n                return;\n            const targetCell = e.detail.target;\n            let word = \"\";\n            let wordData = {\n                x: this.currentCell.x,\n                y: this.currentCell.y,\n                length: 0,\n                clue: \"\",\n            };\n            if (targetCell.x === wordData.x && targetCell.y === wordData.y)\n                return;\n            if (targetCell.x === wordData.x) {\n                for (let y = wordData.y; y <= targetCell.y; y++) {\n                    const cell = this.findCell(targetCell.x, y);\n                    if (!cell.value.match(/^[A-Z]$/))\n                        return;\n                    word += cell.value;\n                }\n                wordData.length = targetCell.y - wordData.y + 1;\n                this.currentWordDirection = 'v';\n            }\n            if (targetCell.y === wordData.y) {\n                for (let x = wordData.x; x <= targetCell.x; x++) {\n                    const cell = this.findCell(x, targetCell.y);\n                    if (!cell.value.match(/^[A-Z]$/))\n                        return;\n                    word += cell.value;\n                }\n                wordData.length = targetCell.x - wordData.x + 1;\n                this.currentWordDirection = 'h';\n            }\n            if (word === \"\")\n                return;\n            this.currentWordData = wordData;\n            this.dispatchEvent(new CustomEvent(\"wordSelected\", { detail: { word: word } }));\n        };\n        this.dragOnto = (e) => {\n            if (!this.currentCell)\n                return;\n            this.cells.forEach(c => c.deselect());\n            const targetCell = e.detail.target;\n            if (targetCell.x === this.currentCell.x) {\n                for (let y = this.currentCell.y; y <= targetCell.y; y++) {\n                    const cell = this.findCell(targetCell.x, y);\n                    cell.select();\n                }\n            }\n            if (targetCell.y === this.currentCell.y) {\n                for (let x = this.currentCell.x; x <= targetCell.x; x++) {\n                    const cell = this.findCell(x, targetCell.y);\n                    cell.select();\n                }\n            }\n        };\n        this.addClue = (clue) => {\n            if (!this.currentWordData)\n                return;\n            this.currentWordData.clue = clue;\n            const word = new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, this.currentWordData, this.currentWordDirection);\n            if (this.currentWordDirection === 'h')\n                this.horizontalWords.push(word);\n            if (this.currentWordDirection === 'v')\n                this.verticalWords.push(word);\n        };\n        this.selectWord = (word) => {\n            this.horizontalWords.forEach(w => w.deselect());\n            this.verticalWords.forEach(w => w.deselect());\n            this.cells.forEach(c => c.deselect());\n            word.select(false);\n        };\n        this.renderHintSection = () => {\n            const section = document.createElement('div');\n            section.className = 'hintSection';\n            if (this.horizontalWords.length > 0) {\n                const heading = document.createElement('div');\n                heading.className = 'hintHeading';\n                heading.innerHTML = 'Horizontal:';\n                section.appendChild(heading);\n                for (const w of this.horizontalWords) {\n                    w.addEventListener('selected', (e) => this.selectWord(w));\n                    w.addEventListener('rightclicked', (e) => {\n                        this.horizontalWords = this.horizontalWords.filter(w2 => w2 !== w);\n                        this.verticalWords = this.verticalWords.filter(w2 => w2 !== w);\n                        this.dispatchEvent(new CustomEvent('rerender'));\n                    });\n                    section.appendChild(w.renderHint());\n                }\n            }\n            if (this.verticalWords.length > 0) {\n                const heading = document.createElement('div');\n                heading.className = 'hintHeading';\n                heading.innerHTML = 'Vertikal:';\n                section.appendChild(heading);\n                for (const w of this.verticalWords) {\n                    w.addEventListener('selected', (e) => this.selectWord(w));\n                    section.appendChild(w.renderHint());\n                }\n            }\n            return section;\n        };\n        this.createDownloadData = () => {\n            const solution = [];\n            for (let y = 0; y < this.height; y++) {\n                let line = \"\";\n                for (let x = 0; x < this.width; x++) {\n                    const value = this.findCell(x, y).value;\n                    line += value.match(/^[A-Z]$/) ? value : '.';\n                }\n                solution.push(line);\n            }\n            ;\n            return {\n                width: this.width,\n                height: this.height,\n                solution: solution,\n                clues: {\n                    horizontal: this.horizontalWords.map(w => w.wordData),\n                    vertical: this.verticalWords.map(w => w.wordData),\n                }\n            };\n        };\n        this.width = data.width;\n        this.height = data.height;\n        this.cells = [];\n        this.currentCell = null;\n        this.currentWordData = null;\n        this.currentWordDirection = null;\n        this.horizontalWords = [];\n        this.verticalWords = [];\n        const pd = data;\n        for (let y = 0; y < this.height; y++) {\n            for (let x = 0; x < this.width; x++) {\n                const c = this.createCell(x, y);\n                if (pd.solution) {\n                    const letter = pd.solution[y][x];\n                    if (letter !== '.') {\n                        c.value = letter;\n                    }\n                }\n            }\n        }\n        if (pd.clues) {\n            for (let y = 0; y < this.height; y++) {\n                for (let x = 0; x < this.width; x++) {\n                    const hWord = pd.clues.horizontal.find(w => w.x === x && w.y === y);\n                    const vWord = pd.clues.vertical.find(w => w.x === x && w.y === y);\n                    if (hWord || vWord) {\n                        //cell.markAsClue(curClue);\n                        if (hWord) {\n                            this.horizontalWords.push(new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, hWord, 'h'));\n                        }\n                        if (vWord) {\n                            this.verticalWords.push(new _word__WEBPACK_IMPORTED_MODULE_1__.Word(this, 0, vWord, 'v'));\n                        }\n                        //curClue++;\n                    }\n                }\n            }\n        }\n    }\n    createCell(x, y) {\n        const cell = new _cell__WEBPACK_IMPORTED_MODULE_0__.Cell(x, y, \"?\");\n        cell.addEventListener('clicked', this.markAsCurrent);\n        cell.addEventListener('mouseup', this.finishSelection);\n        cell.addEventListener('blur', this.unmark);\n        cell.addEventListener('dragged', this.dragOnto);\n        cell.addEventListener('filled', this.advance);\n        cell.addEventListener('retract', this.retract);\n        cell.addEventListener('move', this.move);\n        this.cells.push(cell);\n        return cell;\n    }\n}\n\n\n\n//# sourceURL=webpack://kreuzwortraetsel/./src/shared/empty-puzzle.ts?");

/***/ }),

/***/ "./src/shared/settings.ts":
/*!********************************!*\
  !*** ./src/shared/settings.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Settings\": () => (/* binding */ Settings)\n/* harmony export */ });\nconst Settings = {\n    autocheck: false,\n};\n\n\n\n//# sourceURL=webpack://kreuzwortraetsel/./src/shared/settings.ts?");

/***/ }),

/***/ "./src/shared/word.ts":
/*!****************************!*\
  !*** ./src/shared/word.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Word\": () => (/* binding */ Word)\n/* harmony export */ });\nclass Word extends EventTarget {\n    constructor(puzzle, clue, data, direction) {\n        super();\n        this.initCells = (puzzle, startX, startY, dir, length) => {\n            this.cells = [];\n            for (let i = 0; i < length; i++) {\n                const x = startX + (dir === 'h' ? i : 0);\n                const y = startY + (dir === 'v' ? i : 0);\n                const cell = puzzle.findCell(x, y);\n                this.cells.push(cell);\n                if (i > 0) {\n                    cell.addConnection(dir === 'h' ? 0b1 : 0b100);\n                }\n                if (i < length - 1) {\n                    cell.addConnection(dir === 'h' ? 0b10 : 0b1000);\n                }\n            }\n        };\n        this.renderHint = () => {\n            this.hintDiv.className = 'clue';\n            this.hintDiv.textContent = `${this.number}: ${this.desc}`;\n            this.hintDiv.addEventListener('mousedown', this.onClick);\n            this.hintDiv.addEventListener('contextmenu', this.onContextMenu);\n            return this.hintDiv;\n        };\n        this.onClick = () => {\n            setTimeout(() => this.dispatchEvent(new CustomEvent('selected', { detail: { word: this } })));\n        };\n        this.onContextMenu = (e) => {\n            e.preventDefault();\n            this.dispatchEvent(new CustomEvent('rightclicked', { detail: { word: this } }));\n        };\n        this.containsCell = (cell) => {\n            for (const c of this.cells) {\n                if (c === cell) {\n                    return true;\n                }\n            }\n            return false;\n        };\n        this.select = (focusFirstCell) => {\n            this.hintDiv.classList.add('selected');\n            for (const c of this.cells) {\n                c.select();\n            }\n            if (focusFirstCell) {\n                this.cells[0].focus();\n            }\n        };\n        this.deselect = () => {\n            this.hintDiv.classList.remove('selected');\n            for (const c of this.cells) {\n                c.deselect();\n            }\n        };\n        this.advance = (curCell) => {\n            const i = this.cells.findIndex(c => c === curCell);\n            if (i < 0)\n                return false;\n            if (i === this.cells.length - 1) {\n                return false;\n            }\n            this.cells[i + 1].focus();\n            return true;\n        };\n        this.retract = (curCell) => {\n            const i = this.cells.findIndex(c => c === curCell);\n            if (i < 0)\n                return false;\n            if (i === 0) {\n                return false;\n            }\n            this.cells[i - 1].clear();\n            this.cells[i - 1].focus();\n            return true;\n        };\n        this.wordData = data;\n        this.number = clue;\n        this.desc = data.clue;\n        this.direction = direction;\n        this.cells = [];\n        if (puzzle)\n            this.initCells(puzzle, data.x, data.y, direction, data.length);\n        this.hintDiv = document.createElement('div');\n    }\n}\n\n\n\n//# sourceURL=webpack://kreuzwortraetsel/./src/shared/word.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/editor.ts");
/******/ 	
/******/ })()
;