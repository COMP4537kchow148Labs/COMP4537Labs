import { user } from '../lang/messages/en/user.js';

class Note
{
    constructor(content){
        this.content = content;
    }
}

class NoteManager{
    constructor(containerId, statusId){
        this.container = document.getElementById(containerId);
        this.status = document.getElementById(statusId);
        this.notes = this.loadNotes();
        this.renderNotes();

        const lastSaved = localStorage.getItem("lastSaved");
        if(lastSaved){
            this.status.textContent = user.STORED_MESSAGE + lastSaved;
        }
    }

    loadNotes(){
        const notesData = localStorage.getItem("notes");
        if(notesData){
            const notesArray = JSON.parse(notesData);
            return notesArray.map(note => new Note(note.content));
        }
        return [];
    }

    saveNotes(){
        const currentNotes = localStorage.getItem("notes");
        const newNotes = JSON.stringify(this.notes);
        if(currentNotes !== newNotes){
            localStorage.setItem("notes", newNotes);
            const now = new Date().toLocaleTimeString();
            localStorage.setItem("lastSaved", now);
            this.status.textContent = "Stored at: " + now;
        }
    }

    addNote(content = ""){
        const newNote = new Note(content);
        this.notes.push(newNote);
        this.renderNotes();
        this.saveNotes();
    }

    removeNote(index){
        this.notes.splice(index, 1);
        this.renderNotes();
        this.saveNotes();
    }

    renderNotes(){
        this.container.innerHTML = "";
        this.notes.forEach((note, index) => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note";

            const textArea = document.createElement("textarea");
            textArea.value = note.content;
            textArea.addEventListener("input", (e) => {
                note.content = e.target.value;
                this.saveNotes();
            });

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => this.removeNote(index));

            noteDiv.appendChild(textArea);
            noteDiv.appendChild(removeBtn);
            this.container.appendChild(noteDiv);
        });
    }
}

window.onload = () => {
    const app = new NoteManager("notesContainer", "lastSaved");
    document.getElementById("addBtn").addEventListener("click", () => app.addNote());
};
