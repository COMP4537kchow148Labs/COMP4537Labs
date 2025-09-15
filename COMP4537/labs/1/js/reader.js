class Note {
    constructor(content){
        this.content = content;
    }
}

class Reader{
    constructor(containerId, statusId){
        this.container = document.getElementById(containerId);
        this.status = document.getElementById(statusId);
        this.currentNotes = localStorage.getItem("notes");

        this.notes = this.loadNotes();
        this.renderNotes();
        const lastSaved = localStorage.getItem("lastSaved");
        if(lastSaved){
            this.status.textContent = "Updated at: " + lastSaved;
        }
        this.retrieveNotes();
    }

    loadNotes(){
        const notesData = localStorage.getItem("notes");
        if(notesData){
            const notesArray = JSON.parse(notesData);
            return notesArray.map(note => new Note(note.content));
        }
        return [];
    }

    renderNotes(){
        this.container.innerHTML = "";
        this.notes.forEach(note => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note";

            const textArea = document.createElement("textarea");
            textArea.value = note.content;
            textArea.readOnly = true;

            noteDiv.appendChild(textArea);
            this.container.appendChild(noteDiv);
        });
    }

    retrieveNotes(){
        setInterval(() => {
            const notesData = localStorage.getItem("notes");
            if(notesData !== this.currentNotes){
                this.currentNotes = notesData;
                this.notes = this.loadNotes();
                this.renderNotes();
                
                const lastSaved = localStorage.getItem("lastSaved");
                if(lastSaved){
                    this.status.textContent = "Updated at: " + lastSaved;
                }
            }
        }, 2000);
    }
}

window.onload = () => {
    new Reader("notesContainer", "lastRetrieved");
};