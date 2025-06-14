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
        if(inputTarget.dataset.totaleixoxoutput) {
            const algarismosDoQuartetoCelular = document.querySelectorAll(`.${inputTarget.dataset.quartetocelular}`);
            const contraAlgarismos = document.querySelectorAll(`.${inputTarget.dataset.contraquarteto}`);
            let valorDoQuartetoCelular = "", contraValor = "";
            for (let i=0; i < algarismosDoQuartetoCelular.length; i++) {
                valorDoQuartetoCelular += algarismosDoQuartetoCelular[i].value;
                contraValor += contraAlgarismos[i].value;
            }
            let total = Number(valorDoQuartetoCelular) + Number(contraValor);
            total = total.toString();
            const celulasDeSaida = document.querySelectorAll(`.${inputTarget.dataset.totaleixoxoutput}`);
            this.preencherTotalAoQuartetoCelularDeSaida(total, celulasDeSaida);
        } 
        if(inputTarget.parentElement.dataset.coltitle === "receitas-aviadas") {
            let classNameDosOperandos = inputTarget.dataset.totaleixoy;
            inputTarget.classList.add(`${classNameDosOperandos}`);
            const operandos = document.querySelectorAll(`.${classNameDosOperandos}`);
            const celulaDeSaida = document.querySelector(`.${inputTarget.dataset.totaleixoyoutput}`);
            celulaDeSaida.value = this.somar(operandos);
            return false;
        }
        if(inputTarget.dataset.totaleixoy) {
            const operandos = document.querySelectorAll(`.${inputTarget.dataset.totaleixoy}`)
            let contraAlgarismos, contraValor = "";
            let total = 0;
            for (let i=0; i < operandos.length; i+=4) {
                contraAlgarismos = document.querySelectorAll(`.${operandos[i].dataset.quartetocelular}`);
                for (const algarismo of contraAlgarismos) {
                    contraValor += algarismo.value;
                }
                total+= Number(contraValor)
                contraValor = ""
            }
            total = total.toString();
            const celulasDeSaida = document.querySelectorAll(`.${inputTarget.dataset.totaleixoyoutput}`);
            this.preencherTotalAoQuartetoCelularDeSaida(total, celulasDeSaida);
        }
        if(inputTarget.dataset.totalgeral) {
            const operandos = document.querySelectorAll(`.${inputTarget.dataset.totalgeral}`)
            let contraAlgarismos, contraValor = "";
            let total = 0;
            for (let i=0; i < operandos.length; i+=4) {
                contraAlgarismos = document.querySelectorAll(`.${operandos[i].dataset.quartetocelular}`);
                for (const algarismo of contraAlgarismos) {
                    contraValor += algarismo.value;
                }
                total+= Number(contraValor)
                contraValor = ""
            }
            total = total.toString();
            const celulasDeSaida = document.querySelectorAll(`.${inputTarget.dataset.totalgeraloutput}`);
            this.preencherTotalAoQuartetoCelularDeSaida(total, celulasDeSaida);
        }
    },
    preencherTotalAoQuartetoCelularDeSaida(total, celulasDeSaida) {
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
    },
    somar(celulasPorTotalizar) {
        let soma = 0;
        for(const c of celulasPorTotalizar) {
            soma += Number(c.value);
        }
        return soma;
    }
}
const mapa = {
    toRadioCheckboxes(checkboxes) {
        checkboxes.forEach (checkbox => {
            checkbox.addEventListener("change", () => {
                for (const c of checkboxes) c.checked = false;
                checkbox.checked = true;
            });
        });
    },
    saveCheckboxOption(checkboxes, key) {
        for(const checkbox of checkboxes) {
            checkbox.addEventListener("change", () => localStorage.setItem(`${key}`, checkbox.id));
            let checkboxSavedOnStorage = localStorage.getItem(`${key}`);
            if(checkboxSavedOnStorage) {
                checkbox.checked = false;
                if(checkbox.id === checkboxSavedOnStorage) {
                    checkbox.checked = true;
                }
            }
        }
    },
    simularDuplicadoOuTriplicado(checkbox) {
        const ficha = document.querySelector(".ficha");
        let copia = checkbox.dataset.copiadaficha;
        ficha.classList.remove("ficha--duplicado");
        ficha.classList.remove("ficha--triplicado");
        ficha.classList.add(`${copia}`);
    }
}
function escutarEventos() {
    const inputsCelulares = document.querySelectorAll("[data-totaleixoy]");
    inputsCelulares.forEach( inputCelular => {
        inputCelular.addEventListener("input", () => totalizador.filtrarEtotalizarCelulas(inputCelular));
        inputCelular.classList.add(`${inputCelular.dataset.totaleixoy}`);
        inputCelular.classList.add(`${inputCelular.dataset.totalgeral}`);
        inputCelular.classList.add(`${inputCelular.dataset.quartetocelular}`);
        setTimeout(() => {
            inputCelular.value !== "" && totalizador.filtrarEtotalizarCelulas(inputCelular);
        }, 0)
    });
    // Simular Duplicado ou triplicado
    const checkboxesBgcModifiers = document.querySelectorAll(".ficha__rodape input[type=checkbox]");
    mapa.toRadioCheckboxes(checkboxesBgcModifiers);
    let checkboxStorageKey = "tmrmc-copia"
    mapa.saveCheckboxOption(checkboxesBgcModifiers, checkboxStorageKey);
    checkboxesBgcModifiers.forEach( checkbox => {
        checkbox.addEventListener("change", () => {
            mapa.simularDuplicadoOuTriplicado(checkbox);
        });
        checkbox.checked && mapa.simularDuplicadoOuTriplicado(checkbox);
    });
}
window.addEventListener("load", () => {
    backup();
    escutarEventos();
});




