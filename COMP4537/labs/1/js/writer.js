class Note
{
    constructor(id, content){
        this.id = id;
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
            this.status.textContent = "Stored at: " + lastSaved;
        }
    }

    loadNotes(){
        const notesData = localStorage.getItem("notes");
        if(notesData){
            const notesArray = JSON.parse(notesData);
            return notesArray.map(note => new Note(note.id, note.content));
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
        const newNote = new Note(Date.now().toString(), content);
        this.notes.push(newNote);
        this.renderNotes();
        this.saveNotes();
    }

    removeNote(id){
        this.notes = this.notes.filter(note => note.id !== id);
        this.renderNotes();
        this.saveNotes();
    }

    renderNotes(){
        this.container.innerHTML = "";
        this.notes.forEach(note => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note";
            noteDiv.dataset.id = note.id;

            const textArea = document.createElement("textarea");
            textArea.value = note.content;
            textArea.addEventListener("input", (e) => {
                note.content = e.target.value;
                this.saveNotes();
            });

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => this.removeNote(note.id));

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
