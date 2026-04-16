function formatHours(decHours) {
    let hrs = Math.floor(decHours);
    let mins = Math.round((decHours - hrs) * 60);
    if (hrs === 0 && mins === 0) return "0h";
    if (hrs === 0) return `${mins}min`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}min`;
  }
  
  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;'}[m];
    });
  }
  
  function showToast(msg) {
    let toast = document.createElement("div");
    toast.className="toast-msg";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 2500);
  }