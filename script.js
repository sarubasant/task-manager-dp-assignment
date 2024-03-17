// Initialize an empty array to store tasks
const tasks = [];

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    const form = e.target; // Get the form element
    const formData = new FormData(form); // Create a FormData object

    // Convert the FormData object into an array of objects
    const formValues = Array.from(formData.entries());

    // Create an object to store the current form data
    const taskObject = {};

    // Iterate through the form values and add them to the taskObject
    for (const [name, value] of formValues) {
        taskObject[name] = value;
    }

    // Check if the button text is "Add" or "Save"
    if (document.getElementById("add-button").innerText === "Add") {
        taskObject.completed = false;
        // Add the taskObject to the tasks array
        tasks.push(taskObject);
    } else {
        // Get the index of the task being edited
        let index = parseInt(document.getElementById("add-button").getAttribute("data-index"));
        // Update the task at the specified index with the new values
        tasks[index] = { ...tasks[index], ...taskObject };
        // Reset the button text to "Add"
        document.getElementById("add-button").innerText = "Add";
        alert("Task Updated Successfully!!")
    }

    // Log the updated tasks array (for demonstration purposes)
    //   console.log(tasks);

    // Clear the form fields (optional)
    form.reset();

    updateTable(tasks);
    showUpcomingIncompleteTasks();

});

function updateTable(tasks) {
    const taskList = document.querySelector("tbody");
    taskList.innerHTML = ""; // Clear existing rows

    // Populate the table with tasks
    tasks.forEach((task) => {
        const row = document.createElement("tr");
        row.className = task.completed ? 'completed' : ""
        for (const key in task) {
            if (key !== 'completed') {
                const cell = document.createElement("td");
                cell.textContent = task[key];
                cell.onclick = () => {
                    task.completed = !task.completed
                    showUpcomingIncompleteTasks();
                    updateTable(tasks);
                }
                row.appendChild(cell);
            }
        }




        // Add Edit and Delete buttons
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            // Handle edit logic here
            const indexToEdit = tasks.findIndex(obj => obj.title === task.title);
            prefillform(indexToEdit);

        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {

            const indexToRemove = tasks.findIndex(obj => obj.title === task.title);

            if (indexToRemove > -1) {
                tasks.splice(indexToRemove, 1);// Remove one item at the specified index
                // remove the row from the table
                updateTable(tasks)
            }


        });

        const buttonCell = document.createElement("td");
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);
        row.appendChild(buttonCell);


        taskList.appendChild(row);
    });

}

function searchTask() {
    const searchInput = document.querySelector('#search').value.toLowerCase();
    var filteredTasks = tasks.filter((task) => {
        // return task.title.toLowerCase().includes(searchValue);
        const titleMatches = task.title.toLowerCase().includes(searchInput);
        const descriptionMatches = task.description.toLowerCase().includes(searchInput);
        const deadlineMatches = task.deadline.toLowerCase().includes(searchInput);
        const priorityMatches = task.priority.toLowerCase().includes(searchInput);
        const categoryMatches = task.category.toLowerCase().includes(searchInput);

        // Return true if any property matches the search input
        return titleMatches || descriptionMatches || deadlineMatches || priorityMatches || categoryMatches;

    })
    updateTable(filteredTasks);
    // console.log(filteredTasks);

}

function showUpcomingIncompleteTasks() {
    const currentDate = new Date(); // Get the current date

    // Filter incomplete tasks
    const incompleteTasks = tasks.filter((task) => !task.completed);

    if (incompleteTasks.length > 0) {
        // Find the earliest task based on the deadline
        const earliestTask = incompleteTasks.reduce((earliest, task) => {
            const taskDeadline = new Date(task.deadline);
            return taskDeadline > currentDate && taskDeadline < new Date(earliest.deadline) ? task : earliest;
        }, incompleteTasks[0]);

        // Display the earliest task details (customize as needed)
        alert(`Upcoming task: ${earliestTask.title}`);
    } else {
        alert("Hurray! Completed All tasks!!!");
    }
}

function prefillform(indexToEdit) {
    const taskToEdit = tasks[indexToEdit];
    document.getElementById('title').value = taskToEdit.title;
    document.getElementById('description').value = taskToEdit.description;
    document.getElementById('deadline').value = taskToEdit.deadline;
    document.getElementById('priority-dropdown').value = taskToEdit.priority;
    document.getElementById('category-dropdown').value = taskToEdit.category;
    document.getElementById('add-button').innerText = "Save";
    document.getElementById("add-button").setAttribute("data-index", indexToEdit);
}