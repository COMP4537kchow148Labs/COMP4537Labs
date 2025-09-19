import { user } from '../lang/messages/en/user.js';

function setupIndexPage() {
    document.title = user.TITLE;
    document.getElementById("mainTitle").textContent = user.TITLE;
    document.getElementById("writerLink").textContent = user.WRITER_LINK;
    document.getElementById("readerLink").textContent = user.READER_LINK;
}

window.onload = setupIndexPage;