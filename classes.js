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
        this.corrected = false;
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
