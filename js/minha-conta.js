/* =========================================================
   TOPY'GUT - MINHA CONTA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const nomeConta =
            document.getElementById(
                "nomeConta"
            );

        const documentoConta =
            document.getElementById(
                "documentoConta"
            );

        const emailConta =
            document.getElementById(
                "emailConta"
            );

        const telefoneConta =
            document.getElementById(
                "telefoneConta"
            );

        const codigoConta =
            document.getElementById(
                "codigoConta"
            );

        const statusConta =
            document.getElementById(
                "statusConta"
            );

        const cepConta =
            document.getElementById(
                "cepConta"
            );

        const ruaConta =
            document.getElementById(
                "ruaConta"
            );

        const numeroConta =
            document.getElementById(
                "numeroConta"
            );

        const complementoConta =
            document.getElementById(
                "complementoConta"
            );

        const bairroConta =
            document.getElementById(
                "bairroConta"
            );

        const cidadeConta =
            document.getElementById(
                "cidadeConta"
            );


        /* =====================================================
           TOKEN
        ===================================================== */

        function obterToken() {

            return (
                sessionStorage.getItem(
                    "topygut_token"
                ) ||
                localStorage.getItem(
                    "topygut_token"
                )
            );

        }


        /* =====================================================
           FORMATAR CNPJ
        ===================================================== */

        function formatarCnpj(
            valor
        ) {

            const numeros =
                String(
                    valor || ""
                ).replace(
                    /\D/g,
                    ""
                );


            if (
                numeros.length !== 14
            ) {

                return valor || "-";

            }


            return numeros.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                "$1.$2.$3/$4-$5"
            );

        }


        /* =====================================================
           FORMATAR CEP
        ===================================================== */

        function formatarCep(
            valor
        ) {

            const numeros =
                String(
                    valor || ""
                ).replace(
                    /\D/g,
                    ""
                );


            if (
                numeros.length !== 8
            ) {

                return valor || "-";

            }


            return numeros.replace(
                /^(\d{5})(\d{3})$/,
                "$1-$2"
            );

        }

        /* =====================================================
   ALTERAR SENHA
===================================================== */

const btnAlterarSenha =
    document.getElementById(
        "btnAlterarSenha"
    );

const modalSenha =
    document.getElementById(
        "modalSenha"
    );

const fecharModalSenha =
    document.getElementById(
        "fecharModalSenha"
    );

const cancelarSenha =
    document.getElementById(
        "cancelarSenha"
    );

const salvarNovaSenha =
    document.getElementById(
        "salvarNovaSenha"
    );

const senhaAtual =
    document.getElementById(
        "senhaAtual"
    );

const novaSenha =
    document.getElementById(
        "novaSenha"
    );

const confirmarNovaSenha =
    document.getElementById(
        "confirmarNovaSenha"
    );


function abrirModalSenha() {

    if (!modalSenha) {
        return;
    }


    senhaAtual.value =
        "";

    novaSenha.value =
        "";

    confirmarNovaSenha.value =
        "";


    modalSenha.classList.add(
        "ativo"
    );


    senhaAtual.focus();

}


function fecharSenha() {

    if (!modalSenha) {
        return;
    }


    modalSenha.classList.remove(
        "ativo"
    );

}


if (btnAlterarSenha) {

    btnAlterarSenha.addEventListener(
        "click",
        abrirModalSenha
    );

}


if (fecharModalSenha) {

    fecharModalSenha.addEventListener(
        "click",
        fecharSenha
    );

}


if (cancelarSenha) {

    cancelarSenha.addEventListener(
        "click",
        fecharSenha
    );

}


if (modalSenha) {

    modalSenha.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modalSenha
            ) {

                fecharSenha();

            }

        }
    );

}


    if (salvarNovaSenha) {

        salvarNovaSenha.addEventListener(
            "click",
            async function () {

                const atual =
                    senhaAtual.value;

                const nova =
                    novaSenha.value;

                const confirmar =
                    confirmarNovaSenha.value;


                if (
                    !atual ||
                    !nova ||
                    !confirmar
                ) {

                    alert(
                        "Preencha todos os campos."
                    );

                    return;

                }


                if (
                    nova.length < 8
                ) {

                    alert(
                        "A nova senha deve ter pelo menos 8 caracteres."
                    );

                    return;

                }


                if (
                    nova !== confirmar
                ) {

                    alert(
                        "A confirmação da nova senha não confere."
                    );

                    return;

                }


                const token =
                    obterToken();


                if (!token) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    window.location.href =
                        "area-cliente.html";

                    return;

                }


                try {

                    salvarNovaSenha.disabled =
                        true;

                    salvarNovaSenha.textContent =
                        "Salvando...";


                    const resposta =
                        await fetch(
                            `${API_URL}/cliente/alterar-senha`,
                            {
                                method:
                                    "PATCH",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        "Bearer " +
                                        token
                                },

                                body:
                                    JSON.stringify({

                                        senhaAtual:
                                            atual,

                                        novaSenha:
                                            nova

                                    })
                            }
                        );


                    const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.mensagem ||
                            "Não foi possível alterar a senha."
                        );

                        return;

                    }


                    alert(
                        "Senha alterada com sucesso."
                    );


                    fecharSenha();


                } catch (erro) {

                    console.error(
                        "Erro ao alterar senha:",
                        erro
                    );


                    alert(
                        "Não foi possível conectar ao servidor."
                    );


                } finally {

                    salvarNovaSenha.disabled =
                        false;

                    salvarNovaSenha.textContent =
                        "Salvar nova senha";

                }

            }
        );

    }

        /* =====================================================
           CARREGAR DADOS DO CLIENTE
        ===================================================== */

        async function carregarMinhaConta() {

            const token =
                obterToken();


            if (!token) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                window.location.href =
                    "area-cliente.html";

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/cliente/minha-conta`,
                        {
                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    token

                            }
                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível carregar seus dados."
                    );

                    return;

                }


                const cliente =
                    dados.cliente;


                /* =============================================
                   DADOS CADASTRAIS
                ============================================= */

                if (nomeConta) {

                    nomeConta.textContent =
                        cliente.razao_social ||
                        "-";

                }


                if (documentoConta) {

                    documentoConta.textContent =
                        formatarCnpj(
                            cliente.cnpj
                        );

                }


                if (emailConta) {

                    emailConta.textContent =
                        cliente.email ||
                        "-";

                }


                if (telefoneConta) {

                    telefoneConta.textContent =
                        cliente.telefone ||
                        "-";

                }


                if (codigoConta) {

                    codigoConta.textContent =
                        "#" +
                        String(
                            cliente.id
                        ).padStart(
                            4,
                            "0"
                        );

                }


                /* =============================================
                   STATUS
                ============================================= */

                if (statusConta) {

                    statusConta.textContent =
                        cliente.status ===
                        "ativo"
                            ? "Conta ativa"
                            : "Conta inativa";


                    statusConta.classList.remove(
                        "status-ativo",
                        "status-inativo"
                    );


                    statusConta.classList.add(
                        cliente.status ===
                        "ativo"
                            ? "status-ativo"
                            : "status-inativo"
                    );

                }


                /* =============================================
                   ENDEREÇO
                ============================================= */

                if (cepConta) {

                    cepConta.textContent =
                        formatarCep(
                            cliente.cep
                        );

                }


                if (ruaConta) {

                    ruaConta.textContent =
                        cliente.endereco ||
                        "-";

                }


                if (numeroConta) {

                    numeroConta.textContent =
                        cliente.numero ||
                        "-";

                }


                if (complementoConta) {

                    complementoConta.textContent =
                        cliente.complemento ||
                        "—";

                }


                if (bairroConta) {

                    bairroConta.textContent =
                        cliente.bairro ||
                        "-";

                }


                if (cidadeConta) {

                    cidadeConta.textContent =
                        cliente.cidade ||
                        "-";

                }


            } catch (erro) {

                console.error(
                    "Erro ao carregar Minha Conta:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }


        /* =====================================================
           MENU MOBILE
        ===================================================== */

        const menuToggle =
            document.getElementById(
                "menuToggle"
            );

        const menu =
            document.querySelector(
                ".menu"
            );


        if (
            menuToggle &&
            menu
        ) {

            menuToggle.addEventListener(
                "click",
                function () {

                    const menuAberto =
                        menu.classList.toggle(
                            "ativo"
                        );


                    menuToggle.classList.toggle(
                        "ativo",
                        menuAberto
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        menuAberto
                    );


                    menuToggle.setAttribute(
                        "aria-label",
                        menuAberto
                            ? "Fechar menu"
                            : "Abrir menu"
                    );

                }
            );


            const linksMenu =
                menu.querySelectorAll(
                    "a"
                );


            linksMenu.forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            menu.classList.remove(
                                "ativo"
                            );

                            menuToggle.classList.remove(
                                "ativo"
                            );

                            menuToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            menuToggle.setAttribute(
                                "aria-label",
                                "Abrir menu"
                            );
                        }
                    );
                }
            );
        }

        /* =====================================================
           INICIAL
        ===================================================== */

        carregarMinhaConta();
    }
);