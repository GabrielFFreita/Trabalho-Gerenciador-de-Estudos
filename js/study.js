function updateHoursUI() {
    totalHorasSpan.innerText = formatHours(totalHours);
    hojeHorasSpan.innerText = formatHours(todayHours);
  }
  
  function renderWeeklyGraph() {
    const container = document.getElementById("weeklyBars");
    const dias = ["SEG","TER","QUA","QUI","SEX","SÁB","DOM"];
    const maxHoras = Math.max(...weekHours, 0.1);
  
    container.innerHTML = "";
  
    for (let i=0;i<weekHours.length;i++){
      let percent = (weekHours[i]/maxHoras)*100;
  
      const barItem = document.createElement("div");
      barItem.className="bar-item";
  
      barItem.innerHTML = `
        <div class="bar-bg">
          <div class="bar-fill" style="height:${percent}%"></div>
        </div>
        <div class="day-label">${dias[i]}</div>
        <div class="hours-value">${weekHours[i].toFixed(1)}h</div>
      `;
  
      container.appendChild(barItem);
    }
  }
  
  function checkDailyReset() {
    const todayStr = new Date().toISOString().slice(0,10);
  
    if (lastDateTrack !== todayStr){
      todayHours = 0;
      lastDateTrack = todayStr;
      saveDataToLocal();
      updateHoursUI();
    }
  }
  
  function addStudyMinutes(minutes) {
    if (minutes <= 0) return;
  
    const hoursToAdd = minutes / 60;
  
    totalHours += hoursToAdd;
    todayHours += hoursToAdd;
  
    let currentDay = new Date().getDay();
    let weekIndex = (currentDay === 0) ? 6 : currentDay - 1;
  
    weekHours[weekIndex] += hoursToAdd;
  
    updateHoursUI();
    renderWeeklyGraph();
    saveDataToLocal();
  
    // showToast(`✅ +${minutes} min registrados!`);
  }