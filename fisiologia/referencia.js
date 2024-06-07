"use strict"

const referencia = {
    retornarLinha(inputTarget) {
        const colLinhas = document.querySelectorAll(".ficha__body__col-de-dias span");
        const linhaOuput = document.querySelector(".reference-row__output--linha");
        const inputTargetAndSiblings = inputTarget.parentElement.children;
        let inputTargetIndex = 0;

        for (let i=0; i < inputTargetAndSiblings.length; i++) {
            if(inputTargetAndSiblings[i] === inputTarget) {
                inputTargetIndex = i;
            }
        }

        linhaOuput.value = colLinhas[inputTargetIndex].innerText;

    },

    retornarColuna(inputTarget) {
        const indicadorOutput = document.querySelector(".reference-row__output--coluna");

        let classeDoIndicadorColunar = inputTarget.parentElement.dataset.coltitle;
        let indicadorColunar = document.querySelector(`.${classeDoIndicadorColunar}`).innerText;
        indicadorOutput.innerHTML = indicadorColunar; 

    },

    retornarVazio() {
        const outputs = document.querySelectorAll(".reference-row__output");
        for (const o of outputs) o.value = "";
    }
}

function events() {
    const inputsCelulares = document.querySelectorAll(".ficha__col-de-inputs input");
    inputsCelulares.forEach( inputCelular => {
        inputCelular.addEventListener("focus", () => {
            if(!inputCelular.matches("[readonly]")) {
                referencia.retornarLinha(inputCelular);
                referencia.retornarColuna(inputCelular);
            }
        });
    });

    inputsCelulares.forEach( inputCelular => inputCelular.addEventListener("focusout", referencia.retornarVazio));
}

window.onload = events;