import { user } from '../lang/messages/en/user.js';

// Note class represents a single note with editing and removal capabilities
class Note {
    constructor(content, index, writer) {
        this.content = content; // Note content
        this.index = index; // Note index in the list
        this.writer = writer;

        // Create textarea
        this.textArea = document.createElement("textarea");
        this.textArea.value = this.content;

        //Save changes when user types
        this.textArea.addEventListener("input", (e) => {
            this.content = e.target.value;
            this.writer.updateNote(this.index, this.content);
        });

        // Create remove button
        this.removeBtn = document.createElement("button");
        this.removeBtn.textContent = "Remove";
        // Attach event listener to handle removal
        this.removeBtn.addEventListener("click", () => {
            this.writer.removeNote(this.index);
            this.noteDiv.remove();
        });

        // Create note container
        this.noteDiv = document.createElement("div");
        this.noteDiv.className = "note";
        this.noteDiv.appendChild(this.textArea);
        this.noteDiv.appendChild(this.removeBtn);
    }

    //Add note to container
    render(container) {
        container.appendChild(this.noteDiv);
    }
}

// Writer class manages the collection of notes
class Writer {
    constructor(containerId, statusId) {
        document.title = user.WRITER_PAGE_TITLE;
        document.getElementById("writerTitle").textContent = user.WRITER_PAGE_TITLE;
        document.getElementById("addBtn").textContent = user.ADD_BUTTON;
        document.getElementById("goBack").textContent = user.GO_BACK;
        
        this.container = document.getElementById(containerId); // Display notes
        this.status = document.getElementById(statusId); // Display timestamp
        this.notes = this.loadNotes(); // Load notes from localStorage
        this.renderNotes(); // Render notes to HTML page

        // Display last saved time
        const lastSaved = localStorage.getItem("lastSaved");
        if (lastSaved) {
            this.status.textContent = user.STORED_MESSAGE + lastSaved;
        }
        //Add event listener to "Add" button
        document.getElementById("addBtn").addEventListener("click", () => this.addNote());  
    }

    // Load notes from localStorage and create Note objects
    loadNotes() {
        const notesData = localStorage.getItem("notes");
        if (notesData) {
            const notesArray = JSON.parse(notesData);
            const loadedNotes = [];
            notesArray.forEach((note, idx) =>{
                loadedNotes.push(new Note(note.content, idx, this))
            });
            return loadedNotes;
        }
        return [];
    }

    // Save notes to localStorage and update timestamp
    saveNotes() {
        const notesData = JSON.stringify(this.notes.map(note => ({ content: note.content })));
        localStorage.setItem("notes", notesData);
        const now = new Date().toLocaleTimeString();
        localStorage.setItem("lastSaved", now);
        this.status.textContent = user.STORED_MESSAGE + now;
    }

    //Add a new note and save changes
    addNote() {
        const idx = this.notes.length;
        const newNote = new Note("", idx, this);
        this.notes.push(newNote);
        this.renderNotes();
        this.saveNotes();
    }

    //Remove note by index, re-index all notes, and save changes
    removeNote(index) {
        this.notes.splice(index, 1);
        // Re-index notes 
        this.notes.forEach((note, idx) => note.index = idx);
        this.renderNotes();
        this.saveNotes();
    }

    //Update note content by index and save changes
    updateNote(index, newContent) {
        this.notes[index].content = newContent;
        this.saveNotes();
    }

    //Render all notes to the container
    renderNotes() {
        this.container.innerHTML = "";
        this.notes.forEach(note => note.render(this.container));
    }
}

// Initialize Writer when page loads
window.onload = () => new Writer("notesContainer", "lastSaved");