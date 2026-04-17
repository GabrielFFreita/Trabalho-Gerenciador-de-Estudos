document.addEventListener("DOMContentLoaded", () => {

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuario && usuario.nome) {
      const saudacao = document.getElementById("saudacao");
      if (saudacao) {
        saudacao.textContent = `Olá, ${usuario.nome}`;
      }
    }

    totalHorasSpan = document.getElementById("totalHorasDisplay");
    hojeHorasSpan = document.getElementById("hojeHorasDisplay");
    tarefasConcluidasSpan = document.getElementById("tarefasConcluidasCount");
    totalTarefasSpan = document.getElementById("totalTarefasCount");
    listaContainer = document.getElementById("listaTarefas");
    progressFillDiv = document.getElementById("progressFillBar");
    percentualSpan = document.getElementById("percentualProgresso");

    loadDataFromLocal();

    updateHoursUI();
    renderWeeklyGraph();
    renderTasks();
    renderCalendar();

    if (!selectedDateStr) {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().slice(0,10);
      selectDate(hojeStr);
    }
  
    document.getElementById("registrarEstudoBtn")
      .addEventListener("click", () => {
        let mins = parseInt(document.getElementById("minutosEstudo").value);
        if(mins > 0) {
          addStudyMinutes(mins);
        } else {
          showToast("Insira minutos válidos");
        }
      });
  
    document.getElementById("adicionarTarefaBtn")
      .addEventListener("click", () => {
        let val = document.getElementById("novaTarefaInput").value;
        addTask(val);
        document.getElementById("novaTarefaInput").value = "";
      });
  
    document.getElementById("prevMonthBtn")
      .addEventListener("click", () => {
        currentMonth--;
        if(currentMonth < 0){
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar();
      });
  
    document.getElementById("nextMonthBtn")
      .addEventListener("click", () => {
        currentMonth++;
        if(currentMonth > 11){
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar();
      });
  
    document.getElementById("addReminderBtn")
      .addEventListener("click", addReminderToSelected);
  
    document.getElementById("startTimerBtn")
      .addEventListener("click", startTimer);
  
    document.getElementById("resetTimerBtn")
      .addEventListener("click", resetTimer);

    resetTimer();

    setInterval(() => {
      checkDailyReset();
      saveDataToLocal();
    }, 60000);
  });