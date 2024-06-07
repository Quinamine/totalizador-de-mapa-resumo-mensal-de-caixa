"use strict"

function backup() {
    const inputsGerais = document.querySelectorAll(".ficha input, textarea");

    for (let i = 0; i < inputsGerais.length; i++) {
        
        inputsGerais[i].addEventListener("input", () => {
            localStorage.setItem(`${keyPrefix}-input${i}`, inputsGerais[i].value);
        });
        inputsGerais[i].value = localStorage.getItem(`${keyPrefix}-input${i}`);
    }
}

const totalizador = {
    filtrarEtotalizarCelulas(inputTarget) {
        if(inputTarget.dataset.cobradoousubsidiado) {
            const algarismosDeCobradoOuSubsidiado = document.querySelectorAll(`.${inputTarget.dataset.cobradoousubsidiado}`);
            const contraAlgarismos = document.querySelectorAll(`.${inputTarget.dataset.cobradoousubscorrespondente}`);

            let valCobradoOuSubsidiado = "", contraValor = "";
            for (let i=0; i < algarismosDeCobradoOuSubsidiado.length; i++) {
                valCobradoOuSubsidiado += algarismosDeCobradoOuSubsidiado[i].value;
                contraValor += contraAlgarismos[i].value;

            }
            let total = Number(valCobradoOuSubsidiado) + Number(contraValor);
            total = total.toString();
            const celulasDeSaida = document.querySelectorAll(`.${inputTarget.dataset.totaleixoxoutput}`);
            
            /*celulasDeSaida[3].value = total[total.length - 1]
            celulasDeSaida[2].value = total[total.length - 2]
            celulasDeSaida[1].value = total[total.length - 3]
            celulasDeSaida[0].value = total[total.length - 4]*/

            for (const celula of celulasDeSaida) celula.value = "";

            let outputCellIndex = 3;
            for (let i=1; i <= total.length; i++) {
                if(outputCellIndex >= 0) celulasDeSaida[outputCellIndex].value = total[total.length - i];
                outputCellIndex--;
                if(total.length > 4) {
                    let milhares = total.substr(0, total.length - 3);
                    celulasDeSaida[0].value = Number(milhares).toLocaleString();
                }
            }

        } 


        if(inputTarget.parentElement.dataset.coltitle === "receitas-aviadas") {
            let classNameDosOperandos = inputTarget.dataset.totaleixoy;
            inputTarget.classList.add(`${classNameDosOperandos}`);

            const operandos = document.querySelectorAll(`.${classNameDosOperandos}`);
            const celulaDeSaida = document.querySelector(`.${inputTarget.dataset.totaleixoyoutput}`);
            celulaDeSaida.value = this.somar(operandos);
        } else {
            if(inputTarget.dataset.totaleixoy) {
                const algarismos = document.querySelectorAll(`.${inputTarget.dataset.cobradoousubsidiado}`);
                const operandos = document.querySelectorAll(`.${inputTarget.dataset.totaleixoy}`)

                let valor = "";
                for (let i=0; i < algarismos.length; i++) {
                    valor += algarismos[i].value;
                }

                let contraAlgarismos, contraValor = "";
                for (let i=0; i < operandos.length; i++) {
                    contraAlgarismos = document.querySelectorAll(`.${operandos[i].dataset.cobradoousubsidiado}`);
                    
                }
                    
            }       
        }
    },
    
    somar(celulasPorTotalizar) {
        let soma = 0;
        for(const c of celulasPorTotalizar) {
            soma += Number(c.value);
        }
        return soma;
    }
}

function escutarEventos() {
    const inputsCelulares = document.querySelectorAll("[data-totaleixoy]");
    inputsCelulares.forEach( inputCelular => {
        inputCelular.addEventListener("input", () => totalizador.filtrarEtotalizarCelulas(inputCelular));
        inputCelular.classList.add(`${inputCelular.dataset.totaleixoy}`);
        if(inputCelular.dataset.cobradoousubsidiado) {
            inputCelular.classList.add(`${inputCelular.dataset.cobradoousubsidiado}`);
            //inputCelular.value !== "" && totalizador.filtrarEtotalizarCelulas(inputCelular);
        }
    });
}

window.addEventListener("load", () => {
    backup();
    escutarEventos();    
});




