import { user } from '../lang/messages/en/user.js';

// Note class represents a single note
class Note {
    constructor(content) {
        this.content = content; // Note content

        //Create textarea
        this.textArea = document.createElement("textarea");
        this.textArea.value = this.content;
        this.textArea.readOnly = true;

        // Create note container
        this.noteDiv = document.createElement("div");
        this.noteDiv.className = "note";
        this.noteDiv.appendChild(this.textArea);
    }

    //Render note and add to container
    render(container) {
        container.appendChild(this.noteDiv);
    }
}

// Manages reading notes from localStorage and displaying them in real time
class Reader {
    constructor(containerId, statusId) {
        document.title = user.READER_PAGE_TITLE;
        document.getElementById("readerTitle").textContent = user.READER_PAGE_TITLE;
        document.getElementById("goBack").textContent = user.GO_BACK;

        this.container = document.getElementById(containerId); // Where notes are displayed
        this.status = document.getElementById(statusId); // Where timestamp is displayed
        this.currentNotes = localStorage.getItem("notes"); // Track current notes state

        this.notes = this.loadNotes(); // Load notes from localStorage
        this.renderNotes(); // Render notes to HTML page
        const lastSaved = localStorage.getItem("lastSaved");
        if (lastSaved) {
            this.status.textContent = user.UPDATED_MESSAGE + lastSaved;
        }
        this.retrieveNotes(); // Start periodic retrieval of notes
    }

    // Load notes from localStorage and create Note objects
    loadNotes() {
        const notesData = localStorage.getItem("notes");
        if (notesData) {
            const notesArray = JSON.parse(notesData);
            //Create Note objects for each note data
            const notes = [];
            notesArray.forEach(note => {
                notes.push(new Note(note.content));
            });
            return notes;
        }
        return [];
    }

    //Render all notes to the container
    renderNotes() {
        this.container.innerHTML = "";
        this.notes.forEach(note => note.render(this.container));
    }

    //Periodically check for updates in localStorage and update notes if changed
    retrieveNotes() {
        setInterval(() => {
            const notesData = localStorage.getItem("notes");
            // Check if notes data has changed
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

// Initialize Reader when page loads
window.onload = () => new Reader("notesContainer", "lastRetrieved");