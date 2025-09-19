import { user } from '../lang/messages/en/user.js';

class Note {
    constructor(content, index, onRemove, onUpdate) {
        this.content = content;
        this.index = index;
        this.onRemove = onRemove;
        this.onUpdate = onUpdate;

        // Create DOM elements
        this.textArea = document.createElement("textarea");
        this.textArea.value = this.content;
        this.textArea.addEventListener("input", (e) => {
            this.content = e.target.value;
            this.store();
        });

        this.removeBtn = document.createElement("button");
        this.removeBtn.textContent = "Remove";
        this.removeBtn.addEventListener("click", () => this.remove());

        this.noteDiv = document.createElement("div");
        this.noteDiv.className = "note";
        this.noteDiv.appendChild(this.textArea);
        this.noteDiv.appendChild(this.removeBtn);
    }

    render(container) {
        container.appendChild(this.noteDiv);
    }

    remove() {
        this.noteDiv.remove();
        this.onRemove(this.index);
    }

    store() {
        this.onUpdate(this.index, this.content);
    }
}

class Writer {
    constructor(containerId, statusId) {
        this.container = document.getElementById(containerId);
        this.status = document.getElementById(statusId);
        this.notes = this.loadNotes();
        this.renderNotes();

        const lastSaved = localStorage.getItem("lastSaved");
        if (lastSaved) {
            this.status.textContent = user.STORED_MESSAGE + lastSaved;
        }
    }

    loadNotes() {
        const notesData = localStorage.getItem("notes");
        if (notesData) {
            const notesArray = JSON.parse(notesData);
            return notesArray.map((note, idx) =>
                new Note(note.content, idx, this.removeNote.bind(this), this.updateNote.bind(this))
            );
        }
        return [];
    }

    saveNotes() {
        const notesData = JSON.stringify(this.notes.map(note => ({ content: note.content })));
        localStorage.setItem("notes", notesData);
        const now = new Date().toLocaleTimeString();
        localStorage.setItem("lastSaved", now);
        this.status.textContent = user.STORED_MESSAGE + now;
    }

    addNote(content = "") {
        const idx = this.notes.length;
        const newNote = new Note(content, idx, this.removeNote.bind(this), this.updateNote.bind(this));
        this.notes.push(newNote);
        this.renderNotes();
        this.saveNotes();
    }

    removeNote(index) {
        this.notes.splice(index, 1);
        // Re-index notes
        this.notes.forEach((note, idx) => note.index = idx);
        this.renderNotes();
        this.saveNotes();
    }

    updateNote(index, newContent) {
        this.notes[index].content = newContent;
        this.saveNotes();
    }

    renderNotes() {
        this.container.innerHTML = "";
        this.notes.forEach(note => note.render(this.container));
    }
}

window.onload = () => {
    const app = new Writer("notesContainer", "lastSaved");
    document.getElementById("addBtn").addEventListener("click", () => app.addNote());
};
