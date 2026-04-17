// ---------- DADOS GLOBAIS ----------
let tasks = [];
let totalHours = 0;
let todayHours = 0;
let weekHours = [0,0,0,0,0,0,0];
let lastDateTrack = "";

let reminders = {};
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDateStr = "";

// TIMER
let timerInterval = null;
let remainingSeconds = 0;
let isTimerRunning = false;