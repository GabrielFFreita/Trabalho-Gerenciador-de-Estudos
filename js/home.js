let tarefas = [];
let totalHoras = 0;
let hojeHoras = 0;
let horasSemana = [0, 0, 0, 0, 0, 0, 0];
let ultimaDataRastreada = "";
let lembretes = {};
let anoAtual = new Date().getFullYear();
let mesAtual = new Date().getMonth();
let dataSelecionada = "";

let intervaloCronometro = null;
let segundosRestantes = 1500;
let cronometroRodando = false;

const totalHorasSpan = document.getElementById("totalHorasDisplay");
const hojeHorasSpan = document.getElementById("hojeHorasDisplay");
const tarefasConcluidasSpan = document.getElementById("tarefasConcluidasCount");
const totalTarefasSpan = document.getElementById("totalTarefasCount");
const containerLista = document.getElementById("listaTarefas");
const barraProgressoDiv = document.getElementById("progressFillBar");
const percentualSpan = document.getElementById("percentualProgresso");

function formatarHoras(horasDecimais) {
    let horas = Math.floor(horasDecimais);
    let minutos = Math.round((horasDecimais - horas) * 60);
    if (horas === 0 && minutos === 0) return "0h";
    if (horas === 0) return `${minutos}min`;
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
}

function escaparHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        }[m];
    });
}

function mostrarToast(mensagem) {
    let toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerText = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function salvarDadosLocal() {
    const dados = {
        tarefas: tarefas,
        totalHoras: totalHoras,
        hojeHoras: hojeHoras,
        horasSemana: horasSemana,
        ultimaDataRastreada: ultimaDataRastreada,
        lembretes: lembretes
    };
    localStorage.setItem("smartstudy_completo", JSON.stringify(dados));
}

function carregarDadosLocal() {
    const salvo = localStorage.getItem("smartstudy_completo");
    if (salvo) {
        try {
            const d = JSON.parse(salvo);
            tarefas = d.tarefas || [];
            totalHoras = d.totalHoras || 0;
            hojeHoras = d.hojeHoras || 0;
            horasSemana = d.horasSemana || [0, 0, 0, 0, 0, 0, 0];
            ultimaDataRastreada = d.ultimaDataRastreada || "";
            lembretes = d.lembretes || {};
        } catch (e) {
            console.error("Erro ao carregar dados:", e);
        }
    }

    if (tarefas.length === 0) {
        tarefas = [
            { id: 1, texto: "Revisar algoritmos", concluida: false },
            { id: 2, texto: "Praticar JavaScript", concluida: false },
            { id: 3, texto: "Estudar banco de dados", concluida: false }
        ];
    }
    
    if (Object.keys(lembretes).length === 0) {
        const hoje = new Date().toISOString().slice(0, 10);
        lembretes[hoje] = ["📚 Estudar 2 horas de matemática"];
    }

    const hojeStr = new Date().toISOString().slice(0, 10);
    if (ultimaDataRastreada !== hojeStr) {
        hojeHoras = 0;
        ultimaDataRastreada = hojeStr;
        salvarDadosLocal();
    }
}

function atualizarInterfaceHoras() {
    if (totalHorasSpan) totalHorasSpan.innerText = formatarHoras(totalHoras);
    if (hojeHorasSpan) hojeHorasSpan.innerText = formatarHoras(hojeHoras);
}

function verificarResetDiario() {
    const hojeStr = new Date().toISOString().slice(0, 10);
    if (ultimaDataRastreada !== hojeStr) {
        hojeHoras = 0;
        ultimaDataRastreada = hojeStr;
        salvarDadosLocal();
        atualizarInterfaceHoras();
    }
}

function adicionarMinutosEstudo(minutos) {
    if (minutos <= 0) return;
    const horasAdicionar = minutos / 60;
    totalHoras += horasAdicionar;
    hojeHoras += horasAdicionar;
    
    let diaSemana = new Date().getDay();
    let indiceSemana = (diaSemana === 0) ? 6 : diaSemana - 1;
    horasSemana[indiceSemana] += horasAdicionar;
    
    atualizarInterfaceHoras();
    renderizarGraficoSemanal();
    salvarDadosLocal();
    mostrarToast(`✅ +${minutos} min registrados!`);
}

function renderizarGraficoSemanal() {
    const container = document.getElementById("weeklyBars");
    if (!container) return;
    
    const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
    const maxHoras = Math.max(...horasSemana, 0.1);
    container.innerHTML = "";
    
    for (let i = 0; i < horasSemana.length; i++) {
        let percentual = maxHoras === 0 ? 0 : (horasSemana[i] / maxHoras) * 100;
        const itemBarra = document.createElement("div");
        itemBarra.className = "bar-item";
        itemBarra.innerHTML = `
            <div class="bar-bg">
                <div class="bar-fill" style="height: ${percentual}%;"></div>
            </div>
            <div class="day-label">${dias[i]}</div>
            <div class="hours-value">${horasSemana[i].toFixed(1)}h</div>
        `;
        container.appendChild(itemBarra);
    }
}

function deletarTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    renderizarTarefas();
    salvarDadosLocal();
    mostrarToast("🗑️ Tarefa removida!");
}

function renderizarTarefas() {
    if (!containerLista) return;
    
    if (tarefas.length === 0) {
        containerLista.innerHTML = `<li style="text-align:center; padding:1rem; list-style:none;">📭 Nenhuma tarefa cadastrada</li>`;
        if (totalTarefasSpan) totalTarefasSpan.innerText = "0";
        if (tarefasConcluidasSpan) tarefasConcluidasSpan.innerText = "0";
        atualizarProgressoGlobal();
        return;
    }
    
    let concluidas = 0;
    containerLista.innerHTML = "";
    
    tarefas.forEach((tarefa) => {
        if (tarefa.concluida) concluidas++;
        
        const li = document.createElement("li");
        li.className = "item-tarefa task-item";
        
        li.innerHTML = `
            <div class="lado-esquerdo-tarefa task-left">
                <input type="checkbox" class="checkbox-tarefa task-checkbox" data-id="${tarefa.id}" ${tarefa.concluida ? "checked" : ""}>
                <span class="texto-tarefa task-text ${tarefa.concluida ? "completed" : ""}">${escaparHtml(tarefa.texto)}</span>
            </div>
            <div class="acoes-tarefa">
                <button class="botao-excluir-tarefa delete-task" data-id="${tarefa.id}" title="Excluir tarefa">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector(".checkbox-tarefa");
        checkbox.addEventListener("change", (e) => {
            const id = parseInt(e.target.getAttribute("data-id"));
            const tarefaEncontrada = tarefas.find(t => t.id === id);
            if (tarefaEncontrada) {
                tarefaEncontrada.concluida = e.target.checked;
                salvarDadosLocal();
                renderizarTarefas();
                mostrarToast(tarefaEncontrada.concluida ? "✅ Tarefa concluída!" : "📝 Tarefa reaberta");
            }
        });

        const botaoExcluir = li.querySelector(".botao-excluir-tarefa");
        botaoExcluir.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            if (confirm(`❌ Tem certeza que deseja excluir esta tarefa?`)) {
                deletarTarefa(id);
            }
        });
        
        containerLista.appendChild(li);
    });
    
    if (totalTarefasSpan) totalTarefasSpan.innerText = tarefas.length;
    if (tarefasConcluidasSpan) tarefasConcluidasSpan.innerText = concluidas;
    
    atualizarProgressoGlobal();
}

function adicionarTarefa(texto) {
    if (!texto || !texto.trim()) return;
    tarefas.push({
        id: Date.now(),
        texto: texto.trim(),
        concluida: false
    });
    renderizarTarefas();
    salvarDadosLocal();
    mostrarToast("📌 Tarefa adicionada!");
}

function atualizarProgressoGlobal() {
    let total = tarefas.length;
    let concluidas = tarefas.filter(t => t.concluida).length;
    let percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);
    
    if (percentualSpan) percentualSpan.innerText = `${percentual}%`;
    if (barraProgressoDiv) barraProgressoDiv.style.width = `${percentual}%`;
}

function renderizarCalendario() {
    const grade = document.getElementById("calendarGrid");
    if (!grade) return;
    
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const inicioSemana = primeiroDia.getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
    
    grade.innerHTML = "";
    
    const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
    diasSemana.forEach(d => {
        let divDia = document.createElement("div");
        divDia.className = "calendar-weekday";
        divDia.innerText = d;
        grade.appendChild(divDia);
    });
    
    let celulasVazias = inicioSemana === 0 ? 6 : inicioSemana - 1;
    for (let i = 0; i < celulasVazias; i++) {
        let vazio = document.createElement("div");
        vazio.className = "calendar-day empty";
        grade.appendChild(vazio);
    }
    
    for (let d = 1; d <= diasNoMes; d++) {
        const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const temLembrete = lembretes[dataStr] && lembretes[dataStr].length > 0;
        
        const divDia = document.createElement("div");
        divDia.className = "calendar-day";
        if (dataSelecionada === dataStr) divDia.classList.add("selected");
        
        divDia.innerHTML = `
            <div class="day-number">${d}</div>
            ${temLembrete ? '<div class="reminder-dot"></div>' : ''}
        `;
        
        divDia.addEventListener("click", () => {
            selecionarData(dataStr);
        });
        
        grade.appendChild(divDia);
    }

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const tituloMes = document.querySelector(".calendar-header h2");
    if (tituloMes) {
        tituloMes.innerHTML = `<i class="fas fa-calendar-alt"></i> ${meses[mesAtual]} ${anoAtual}`;
    }
}

function selecionarData(dataStr) {
    dataSelecionada = dataStr;
    renderizarCalendario();
    
    const label = document.getElementById("selectedDateLabel");
    if (label) label.innerText = dataStr;
    
    const listaRem = lembretes[dataStr] || [];
    const container = document.getElementById("remindersContainer");
    
    if (!container) return;
    
    if (listaRem.length === 0) {
        container.innerHTML = "<i>📭 Nenhum lembrete para este dia.</i>";
    } else {
        container.innerHTML = "";
        listaRem.forEach((rem, idx) => {
            const div = document.createElement("div");
            div.className = "reminder-item";
            div.innerHTML = `
                <span>📌 ${escaparHtml(rem)}</span>
                <button class="delete-reminder" data-indice="${idx}">🗑️</button>
            `;
            div.querySelector(".delete-reminder").addEventListener("click", () => {
                excluirLembrete(dataStr, idx);
            });
            container.appendChild(div);
        });
    }
}

function excluirLembrete(dataStr, indice) {
    if (lembretes[dataStr]) lembretes[dataStr].splice(indice, 1);
    if (lembretes[dataStr]?.length === 0) delete lembretes[dataStr];
    salvarDadosLocal();
    selecionarData(dataStr);
    mostrarToast("🗑️ Lembrete removido");
}

function adicionarLembreteSelecionado() {
    const input = document.getElementById("newReminderText");
    const texto = input?.value.trim();
    if (!texto || !dataSelecionada) return;
    
    if (!lembretes[dataSelecionada]) lembretes[dataSelecionada] = [];
    lembretes[dataSelecionada].push(texto);
    salvarDadosLocal();
    if (input) input.value = "";
    selecionarData(dataSelecionada);
    mostrarToast("✅ Lembrete adicionado!");
}

function atualizarMostradorCronometro() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    const mostrador = document.getElementById("mostradorCronometro");
    if (mostrador) {
        mostrador.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}

function iniciarCronometro() {
    if (intervaloCronometro) clearInterval(intervaloCronometro);
    
    const inputMinutos = document.getElementById("minutosCronometro");
    let minutos = parseInt(inputMinutos?.value, 10);
    if (isNaN(minutos) || minutos <= 0) minutos = 25;
    
    if (!cronometroRodando) {
        segundosRestantes = minutos * 60;
        atualizarMostradorCronometro();
    }
    
    cronometroRodando = true;
    
    intervaloCronometro = setInterval(() => {
        if (segundosRestantes <= 0) {
            clearInterval(intervaloCronometro);
            intervaloCronometro = null;
            cronometroRodando = false;
            mostrarToast("🎉 TEMPO ESGOTADO! Estudo completo! 🎉");
            atualizarMostradorCronometro();
            return;
        }
        segundosRestantes--;
        atualizarMostradorCronometro();
    }, 1000);
}

function reiniciarCronometro() {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
        intervaloCronometro = null;
    }
    cronometroRodando = false;
    
    const minutos = parseInt(document.getElementById("minutosCronometro")?.value, 10);
    segundosRestantes = (isNaN(minutos) || minutos <= 0) ? 25 * 60 : minutos * 60;
    atualizarMostradorCronometro();
}

document.addEventListener("DOMContentLoaded", () => {

    carregarDadosLocal();
    
    const saudacao = document.getElementById("saudacao");
    if (saudacao) {
        saudacao.textContent = `Olá, estudante! 📚`;
    }

    atualizarInterfaceHoras();
    renderizarGraficoSemanal();
    renderizarTarefas();
    renderizarCalendario();

    if (!dataSelecionada) {
        const hoje = new Date();
        dataSelecionada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    }
    selecionarData(dataSelecionada);

    const botaoRegistrar = document.getElementById("registrarEstudoBtn");
    if (botaoRegistrar) {
        botaoRegistrar.addEventListener("click", () => {
            let minutos = parseInt(document.getElementById("minutosEstudo")?.value, 10);
            if (minutos > 0) {
                adicionarMinutosEstudo(minutos);
                if (document.getElementById("minutosEstudo")) {
                    document.getElementById("minutosEstudo").value = "30";
                }
            } else {
                mostrarToast("⚠️ Insira minutos válidos");
            }
        });
    }

    const botaoAdicionarTarefa = document.getElementById("adicionarTarefaBtn");
    if (botaoAdicionarTarefa) {
        botaoAdicionarTarefa.addEventListener("click", () => {
            const input = document.getElementById("novaTarefaInput");
            if (input && input.value.trim()) {
                adicionarTarefa(input.value.trim());
                input.value = "";
            }
        });
    }
    
    const botaoMesAnterior = document.getElementById("prevMonthBtn");
    const botaoMesProximo = document.getElementById("nextMonthBtn");
    
    if (botaoMesAnterior) {
        botaoMesAnterior.addEventListener("click", () => {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            renderizarCalendario();
            if (dataSelecionada) selecionarData(dataSelecionada);
        });
    }
    
    if (botaoMesProximo) {
        botaoMesProximo.addEventListener("click", () => {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            renderizarCalendario();
            if (dataSelecionada) selecionarData(dataSelecionada);
        });
    }

    const botaoAdicionarLembrete = document.getElementById("addReminderBtn");
    if (botaoAdicionarLembrete) {
        botaoAdicionarLembrete.addEventListener("click", adicionarLembreteSelecionado);
    }

    const botaoIniciar = document.getElementById("botaoIniciarCronometro");
    const botaoReiniciar = document.getElementById("botaoReiniciarCronometro");
    
    if (botaoIniciar) botaoIniciar.addEventListener("click", iniciarCronometro);
    if (botaoReiniciar) botaoReiniciar.addEventListener("click", reiniciarCronometro);

    reiniciarCronometro();

    setInterval(() => {
        verificarResetDiario();
        salvarDadosLocal();
    }, 60000);

    const inputTarefa = document.getElementById("novaTarefaInput");
    if (inputTarefa) {
        inputTarefa.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (inputTarefa.value.trim()) {
                    adicionarTarefa(inputTarefa.value.trim());
                    inputTarefa.value = "";
                }
            }
        });
    }

    const inputLembrete = document.getElementById("newReminderText");
    if (inputLembrete) {
        inputLembrete.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                adicionarLembreteSelecionado();
            }
        });
    }
});