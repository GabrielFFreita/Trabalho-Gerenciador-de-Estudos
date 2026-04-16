function renderTasks() {
    if (tasks.length === 0) {
      listaContainer.innerHTML = `<li class="empty-tasks">📭 Nenhuma tarefa</li>`;
      totalTarefasSpan.innerText = "0";
      tarefasConcluidasSpan.innerText = "0";
      updateGlobalProgress();
      return;
    }
  
    let completedCount = 0;
    listaContainer.innerHTML = "";
  
    tasks.forEach(task => {
      if (task.completed) completedCount++;
  
      const li = document.createElement("li");
      li.className = "task-item";
  
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span class="${task.completed ? "completed-task" : ""}">${escapeHtml(task.text)}</span>
        </div>
      `;
  
      const chk = li.querySelector("input");
  
      chk.addEventListener("change", () => {
        task.completed = chk.checked;
        renderTasks();
        saveDataToLocal();
      });
  
      listaContainer.appendChild(li);
    });
  
    totalTarefasSpan.innerText = tasks.length;
    tarefasConcluidasSpan.innerText = completedCount;
  
    updateGlobalProgress();
  }
  
  function updateGlobalProgress() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
  
    let percent = total === 0 ? 0 : Math.round((completed/total)*100);
  
    percentualSpan.innerText = `${percent}%`;
    progressFillDiv.style.width = `${percent}%`;
  }
  
  function addTask(text) {
    if(!text.trim()) return;
  
    tasks.push({
      id: Date.now()+Math.random(),
      text: text.trim(),
      completed: false
    });
  
    renderTasks();
    saveDataToLocal();
  }