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
