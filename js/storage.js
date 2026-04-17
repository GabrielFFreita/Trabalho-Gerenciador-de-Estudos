function saveDataToLocal() {
    const data = { tasks, totalHours, todayHours, weekHours, lastDateTrack, reminders };
    localStorage.setItem("smartstudy_full", JSON.stringify(data));
  }
  
  function loadDataFromLocal() {
    const saved = localStorage.getItem("smartstudy_full");
  
    if (saved) {
      try {
        const d = JSON.parse(saved);
        tasks = d.tasks || [];
        totalHours = d.totalHours || 0;
        todayHours = d.todayHours || 0;
        weekHours = d.weekHours || [0,0,0,0,0,0,0];
        lastDateTrack = d.lastDateTrack || "";
        reminders = d.reminders || {};
      } catch(e) {}
    }
  
    if(tasks.length===0){
      tasks = [
        { id:1, text:"Revisar algoritmos", completed:false },
        { id:2, text:"Praticar JavaScript", completed:true }
      ];
    }
  
    if(Object.keys(reminders).length===0){
      reminders = {
        [`${new Date().toISOString().slice(0,10)}`]: ["Estudar 2h de matemática"]
      };
    }
  
    if(weekHours.every(v=>v===0)){
      weekHours = [1.2,2.5,0.8,3.0,1.5,0.5,0.2];
    }
  
    const todayStr = new Date().toISOString().slice(0,10);
    if (lastDateTrack !== todayStr) {
      todayHours = 0;
      lastDateTrack = todayStr;
      saveDataToLocal();
    }
  }