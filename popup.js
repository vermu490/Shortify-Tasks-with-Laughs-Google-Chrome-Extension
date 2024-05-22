let generateBtn = document.querySelector("#shortURL");
let api = document.querySelector("#myurl");
let toastError = document.querySelector('.toast-error');
let toastSuccess = document.querySelector('.toast-success');
let loader = document.querySelector('.loading');
const url = new URL("https://t.ly/api/v1/link/shorten");
let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

generateBtn.addEventListener('click', () => {
    if (api.value) {
        loader.classList.remove('d-hide');
        chrome.storage.local.get(['API'], function (result) {
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "long_url": api.value,
                    "domain": "https://t.ly/",
                    "api_token": result.API
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(json => {
                loader.classList.add('d-hide');
                toastSuccess.classList.remove('d-hide');
                toastSuccess.textContent = json.short_url;
            }).catch(err => { 
                loader.classList.add('d-hide');
                toastError.classList.remove('d-hide');
                console.error('There was a problem with the fetch operation:', err); 
            });
        });
    } else {
        toastError.classList.remove('d-hide');
        setTimeout(() => {
            toastError.classList.add('d-hide');
        }, 1500);
    }
});

// Todo List Functionality
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// Load the saved todos from local storage when the popup is opened
document.addEventListener('DOMContentLoaded', loadTodos);

todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText !== '') {
        const todoItem = createTodoItem(todoText);
        todoList.appendChild(todoItem);
        todoInput.value = '';
        saveTodos();
    }
}

function createTodoItem(todoText) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('list-group-item', 'todo-item');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', saveTodos); // Save todos when checkbox state changes
    const todoSpan = document.createElement('span');
    todoSpan.textContent = todoText;
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '❌';
    deleteButton.addEventListener('click', function () {
        todoItem.remove();
        saveTodos();
    });
    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoSpan);
    todoItem.appendChild(deleteButton);
    return todoItem;
}

function saveTodos() {
    const todos = [];
    todoList.querySelectorAll('.todo-item').forEach(todoItem => {
        todos.push({
            text: todoItem.querySelector('span').textContent,
            completed: todoItem.querySelector('input').checked
        });
    });
    chrome.storage.local.set({ todos });
}

function loadTodos() {
    chrome.storage.local.get(['todos'], function (result) {
        if (result.todos) {
            result.todos.forEach(todo => {
                const todoItem = createTodoItem(todo.text);
                if (todo.completed) {
                    todoItem.querySelector('input').checked = true;
                }
                todoList.appendChild(todoItem);
            });
        }
    });
}

// Dad Joke Functionality
const dadJokeElement = document.getElementById('dadJoke');

document.addEventListener('DOMContentLoaded', fetchDadJoke);

function fetchDadJoke() {
    fetch('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        dadJokeElement.textContent = data.joke;
    })
    .catch(error => {
        dadJokeElement.textContent = 'Failed to load joke.';
        console.error('Error fetching dad joke:', error);
    });
}
