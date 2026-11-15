import Store from "../../classes/Store.js";
import {
    lookupOneCached,
} from "../../utils/elements.js";

const store = Store.create("pocket-grimoire");
const saveButton = lookupOneCached("#save-game-button");
const loadButton = lookupOneCached("#load-game-button");
const fileInput = lookupOneCached("#load-game-input");

const STORE_KEY = "pocket-grimoire";

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseGameState(contents) {
    const payload = JSON.parse(contents);

    if (!isObject(payload)) {
        throw new TypeError("The save file must contain an object");
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, "state")
        && payload.version !== 1
    ) {
        throw new TypeError("Unsupported save file version");
    }

    const state = (
        Object.prototype.hasOwnProperty.call(payload, "state")
        ? payload.state
        : payload
    );

    if (
        !isObject(state)
        || !isObject(state.characters)
        || !Array.isArray(state.tokens)
        || !state.tokens.every((token) => (
            isObject(token) && typeof token.id === "string"
        ))
    ) {
        throw new TypeError("The file does not contain a Pocket Grimoire save");
    }

    return state;
}

function exportGame() {
    const timestamp = (new Date())
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\.\d{3}Z$/, "Z");
    const payload = {
        version: 1,
        exportedAt: (new Date()).toISOString(),
        state: store.get(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json"
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `pocket-grimoire-${timestamp}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

function loadGame(file) {
    const reader = new FileReader();

    reader.addEventListener("load", ({ target }) => {
        let state;

        try {
            state = parseGameState(target.result);
        } catch (error) {
            window.alert(window.I18N?.invalidGameSave || "The save file is not valid.");
            return;
        }

        try {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Unable to store the loaded game", error);
            window.alert(window.I18N?.gameSaveLoadError || "The game could not be loaded.");
            return;
        }

        window.location.reload();
    });

    reader.addEventListener("error", () => {
        window.alert(window.I18N?.invalidGameSave || "The save file could not be read.");
    });

    reader.readAsText(file);
}

saveButton.addEventListener("click", exportGame);
loadButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", ({ target }) => {
    const file = target.files?.[0];

    if (file) {
        loadGame(file);
        target.value = "";
    }
});
