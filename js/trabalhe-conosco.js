/* =========================================================
   TOPY'GUT - TRABALHE CONOSCO
   Validações, máscaras e consulta de CEP
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS DO FORMULÁRIO
    ===================================================== */

    const formulario = document.getElementById("formTrabalhe");

    const nome = document.getElementById("nome");
    const nascimento = document.getElementById("nascimento");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const endereco = document.getElementById("endereco");
    const cidade = document.getElementById("cidade");
    const cep = document.getElementById("cep");
    const curriculo = document.getElementById("curriculo");
    const lgpd = document.getElementById("lgpd");


    /* =====================================================
       SEGURANÇA
    ===================================================== */

    if (!formulario) {
        return;
    }


    /* =====================================================
       DATA DE NASCIMENTO
       Impede datas futuras
    ===================================================== */

    if (nascimento) {

        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoje.getDate()
        ).padStart(2, "0");

        nascimento.max =
            `${ano}-${mes}-${dia}`;

    }


    /* =====================================================
       MÁSCARA TELEFONE / WHATSAPP
       Exemplo: (11) 94297-7455
    ===================================================== */

    if (telefone) {

        telefone.addEventListener(
            "input",
            function () {

                let valor =
                    telefone.value.replace(/\D/g, "");

                valor = valor.substring(0, 11);


                if (valor.length > 10) {

                    valor = valor.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

                }

                else if (valor.length > 6) {

                    valor = valor.replace(
                        /^(\d{2})(\d{4,5})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

                }

                else if (valor.length > 2) {

                    valor = valor.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

                }

                else if (valor.length > 0) {

                    valor = valor.replace(
                        /^(\d{0,2})/,
                        "($1"
                    );

                }


                telefone.value = valor;

            }
        );

    }


    /* =====================================================
       FUNÇÃO PARA CONSULTAR O CEP
    ===================================================== */

    async function consultarCep(numeroCep) {

        /*
            Guarda os textos originais para conseguirmos
            restaurar os campos depois da consulta.
        */

        const placeholderEndereco =
            endereco.placeholder;

        const placeholderCidade =
            cidade.placeholder;


        try {

            /* =============================================
               INDICA AO USUÁRIO QUE ESTAMOS CONSULTANDO
            ============================================= */

            endereco.placeholder =
                "Buscando endereço...";

            cidade.placeholder =
                "Buscando cidade...";


            /* =============================================
               CONSULTA VIA CEP
            ============================================= */

            const resposta = await fetch(
                `https://viacep.com.br/ws/${numeroCep}/json/`
            );


            /* =============================================
               ERRO DE CONEXÃO
            ============================================= */

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível consultar o CEP."
                );

            }


            const dados = await resposta.json();


            /* =============================================
               CEP NÃO ENCONTRADO
            ============================================= */

            if (dados.erro) {

                endereco.value = "";
                cidade.value = "";

                alert(
                    "CEP não encontrado.\n\n" +
                    "Confira o número informado ou " +
                    "preencha o endereço manualmente."
                );

                endereco.focus();

                return;

            }


            /* =============================================
               PREENCHIMENTO AUTOMÁTICO
            ============================================= */

            if (dados.logradouro) {

                endereco.value =
                    dados.logradouro;

            }


            if (dados.localidade) {

                cidade.value =
                    dados.localidade;

            }


            /*
                Colocamos o cursor no final da rua.

                Assim a pessoa pode simplesmente acrescentar
                ", 123" ou outro número/complemento.
            */

            endereco.focus();

            const tamanho =
                endereco.value.length;

            endereco.setSelectionRange(
                tamanho,
                tamanho
            );

        }

        catch (erro) {

            console.error(
                "Erro ao consultar CEP:",
                erro
            );


            /*
                Não bloqueamos o formulário.

                Caso a consulta esteja indisponível,
                a pessoa ainda consegue preencher
                endereço e cidade manualmente.
            */

            alert(
                "Não foi possível consultar o CEP " +
                "automaticamente.\n\n" +
                "Você pode preencher o endereço " +
                "manualmente."
            );

        }

        finally {

            endereco.placeholder =
                placeholderEndereco;

            cidade.placeholder =
                placeholderCidade;

        }

    }


    /* =====================================================
       MÁSCARA + CONSULTA AUTOMÁTICA DO CEP

       Exemplo:
       08673020
              ↓
       08673-020
    ===================================================== */

    if (cep) {

        cep.addEventListener(
            "input",
            function () {

                let valor =
                    cep.value.replace(/\D/g, "");

                valor =
                    valor.substring(0, 8);


                /* MÁSCARA */

                if (valor.length > 5) {

                    cep.value =
                        valor.substring(0, 5) +
                        "-" +
                        valor.substring(5);

                }

                else {

                    cep.value = valor;

                }


                /* =========================================
                   CONSULTA QUANDO CHEGAR A 8 NÚMEROS
                ========================================= */

                if (valor.length === 8) {

                    consultarCep(valor);

                }

            }
        );

    }


    /* =====================================================
       VALIDAÇÃO DO CURRÍCULO

       Formatos:
       PDF
       DOC
       DOCX

       Máximo:
       5 MB
    ===================================================== */

    if (curriculo) {

        curriculo.addEventListener(
            "change",
            function () {

                const arquivo =
                    curriculo.files[0];


                if (!arquivo) {
                    return;
                }


                const extensoesPermitidas = [
                    "pdf",
                    "doc",
                    "docx"
                ];


                const extensao =
                    arquivo.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                /* =========================================
                   EXTENSÃO
                ========================================= */

                if (
                    !extensoesPermitidas.includes(
                        extensao
                    )
                ) {

                    alert(
                        "Formato de currículo não permitido.\n\n" +
                        "Envie um arquivo PDF, DOC ou DOCX."
                    );

                    curriculo.value = "";

                    return;

                }


                /* =========================================
                   TAMANHO
                ========================================= */

                const tamanhoMaximo =
                    5 * 1024 * 1024;


                if (
                    arquivo.size >
                    tamanhoMaximo
                ) {

                    alert(
                        "O currículo é muito grande.\n\n" +
                        "O tamanho máximo permitido é 5 MB."
                    );

                    curriculo.value = "";

                }

            }
        );

    }


    /* =====================================================
       VALIDAÇÃO DO FORMULÁRIO
    ===================================================== */

    formulario.addEventListener(
        "submit",
        function (event) {

            /*
                O envio real ainda está desativado.

                Na próxima etapa vamos conectar o
                formulário ao envio por e-mail.
            */

            event.preventDefault();


            /* =============================================
               CAMPOS OBRIGATÓRIOS
            ============================================= */

            if (!formulario.checkValidity()) {

                formulario.reportValidity();

                return;

            }


            /* =============================================
               TELEFONE
            ============================================= */

            const numerosTelefone =
                telefone.value.replace(/\D/g, "");


            if (
                numerosTelefone.length !== 10 &&
                numerosTelefone.length !== 11
            ) {

                alert(
                    "Digite um telefone válido com DDD."
                );

                telefone.focus();

                return;

            }


            /* =============================================
               CEP
            ============================================= */

            const numerosCep =
                cep.value.replace(/\D/g, "");


            if (
                numerosCep.length !== 8
            ) {

                alert(
                    "Digite um CEP válido com 8 números."
                );

                cep.focus();

                return;

            }


            /* =============================================
               CURRÍCULO
            ============================================= */

            if (
                !curriculo.files.length
            ) {

                alert(
                    "Por favor, anexe seu currículo."
                );

                curriculo.focus();

                return;

            }


            /* =============================================
               LGPD
            ============================================= */

            if (!lgpd.checked) {

                alert(
                    "Para enviar sua candidatura, " +
                    "é necessário concordar com o " +
                    "tratamento dos dados pessoais."
                );

                lgpd.focus();

                return;

            }


            /* =============================================
               TESTE CONCLUÍDO
            ============================================= */

            alert(
                "Formulário preenchido corretamente!\n\n" +
                "Na próxima etapa configuraremos o " +
                "envio da candidatura."
            );

        }
    );

});