// 🔹 Renderiza o calendário
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";
  
    const weekdays = ["D","S","T","Q","Q","S","S"];
  
    // Dias da semana
    weekdays.forEach(d => {
      let dw = document.createElement("div");
      dw.className = "calendar-weekday";
      dw.innerText = d;
      grid.appendChild(dw);
    });
  
    // Espaços vazios antes do mês começar
    let emptyCells = startWeekday === 0 ? 6 : startWeekday - 1;
  
    for (let i = 0; i < emptyCells; i++) {
      let empty = document.createElement("div");
      empty.className = "calendar-day empty";
      grid.appendChild(empty);
    }
  
    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
  
      // 🔹 Dia selecionado
      if (selectedDateStr === dateStr) {
        dayDiv.classList.add("selected");
      }
  
      // 🔹 Verifica lembretes
      const hasReminder = reminders[dateStr] && reminders[dateStr].length > 0;
  
      dayDiv.innerHTML = `
        <div class="day-number">${d}</div>
        ${hasReminder ? '<div class="reminder-flag">🚩</div>' : ''}
      `;
  
      // 🔥 clique corrigido
      dayDiv.addEventListener("click", () => {
        selectDate(dateStr);
      });
  
      grid.appendChild(dayDiv);
    }
  }
  
  
  // 🔹 NOVA FUNÇÃO (ESSENCIAL)
  function selectDate(dateStr) {
    selectedDateStr = dateStr;
  
    // Atualiza calendário (highlight)
    renderCalendar();
  
    // Atualiza título
    const label = document.getElementById("selectedDateLabel");
    if (label) {
      label.innerText = dateStr;
    }
  
    const remList = reminders[dateStr] || [];
    const container = document.getElementById("remindersContainer");
  
    if (!container) return;
  
    // Sem lembretes
    if (remList.length === 0) {
      container.innerHTML = "<i>📭 Nenhum lembrete para este dia.</i>";
    } else {
      container.innerHTML = "";
  
      remList.forEach((rem, idx) => {
        const div = document.createElement("div");
        div.className = "reminder-item";
  
        div.innerHTML = `
          <span>📌 ${escapeHtml(rem)}</span>
          <button class="delete-reminder">🗑️</button>
        `;
  
        div.querySelector(".delete-reminder").addEventListener("click", () => {
          deleteReminder(dateStr, idx);
        });
  
        container.appendChild(div);
      });
    }
  }
  
  
  // 🔹 Adicionar lembrete
  function addReminderToSelected() {
    const input = document.getElementById("newReminderText");
    const text = input.value.trim();
  
    if (!text) return;
  
    if (!reminders[selectedDateStr]) {
      reminders[selectedDateStr] = [];
    }
  
    reminders[selectedDateStr].push(text);
  
    saveDataToLocal();
    input.value = "";
  
    selectDate(selectedDateStr);
  }
  
  
  // 🔹 Deletar lembrete
  function deleteReminder(dateStr, idx) {
    if (reminders[dateStr]) {
      reminders[dateStr].splice(idx, 1);
    }
  
    if (reminders[dateStr]?.length === 0) {
      delete reminders[dateStr];
    }
  
    saveDataToLocal();
    selectDate(dateStr);
  }