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
    "We are in the time during which we are within another location. I am running toward the path along the river during the hour of 10 am. You can dive into the river since it is within city limits and is thus off limits for pollution. ";
const testPreopositionsCity = "We made into because across that means toward, and so off turtle during laptops within. ";
const testPunctuationInsideQuotes = `He said "LMAO", can you believe it? I told him "we have to run"! And he replied "Are you sure"? Yet another person declared "AYY LMAO"! Which lead me to wonder, "Can anyone do more to look like", but that was not a rule following example. `;
const testNumbers =
    "The number 103 is ok, but the number 93 is not. The number $30 is fine, but the phrase 'he offered 30 dollars' is not. The percentage value 15% is ok, but the text version '15 percent' is a problem! ";
const startText = testAdverbs + testRepeatWord + testPrepositions + testPunctuationInsideQuotes + testNumbers + testPreopositionsCity;

const output = document.getElementById("output");

const input = document.getElementById("textInput");

input.value = startText;
output.innerText = startText;
// setup
const textHost = new Host(output);

const removeAdverbsBtn = document.getElementById("removeAdverbsBtn");
removeAdverbsBtn.addEventListener("click", () => {
    deleteAdverbs(wordsWithCorrections, textHost);
    hideRemoverBtn(removeAdverbsBtn);
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

let wordsWithCorrections;

document.getElementById("adverbCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sanitizedWordsArr = sanitizeLargeText(v);
    wordsWithCorrections = findAdverbs(sanitizedWordsArr);
    console.log(wordsWithCorrections, "65rm");
    for (const word of wordsWithCorrections) {
        if (word.hasCorrection()) {
            console.log(word, "68rm");
        }
    }
    // highlight the adverbs
    const outputHTML = generateHTMLWithHighlightsForAdverbs(wordsWithCorrections);
    console.log(outputHTML, "155rm");
    removeUnfixedText();
    setHTML(outputHTML, output);
    showRemoverBtn(removeAdverbsBtn);
});

document.getElementById("repeatWordCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sentences = splitBySentence(v);

    wordsWithCorrections = findRepeatWords(sentences);
    console.log(
        wordsWithCorrections.map(w => w.original),
        "134rm",
    );
    console.log(wordsWithCorrections, "86rm");

    // highlight the repeats
    const outputHTML = generateHTMLWithHighlightsForRepeats(wordsWithCorrections);
    removeUnfixedText();
    setHTML(outputHTML, output);
    // showRemoverBtn(removeAdverbsBtn);
});

document.getElementById("prepositionCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sentences = splitBySentence(v);

    wordsWithCorrections = findTooManyPrepositions(sentences, prepositionList);
    console.log(
        wordsWithCorrections.map(w => w.original),
        "105rm",
    );
    console.log(wordsWithCorrections.map(w => w.hasCorrection()));
    for (const word of wordsWithCorrections) {
        if (word.hasCorrection()) {
            console.log(word, "68rm");
        }
    }
    const outputHTML = generateHTMLWithHighlightsForPrepositions(wordsWithCorrections);
    removeUnfixedText();
    setHTML(outputHTML, output);
});

document.getElementById("punctuationInsideQuotesCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sentences = v.split(" ");
    const outputHTML = [];
    for (const s of sentences) {
        if (s.slice(-1) == `?` || s.slice(-1) == `!` || s.slice(-1) == `.`) {
            if (s.substring(s.length - 2, s.length - 1) == `"`) {
                const span = document.createElement("span");
                span.classList.add("errorText");
                span.classList.add("fadeInRed");
                span.innerText = s + " ";
                console.log(s, "133rm");
                outputHTML.push(span);
                continue;
            }
        }
        const span = document.createElement("span");
        span.innerText = s + " ";
        outputHTML.push(span);
    }
    removeUnfixedText();
    setHTML(outputHTML, output);
});

document.getElementById("numsUnderOneHundredCheck").addEventListener("click", () => {
    clearOtherProblems();
    const v = output.innerText;
    const sentences = v.split(" ");
    const outputHTML = [];
    for (const s of sentences) {
        const asInt = parseInt(s, 10);
        if (s.slice(-1) == "%") {
            const span = document.createElement("span");
            span.innerText = s + " ";
            outputHTML.push(span);
            continue;
        }
        console.log(s);
        if (asInt !== NaN && asInt < 100) {
            console.log(asInt, "155rm");
            const span = document.createElement("span");
            span.classList.add("errorText");
            span.classList.add("fadeInRed");
            span.innerText = s + " ";
            console.log(s, "133rm");
            outputHTML.push(span);
            continue;
        }
        const span = document.createElement("span");
        span.innerText = s + " ";
        outputHTML.push(span);
    }
    removeUnfixedText();
    setHTML(outputHTML, output);
});
