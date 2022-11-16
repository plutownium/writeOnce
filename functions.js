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

function splitBySentence(text) {
    const endings = ["? ", ". ", "! ", `?" `, `!" `, `." `];
    // const sentences = [];
    const byQuestionMark = text.split(endings[0]);
    const byPeriod = byQuestionMark.map(potentiallyTwoSentences => potentiallyTwoSentences.split(endings[1])).flat();
    const byExclamation = byPeriod.map(potentiallyTwoSentences => potentiallyTwoSentences.split(endings[2])).flat();
    const byQuotedQuestionMark = byExclamation.map(potentiallyTwoSentences => potentiallyTwoSentences.split(endings[3])).flat();
    const byQuotedPeriod = byQuotedQuestionMark.map(p => p.split(endings[4])).flat();
    const byQuotedExclamationMark = byQuotedPeriod.map(p => p.split(endings[5])).flat(); // really "all"
    return byQuotedExclamationMark;
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

function findRepeatWords(sentencesArr) {
    // return a wordsArr
    const wordsArr = [];
    let currentSentenceWords = [];
    let nextSentenceWords = [];
    for (let i = 0; i < sentencesArr.length - 1; i++) {
        currentSentenceWords = sentencesArr[i].replace(/[^A-Za-z0-9,\s]+/, "").split(" ");
        nextSentenceWords = sentencesArr[i + 1].replace(/[^A-Za-z0-9,\s]+/, "").split(" ");
        const intersection = currentSentenceWords.filter(element => nextSentenceWords.includes(element));
        let words;
        if (intersection.length > 0) {
            // repeats? tag the repeats. the non-repeats are just normal words
            // TODO;
            words = currentSentenceWords.map(word => {
                const w = sanitizeWord(word);
                if (intersection.includes(word)) {
                    w.setCorrection(word, "repeat");
                }
                return w;
            });
        } else {
            // no repeats;
            // todo
            words = currentSentenceWords.map(word => {
                const w = sanitizeWord(word);
                return w;
            });
        }
        wordsArr.push(words);
        for (let j = 0; j < words.length; j++) {
            wordsArr.push(words[j]);
        }
    }

    return wordsArr.flat();
}

// error makers
function showErrorFromOriginal(originalText) {
    const span = document.createElement("span");
    span.classList.add("errorText");
    span.classList.add("fadeInRed");
    span.innerText = originalText + " ";
    return span;
}

function showErrorFromCorrection(correction) {
    console.log(correction, "85rm");
    const span = document.createElement("span");
    span.classList.add("errorText");
    span.classList.add("fadeInRed");
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

// highlightAdverbsFromWords
function generateHTMLWithHighlights(wordsArr) {
    const showCorrected = false; // hardcode
    let zip = [];
    for (const word of wordsArr) {
        if (word.hasCorrection()) {
            if (showCorrected) {
                zip.push(showErrorFromCorrection(word.getCorrection()));
            } else {
                zip.push(showErrorFromOriginal(word.getOriginal()));
            }
        } else {
            zip.push(showPlain(word.getOriginal()));
        }
    }
    return zip;
}

// Repeats
function generateHTMLWithHighlightsRepeats(wordsArr) {
    const showCorrected = false; // hardcode
    let zip = [];
    for (const word of wordsArr) {
        if (word.hasCorrection()) {
            if (showCorrected) {
                zip.push(showErrorFromCorrection(word.getCorrection()));
            } else {
                zip.push(showErrorFromOriginal(word.getOriginal()));
            }
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
