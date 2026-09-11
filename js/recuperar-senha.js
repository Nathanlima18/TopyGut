/* =========================================================
   TOPY'GUT - RECUPERAÇÃO DE SENHA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const formRecuperarSenha =
        document.getElementById("formRecuperarSenha");

    const emailRecuperacao =
        document.getElementById("emailRecuperacao");

    const novaSenha =
        document.getElementById("novaSenha");

    const confirmarSenha =
        document.getElementById("confirmarSenha");

    const mensagemRecuperacao =
        document.getElementById("mensagemRecuperacao");

    const botao =
        document.querySelector(".btn-redefinir");


    function mostrarMensagem(texto, tipo) {

        mensagemRecuperacao.textContent =
            texto;

        mensagemRecuperacao.className =
            "mensagem-recuperacao " + tipo;

    }


    formRecuperarSenha.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!formRecuperarSenha.checkValidity()) {

                formRecuperarSenha.reportValidity();

                return;

            }


            if (
                novaSenha.value !==
                confirmarSenha.value
            ) {

                mostrarMensagem(
                    "As senhas não coincidem.",
                    "erro"
                );

                confirmarSenha.focus();

                return;

            }


            if (novaSenha.value.length < 8) {

                mostrarMensagem(
                    "A nova senha deve ter pelo menos 8 caracteres.",
                    "erro"
                );

                novaSenha.focus();

                return;

            }


            botao.disabled = true;

            botao.textContent =
                "Redefinindo...";


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/recuperar-senha`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email:
                                    emailRecuperacao
                                        .value
                                        .trim(),

                                novaSenha:
                                    novaSenha.value
                            })
                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    mostrarMensagem(
                        dados.mensagem ||
                        "Não foi possível redefinir a senha.",
                        "erro"
                    );

                    return;

                }


                mostrarMensagem(
                    "Senha redefinida com sucesso. Você já pode voltar ao login.",
                    "sucesso"
                );


                formRecuperarSenha.reset();

            } catch (erro) {

                console.error(
                    "Erro na recuperação:",
                    erro
                );


                mostrarMensagem(
                    "Não foi possível conectar ao servidor.",
                    "erro"
                );

            } finally {

                botao.disabled = false;

                botao.textContent =
                    "Redefinir senha";

            }

        }
    );

});