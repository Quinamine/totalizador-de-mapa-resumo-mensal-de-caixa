"use strict"
const menu = {
    realcarTotaisSe(condicao) {
        const totais = document.querySelectorAll("[readonly]");
        for (const t of totais) {
            if(condicao) {
                t.classList.add("input--realcar-totais");
                localStorage.setItem(`${keyPrefix}-realcarTotais`, true);
            } else {
                t.classList.remove("input--realcar-totais");
                localStorage.removeItem(`${keyPrefix}-realcarTotais`);
            }
        }
    },

    irParaLinha() {
        return {
            dialogBox: document.querySelector(".dialog-box-ir-para"),
            inputNumLinha: document.querySelector(".dialog-box-ir-para__input-linha"),
            numerosDeLinha: document.querySelectorAll(".ficha__body__col-de-dias span"),

            abrirDialogBox() { 
                menu.irParaLinha().dialogBox.classList.add("--open");
                menu.irParaLinha().inputNumLinha.value = "";
                menu.irParaLinha().inputNumLinha.focus();
            },

            fecharDialogBox() {
                menu.irParaLinha().dialogBox.classList.remove("--open");
                menu.irParaLinha().removeLnHighlight();
            },

            goToLn(numLinha) {
                this.removeLnHighlight(); 
                let nL = this.numerosDeLinha;

                let numLinhaMatches = false;
                for(let i = 0; i < nL.length; i++) {
                    if(nL[i].textContent === numLinha) {
                            numLinhaMatches = true;
                            let newIndex = i;
                            if(window.innerWidth > 998) newIndex -= 2;
                            i > 2 ? nL[newIndex].parentElement.scrollIntoView() : document.body.scrollIntoView(); 
                            this.highlightLnFound(nL[i].parentElement);        
                    }
                }  
              
                if(!numLinhaMatches) {
                    const msg = "Nenhuma linha corresponde ao número digitado.";
                    alertarSobre(msg);
                }
            },

            highlightLnFound(lnFound) {
                this.removeLnHighlight();
                lnFound.classList.add("--highlight");
            },

            removeLnHighlight() {
                for(const num of this.numerosDeLinha) {
                    num.parentElement.classList.remove("--highlight");
                }
            }
        }
    },

    esvaziarFicha() {
        return {  
            dialogBox: document.querySelector(".dialog-box-esvaziar-ficha"),
            abrirDialogBox() { 
                const inputsDaFicha = document.querySelectorAll(".ficha input");

                let inputFilled = 0;
                for(const input of inputsDaFicha) {
                    input.value.length > 0 && inputFilled++;
                }

                if(inputFilled === 0) {
                    const noInputFilledMsg = "A ficha já se encontra vazia."
                    alertarSobre(noInputFilledMsg);
                    return false;
                } 

                menu.esvaziarFicha().dialogBox.classList.add("--open");
                desfoqueDoFundo("desfocar");
            },

            fecharDialogBox() {
                menu.esvaziarFicha().dialogBox.classList.remove("--open");
                desfoqueDoFundo("focar");
            },

            confirmar() {
                const inputsGerais  = document.querySelectorAll(".ficha input, textarea");
       
                for (let i = 0; i < inputsGerais.length; i++) {
                    inputsGerais[i].value = "";
                    localStorage.removeItem(`${keyPrefix}-input${i}`);
                }
                menu.esvaziarFicha().fecharDialogBox();
                removerDestaqueDeRedCells();
            }
        }
    },

    imprimirFicha() {
        const comentarios = document.querySelector(".main__campo-de-comentarios");
        comentarios.value === "" ? comentarios.parentElement.classList.add("--no-print") : comentarios.parentElement.classList.remove("--no-print");
        window.print()
    },

    abrirArtigo(artigo) {
        const artigoSobre = document.querySelector(".artigo--sobre");
        const artigoAjuda = document.querySelector(".artigo--ajuda");
        const body = document.querySelector("body");

        artigo === "sobre" ? 
        artigoSobre.classList.add("--open") : 
        artigoAjuda.classList.add("--open");

        body.classList.add("body--overflow-h");
        desfoqueDoFundo("desfocar");
    },

    fecharArtigo(artigo) {
        const artigoSobre = document.querySelector(".artigo--sobre");
        const artigoAjuda = document.querySelector(".artigo--ajuda");
        const body = document.querySelector("body");

        artigo === "sobre" && artigoSobre.classList.remove("--open");

        if(artigo === "ajuda") {
            const details = document.getElementsByTagName("details");
            for (const d of details) {
                d.removeAttribute("open");
            }
            artigoAjuda.classList.remove("--open");
        }

        body.classList.remove("body--overflow-h");
        desfoqueDoFundo("focar");
    }
}

function eventos() {
    // REALCAR TOTAIS
    const checkboxRealcarTotais = document.getElementById("checkbox-realcar-totais");
    const cRt = checkboxRealcarTotais;
    cRt.addEventListener("change", () => cRt.checked ? menu.realcarTotaisSe(1) : menu.realcarTotaisSe(0));

    // Realcar totais no load do windows 
    if(localStorage.getItem(`${keyPrefix}-realcarTotais`)) {
        checkboxRealcarTotais.setAttribute("checked", "checked");
        menu.realcarTotaisSe(1);
    }

    // IR PARA LINHA
    const btnAbrirIrPara = document.querySelector(".header__menu__btn--ir-para");
    btnAbrirIrPara.addEventListener("click", menu.irParaLinha().abrirDialogBox);

    const btnFecharIrPara = document.querySelector(".dialog-box-ir-para__btn--fechar");
    btnFecharIrPara.addEventListener("click", menu.irParaLinha().fecharDialogBox);

    const inputNumLinha = document.querySelector(".dialog-box-ir-para__input-linha");
    inputNumLinha.addEventListener("input", () => {
        inputNumLinha.value !== "" ? 
            menu.irParaLinha().goToLn(inputNumLinha.value) 
            : menu.irParaLinha().removeLnHighlight();
    });

    // Fechar dialog-boxes-default
    const btnsFecharDialogBox = document.querySelectorAll(".dialog-box-default__btn");
    btnsFecharDialogBox.forEach( btn => {
        btn.addEventListener("click", () => {
            let btnParent = btn.parentElement;
            btnParent.parentElement.classList.remove("--open");
            clearInterval(btnAutoCloseLoop);
        });
    });

    // ESVAZIAR FICHA 
    const btnEsvaziarFicha = document.querySelector(".header__menu__btn--esvaziar-ficha");
    btnEsvaziarFicha.addEventListener("click", menu.esvaziarFicha().abrirDialogBox);

    const btnCancelar = document.querySelector(".dialog-box-esvaziar-ficha__btn--cancelar");
    btnCancelar.addEventListener("click", menu.esvaziarFicha().fecharDialogBox);

    const btnConfirmar = document.querySelector(".dialog-box-esvaziar-ficha__btn--confirmar");
    btnConfirmar.addEventListener("click", menu.esvaziarFicha().confirmar);

    // IMPRIMIR 
    const btnImprimir = document.querySelector(".header__menu__btn--imprimir");
    btnImprimir.addEventListener("click", menu.imprimirFicha);

    // Artigos
    const btnAbrirSobre = document.querySelector(".header__menu__btn--sobre");
    btnAbrirSobre.addEventListener("click", () => menu.abrirArtigo("sobre"));

    const btnFecharSobre = document.querySelector(".artigo__btn-x--fechar-sobre")
    btnFecharSobre.addEventListener("click", () => menu.fecharArtigo("sobre"));

    window.addEventListener("resize", () => {
        const artigoSobre = document.querySelector(".artigo--sobre");

        const itsMobile = window.innerWidth < 1024;
        const articleIsOpen = artigoSobre.matches(".--open");
        const body = document.querySelector("body");

        if(itsMobile && articleIsOpen) {
            desfoqueDoFundo("focar");
            location.href = `index.html#${artigoSobre.id}`;
            body.classList.remove("body--overflow-h");
            
        } else if(!itsMobile && articleIsOpen) {
            desfoqueDoFundo("desfocar");
            body.classList.add("body--overflow-h");
        }       
    });

    const btnAbrirAjuda = document.querySelector(".header__menu__btn--ajuda");
    btnAbrirAjuda.addEventListener("click", () => menu.abrirArtigo("ajuda"));

    const btnFecharAjuda = document.querySelector(".artigo__btn-x--fechar-ajuda")
    btnFecharAjuda.addEventListener("click", () => menu.fecharArtigo("ajuda"));

    // PARTILHAR 
    const data = {
        title: "Totalizador de Mapa Resumo Mensal de Caixa",
        text: "Totaliza automaticamente, com base nos dados inseridos pelo usuário, o mapa resumo mensal de caixa. Foi desenvolvido de acordo com o modelo da respectiva ficha de resumo mensal actualmente vigente no Serviço Nacional de Saúde em Moçambique.",
        url: "https://quinamine.github.io/totalizador-de-mapa-resumo-mensal-de-caixa/index.html"
    }

    const btnPartilhar = document.querySelector(".header__menu__btn--partilhar");
    btnPartilhar.addEventListener("click", () => {
        try {
            navigator.share(data).then(()=>console.log("Totalizador partilhado com sucesso."))
            .catch(e=> console.log(`Não foi possivel partilhar o totalizador devido ao erro: ${e}.`))
        } catch (e) {
            console.log("O seu navegador não tem suporte ao método 'navigator.share()'.")
        }
    })

};

window.addEventListener("load", eventos);

window.addEventListener("keydown", event => {

    // CONTROL = 17 && p = 80
    if(event.ctrlKey && event.keyCode === 80) {
        event.preventDefault();
        menu.imprimirFicha();
    }
})
