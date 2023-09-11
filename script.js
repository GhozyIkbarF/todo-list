const dateTime = document.getElementById('dateTime');
const form = document.getElementById('form-create-todo');
const searchInput = document.getElementById('search-task');
const btn_close_modal = document.getElementById('btn-close-modal');

let todoList = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = form.elements.task.value;
    const date = form.elements.date.value;

    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const uniqid = randLetter + Date.now();

    const todoObject = generateTodoObject(uniqid, task, changeFormatDate(date), false)
    todoList.push(todoObject);
    saveTodo()
    form.reset();
});

searchInput.addEventListener('keyup', () => displayTodo())
searchInput.addEventListener('keydown', () => displayTodo())

function createTask(item) {
    let todo
    item.isCompleted ?
        todo = document.querySelector('.todo-complete') :
        todo = document.querySelector('.todo-uncomplete')

    const task_wrapper = document.createElement('div');
    task_wrapper.classList.add('task-wrappper');

    const task = document.createElement('div');
    task.classList.add('task');
    const action_task = document.createElement('p');
    action_task.innerText = item.task
    const date_task = document.createElement('p');
    date_task.innerText = item.date

    task.append(action_task, date_task)

    const actions = document.createElement('div');
    actions.classList.add('actions')
    const btn_delete = document.createElement('button');
    btn_delete.innerText = 'Delete';
    btn_delete.id = item.id;

    btn_delete.addEventListener('click', () => deleteTask(item.id))

    let btn
    function btnIsCompleted(isCompleted) {
        btn = document.createElement('button');
        isCompleted ? btn.innerText = 'Move' : btn.innerText = 'Done';
        btn.addEventListener('click', () => isTaskDone(item.id))
        actions.append(btn, btn_delete)
    }
    btnIsCompleted(item.isCompleted)
    task_wrapper.append(task, actions);
    todo.append(task_wrapper)
}

function displayTodo() {
    document.querySelector('.todo-complete').innerHTML = '';
    document.querySelector('.todo-uncomplete').innerHTML = ''
    todoList.forEach((item) => {
        if (item?.task?.toLowerCase().includes(searchInput.value)) createTask(item)
    })
};

function generateTodoObject(id, task, date, isCompleted) {
    return { id, task, date, isCompleted }
}

function renderTask() {
    todoList = [];
    const getList = JSON.parse(localStorage.getItem("list"));
    if (getList) getList.forEach(item => {
        todoList.push(item);
    });
    displayTodo();
}

function saveTodo() {
    localStorage.setItem('list', JSON.stringify(todoList));
    renderTask()
}

function deleteTask(id) {
    const filter = todoList.filter(item => item.id !== id);
    todoList = filter
    saveTodo();
}

const input_modal = document.getElementById('input-modal')
let initial;
const modal = document.getElementById('modal');
let indexTodo;
function isTaskDone(param) {
    const getindex = todoList.findIndex(item => item.id === param)
    indexTodo = getindex
    initial = [...todoList];
    if (initial[getindex].isCompleted) {
        modal.style.display = 'flex';
        input_modal[0].value = initial[getindex].task;
    } else {
        initial[getindex].isCompleted = true
        todoList = initial
        saveTodo(todoList)
    }
}

btn_close_modal.addEventListener('click', () => {
    modal.style.display = 'none';
})
input_modal.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = input_modal.elements.task.value;
    const date = input_modal.elements.date.value;

    initial[indexTodo].task = task;
    initial[indexTodo].date = changeFormatDate(date)
    initial[indexTodo].isCompleted = false;
    todoList = initial
    input_modal.reset();
    modal.style.display = 'none';
    saveTodo(todoList)
});

$(function inputDate() {
    $("#date-input").datepicker({
        changeYear: true,
        gotoCurrent: true,
        autoSize: true,
        minDate: 0,
        dateFormat: "yy-mm-dd",
    });
    inputDate()
});

function setDateToday() {
    const dateInput = document.getElementById("date-input");
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today
}

function changeFormatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
    const newFormat = date.split('-');
    const indexMonth = Number(newFormat[1] - 1);
    return `${months[indexMonth]} ${newFormat[2]}, ${newFormat[0]}`;
}

setInterval(() => {
    const date = new Date();

    // Specify the locale as 'id-ID' for Indonesian
    const locale = 'id-ID';

    // Specify date and time formatting options
    const options = {
        weekday: 'long', // Full day name (e.g., "Senin")
        year: 'numeric', // Four-digit year (e.g., "2023")
        month: 'long', // Full month name (e.g., "Januari")
        day: 'numeric', // Day of the month (e.g., "1")
        hour: 'numeric', // Hour (e.g., "13" for 1 PM)
        minute: 'numeric', // Minute (e.g., "30")
        second: 'numeric', // Second (e.g., "45")
        hour12: false, // Use 24-hour format (true for AM/PM format)
        timeZoneName: 'short' // Time zone name (e.g., "WIB")
    };

    // Format the date and time
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

    dateTime.innerText = formattedDate
}, 1000);

document.addEventListener("DOMContentLoaded", function () {
    renderTask();
});