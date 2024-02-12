// Sayfa yüklendiğinde localStorage'dan kaydedilmiş todoları yükler
window.onload = function() {
    var savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
        savedTodos.forEach(function(todo) {
            addTodoUI(todo.text, todo.completed);
        });
    }
};

function addTodo() {
    var input = document.getElementById("todoInput").value;
    if (input === '') {
        alert("Lütfen bir görev giriniz!");
        return;
    }
    addTodoUI(input, false);
    saveTodosToLocalStorage();
    document.getElementById("todoInput").value = "";
}

function addTodoUI(todoText, completed) {
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.textContent = todoText;
    li.appendChild(span);
    if (completed) {
        span.classList.add("completed");
    }
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function() {
        deleteTodo(this);
    };
    li.appendChild(deleteButton);
    var completeButton = document.createElement("button");
    completeButton.textContent = "✓";
    completeButton.classList.add("complete-btn");
    completeButton.onclick = function() {
        completeTodo(this);
    };
    li.appendChild(completeButton);
    document.getElementById("todoList").appendChild(li);
}

function deleteTodo(element) {
    element.parentElement.remove();
    saveTodosToLocalStorage();
}

function deleteAll() {
    document.getElementById("todoList").innerHTML = "";
    localStorage.removeItem('todos');
}

function saveTodosToLocalStorage() {
    var todos = [];
    var todoElements = document.querySelectorAll("#todoList li span");
    todoElements.forEach(function(todoElement) {
        var todo = {
            text: todoElement.textContent,
            completed: todoElement.classList.contains("completed")
        };
        todos.push(todo);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function completeTodo(element) {
    var span = element.parentElement.querySelector("span");
    span.classList.toggle("completed");
    saveTodosToLocalStorage();
}

