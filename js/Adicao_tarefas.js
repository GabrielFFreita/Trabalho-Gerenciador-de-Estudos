const tarefa_valor = document.querySelector("#tarefa");

let tarefa = tarefa_valor.value;


let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

tarefas.push(tarefa);


localStorage.setItem("tarefas", JSON.stringify(tarefas));

console.log(tarefas);