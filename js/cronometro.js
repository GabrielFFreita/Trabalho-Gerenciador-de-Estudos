// ============================================
// CRONÔMETRO
// ============================================

// ---------- VARIÁVEIS ----------
let intervaloCronometro = null;
let segundosRestantes = 1500;
let cronometroRodando = false;

// ---------- MOSTRADOR ----------
function atualizarMostradorCronometro() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;

    document.getElementById("mostradorCronometro").innerText =
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// ---------- INICIAR ----------
function iniciarCronometro() {

    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
    }

    const inputMinutos = document.getElementById("minutosCronometro");
    let minutos = parseInt(inputMinutos.value, 10);

    if (isNaN(minutos) || minutos <= 0) {
        minutos = 25;
    }

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

            mostrarToast("🎉 TEMPO ESGOTADO!");
            atualizarMostradorCronometro();
            return;
        }

        segundosRestantes--;
        atualizarMostradorCronometro();

    }, 1000);
}

// ---------- RESET ----------
function reiniciarCronometro() {

    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
        intervaloCronometro = null;
    }

    cronometroRodando = false;

    const minutos = parseInt(document.getElementById("minutosCronometro").value, 10);

    segundosRestantes = (isNaN(minutos) || minutos <= 0)
        ? 25 * 60
        : minutos * 60;

    atualizarMostradorCronometro();
}

// ---------- EVENTOS ----------
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("botaoIniciarCronometro")
        .addEventListener("click", iniciarCronometro);

    document.getElementById("botaoReiniciarCronometro")
        .addEventListener("click", reiniciarCronometro);

    reiniciarCronometro();
});