//show all the records present in local storage
showTask();

//import all the required elements using their Id
let inputField = document.getElementById('inputField');
let addToDoButton = document.getElementById('addButton');
let saveButton = document.getElementById('saveButton');
let deleteAllButton = document.getElementById('deleteAllButton');
saveButton.style.display = "none";

//add the taskname entered by user into localstorage onclick of Add button
addToDoButton.addEventListener('click', function() {  
    inputFieldValue = inputField.value;
    //If the user is clicking Add button without entering taskname give alert message
    if(inputFieldValue.trim() == '') {
        alert('Enter a taskname');
        document.getElementById('inputField').style.borderColor = 'red';
    }      
        if(inputFieldValue.trim() != '') {
            document.getElementById('inputField').style.borderColor = 'black';
            //we want to add inputField in local storage
            let webtask = localStorage.getItem('localtask');
            if(webtask == null) {
                //create an array
                taskObj = [];
            }
        else {
            //parse the webtask to JSON as it is present in string format in local storage
            taskObj = JSON.parse(webtask);
        }
        taskObj.push(inputFieldValue);
        localStorage.setItem('localtask', JSON.stringify(taskObj));

        //after adding the user entered value in the local storage make input text field empty
        inputField.value = "";
    }
    //showTask function to present the elements stored in local storage in UI
    showTask();
    analyseTable();
})

//add tasks into added_tasklist_table using showTask() function
function showTask() {
    let webtask = localStorage.getItem('localtask');
    if(webtask == null)
        taskObj = [];
    else
        taskObj = JSON.parse(webtask);
    let html = '';

    taskObj.forEach((item, index) => {       
        html+=`<tr> 
                     <td>
                       <input type="checkbox" name="checkbox" id="checkBox${index}" onchange=cutTaskName(${index}) onchange=analyseTable()>
                     </td>
                     <td>
                        ${item}
                     </td>
                     <td>
                        <button type="button" id="editButton" onclick="editTask(${index})">Edit</button>
                        <button type="button" id="deleteButton" onclick="deleteTask(${index})">Delete</button>
                     </td>
                 </tr>`;       
    });
    let addedTasklistTable = document.getElementById('addedTasklistTable');
    addedTasklistTable.innerHTML = html;
    analyseTable();
}

//edittask function
function editTask(index) {
    let saveIndex = document.getElementById('saveIndex');
    saveIndex.value = index;
    let webtask = localStorage.getItem('localtask');
    let taskObj = JSON.parse(webtask);
    inputField.value = taskObj[index];
    addToDoButton.style.display = "none";
    saveButton.style.display = "inline-block";
}

//savetask into container 
saveButton.addEventListener('click', function() {
    let webtask = localStorage.getItem('localtask');
    let taskObj = JSON.parse(webtask);
    let saveIndex = document.getElementById('saveIndex').value;
    taskObj[saveIndex] = inputField.value;
    localStorage.setItem("localtask", JSON.stringify(taskObj));
    showTask();
    inputField.value = "";
    saveButton.style.display = "none";
    addToDoButton.style.display = "inline-block";
})

//deletetask function
function deleteTask(index) {
    let webtask = localStorage.getItem('localtask');
    let taskObj = JSON.parse(webtask);
    //because we have index so use splice for deleting
    taskObj.splice(index, 1);
    localStorage.setItem("localtask", JSON.stringify(taskObj));
    showTask();
    analyseTable();
}

//deleteall function
deleteAllButton.addEventListener('click', function() {
    let webtask = localStorage.getItem('localtask');
    let taskObj = JSON.parse(webtask);
    localStorage.removeItem('localtask');
    showTask();
    analyseTable();
})

//function to cut taskname on selecting the checkbox 
function cutTaskName(index) {      
    let checkBox = document.getElementById(`checkBox${index}`);
    checkBox.parentElement.nextElementSibling.classList.toggle('checkboxEvaluation');
    analyseTable();    
}

function analyseTable() {
    taskAnalysisTable = document.getElementById('tasklist_analysis_table');
    let addedTasklistTable = document.getElementById('addedTasklistTable');
    var rowCount = addedTasklistTable.getElementsByTagName('tr');    
    let webtask = localStorage.getItem('localtask');
    let taskObj = JSON.parse(webtask);
    var totalTaskCount = taskObj.length;
    document.getElementById('totaltasks').innerText = totalTaskCount;
    let taskCompletedCount = 0;
    for(var i=0; i<rowCount.length; i++) {
        if(rowCount[i].cells[0].getElementsByTagName('input')[0].checked)
           taskCompletedCount+=1;
    }
    document.getElementById('taskscompleted').innerText = taskCompletedCount;
    var taskLeftCount = totalTaskCount - taskCompletedCount;
    document.getElementById('tasksleft').innerText = taskLeftCount;
    var efficiencyCount = (totalTaskCount != 0) ? (taskCompletedCount/totalTaskCount)*100 : 0;
    document.getElementById('efficiency').innerText = efficiencyCount+'%';
}
