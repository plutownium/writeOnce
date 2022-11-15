// pains
const prepositionList = [
    "in",
    "into",
    "onto",
    "at",
    "during",
    "since",
    "within",
    "over",
    "above",
    "below",
    "across",
    "along",
    "behind",
    "off",
    "toward",
];

// default input
const testAdverbs = "there is an actually redundant use of adverbs here. I quickly read using an intermediately usable medium called light. ";
const testRepeatWord =
    "This sentence uses the word lesson and also the word hats. This next sentence also utilizes the word lesson and mentions hats. ";
const testPrepositions =
    "We are in the time during which we are within another location. I am running toward the path along the river during the hour of 10 am. You can dive into the river since it is within city limits and is thus off limits for pollution.";
const testPunctuationInsideQuotes = `He said "LMAO", can you believe it? I told him "we have to run"! And he replied "Are you sure"? Yet another person declared "AYY LMAO"! Which lead me to wonder, "Can anyone do more to look like", but that was not a rule following example.`;
const testNumbers =
    "The number 103 is ok, but the number 93 is not. The number $30 is fine, but the phrase 'he offered 30 dollars' is not. The percentage value 15% is ok, but the text version '15 percent' is a problem!";
const startText = testAdverbs + testRepeatWord + testPrepositions + testPunctuationInsideQuotes + testNumbers;

const output = document.getElementById("output");

const input = document.getElementById("textInput");

input.value = startText;
output.innerText = startText;
// setup
const textHost = new Host(output);

const removeAdverbsBtn = document.getElementById("removeAdverbsBtn");
removeAdverbsBtn.addEventListener("click", () => {
    deleteAdverbs(wordsWithCorrections, textHost);
});

//

input.addEventListener("input", () => {
    const newValue = input.value;
    console.log(newValue, "7rm");
    if (newValue.length === 0) {
        output.innerText = startText;
        input.value = startText;
        return;
    }
    output.innerText = newValue;
});

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

function deleteAdverbs(correctedWords, host) {
    for (const word of correctedWords) {
        if (word.hasCorrection && word.getCorrection().type) {
            host.delete(word);
        }
    }
}

let wordsWithCorrections;

document.getElementById("adverbCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sanitizedWords = sanitizeLargeText(v);
    wordsWithCorrections = findAdverbs(sanitizedWords);
    // highlight the adverbs
    const outputHTML = highlightAdverbsFromWords(wordsWithCorrections, output);
    console.log(outputHTML, "155rm");
    removeUnfixedText();
    setHTML(outputHTML, output);
    showRemoverBtn(removeAdverbsBtn);
});

function setHTML(newHTML, targetEl) {
    console.log("Target el:", targetEl);
    // targetEl.innerHTML = newHTML;
    console.log(newHTML, "164rm");
    for (const el of newHTML) {
        targetEl.appendChild(el);
    }
}

// ** **
// Classes
// ** **

class Host {
    constructor(el) {
        this.host = el;
    }

    setActiveText(text) {
        this.host.innerText = text;
    }

    delete(word) {
        // by index
        const toModify = this.host.innerText;
        const modified = toModify.split(" ").filter((text, index) => {
            console.log(word.getIndex(), "126rm");
            if (word.getIndex()) return "";
            else return text;
        });
        this.host.innerText = modified.join(" ");
    }
}

class Word {
    constructor(original, index, sanitized, segments) {
        this.original = original;
        this.index = index;
        this.sanitized = sanitized;
        this.segments = segments;
    }

    sanitize() {
        this.sanitized = sanitize(this.original);
    }

    getOriginal() {
        return this.original;
    }

    getSanitized() {
        if (this.sanitized === undefined) throw new Error("word wasn't sanitized: " + this.original);
        return this.sanitized;
    }

    getIndex() {
        return this.index;
    }

    hasCorrection() {
        return this.corrected;
    }

    setCorrection(correction, correctionType) {
        this.correction = new Correction(correction, correctionType);
        this.corrected = true;
    }

    getCorrection() {
        return this.correction.getFixed();
    }
}

class Correction {
    constructor(fixed, type) {
        this.fixed = fixed;
        this.type = type;
    }

    getFixed() {
        if (this.fixed) return { fixed: this.fixed, type: this.type };
        else throw new Error("no fix detected");
    }
}

function replaceProblemWithSolution(segments, originalText, fixedText) {
    return segments.map(segment => {
        if (segment === originalText) return fixedText;
        else return segment;
    });
}
