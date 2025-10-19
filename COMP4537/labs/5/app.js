function insertDefaultRows(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insertDefaultRows", true); //change to correct URL endpoint later
    xhttp.send();
    xhttp.onreadystatechange = function() {
        const response = JSON.parse(this.responseText);
        if(xhttp.status == 200){
            alert(response.message);
        }

    }
}

function runQuery(){
    const xhttp = new XMLHttpRequest();
    if(document.getElementById("queryInput").value.startsWith("SELECT")){
        xhttp.open("GET", "https:localhost:3000/", true); //change to correct URL endpoint later
        xhttp.send();
        xhttp.onreadystatechange = function(){
            const response = JSON.parse(this.responseText);
            if(xhttp.status == 200){
                populateTable(response.data);
            }
        }
    }
}

function populateTable(data){
    const table = document.getElementById("outputTable").getElementsByTagName("tbody")[0];
    table.innerHTML = ""; // Clear existing table content

    data.forEach(row => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = row.patientId;
        newRow.insertCell(1).textContent = row.patientName;
        newRow.insertCell(2).textContent = row.dateOfBirth;
    });
}

document.getElementById("defaultRowsBtn").addEventListener("click", insertDefaultRows);
document.getElementById("runQueryBtn").addEventListener("click", runQuery);