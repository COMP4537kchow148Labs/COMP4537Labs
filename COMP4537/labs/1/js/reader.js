import { user } from '../lang/messages/en/user.js';

class Note {
    constructor(content) {
        this.content = content;

        this.textArea = document.createElement("textarea");
        this.textArea.value = this.content;
        this.textArea.readOnly = true;

        this.noteDiv = document.createElement("div");
        this.noteDiv.className = "note";
        this.noteDiv.appendChild(this.textArea);
    }

    render(container) {
        container.appendChild(this.noteDiv);
    }
}

class Reader {
    constructor(containerId, statusId) {
        this.container = document.getElementById(containerId);
        this.status = document.getElementById(statusId);
        this.currentNotes = localStorage.getItem("notes");

        this.notes = this.loadNotes();
        this.renderNotes();
        const lastSaved = localStorage.getItem("lastSaved");
        if (lastSaved) {
            this.status.textContent = user.UPDATED_MESSAGE + lastSaved;
        }
        this.retrieveNotes();
    }

    loadNotes() {
        const notesData = localStorage.getItem("notes");
        if (notesData) {
            const notesArray = JSON.parse(notesData);
            return notesArray.map(note => new Note(note.content));
        }
        return [];
    }

    renderNotes() {
        this.container.innerHTML = "";
        this.notes.forEach(note => note.render(this.container));
    }

    retrieveNotes() {
        setInterval(() => {
            const notesData = localStorage.getItem("notes");
            if (notesData !== this.currentNotes) {
                this.currentNotes = notesData;
                this.notes = this.loadNotes();
                this.renderNotes();

                const lastSaved = localStorage.getItem("lastSaved");
                if (lastSaved) {
                    this.status.textContent = user.UPDATED_MESSAGE + lastSaved;
                }
            }
        }, 2000);
    }
}

window.onload = () => {
    new Reader("notesContainer", "lastRetrieved");
};