/* =========================================================
   TOPY'GUT - ADMIN CLIENTES
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ===================================================== */

    const btnNovoCliente =
        document.getElementById("btnNovoCliente");

    const btnNovoAdmin =
        document.getElementById("btnNovoAdmin");

    const modalCliente =
        document.getElementById("modalCliente");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const fecharModalCliente =
        document.getElementById("fecharModalCliente");

    const cancelarCliente =
        document.getElementById("cancelarCliente");

    const formCliente =
        document.getElementById("formCliente");

    const tituloModalCliente =
        document.getElementById("tituloModalCliente");

    const pesquisaCliente =
        document.getElementById("pesquisaCliente");

    const totalClientes =
        document.getElementById("totalClientes");

    const clientesVazio =
        document.getElementById("clientesVazio");

    const tabela =
        document.querySelector(".tabela-clientes");

    const tbody =
        tabela
            ? tabela.querySelector("tbody")
            : null;


    /* =====================================================
       MODAL ADMIN
    ===================================================== */

    const modalAdmin =
        document.getElementById("modalAdmin");

    const modalAdminOverlay =
        document.getElementById("modalAdminOverlay");

    const fecharModalAdmin =
        document.getElementById("fecharModalAdmin");

    const cancelarAdmin =
        document.getElementById("cancelarAdmin");

    const formAdmin =
        document.getElementById("formAdmin");

    const nomeAdminNovo =
        document.getElementById("nomeAdminNovo");

    const emailAdminNovo =
        document.getElementById("emailAdminNovo");

    const senhaAdminNovo =
        document.getElementById("senhaAdminNovo");

    const statusAdminNovo =
        document.getElementById("statusAdminNovo");


    /* =====================================================
       CAMPOS DO CLIENTE
    ===================================================== */

    const nomeCliente =
        document.getElementById("nomeCliente");

    const cnpjCliente =
        document.getElementById("cnpjCliente");

    const contatoCliente =
        document.getElementById("contatoCliente");

    const telefoneCliente =
        document.getElementById("telefoneCliente");

    const emailCliente =
        document.getElementById("emailCliente");

    const cepCliente =
        document.getElementById("cepCliente");

    const enderecoCliente =
        document.getElementById("enderecoCliente");

    const numeroCliente =
        document.getElementById("numeroCliente");

    const complementoCliente =
        document.getElementById("complementoCliente");

    const bairroCliente =
        document.getElementById("bairroCliente");

    const cidadeCliente =
        document.getElementById("cidadeCliente");

    const senhaCliente =
        document.getElementById("senhaCliente");

    const statusCliente =
        document.getElementById("statusCliente");

    const statusCnpj =
        document.getElementById("statusCnpj");

    const mensagemCnpj =
        document.getElementById("mensagemCnpj");

    const statusCep =
        document.getElementById("statusCep");

    const mensagemCep =
        document.getElementById("mensagemCep");


    /* =====================================================
       CONTROLE
    ===================================================== */

    let clienteEmEdicao = null;
    let situacaoCnpj = null;


    /* =====================================================
       USUÁRIO LOGADO
    ===================================================== */

    const usuarioSalvo =
        sessionStorage.getItem(
            "topygut_usuario"
        );

    if (
        btnNovoAdmin &&
        usuarioSalvo
    ) {

        try {

            const usuario =
                JSON.parse(usuarioSalvo);

            if (
                usuario.tipo === "master"
            ) {

                btnNovoAdmin.style.display =
                    "block";

            }

        } catch (erro) {

            console.error(
                "Erro ao ler usuário:",
                erro
            );

        }

    }


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
       SOMENTE NÚMEROS
    ===================================================== */

    function somenteNumeros(valor) {

        return String(valor || "")
            .replace(/\D/g, "");

    }


    /* =====================================================
       MÁSCARA CNPJ
    ===================================================== */

    function formatarCnpj(valor) {

        let numeros =
            somenteNumeros(valor)
                .substring(0, 14);

        numeros =
            numeros.replace(
                /^(\d{2})(\d)/,
                "$1.$2"
            );

        numeros =
            numeros.replace(
                /^(\d{2})\.(\d{3})(\d)/,
                "$1.$2.$3"
            );

        numeros =
            numeros.replace(
                /\.(\d{3})(\d)/,
                ".$1/$2"
            );

        numeros =
            numeros.replace(
                /(\d{4})(\d)/,
                "$1-$2"
            );

        return numeros;

    }


    /* =====================================================
       MÁSCARA TELEFONE
    ===================================================== */

    function formatarTelefone(valor) {

        const numeros =
            somenteNumeros(valor)
                .substring(0, 11);

        if (
            numeros.length <= 10
        ) {

            return numeros
                .replace(
                    /^(\d{2})(\d)/,
                    "($1) $2"
                )
                .replace(
                    /(\d{4})(\d)/,
                    "$1-$2"
                );

        }

        return numeros
            .replace(
                /^(\d{2})(\d)/,
                "($1) $2"
            )
            .replace(
                /(\d{5})(\d)/,
                "$1-$2"
            );

    }


    /* =====================================================
       MÁSCARA CEP
    ===================================================== */

    function formatarCep(valor) {

        const numeros =
            somenteNumeros(valor)
                .substring(0, 8);

        return numeros.replace(
            /^(\d{5})(\d)/,
            "$1-$2"
        );

    }


    /* =====================================================
       VALIDAÇÃO CNPJ
    ===================================================== */

    function validarCnpj(cnpj) {

        const numeros =
            somenteNumeros(cnpj);

        if (
            numeros.length !== 14
        ) {

            return false;

        }

        if (
            /^(\d)\1{13}$/.test(numeros)
        ) {

            return false;

        }


        function calcularDigito(
            base,
            pesos
        ) {

            let soma = 0;

            for (
                let i = 0;
                i < pesos.length;
                i++
            ) {

                soma +=
                    Number(base[i]) *
                    pesos[i];

            }

            const resto =
                soma % 11;

            return resto < 2
                ? 0
                : 11 - resto;

        }


        const primeiro =
            calcularDigito(
                numeros.substring(0, 12),
                [
                    5, 4, 3, 2,
                    9, 8, 7, 6,
                    5, 4, 3, 2
                ]
            );


        const segundo =
            calcularDigito(
                numeros.substring(0, 12) +
                primeiro,
                [
                    6, 5, 4, 3,
                    2, 9, 8, 7,
                    6, 5, 4, 3,
                    2
                ]
            );


        return (
            Number(numeros[12]) ===
                primeiro &&
            Number(numeros[13]) ===
                segundo
        );

    }


    /* =====================================================
       STATUS CNPJ
    ===================================================== */

    function limparStatusCnpj() {

        situacaoCnpj = null;

        if (statusCnpj) {
            statusCnpj.textContent = "";
        }

        if (mensagemCnpj) {

            mensagemCnpj.textContent = "";

            mensagemCnpj.className =
                "mensagem-campo";

        }

        if (cnpjCliente) {

            cnpjCliente.classList.remove(
                "campo-valido",
                "campo-invalido"
            );

        }

    }


    function mostrarCnpjSucesso(
        mensagem
    ) {

        if (statusCnpj) {
            statusCnpj.textContent = "✓";
        }

        if (mensagemCnpj) {

            mensagemCnpj.textContent =
                mensagem;

            mensagemCnpj.className =
                "mensagem-campo sucesso";

        }

        cnpjCliente.classList.remove(
            "campo-invalido"
        );

        cnpjCliente.classList.add(
            "campo-valido"
        );

    }


    function mostrarCnpjErro(
        mensagem
    ) {

        if (statusCnpj) {
            statusCnpj.textContent = "✕";
        }

        if (mensagemCnpj) {

            mensagemCnpj.textContent =
                mensagem;

            mensagemCnpj.className =
                "mensagem-campo erro";

        }

        cnpjCliente.classList.remove(
            "campo-valido"
        );

        cnpjCliente.classList.add(
            "campo-invalido"
        );

    }


    function mostrarCnpjAviso(
        mensagem
    ) {

        if (statusCnpj) {
            statusCnpj.textContent = "!";
        }

        if (mensagemCnpj) {

            mensagemCnpj.textContent =
                mensagem;

            mensagemCnpj.className =
                "mensagem-campo aviso";

        }

        cnpjCliente.classList.remove(
            "campo-valido",
            "campo-invalido"
        );

    }


    /* =====================================================
       CONSULTA CNPJ
    ===================================================== */

    async function consultarCnpj() {

        const cnpj =
            somenteNumeros(
                cnpjCliente.value
            );

        limparStatusCnpj();

        if (!cnpj) {
            return;
        }

        if (!validarCnpj(cnpj)) {

            mostrarCnpjErro(
                "CNPJ inválido."
            );

            return;

        }

        mostrarCnpjAviso(
            "Consultando situação cadastral..."
        );


        try {

            const resposta =
                await fetch(
                    "https://brasilapi.com.br/api/cnpj/v1/" +
                    cnpj
                );


            if (!resposta.ok) {

                throw new Error(
                    "Consulta indisponível"
                );

            }


            const dados =
                await resposta.json();


            const situacao =
                String(
                    dados.descricao_situacao_cadastral ||
                    ""
                )
                    .trim()
                    .toUpperCase();


            if (
                situacao === "ATIVA"
            ) {

                situacaoCnpj =
                    "ativa";

                mostrarCnpjSucesso(
                    "CNPJ ativo."
                );


                if (
                    !nomeCliente.value.trim() &&
                    dados.razao_social
                ) {

                    nomeCliente.value =
                        dados.razao_social;

                }

                return;

            }


            situacaoCnpj =
                "inativa";

            mostrarCnpjErro(
                "Situação cadastral: " +
                (
                    situacao ||
                    "não ativa"
                ) +
                "."
            );


        } catch (erro) {

            situacaoCnpj =
                "indisponivel";

            mostrarCnpjAviso(
                "CNPJ válido, mas não foi possível consultar a situação agora."
            );

        }

    }


    /* =====================================================
       STATUS CEP
    ===================================================== */

    function limparStatusCep() {

        if (statusCep) {
            statusCep.textContent = "";
        }

        if (mensagemCep) {

            mensagemCep.textContent = "";

            mensagemCep.className =
                "mensagem-campo";

        }

        cepCliente.classList.remove(
            "campo-valido",
            "campo-invalido"
        );

    }


    function mostrarCepSucesso() {

        if (statusCep) {
            statusCep.textContent = "✓";
        }

        if (mensagemCep) {

            mensagemCep.textContent =
                "CEP encontrado.";

            mensagemCep.className =
                "mensagem-campo sucesso";

        }

        cepCliente.classList.remove(
            "campo-invalido"
        );

        cepCliente.classList.add(
            "campo-valido"
        );

    }


    function mostrarCepErro(
        mensagem
    ) {

        if (statusCep) {
            statusCep.textContent = "✕";
        }

        if (mensagemCep) {

            mensagemCep.textContent =
                mensagem;

            mensagemCep.className =
                "mensagem-campo erro";

        }

        cepCliente.classList.remove(
            "campo-valido"
        );

        cepCliente.classList.add(
            "campo-invalido"
        );

    }


    function limparEndereco() {

        enderecoCliente.value = "";
        bairroCliente.value = "";
        cidadeCliente.value = "";

    }


    /* =====================================================
       CONSULTA CEP
    ===================================================== */

    async function consultarCep() {

        const cep =
            somenteNumeros(
                cepCliente.value
            );

        limparStatusCep();

        if (!cep) {
            return;
        }

        if (
            cep.length !== 8
        ) {

            limparEndereco();

            mostrarCepErro(
                "CEP inválido."
            );

            return;

        }


        if (mensagemCep) {

            mensagemCep.textContent =
                "Buscando endereço...";

            mensagemCep.className =
                "mensagem-campo aviso";

        }


        try {

            const resposta =
                await fetch(
                    "https://viacep.com.br/ws/" +
                    cep +
                    "/json/"
                );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao consultar CEP"
                );

            }


            const dados =
                await resposta.json();


            if (dados.erro) {

                limparEndereco();

                mostrarCepErro(
                    "CEP não encontrado."
                );

                return;

            }


            enderecoCliente.value =
                dados.logradouro || "";

            bairroCliente.value =
                dados.bairro || "";

            cidadeCliente.value =
                dados.localidade || "";


            mostrarCepSucesso();

            numeroCliente.focus();


        } catch (erro) {

            mostrarCepErro(
                "Não foi possível consultar o CEP."
            );

        }

    }


    /* =====================================================
       INICIAIS
    ===================================================== */

    function gerarIniciais(nome) {

        const palavras =
            String(nome || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (
            palavras.length === 0
        ) {

            return "CL";

        }


        if (
            palavras.length === 1
        ) {

            return palavras[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            palavras[0][0] +
            palavras[1][0]
        ).toUpperCase();

    }


    /* =====================================================
       MODAL ADMIN
    ===================================================== */

    function abrirModalAdmin() {

        if (
            !modalAdmin ||
            !formAdmin
        ) {
            return;
        }

        formAdmin.reset();

        statusAdminNovo.value =
            "ativo";

        modalAdmin.classList.add(
            "ativo"
        );

        modalAdmin.setAttribute(
            "aria-hidden",
            "false"
        );

        nomeAdminNovo.focus();

    }


    function fecharModalAdministrador() {

        if (!modalAdmin) {
            return;
        }

        modalAdmin.classList.remove(
            "ativo"
        );

        modalAdmin.setAttribute(
            "aria-hidden",
            "true"
        );

        if (formAdmin) {
            formAdmin.reset();
        }

    }


    /* =====================================================
       CRIAR ADMIN
    ===================================================== */

    if (formAdmin) {

        formAdmin.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (
                    !formAdmin.checkValidity()
                ) {

                    formAdmin.reportValidity();

                    return;

                }


                const token =
                    obterToken();


                if (!token) {

                    alert(
                        "Sessão não encontrada. Faça login novamente."
                    );

                    return;

                }


                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/admins`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        "Bearer " +
                                        token
                                },

                                body:
                                    JSON.stringify(
                                        {
                                            nome:
                                                nomeAdminNovo
                                                    .value
                                                    .trim(),

                                            email:
                                                emailAdminNovo
                                                    .value
                                                    .trim(),

                                            senha:
                                                senhaAdminNovo
                                                    .value,

                                            status:
                                                statusAdminNovo
                                                    .value
                                        }
                                    )
                            }
                        );


                    const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.mensagem ||
                            "Não foi possível criar o administrador."
                        );

                        return;

                    }


                    alert(
                        "Administrador criado com sucesso!"
                    );

                    fecharModalAdministrador();


                } catch (erro) {

                    console.error(
                        "Erro ao criar administrador:",
                        erro
                    );

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }

            }
        );

    }


    /* =====================================================
       MODAL CLIENTE
    ===================================================== */

    function abrirModalNovoCliente() {

        clienteEmEdicao = null;

        situacaoCnpj = null;

        tituloModalCliente.textContent =
            "Novo cliente";

        formCliente.reset();

        limparStatusCnpj();
        limparStatusCep();

        statusCliente.value =
            "ativo";


        /*
           Novo cliente precisa de senha.
        */

        senhaCliente.required =
            true;


        modalCliente.classList.add(
            "ativo"
        );

        modalCliente.setAttribute(
            "aria-hidden",
            "false"
        );


        setTimeout(
            function () {

                nomeCliente.focus();

            },
            50
        );

    }


    function fecharModal() {

        modalCliente.classList.remove(
            "ativo"
        );

        modalCliente.setAttribute(
            "aria-hidden",
            "true"
        );

        clienteEmEdicao = null;

        situacaoCnpj = null;

        formCliente.reset();

        limparStatusCnpj();
        limparStatusCep();

        senhaCliente.required =
            true;

    }


    /* =====================================================
       CRIA LINHA DO CLIENTE
    ===================================================== */

    function criarLinhaCliente(
        dados,
        codigo
    ) {

        const tr =
            document.createElement("tr");

        tr.className =
            "cliente-item";


        tr.dataset.id =
            dados.id || "";

        tr.dataset.nome =
            dados.nome || "";

        tr.dataset.cnpj =
            dados.cnpj || "";

        tr.dataset.contato =
            dados.contato || "";

        tr.dataset.telefone =
            dados.telefone || "";

        tr.dataset.email =
            dados.email || "";

        tr.dataset.cep =
            dados.cep || "";

        tr.dataset.endereco =
            dados.endereco || "";

        tr.dataset.numero =
            dados.numero || "";

        tr.dataset.complemento =
            dados.complemento || "";

        tr.dataset.bairro =
            dados.bairro || "";

        tr.dataset.cidade =
            dados.cidade || "";

        tr.dataset.status =
            dados.status || "ativo";


        const textoStatus =
            dados.status === "inativo"
                ? "Inativo"
                : "Ativo";


        const textoBotao =
            dados.status === "inativo"
                ? "Ativar"
                : "Desativar";


        tr.innerHTML = `

            <td>

                <div class="cliente-identificacao">

                    <div class="cliente-avatar">
                        ${gerarIniciais(dados.nome)}
                    </div>

                    <div>

                        <strong>
                            ${dados.nome}
                        </strong>

                        <span>
                            ${codigo}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${dados.cnpj}
            </td>


            <td>

                <strong>
                    ${dados.contato}
                </strong>

                <br>

                <span>
                    ${dados.telefone}
                </span>

            </td>


            <td>
                ${dados.email}
            </td>


            <td>

                <span class="status ${dados.status}">
                    ${textoStatus}
                </span>

            </td>


            <td>

                <div class="acoes">

                    <button
                        type="button"
                        class="btn-editar"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-desativar"
                    >
                        ${textoBotao}
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                    >
                        Excluir
                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(tr);

        return tr;

    }


    /* =====================================================
       DADOS DO FORMULÁRIO
    ===================================================== */

    function obterDadosFormulario() {

        return {

            nome:
                nomeCliente.value.trim(),

            cnpj:
                cnpjCliente.value.trim(),

            contato:
                contatoCliente.value.trim(),

            telefone:
                telefoneCliente.value.trim(),

            email:
                emailCliente.value.trim(),

            cep:
                cepCliente.value.trim(),

            endereco:
                enderecoCliente.value.trim(),

            numero:
                numeroCliente.value.trim(),

            complemento:
                complementoCliente.value.trim(),

            bairro:
                bairroCliente.value.trim(),

            cidade:
                cidadeCliente.value.trim(),

            senha:
                senhaCliente.value,

            status:
                statusCliente.value

        };

    }


    /* =====================================================
       ATUALIZA LINHA
    ===================================================== */

    function atualizarLinhaCliente(
        cliente,
        dados
    ) {

        cliente.dataset.nome =
            dados.nome;

        cliente.dataset.cnpj =
            dados.cnpj;

        cliente.dataset.contato =
            dados.contato;

        cliente.dataset.telefone =
            dados.telefone;

        cliente.dataset.email =
            dados.email;

        cliente.dataset.cep =
            dados.cep;

        cliente.dataset.endereco =
            dados.endereco;

        cliente.dataset.numero =
            dados.numero;

        cliente.dataset.complemento =
            dados.complemento;

        cliente.dataset.bairro =
            dados.bairro;

        cliente.dataset.cidade =
            dados.cidade;

        cliente.dataset.status =
            dados.status;


        cliente.querySelector(
            ".cliente-avatar"
        ).textContent =
            gerarIniciais(
                dados.nome
            );


        cliente.querySelector(
            ".cliente-identificacao strong"
        ).textContent =
            dados.nome;


        cliente.children[1]
            .textContent =
                dados.cnpj;


        cliente.children[2]
            .innerHTML = `

                <strong>
                    ${dados.contato}
                </strong>

                <br>

                <span>
                    ${dados.telefone}
                </span>

            `;


        cliente.children[3]
            .textContent =
                dados.email;


        const statusElemento =
            cliente.querySelector(
                ".status"
            );


        statusElemento.className =
            "status " +
            dados.status;


        statusElemento.textContent =
            dados.status === "ativo"
                ? "Ativo"
                : "Inativo";


        cliente.querySelector(
            ".btn-desativar"
        ).textContent =
            dados.status === "ativo"
                ? "Desativar"
                : "Ativar";

    }


    /* =====================================================
       ABRIR EDIÇÃO
    ===================================================== */

    function abrirEdicao(cliente) {

        clienteEmEdicao =
            cliente;


        tituloModalCliente.textContent =
            "Editar cliente";


        nomeCliente.value =
            cliente.dataset.nome || "";

        cnpjCliente.value =
            cliente.dataset.cnpj || "";

        contatoCliente.value =
            cliente.dataset.contato || "";

        telefoneCliente.value =
            cliente.dataset.telefone || "";

        emailCliente.value =
            cliente.dataset.email || "";

        cepCliente.value =
            cliente.dataset.cep || "";

        enderecoCliente.value =
            cliente.dataset.endereco || "";

        numeroCliente.value =
            cliente.dataset.numero || "";

        complementoCliente.value =
            cliente.dataset.complemento || "";

        bairroCliente.value =
            cliente.dataset.bairro || "";

        cidadeCliente.value =
            cliente.dataset.cidade || "";

        statusCliente.value =
            cliente.dataset.status ||
            "ativo";


        /*
           Na edição, senha é opcional.
           Se ficar vazia, mantém a atual.
        */

        senhaCliente.value = "";

        senhaCliente.required =
            false;


        situacaoCnpj =
            "ativa";

        mostrarCnpjSucesso(
            "CNPJ cadastrado."
        );


        if (
            cepCliente.value
        ) {

            mostrarCepSucesso();

        }


        modalCliente.classList.add(
            "ativo"
        );

        modalCliente.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       CONTADOR
    ===================================================== */

    function atualizarContador() {

        if (!totalClientes) {
            return;
        }

        const quantidade =
            document.querySelectorAll(
                ".cliente-item"
            ).length;


        totalClientes.textContent =
            quantidade === 1
                ? "1 cliente"
                : quantidade +
                  " clientes";

    }


    /* =====================================================
       ESTADO VAZIO
    ===================================================== */

    function atualizarEstadoVazio() {

        if (
            !tabela ||
            !clientesVazio
        ) {
            return;
        }


        const clientes =
            document.querySelectorAll(
                ".cliente-item"
            );


        let visiveis = 0;


        clientes.forEach(
            function (cliente) {

                if (
                    cliente.style.display !==
                    "none"
                ) {

                    visiveis++;

                }

            }
        );


        if (
            visiveis === 0
        ) {

            clientesVazio.classList.add(
                "mostrar"
            );

            tabela.style.display =
                "none";

        } else {

            clientesVazio.classList.remove(
                "mostrar"
            );

            tabela.style.display =
                "table";

        }

    }


    /* =====================================================
       SALVAR CLIENTE
    ===================================================== */

    if (formCliente) {

        formCliente.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (
                    !formCliente.checkValidity()
                ) {

                    formCliente.reportValidity();

                    return;

                }


                /* CNPJ */

                if (
                    !validarCnpj(
                        cnpjCliente.value
                    )
                ) {

                    mostrarCnpjErro(
                        "Informe um CNPJ válido."
                    );

                    cnpjCliente.focus();

                    return;

                }


                if (!situacaoCnpj) {

                    await consultarCnpj();

                }


                if (
                    situacaoCnpj ===
                    "inativa"
                ) {

                    mostrarCnpjErro(
                        "Não é possível cadastrar um CNPJ que não esteja ativo."
                    );

                    cnpjCliente.focus();

                    return;

                }


                /* CEP */

                const cepNumeros =
                    somenteNumeros(
                        cepCliente.value
                    );


                if (
                    cepNumeros.length !== 8
                ) {

                    mostrarCepErro(
                        "Informe um CEP válido."
                    );

                    cepCliente.focus();

                    return;

                }


                const dados =
                    obterDadosFormulario();


                const token =
                    obterToken();


                if (!token) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    return;

                }


                /* =================================================
                   NOVO CLIENTE
                ================================================= */

                if (!clienteEmEdicao) {

                    try {

                        const resposta =
                            await fetch(
                                `${API_URL}/clientes`,
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            "Bearer " +
                                            token
                                    },

                                    body:
                                        JSON.stringify(
                                            {
                                                razaoSocial:
                                                    dados.nome,

                                                cnpj:
                                                    dados.cnpj,

                                                contato:
                                                    dados.contato,

                                                telefone:
                                                    dados.telefone,

                                                email:
                                                    dados.email,

                                                cep:
                                                    dados.cep,

                                                endereco:
                                                    dados.endereco,

                                                numero:
                                                    dados.numero,

                                                complemento:
                                                    dados.complemento,

                                                bairro:
                                                    dados.bairro,

                                                cidade:
                                                    dados.cidade,

                                                senha:
                                                    dados.senha,

                                                status:
                                                    dados.status
                                            }
                                        )
                                }
                            );


                        const resultado =
                            await resposta.json();


                        if (!resposta.ok) {

                            alert(
                                resultado.mensagem ||
                                "Não foi possível cadastrar o cliente."
                            );

                            return;

                        }


                        dados.id =
                            resultado.cliente.id;


                        criarLinhaCliente(
                            dados,
                            "Cliente #" +
                            String(
                                resultado.cliente.id
                            ).padStart(
                                3,
                                "0"
                            )
                        );


                        atualizarContador();
                        atualizarEstadoVazio();


                        alert(
                            "Cliente cadastrado com sucesso!"
                        );


                        fecharModal();


                    } catch (erro) {

                        console.error(
                            "Erro ao cadastrar cliente:",
                            erro
                        );

                        alert(
                            "Não foi possível conectar ao servidor."
                        );

                    }


                    return;

                }


                /* =================================================
                   EDITAR CLIENTE
                ================================================= */

                const clienteId =
                    clienteEmEdicao
                        .dataset
                        .id;


                if (!clienteId) {

                    alert(
                        "Não foi possível identificar este cliente."
                    );

                    return;

                }


                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/clientes/${clienteId}`,
                            {
                                method:
                                    "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        "Bearer " +
                                        token
                                },

                                body:
                                    JSON.stringify(
                                        {
                                            razaoSocial:
                                                dados.nome,

                                            cnpj:
                                                dados.cnpj,

                                            contato:
                                                dados.contato,

                                            telefone:
                                                dados.telefone,

                                            email:
                                                dados.email,

                                            cep:
                                                dados.cep,

                                            endereco:
                                                dados.endereco,

                                            numero:
                                                dados.numero,

                                            complemento:
                                                dados.complemento,

                                            bairro:
                                                dados.bairro,

                                            cidade:
                                                dados.cidade,

                                            senha:
                                                dados.senha,

                                            status:
                                                dados.status
                                        }
                                    )
                            }
                        );


                    const resultado =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            resultado.mensagem ||
                            "Não foi possível atualizar o cliente."
                        );

                        return;

                    }


                    atualizarLinhaCliente(
                        clienteEmEdicao,
                        dados
                    );


                    alert(
                        "Cliente atualizado com sucesso!"
                    );


                    fecharModal();


                } catch (erro) {

                    console.error(
                        "Erro ao atualizar cliente:",
                        erro
                    );

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }

            }
        );

    }


    /* =====================================================
       CLIQUES DA TABELA
    ===================================================== */

    if (tbody) {

        tbody.addEventListener(
            "click",
            async function (event) {

                const botao =
                    event.target.closest(
                        "button"
                    );


                if (!botao) {
                    return;
                }


                const cliente =
                    botao.closest(
                        ".cliente-item"
                    );


                if (!cliente) {
                    return;
                }


                /* =============================================
                   EDITAR
                ============================================= */

                if (
                    botao.classList.contains(
                        "btn-editar"
                    )
                ) {

                    abrirEdicao(
                        cliente
                    );

                    return;

                }


                /* =============================================
                   ATIVAR / DESATIVAR
                ============================================= */

                if (
                    botao.classList.contains(
                        "btn-desativar"
                    )
                ) {

                    const token =
                        obterToken();


                    if (!token) {

                        alert(
                            "Sua sessão expirou. Faça login novamente."
                        );

                        return;

                    }


                    const clienteId =
                        cliente.dataset.id;


                    const statusAtual =
                        cliente.dataset.status;


                    const novoStatus =
                        statusAtual === "ativo"
                            ? "inativo"
                            : "ativo";


                    try {

                        const resposta =
                            await fetch(
                                `${API_URL}/clientes/${clienteId}/status`,
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
                                        JSON.stringify(
                                            {
                                                status:
                                                    novoStatus
                                            }
                                        )
                                }
                            );


                        const dados =
                            await resposta.json();


                        if (!resposta.ok) {

                            alert(
                                dados.mensagem ||
                                "Não foi possível alterar o status."
                            );

                            return;

                        }


                        cliente.dataset.status =
                            novoStatus;


                        const statusElemento =
                            cliente.querySelector(
                                ".status"
                            );


                        statusElemento.className =
                            "status " +
                            novoStatus;


                        statusElemento.textContent =
                            novoStatus === "ativo"
                                ? "Ativo"
                                : "Inativo";


                        botao.textContent =
                            novoStatus === "ativo"
                                ? "Desativar"
                                : "Ativar";


                    } catch (erro) {

                        console.error(
                            "Erro ao alterar status:",
                            erro
                        );

                        alert(
                            "Não foi possível conectar ao servidor."
                        );

                    }


                    return;

                }


                /* =============================================
                   EXCLUIR
                ============================================= */

                if (
                    botao.classList.contains(
                        "btn-excluir"
                    )
                ) {

                    const nome =
                        cliente.dataset.nome;


                    const confirmar =
                        confirm(
                            "Tem certeza que deseja excluir o cliente \"" +
                            nome +
                            "\"?"
                        );


                    if (!confirmar) {
                        return;
                    }


                    const token =
                        obterToken();


                    if (!token) {

                        alert(
                            "Sua sessão expirou. Faça login novamente."
                        );

                        return;

                    }


                    const clienteId =
                        cliente.dataset.id;


                    if (!clienteId) {

                        alert(
                            "Não foi possível identificar este cliente."
                        );

                        return;

                    }


                    try {

                        const resposta =
                            await fetch(
                                `${API_URL}/clientes/${clienteId}`,
                                {
                                    method:
                                        "DELETE",

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
                                "Não foi possível excluir o cliente."
                            );

                            return;

                        }


                        cliente.remove();

                        atualizarContador();
                        atualizarEstadoVazio();


                        alert(
                            "Cliente excluído com sucesso!"
                        );


                    } catch (erro) {

                        console.error(
                            "Erro ao excluir cliente:",
                            erro
                        );

                        alert(
                            "Não foi possível conectar ao servidor."
                        );

                    }


                    return;

                }

            }
        );

    }


    /* =====================================================
       PESQUISA
    ===================================================== */

    if (pesquisaCliente) {

        pesquisaCliente.addEventListener(
            "input",
            function () {

                const termo =
                    pesquisaCliente.value
                        .trim()
                        .toLowerCase();


                const clientes =
                    document.querySelectorAll(
                        ".cliente-item"
                    );


                clientes.forEach(
                    function (cliente) {

                        const nome =
                            (
                                cliente.dataset.nome ||
                                ""
                            ).toLowerCase();

                        const cnpj =
                            (
                                cliente.dataset.cnpj ||
                                ""
                            ).toLowerCase();

                        const contato =
                            (
                                cliente.dataset.contato ||
                                ""
                            ).toLowerCase();

                        const email =
                            (
                                cliente.dataset.email ||
                                ""
                            ).toLowerCase();


                        const encontrou =
                            nome.includes(termo) ||
                            cnpj.includes(termo) ||
                            contato.includes(termo) ||
                            email.includes(termo);


                        cliente.style.display =
                            encontrou
                                ? ""
                                : "none";

                    }
                );


                atualizarEstadoVazio();

            }
        );

    }


    /* =====================================================
       EVENTOS DOS MODAIS
    ===================================================== */

    if (btnNovoCliente) {

        btnNovoCliente.addEventListener(
            "click",
            abrirModalNovoCliente
        );

    }


    if (fecharModalCliente) {

        fecharModalCliente.addEventListener(
            "click",
            fecharModal
        );

    }


    if (cancelarCliente) {

        cancelarCliente.addEventListener(
            "click",
            fecharModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            fecharModal
        );

    }


    if (btnNovoAdmin) {

        btnNovoAdmin.addEventListener(
            "click",
            abrirModalAdmin
        );

    }


    if (fecharModalAdmin) {

        fecharModalAdmin.addEventListener(
            "click",
            fecharModalAdministrador
        );

    }


    if (cancelarAdmin) {

        cancelarAdmin.addEventListener(
            "click",
            fecharModalAdministrador
        );

    }


    if (modalAdminOverlay) {

        modalAdminOverlay.addEventListener(
            "click",
            fecharModalAdministrador
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                modalCliente &&
                modalCliente.classList.contains(
                    "ativo"
                )
            ) {

                fecharModal();

            }


            if (
                modalAdmin &&
                modalAdmin.classList.contains(
                    "ativo"
                )
            ) {

                fecharModalAdministrador();

            }

        }
    );


    /* =====================================================
       MÁSCARAS
    ===================================================== */

    if (cnpjCliente) {

        cnpjCliente.addEventListener(
            "input",
            function () {

                cnpjCliente.value =
                    formatarCnpj(
                        cnpjCliente.value
                    );

                limparStatusCnpj();

            }
        );


        cnpjCliente.addEventListener(
            "blur",
            consultarCnpj
        );

    }


    if (telefoneCliente) {

        telefoneCliente.addEventListener(
            "input",
            function () {

                telefoneCliente.value =
                    formatarTelefone(
                        telefoneCliente.value
                    );

            }
        );

    }


    if (cepCliente) {

        cepCliente.addEventListener(
            "input",
            function () {

                cepCliente.value =
                    formatarCep(
                        cepCliente.value
                    );

                limparStatusCep();

            }
        );


        cepCliente.addEventListener(
            "blur",
            consultarCep
        );

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

                const aberto =
                    menu.classList.toggle(
                        "ativo"
                    );


                menuToggle.classList.toggle(
                    "ativo",
                    aberto
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    aberto
                );

            }
        );


        menu
            .querySelectorAll("a")
            .forEach(
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

                        }
                    );

                }
            );

    }


    /* =====================================================
       CARREGAR CLIENTES DO MYSQL
    ===================================================== */

    async function carregarClientes() {

        if (!tbody) {
            return;
        }


        const token =
            obterToken();


        if (!token) {

            alert(
                "Sessão não encontrada. Faça login novamente."
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/clientes`,
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
                    "Não foi possível carregar os clientes."
                );

                return;

            }


            tbody.innerHTML = "";


            dados.clientes.forEach(
                function (cliente) {

                    criarLinhaCliente(
                        {
                            id:
                                cliente.id,

                            nome:
                                cliente.razao_social,

                            cnpj:
                                cliente.cnpj,

                            contato:
                                cliente.contato,

                            telefone:
                                cliente.telefone,

                            email:
                                cliente.email,

                            cep:
                                cliente.cep,

                            endereco:
                                cliente.endereco,

                            numero:
                                cliente.numero,

                            complemento:
                                cliente.complemento ||
                                "",

                            bairro:
                                cliente.bairro,

                            cidade:
                                cliente.cidade,

                            status:
                                cliente.status
                        },

                        "Cliente #" +
                        String(
                            cliente.id
                        ).padStart(
                            3,
                            "0"
                        )
                    );

                }
            );


            atualizarContador();
            atualizarEstadoVazio();


        } catch (erro) {

            console.error(
                "Erro ao carregar clientes:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    }


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    carregarClientes();

});