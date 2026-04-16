function updateTimerDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
  
    document.getElementById("timerDisplay").innerText =
      `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  }
  
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
  
    let mins = parseInt(document.getElementById("timerMinutes").value);
  
    if (isNaN(mins) || mins <= 0) mins = 25;
  
    remainingSeconds = mins * 60;
  
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
  
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        showToast("Tempo acabou!");
      }
    }, 1000);
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    remainingSeconds = 25 * 60;
    updateTimerDisplay();
  }