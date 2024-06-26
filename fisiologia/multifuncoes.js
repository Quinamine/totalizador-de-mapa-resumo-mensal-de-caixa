"use strict"

var keyPrefix = "trmcaixa";

function desfoqueDoFundo(accao) {
    const desfoque = document.querySelector(".desfoque");
    accao === "desfocar" ? 
    desfoque.classList.add("on") :
    desfoque.classList.remove("on");
}

function alertarSobre(msg) {
    const dialogBoxDefault = document.querySelector(".dialog-box-default--small");
    const dialogBoxDefault__console = dialogBoxDefault.querySelector(".dialog-box-default__p--js-console");

    dialogBoxDefault__console.textContent = msg;

    clearInterval(btnAutoCloseLoop);
    let time = 15;
    const btn__outputTime = document.querySelector(".dialog-box-default__output-autoclose-loop");
    btn__outputTime.textContent = `(${time--}s)`;
    btnAutoCloseLoop = setInterval(() => {
        btn__outputTime.textContent = `(${time--}s)`;
        if(time < 0) {
            dialogBoxDefault.classList.remove("--open");
            clearInterval(btnAutoCloseLoop);
        }

    }, 1000);
    dialogBoxDefault.classList.add("--open");
}

function destacarCelulasComConteudoOmisso() {
    const celulas = document.querySelectorAll(".ficha__col-de-inputs input");

    let celulasSaturadas = 0;
    for(const c of celulas) {
        c.classList.remove("--font-small");
        c.classList.remove("celula-saturada");
        
        if(c.clientWidth > 100) {
            if(c.value.length > 22) {
                c.classList.add("celula-saturada");
                celulasSaturadas++;
            }
            
        } else {
            if(c.value.length > 6) {
                c.classList.add("celula-saturada");
                celulasSaturadas++;
            }
        }
    }
    
    if(celulasSaturadas > 0) {
        setTimeout(() => {
            const motivoDeSaturacao = document.querySelector(".artigo__details-motivo-de-red-cells");

            menu.abrirArtigo("ajuda");
            motivoDeSaturacao.setAttribute("open", "");
            motivoDeSaturacao.scrollIntoView();
        }, 2500);
    }  
}

function removerDestaqueDeRedCells() {
    const celulas = document.querySelectorAll(".ficha__col-de-inputs input");

    for (const c of celulas) c.classList.remove("celula-saturada");
}

function actualizarAnoDeCopyright() {
    const tempo = new Date();
    let anoActual = tempo.getFullYear();

    if(anoActual < 2024) anoActual = 2024;

    const currentYearOutput = document.querySelector(".footer__current-year");
    currentYearOutput.textContent = anoActual;
}

function sugerirMesEAnoActual() {
    const tempo = new Date();


    let mesActual = tempo.getMonth();
    mesActual++;
    mesActual = mesActual.toString()
    if(mesActual.length === 1) {
        mesActual = 0 + mesActual;
    }

    const casasDecimaisDoMes = document.querySelectorAll(".datalist-mes"); 
    for(let i=0; i < mesActual.length; i++) {
        casasDecimaisDoMes[i].innerHTML = `<option value=${mesActual[i]}></option>`
    }

    const casasDecimaisDoAno = document.querySelectorAll(".datalist-ano");
    let anoActual = tempo.getFullYear();
    anoActual = anoActual.toString();

    for(let i=0; i < anoActual.length; i++) {
        casasDecimaisDoAno[i].innerHTML = `<option value=${anoActual[i]}></option>`
    }
}

function formatarNumeros() {
    const numeros = document.querySelectorAll(".number-format");

    for (const n of numeros) {
        n.textContent = Number(n.textContent).toLocaleString();
    }
}

function animarJanelaAberta(event) {
    const janela = document.querySelector(".dialog-box-esvaziar-ficha");
    if(janela.matches(".--open")) {
        event === "mousedown" ? 
        janela.classList.add("--mexer") : 
        janela.classList.remove("--mexer");
    }
}

let btnAutoCloseLoop;
window.addEventListener("load", () => {
    const readonlyInputs = document.querySelectorAll("[readonly]");
    readonlyInputs.forEach ( inputTarget => inputTarget.addEventListener("click", () => {
        const readonlyInputsMsg = "Os totais estão inacessíveis para assegurar que não sejam modificados.";
        alertarSobre(readonlyInputsMsg);
    }));

    const inputsCelulares = document.querySelectorAll(".ficha__col-de-inputs input");
    inputsCelulares.forEach (inputCelular => inputCelular.addEventListener("input", destacarCelulasComConteudoOmisso));
    destacarCelulasComConteudoOmisso();

    // Actualizar o ano 
    actualizarAnoDeCopyright();
    sugerirMesEAnoActual();
    formatarNumeros();

    // Animar Janela Aberta
    const desfoque = document.querySelector(".desfoque");
    desfoque.addEventListener("mousedown", event => animarJanelaAberta(event.type));
    desfoque.addEventListener("mouseup", event => animarJanelaAberta(event.type));

});
