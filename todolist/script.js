document.addEventListener("DOMContentLoaded", function() {
    var savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
        savedTodos.forEach(function(todo) {
            addTodoUI(todo.text, todo.completed, todo.tags);
        });
    }
});

function addTodo() {
    var todoInput = document.getElementById("todoInput").value;
    var tagInput = document.getElementById("tagInput").value;
    if (todoInput === '' || tagInput === '') {
        alert("Lütfen bir görev ve etiket giriniz!");
        return;
    }
    addTodoUI(todoInput, false, tagInput);
    document.getElementById("todoInput").value = "";
    document.getElementById("tagInput").value = "";
    saveTodosToLocalStorage(); 
}
function completeTodo(element) {
    var span = element.parentElement.querySelector("span");
    span.classList.toggle("completed");

    // Eğer todo tamamlandıysa, etiketlerini de göster
    var tags = element.parentElement.dataset.tags;
    if (span.classList.contains("completed")) {
        showTags(tags);
    } else {
        hideTags();
    }

    saveTodosToLocalStorage();
}


function addTodoUI(todoText, completed, tags) {
    var li = document.createElement("li");
    var span = document.createElement("span");
    li.dataset.tags = tags;

    span.textContent = todoText;
    li.appendChild(span);
    if (completed) {
        span.classList.add("completed");
    }
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", function() {
        deleteTodo(this);
    });
    var completeButton = document.createElement("button");
    completeButton.textContent = "✓";
    completeButton.classList.add("complete-btn");
    completeButton.addEventListener("click", function() {
        completeTodo(this);
    });

    li.appendChild(deleteButton);
    li.appendChild(completeButton);
    document.getElementById("todoList").appendChild(li);

    // Etiket gruplandırmasını ekleyin
    var tagsContainer = document.getElementById("tagsContainer");
    var tagGroup = tagsContainer.querySelector(`.todo-group[data-tag="${tags}"]`);
    if (!tagGroup) {
        tagGroup = document.createElement("div");
        tagGroup.classList.add("todo-group");
        tagGroup.dataset.tag = tags;
        var h2 = document.createElement("h2");
        h2.textContent = tags;
        tagGroup.appendChild(h2);
        tagsContainer.appendChild(tagGroup);
    }
    var tagItem = document.createElement("div");
    tagItem.textContent = todoText;
    tagGroup.appendChild(tagItem);
}

function deleteTodo(element) {
    var todoText = element.parentElement.querySelector("span").textContent;
    element.parentElement.remove();
    deleteTag(todoText); // Etiketi etiket listesinden sil
    saveTodosToLocalStorage();
}

function deleteTag(todoText) {
    var tagsContainer = document.getElementById("tagsContainer");
    var tagItems = tagsContainer.querySelectorAll(".todo-group div");
    tagItems.forEach(function(tagItem) {
        if (tagItem.textContent === todoText) {
            tagItem.remove();
        }
    });
}

function clearAllTodos() {
    var todoList = document.getElementById("todoList");
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    var tagsContainer = document.getElementById("tagsContainer");
    tagsContainer.innerHTML = ""; 
    localStorage.removeItem('todos');
}

function saveTodosToLocalStorage() {
    var todos = [];
    var todoElements = document.querySelectorAll("#todoList li span");
    todoElements.forEach(function(todoElement) {
        var todo = {
            text: todoElement.textContent,
            completed: todoElement.classList.contains("completed"),
            tags: todoElement.parentElement.dataset.tags
        };
        todos.push(todo);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}
function search() {
    var input = document.getElementById("searchInput").value.trim().toLowerCase();
    var todos = document.querySelectorAll("#todoList li");
    var tags = document.querySelectorAll(".todo-group");

    todos.forEach(function(todo) {
        var todoText = todo.querySelector("span").textContent.toLowerCase();
        var todoTags = todo.dataset.tags.toLowerCase().split(",");
        var showTodo = todoText.includes(input) || todoTags.includes(input);

        if (showTodo) {
            todo.style.display = "block";
        } else {
            todo.style.display = "none";
        }
    });

    tags.forEach(function(tag) {
        var tagText = tag.querySelector("h2").textContent.toLowerCase();
        if (tagText.includes(input)) {
            tag.style.display = "block";
        } else {
            tag.style.display = "none";
        }
    });
}

