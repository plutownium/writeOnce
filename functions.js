function sanitizeWord(t, index) {
    // accepts a single word as an input.
    const segments = [];
    const matcher = function (match, offset, string) {
        segments.push(match);
        return "";
    };
    const sanitizedWord = t.replace(/[^A-Za-z]/gi, matcher);

    return new Word(t, index, sanitizedWord, segments);
}

function sanitizeLargeText(text) {
    const sanitized = text.split(" ").map((word, index) => sanitizeWord(word, index));
    return sanitized;
}

// function splitAndSanitize(txt) {
//     const sanitized = txt.split(" ").map(word => {
//         return word.replace(/[^A-Za-z]/gi, "");
//     });
//     return sanitized;
// }

function findAdverbs(wordsArr) {
    for (const w of wordsArr) {
        const lastTwoChars = w.getSanitized().slice(-2);
        if (lastTwoChars === "ly") {
            const withoutTheLy = w.getSanitized().slice(0, -2);
            w.setCorrection(withoutTheLy, "adverb");
        }
    }
    return wordsArr;
}

function showError(correction) {
    console.log(correction, "85rm");
    const span = document.createElement("span");
    span.classList.add("errorText");
    console.log(span, "87rm");
    span.innerText = correction.fixed + " ";
    console.log(span, "87rm");
    return span;
}

function showPlain(someText) {
    const span = document.createElement("span");
    console.log(span, "87rm");
    span.innerText = someText + " ";
    return span;
}

function highlightAdverbsFromWords(wordsArr, outputEl) {
    let zip = [];
    for (const word of wordsArr) {
        if (word.hasCorrection()) {
            zip.push(showError(word.getCorrection()));
        } else {
            zip.push(showPlain(word.getOriginal()));
        }
    }
    return zip;
}

function clearOtherProblems() {
    output.innerText = input.value;
}

function removeUnfixedText() {
    output.innerText = "";
}

// function createWordsObjsFromSanitizedWords(sanitizedTextArr) {
//     const words = sanitizedTextArr.map(sanitizedWord => {
//         return new Word();
//     });
//     return
// }

function showRemoverBtn(removerTool) {
    removerTool.classList.remove("hidden");
}

function hideRemoverBtn(removerTool) {
    removerTool.classList.add("hidden");
}

function deleteAdverbs(correctedWords, host) {
    const wordsToDelete = [];
    for (const word of correctedWords) {
        // console.log(word, "86rm");
        if (word.hasCorrection() && word.getCorrection().type) {
            console.log("Deleting...", word.original, "88rm");
            // host.delete(word);
            wordsToDelete.push(word);
        }
    }
    host.delete(wordsToDelete);
}

function setHTML(newHTML, targetEl) {
    console.log("Target el:", targetEl);
    // targetEl.innerHTML = newHTML;
    console.log(newHTML, targetEl, "164rm");
    for (const el of newHTML) {
        targetEl.appendChild(el);
    }
}

function replaceProblemWithSolution(segments, originalText, fixedText) {
    return segments.map(segment => {
        if (segment === originalText) return fixedText;
        else return segment;
    });
}
