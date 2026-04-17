document.addEventListener("DOMContentLoaded", function () {

    const formCadastro = document.getElementById("formularioCadastro");
    const formLogin = document.getElementById("formularioLogin");

    formCadastro.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioExiste = usuarios.find(u => u.email === email);

        if (usuarioExiste) {
            alert("E-mail já cadastrado!");
            return;
        }

        const usuario = { nome, email, senha };

        usuarios.push(usuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Cadastro realizado!");
        formCadastro.reset();
    });

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("emailLogin").value;
        const senha = document.getElementById("senhaLogin").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(u =>
            u.email === email && u.senha === senha
        );

        if (usuario) {
            alert("Login realizado!");

            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            window.location.href = "home.html";

        } else {
            alert("E-mail ou senha incorretos!");
        }
    });

});

// alternar telas
function alternarFormulario(tipo) {
    const cadastro = document.getElementById("formCadastro");
    const login = document.getElementById("formLogin");
    const titulo = document.getElementById("tituloModal");

    if (tipo === "login") {
        cadastro.style.display = "none";
        login.style.display = "block";
        titulo.textContent = "Login";
    } else {
        cadastro.style.display = "block";
        login.style.display = "none";
        titulo.textContent = "Cadastro";
    }
}