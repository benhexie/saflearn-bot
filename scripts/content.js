/**
 ***************** STEPS *****************
 * Extract data from text
 * 
 * Click "Add question" button
 * Fill "Question Number"
 * Fill "Topic"
 * Fill Question
 * Add options
 * Select correct answer
 * Add  solution / .
 * Click "Add question" button
 * 
 */

(() => {
    // Create Extension Layout
    createInputLayout();
})()

function startBot() {
    enterNew();
    enterData({index: 100, topic: "fff", question: "What is my name?", options: ["Ben", "Mike", "JJ", "Emma"], answer: "Ben", solution: "I knew that all along."})
}

function createInputLayout() {
    document.body.insertAdjacentHTML('afterbegin', `
        <style>
            #div-bot-input-layout {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                pointer-events: none !important;
                background-color: transparent !important;
                z-index: 9999 !important;
                display: flex !important;
                justify-content: flex-start !important;
                align-items: flex-end !important;
            }
            #div-bot-input-layout > div {
                width: 100%;
                height: 48px;
                display: flex;
                padding-inline: 20px;
                align-items: center;
                justify-content: space-between;
                background-color: blue;
                pointer-events: all !important;
                color: white;
            }
        </style>
        <div id="div-bot-input-layout">
            <div>
                <input type="file" id="div-bot-file-input" />
                <button id="div-bot-file-input-btn">Start</button>
            </div>
        </div>
    `)
    document.getElementById("div-bot-file-input-btn").addEventListener('click', startBot)
}

function enterNew() {
    if (!document.querySelector(`div.flexi-modal-overlay[open]`))
        document.querySelector(`div.flexi-tab-content-active div.flexi-grid div.flexi-button`)?.click()
}

function enterData({index, topic, question, options, answer, solution = "."}) {

    function getFrame(i) {
        const iframes = document.querySelectorAll('iframe[id^="tiny-react"]');
        // if (iframes.length >= i) return {}
        return iframes[i].contentDocument.querySelector(`body#tinymce p`)
    }

    function insertOptions() {
        const interval = setInterval(() => {
            if (document.querySelectorAll('iframe[id^="tiny-react"]').length === 3 + options.length) {
                options.forEach((option, i) => {
                    if (option === answer) 
                        document.querySelectorAll('input[label="Correct answer"]')[i].click();
                    getFrame(i + 1).innerHTML = option
                });
                main();
                clearInterval(interval);
            }
        }, 300)
    }

    function main() {

        function simulateKeyPress(elm) {
            elm.focus();
            let downEvent = new KeyboardEvent('keydown', { key: '.', bubbles: true });
            let pressEvent = new KeyboardEvent('keypress', { key: '.', bubbles: true });
            let inputEvent = new InputEvent('input', { inputType: 'insertText', data: '.', bubbles: true });
            let upEvent = new KeyboardEvent('keyup', { key: '.', bubbles: true });
            let deleteEvent = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
            let deleteInputEvent = new InputEvent('input', { inputType: 'deleteContentBackward', data: '', bubbles: true });
            
            elm.dispatchEvent(downEvent);
            elm.dispatchEvent(pressEvent);
            elm.dispatchEvent(inputEvent);
            elm.dispatchEvent(upEvent);
            elm.dispatchEvent(deleteEvent);
            elm.dispatchEvent(deleteInputEvent);
        }

        const quesNumElm = document.querySelector(`input.flexi-input[type="number"]`);
        const topicElm = document.querySelector(`div[label="Topic"] input.flexi-input`);
        const quesElm = getFrame(0);
        const solElm = getFrame(1 + options.length);

        quesNumElm.value = index;
        topicElm.value = topic;
        quesElm.innerHTML = question;
        solElm.innerHTML = solution || ".";
        new Promise((res, rej) => {
            simulateKeyPress(topicElm);
            simulateKeyPress(quesNumElm);
            const iframes = document.querySelectorAll('iframe[id^="tiny-react"]')
            iframes.forEach((x, i) => {
                if (i < iframes.length - 1)
                    simulateKeyPress(x.contentDocument.querySelector(`body#tinymce p`));
            })
            res()
        }).then(() => {
            sendData();
        }).catch(err => {})
    }

    function sendData() {
        document.querySelector(`div.flexi-tab-content-active`)
                .querySelector(`div.flexi-button + div.flexi-button`).click()
    }

    let inside = false;
    if (document.querySelector(`div.flexi-modal-overlay[open]`)) {
        const interval = setInterval(() => {
            if (!inside) {
                if (index && topic && question && options?.length > 0) {
                    inside = true;
                    new Promise((res, rej) => {
                        for (let i = 0; i < options.length; i++) {
                            if (i !== options.length - 1) {
                                document.querySelectorAll(`div.flexi-tab-content-active div.flexi-button`)[5].click();
                            }
                        }
                        res()
                    }).then(() => {
                        insertOptions();
                        inside = false;
                        clearInterval(interval);
                    }).catch(err => {
                        clearInterval(interval);
                    })
            }

            }
        }, 300)
        
    }
}