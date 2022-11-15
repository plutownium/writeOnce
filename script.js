const output = document.getElementById("output");

const input = document.getElementById("textInput");

input.addEventListener("input", () => {
    const newValue = input.value;
    console.log(newValue, "7rm");
    output.innerText = newValue;
});
