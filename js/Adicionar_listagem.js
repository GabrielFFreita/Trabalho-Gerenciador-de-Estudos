const lista = document.querySelector("#lista")
const valor = document.querySelector("#valor")
const btao = document.querySelector("#botao")

btao.addEventListener("click", (e) =>{
    e.preventDefault()
    let dado = valor.value

    let li = document.createElement("li")
    li.textContent(dado)
    lista.appendChild(li)

    valor.value = ""
})