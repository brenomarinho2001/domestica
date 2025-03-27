// Importando as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBwdLgRVuzzjz2g-2vYK4JPd_oSjUKsPUE",
  authDomain: "gerenciadordetarefas-b740b.firebaseapp.com",
  databaseURL: "https://gerenciadordetarefas-b740b-default-rtdb.firebaseio.com",
  projectId: "gerenciadordetarefas-b740b",
  storageBucket: "gerenciadordetarefas-b740b.appspot.com",
  messagingSenderId: "162939282423",
  appId: "1:162939282423:web:5f500e7ae2ae7eb4b144f2",
  measurementId: "G-H687DK189N"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Referências dos elementos
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const taskImageInput = document.getElementById("taskImageInput");
const tasksRef = ref(db, "tasks");

// Função para renderizar as tarefas
function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task" + (task.done ? " done" : "");
        taskItem.innerHTML = `
            <div>
                <div>
                    <i></i> ${task.name}
                    ${task.imageUrl ? `<br><img src="${task.imageUrl}" alt="Imagem da tarefa" style="max-width: 100%; max-height: 100%;">` : ""}
                </div>
                <div class="butt">
                    <button class="${task.done ? 'done' : 'notDone'} toggleTaskBtn" data-index="${index}">
                        ${task.done ? "Não Finalizado" : "Finalizado"}
                    </button>
                    <i class="fa fa-trash delete-btn" data-index="${index}"></i>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    const toggleButtons = document.querySelectorAll(".toggleTaskBtn");
    toggleButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            toggleTask(index);
        });
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            deleteTask(index);
        });
    });
}

// Função para adicionar uma nova tarefa com imagem
// Função para adicionar uma nova tarefa com imagem local
function addTask() {
    const taskName = taskInput.value.trim();
    const taskImage = taskImageInput.files[0];

    if (!taskName) return;

    let imageUrl = "";

    if (taskImage) {
        imageUrl = URL.createObjectURL(taskImage); // Gera um URL temporário para a imagem
    }

    get(tasksRef).then((snapshot) => {
        const tasks = snapshot.val() || [];
        tasks.push({ name: taskName, done: false, imageUrl });
        set(tasksRef, tasks);
    });

    taskInput.value = "";
    taskImageInput.value = "";
}




// Função para alternar o status de conclusão da tarefa
function toggleTask(index) {
    get(tasksRef).then((snapshot) => {
        const tasks = snapshot.val() || [];
        tasks[index].done = !tasks[index].done;
        set(tasksRef, tasks);
    });
}

// Função para excluir uma tarefa
function deleteTask(index) {
    get(tasksRef).then((snapshot) => {
        const tasks = snapshot.val() || [];
        tasks.splice(index, 1);
        set(tasksRef, tasks);
    });
}

// Escutando as mudanças no banco de dados em tempo real
onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val() || [];
    renderTasks(tasks);
});

// Configurando o botão de adicionar tarefa
document.getElementById("addTaskBtn").addEventListener("click", addTask);