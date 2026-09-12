/* =========================================================
   TOPY'GUT - ADMIN PRODUTOS E DESCONTOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PRODUTOS - ELEMENTOS
    ===================================================== */

    const btnNovoProduto =
        document.getElementById("btnNovoProduto");

    const modalProduto =
        document.getElementById("modalProduto");

    const modalProdutoOverlay =
        document.getElementById("modalProdutoOverlay");

    const fecharModalProduto =
        document.getElementById("fecharModalProduto");

    const cancelarProduto =
        document.getElementById("cancelarProduto");

    const formProduto =
        document.getElementById("formProduto");

    const tituloModalProduto =
        document.getElementById("tituloModalProduto");

    const listaProdutos =
        document.getElementById("listaProdutos");

    const pesquisaProduto =
        document.getElementById("pesquisaProduto");

    const totalProdutos =
        document.getElementById("totalProdutos");

    const produtosVazio =
        document.getElementById("produtosVazio");

    const tabelaProdutos =
        document.querySelector(".tabela-produtos");

    const nomeProduto =
        document.getElementById("nomeProduto");

    const categoriaProduto =
        document.getElementById("categoriaProduto");

    const saborProduto =
        document.getElementById("saborProduto");

    const tamanhoProduto =
        document.getElementById("tamanhoProduto");

    const precoProduto =
        document.getElementById("precoProduto");

    const statusProduto =
        document.getElementById("statusProduto");

    const descricaoProduto =
        document.getElementById("descricaoProduto");

    const tipoVariacao =
        document.getElementById("tipoVariacao");

    const nomeVariacao =
        document.getElementById("nomeVariacao");
    
    const btnAdicionarVariacao =
        document.getElementById("btnAdicionarVariacao");

    const listaVariacoes =
        document.getElementById("listaVariacoes");

    let produtoEmEdicao = null;
    
    let variacoesProduto = [];


    const imagemProduto =
    document.getElementById(
        "imagemProduto"
    );

    const produtoPreview =
        document.getElementById(
        "produtoPreview"
    );

    const imagemPreview =
        document.getElementById(
        "imagemPreview"
    );


    /* =====================================================
    VARIAÇÕES DO PRODUTO
    ===================================================== */

    function renderizarVariacoes() {

        listaVariacoes.innerHTML = "";


        variacoesProduto.forEach(
            function (variacao, indice) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "variacao-item";


                item.innerHTML = `

                    <span>
                        ${variacao.tipo === "sabor"
                            ? "Sabor"
                            : "Tamanho"}:
                        ${variacao.nome}
                    </span>

                    <button
                        type="button"
                        class="btn-remover-variacao"
                        data-indice="${indice}"
                        aria-label="Remover variação"
                    >
                        ×
                    </button>

                `;


                listaVariacoes.appendChild(
                    item
                );

            }
        );

    }


    if (btnAdicionarVariacao) {

        btnAdicionarVariacao.addEventListener(
            "click",
            function () {

                const tipo =
                    tipoVariacao.value;

                const nome =
                    nomeVariacao.value.trim();


                if (!tipo) {

                    alert(
                        "Selecione o tipo da variação."
                    );

                    tipoVariacao.focus();

                    return;

                }


                if (!nome) {

                    alert(
                        "Digite o nome da variação."
                    );

                    nomeVariacao.focus();

                    return;

                }


                const duplicada =
                    variacoesProduto.some(
                        function (variacao) {

                            return (
                                variacao.tipo === tipo &&
                                variacao.nome
                                    .toLowerCase() ===
                                nome.toLowerCase()
                            );

                        }
                    );


                if (duplicada) {

                    alert(
                        "Essa variação já foi adicionada."
                    );

                    return;

                }


                variacoesProduto.push({
                    tipo:
                        tipo,

                    nome:
                        nome
                });


                renderizarVariacoes();


                nomeVariacao.value = "";

                nomeVariacao.focus();

            }
        );

    }


    if (listaVariacoes) {

        listaVariacoes.addEventListener(
            "click",
            function (event) {

                const botao =
                    event.target.closest(
                        ".btn-remover-variacao"
                    );


                if (!botao) {

                    return;

                }


                const indice =
                    Number(
                        botao.dataset.indice
                    );


                if (
                    Number.isNaN(indice)
                ) {

                    return;

                }


                variacoesProduto.splice(
                    indice,
                    1
                );


                renderizarVariacoes();

            }
        );

    }

    /* =====================================================
       DESCONTOS - ELEMENTOS
    ===================================================== */

    const btnNovoDesconto =
        document.getElementById("btnNovoDesconto");

    const modalDesconto =
        document.getElementById("modalDesconto");

    const modalDescontoOverlay =
        document.getElementById("modalDescontoOverlay");

    const fecharModalDesconto =
        document.getElementById("fecharModalDesconto");

    const cancelarDesconto =
        document.getElementById("cancelarDesconto");

    const formDesconto =
        document.getElementById("formDesconto");

    const tituloModalDesconto =
        document.getElementById("tituloModalDesconto");

    const valorMinimo =
        document.getElementById("valorMinimo");

    const percentualDesconto =
        document.getElementById("percentualDesconto");

    const statusDesconto =
        document.getElementById("statusDesconto");

    const listaDescontos =
        document.getElementById("listaDescontos");

    const descontosVazio =
        document.getElementById("descontosVazio");


    let descontoEmEdicao = null;


    /* =====================================================
       MOEDA
    ===================================================== */

    function somenteNumeros(valor) {

        return valor.replace(/\D/g, "");

    }


    function formatarCampoMoeda(valor) {

        let numeros =
            somenteNumeros(valor);


        if (!numeros) {
            return "";
        }


        const numero =
            Number(numeros) / 100;


        return numero.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    function moedaParaNumero(valor) {

        if (!valor) {
            return 0;
        }


        return Number(
            valor
                .replace(/\./g, "")
                .replace(",", ".")
        ) || 0;

    }


    function formatarMoeda(valor) {

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    precoProduto.addEventListener(
        "input",
        function () {

            precoProduto.value =
                formatarCampoMoeda(
                    precoProduto.value
                );

        }
    );


    valorMinimo.addEventListener(
        "input",
        function () {

            valorMinimo.value =
                formatarCampoMoeda(
                    valorMinimo.value
                );

        }
    );

    /* =====================================================
    PREVIEW DA IMAGEM DO PRODUTO
    ===================================================== */

    if (imagemProduto) {

        imagemProduto.addEventListener(
            "change",
            function () {

                const arquivo =
                    imagemProduto.files[0];


                if (!arquivo) {

                    produtoPreview.classList.remove(
                        "ativo"
                    );

                    imagemPreview.src = "";

                    return;

                }


                /* TAMANHO MÁXIMO: 5 MB */

                if (
                    arquivo.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "A imagem deve ter no máximo 5 MB."
                    );

                    imagemProduto.value = "";

                    produtoPreview.classList.remove(
                        "ativo"
                    );

                    imagemPreview.src = "";

                    return;

                }


                /* FORMATOS PERMITIDOS */

                const formatosPermitidos = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !formatosPermitidos.includes(
                        arquivo.type
                    )
                ) {

                    alert(
                        "Escolha uma imagem JPG, PNG ou WebP."
                    );

                    imagemProduto.value = "";

                    produtoPreview.classList.remove(
                        "ativo"
                    );

                    imagemPreview.src = "";

                    return;

                }


                const leitor =
                    new FileReader();


                leitor.onload =
                    function (evento) {

                        imagemPreview.src =
                            evento.target.result;

                        produtoPreview.classList.add(
                            "ativo"
                        );

                    };


                leitor.readAsDataURL(
                    arquivo
                );

            }
        );

    }

    /* =====================================================
       ÍCONE
    ===================================================== */

    function obterIconeCategoria(categoria) {

        const categoriaNormalizada =
            categoria
                .toLowerCase()
                .trim();


        if (
            categoriaNormalizada ===
            "iogurtes"
        ) {
            return "🥛";
        }


        if (
            categoriaNormalizada ===
            "laticínios"
        ) {
            return "🧀";
        }


        if (
            categoriaNormalizada ===
            "sucos"
        ) {
            return "🧃";
        }


        if (
            categoriaNormalizada ===
            "pão de queijo"
        ) {
            return "🧀";
        }


        return "📦";

    }


    /* =====================================================
       CÓDIGO PRODUTO
    ===================================================== */

    function gerarCodigoProduto() {

        const quantidade =
            document.querySelectorAll(
                ".produto-item"
            ).length;


        return (
            "Produto #" +
            String(
                quantidade + 1
            ).padStart(3, "0")
        );

    }


    /* =====================================================
       ABRIR PRODUTO
    ===================================================== */

    function abrirNovoProduto() {

        produtoEmEdicao = null;

        variacoesProduto = [];

        renderizarVariacoes();

        tituloModalProduto.textContent =
            "Novo produto";

        formProduto.reset();


        statusProduto.value = "ativo";

        modalProduto.classList.add("ativo");


        modalProduto.setAttribute(
            "aria-hidden",
            "false"
        );


        nomeProduto.focus();

    }


    function fecharProduto() {

        modalProduto.classList.remove(
            "ativo"
        );


        modalProduto.setAttribute(
            "aria-hidden",
            "true"
        );


        produtoEmEdicao = null;

        variacoesProduto = [];

        renderizarVariacoes();

        formProduto.reset();

    }


    /* =====================================================
       CRIAR PRODUTO
    ===================================================== */

    function criarProduto(
        dados,
        codigo
    ) {

        const tr =
            document.createElement("tr");


        tr.className =
            "produto-item";

        tr.dataset.id =
            dados.id || "";

        tr.dataset.nome =
            dados.nome;

        tr.dataset.categoria =
            dados.categoria;

        tr.dataset.sabor =
            dados.sabor;

        tr.dataset.tamanho =
            dados.tamanho;

        tr.dataset.preco =
            dados.preco;

        tr.dataset.imagem =
            dados.imagem || "";

        tr.dataset.status =
            dados.status;

        tr.dataset.descricao =
            dados.descricao;

        tr.dataset.variacoes =
            JSON.stringify(
                dados.variacoes || []
            );

        tr.dataset.id =
            dados.id || "";

        const sabor =
            dados.sabor ||
            "—";


        const textoStatus =
            dados.status === "ativo"
                ? "Ativo"
                : "Inativo";


        const textoBotao =
            dados.status === "ativo"
                ? "Desativar"
                : "Ativar";


        tr.innerHTML = `

            <td>

                <div class="produto-identificacao">

                    <div class="produto-icone">
                        ${dados.imagem
                                ? `
                                    <img src="${API_URL}${dados.imagem}" alt="${dados.nome}">
                                `
                                : obterIconeCategoria(
                                    dados.categoria
                                )
                        }
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
                ${dados.categoria}
            </td>


            <td>
                ${sabor}
            </td>


            <td>
                ${dados.tamanho}
            </td>


            <td>

                <span class="preco-produto">
                    ${formatarMoeda(dados.preco)}
                </span>

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


        listaProdutos.appendChild(tr);

    }


    /* =====================================================
       EDITAR PRODUTO
    ===================================================== */

    function abrirEdicaoProduto(produto) {

        produtoEmEdicao =
            produto;


        try {

            variacoesProduto =
                JSON.parse(
                    produto.dataset.variacoes || "[]"
                );

        } catch (erro) {

            variacoesProduto = [];

        }


        renderizarVariacoes();


        tituloModalProduto.textContent =
            "Editar produto";


        nomeProduto.value =
            produto.dataset.nome || "";


        categoriaProduto.value =
            produto.dataset.categoria || "";


        if (saborProduto) {

            saborProduto.value =
                produto.dataset.sabor || "";

        }


        tamanhoProduto.value =
            produto.dataset.tamanho || "";


        precoProduto.value =
            Number(
                produto.dataset.preco
            ).toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        statusProduto.value =
            produto.dataset.status || "ativo";


        descricaoProduto.value =
            produto.dataset.descricao || "";


        modalProduto.classList.add(
            "ativo"
        );


        modalProduto.setAttribute(
            "aria-hidden",
            "false"
        );

    }

        function atualizarProduto(
            produto,
            dados
        ) {

            produto.dataset.nome =
                dados.nome;

            produto.dataset.categoria =
                dados.categoria;

            produto.dataset.sabor =
                dados.sabor;

            produto.dataset.tamanho =
                dados.tamanho;

            produto.dataset.preco =
                dados.preco;

            produto.dataset.status =
                dados.status;

            produto.dataset.descricao =
                dados.descricao;


            produto.querySelector(
                ".produto-icone"
            ).textContent =
                obterIconeCategoria(
                    dados.categoria
                );


            produto.querySelector(
                ".produto-identificacao strong"
            ).textContent =
                dados.nome;


            produto.children[1].textContent =
                dados.categoria;

            produto.children[2].textContent =
                dados.sabor || "—";

            produto.children[3].textContent =
                dados.tamanho;


            produto.querySelector(
                ".preco-produto"
            ).textContent =
                formatarMoeda(
                    dados.preco
                );


            const status =
                produto.querySelector(
                    ".status"
                );


            status.className =
                "status " +
                dados.status;


            status.textContent =
                dados.status === "ativo"
                    ? "Ativo"
                    : "Inativo";


            produto.querySelector(
                ".btn-desativar"
            ).textContent =
                dados.status === "ativo"
                    ? "Desativar"
                    : "Ativar";

        }


        /* =====================================================
        SALVAR PRODUTO
        ===================================================== */

        formProduto.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!formProduto.checkValidity()) {

                formProduto.reportValidity();

                return;

            }


            const preco =
                moedaParaNumero(
                    precoProduto.value
                );


            if (preco <= 0) {

                alert(
                    "Informe um preço maior que zero."
                );

                precoProduto.focus();

                return;

            }


            const token =
                sessionStorage.getItem(
                    "topygut_token"
                ) ||
                localStorage.getItem(
                    "topygut_token"
                );


            if (!token) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                return;

            }


            const dadosFormulario =
                new FormData();


            dadosFormulario.append(
                "nome",
                nomeProduto.value.trim()
            );


            dadosFormulario.append(
                "categoria",
                categoriaProduto.value
            );


        dadosFormulario.append(
                "variacoes",
                JSON.stringify(variacoesProduto)
            );


            dadosFormulario.append(
                "tamanho",
                tamanhoProduto.value.trim()
            );


            dadosFormulario.append(
                "preco",
                precoProduto.value.trim()
            );


            dadosFormulario.append(
                "status",
                statusProduto.value
            );


            dadosFormulario.append(
                "descricao",
                descricaoProduto.value.trim()
            );


            if (
                imagemProduto.files &&
                imagemProduto.files[0]
            ) {

                dadosFormulario.append(
                    "imagem",
                    imagemProduto.files[0]
                );

            }


            try {

                const editando =
                produtoEmEdicao &&
                produtoEmEdicao.dataset.id;


                const url =
                    editando
                        ? `${API_URL}/produtos/${produtoEmEdicao.dataset.id}`
                        : `${API_URL}/produtos`;


                const metodo =
                    editando
                        ? "PUT"
                        : "POST";


                const resposta =
                    await fetch(
                        url,
                        {
                            method: metodo,

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            },

                            body:
                                dadosFormulario
                        }
                    );


                const dados = await resposta.json();


                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível cadastrar o produto."
                    );

                    return;

                }


                alert(
                editando
                    ? "Produto atualizado com sucesso!"
                    : "Produto cadastrado com sucesso!"
                );
                
                await carregarProdutos();

                formProduto.reset();


                if (produtoPreview) {

                    produtoPreview.classList.remove(
                        "ativo"
                    );

                }


                if (imagemPreview) {

                    imagemPreview.src = "";

                }


                fecharProduto();


            } catch (erro) {

                console.error(
                    "Erro ao salvar produto:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );


    /* =====================================================
       CLIQUES PRODUTOS
    ===================================================== */

    listaProdutos.addEventListener(
        "click",
        async function (event) {

            const botao =
                event.target;

            const produto =
                botao.closest(
                    ".produto-item"
                );

            if (!produto) {
                return;
            }

            if (
                botao.classList.contains(
                    "btn-editar"
                )
            ) {
                abrirEdicaoProduto(
                    produto
                );

                return;
            }

            if (
                botao.classList.contains(
                    "btn-desativar"
                )
            ) {
                const status =
                    produto.querySelector(
                        ".status"
                    );

                const ativo =
                    status.classList.contains(
                        "ativo"
                    );

                produto.dataset.status =
                    ativo
                        ? "inativo"
                        : "ativo";

                status.className =
                    "status " +
                    produto.dataset.status;

                status.textContent =
                    ativo
                        ? "Inativo"
                        : "Ativo";

                botao.textContent =
                    ativo
                        ? "Ativar"
                        : "Desativar";

                return;
            }

            if (
                botao.classList.contains(
                    "btn-excluir"
                )
            ) {

                const produtoId =
                    produto.dataset.id;


                if (!produtoId) {

                    alert(
                        "Não foi possível identificar este produto."
                    );

                    return;

                }


                const confirmar =
                    confirm(
                        "Tem certeza que deseja excluir \"" +
                        produto.dataset.nome +
                        "\" permanentemente?"
                    );


                if (!confirmar) {
                    return;
                }


                const token =
                    sessionStorage.getItem(
                        "topygut_token"
                    ) ||
                    localStorage.getItem(
                        "topygut_token"
                    );


                if (!token) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    return;

                }


                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/produtos/${produtoId}`,
                            {
                                method: "DELETE",

                                headers: {
                                    "Authorization":
                                        "Bearer " + token
                                }
                            }
                        );


                    const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.mensagem ||
                            "Não foi possível excluir o produto."
                        );

                        return;

                    }


                   if (
                        dados.mensagem ===
                        "Produto já utilizado em pedidos e foi inativado."
                    ) {

                        produto.dataset.status =
                            "inativo";

                        const status =
                            produto.querySelector(
                                ".status"
                            );

                        if (status) {

                            status.className =
                                "status inativo";

                            status.textContent =
                                "Inativo";

                        }


                        const botaoStatus =
                            produto.querySelector(
                                ".btn-desativar"
                            );

                        if (botaoStatus) {

                            botaoStatus.textContent =
                                "Ativar";

                        }


                        alert(
                            dados.mensagem
                        );

                    } else {

                        produto.remove();

                        atualizarProdutos();

                        alert(
                            "Produto excluído com sucesso!"
                        );

                    }


                } catch (erro) {

                    console.error(
                        "Erro ao excluir produto:",
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

    /* =====================================================
       PESQUISA
    ===================================================== */

    function atualizarProdutos() {

        const termo =
            pesquisaProduto.value
                .trim()
                .toLowerCase();


        const produtos =
            document.querySelectorAll(
                ".produto-item"
            );


        let visiveis = 0;


        produtos.forEach(
            function (produto) {

                const texto = (

                    produto.dataset.nome +
                    " " +
                    produto.dataset.categoria +
                    " " +
                    produto.dataset.sabor +
                    " " +
                    produto.dataset.tamanho

                ).toLowerCase();


                const mostrar =
                    texto.includes(termo);


                produto.style.display =
                    mostrar
                        ? ""
                        : "none";


                if (mostrar) {
                    visiveis++;
                }

            }
        );


        totalProdutos.textContent =
            produtos.length === 1
                ? "1 produto"
                : produtos.length +
                  " produtos";


        if (visiveis === 0) {

            tabelaProdutos.style.display =
                "none";

            produtosVazio.classList.add(
                "mostrar"
            );

        } else {

            tabelaProdutos.style.display =
                "table";

            produtosVazio.classList.remove(
                "mostrar"
            );

        }

    }


    pesquisaProduto.addEventListener(
        "input",
        atualizarProdutos
    );


    /* =====================================================
       MODAL PRODUTO
    ===================================================== */

    btnNovoProduto.addEventListener(
        "click",
        abrirNovoProduto
    );

    fecharModalProduto.addEventListener(
        "click",
        fecharProduto
    );

    cancelarProduto.addEventListener(
        "click",
        fecharProduto
    );

    modalProdutoOverlay.addEventListener(
        "click",
        fecharProduto
    );


    /* =====================================================
       DESCONTOS
    ===================================================== */

    function abrirNovoDesconto() {

        descontoEmEdicao = null;


        tituloModalDesconto.textContent =
            "Criar desconto";


        formDesconto.reset();


        statusDesconto.value =
            "ativo";


        modalDesconto.classList.add(
            "ativo"
        );


        modalDesconto.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function fecharDesconto() {

        modalDesconto.classList.remove(
            "ativo"
        );


        modalDesconto.setAttribute(
            "aria-hidden",
            "true"
        );


        descontoEmEdicao = null;

        formDesconto.reset();

    }


    function criarDesconto(dados) {

        const item =
            document.createElement("div");

        item.className =
            "desconto-item";


        item.dataset.id =
            dados.id;


        item.dataset.valor =
            dados.valor;

        item.dataset.percentual =
            dados.percentual;

        item.dataset.status =
            dados.status;


        montarConteudoDesconto(
            item
        );


        listaDescontos.appendChild(
            item
        );

    }


    function montarConteudoDesconto(
        item
    ) {

        const valor =
            Number(
                item.dataset.valor
            );


        const percentual =
            Number(
                item.dataset.percentual
            );


        const status =
            item.dataset.status;


        const textoStatus =
            status === "ativo"
                ? "Ativo"
                : "Inativo";


        const textoBotao =
            status === "ativo"
                ? "Desativar"
                : "Ativar";


        item.innerHTML = `

            <div class="desconto-info">

                <div class="desconto-percentual">
                    ${percentual}%
                </div>


                <div class="desconto-texto">

                    <strong>
                        Compras a partir de
                        ${formatarMoeda(valor)}
                    </strong>

                    <span>
                        Desconto automático de
                        ${percentual}% no pedido.
                    </span>

                    <span
                        class="status-regra ${status}"
                    >
                        ${textoStatus}
                    </span>

                </div>

            </div>


            <div class="desconto-acoes">

                <button
                    type="button"
                    class="btn-editar-desconto"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-status-desconto"
                >
                    ${textoBotao}
                </button>

                <button
                    type="button"
                    class="btn-excluir-desconto"
                >
                    Excluir
                </button>

            </div>

        `;

    }


    function atualizarDescontosVazio() {

        const quantidade =
            document.querySelectorAll(
                ".desconto-item"
            ).length;


        descontosVazio.classList.toggle(
            "mostrar",
            quantidade === 0
        );

    }


    formDesconto.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!formDesconto.checkValidity()) {

                formDesconto.reportValidity();

                return;

            }


           const valor =
            moedaParaNumero(
                valorMinimo.value
            );


        const percentual =
            Number(
                percentualDesconto.value
            );


        if (
            valor <= 0 ||
            percentual <= 0 ||
            percentual > 100
        ) {

            alert(
                "Informe valores válidos para a regra."
            );

            return;

        }


        const token =
            sessionStorage.getItem(
                "topygut_token"
            ) ||
            localStorage.getItem(
                "topygut_token"
            );


        if (!token) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            return;

        }


        /* =================================================
        NOVO DESCONTO
        ================================================= */

        if (!descontoEmEdicao) {

            try {

                const resposta =
                    await fetch(
                        `${API_URL}/descontos`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body: JSON.stringify({

                                valorMinimo:
                                    valor,

                                percentual:
                                    percentual,

                                status:
                                    statusDesconto.value

                            })
                        }
                    );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.mensagem ||
                        "Não foi possível criar o desconto."
                    );

                    return;

                }


                criarDesconto({
                    id:
                        resultado.desconto.id,

                    valor:
                        resultado.desconto.valorMinimo,

                    percentual:
                        resultado.desconto.percentual,

                    status:
                        resultado.desconto.status
                });


                atualizarDescontosVazio();


                alert(
                    "Desconto criado com sucesso!"
                );


                fecharDesconto();


            } catch (erro) {

                console.error(
                    "Erro ao criar desconto:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }


            return;

        }


        /* =================================================
        EDIÇÃO
        POR ENQUANTO CONTINUA SOMENTE NA TELA
        ================================================= */

        else {

            descontoEmEdicao.dataset.valor =
                valor;

            descontoEmEdicao.dataset.percentual =
                percentual;

            descontoEmEdicao.dataset.status =
                statusDesconto.value;


            montarConteudoDesconto(
                descontoEmEdicao
            );


            atualizarDescontosVazio();

            fecharDesconto();

        };
}
    );

    async function excluirDescontoBanco(
        item
    ) {

        const id =
            Number(
                item.dataset.id
            );


        if (!id) {

            alert(
                "Não foi possível identificar este desconto."
            );

            return;

        }


        const confirmar =
            confirm(
                "Deseja realmente excluir este desconto?"
            );


        if (!confirmar) {
            return;
        }


        const token =
            sessionStorage.getItem(
                "topygut_token"
            ) ||
            localStorage.getItem(
                "topygut_token"
            );


        if (!token) {

            alert(
                "Sua sessão expirou."
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/descontos/${id}`,
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
                    "Não foi possível excluir o desconto."
                );

                return;

            }


            item.remove();

            atualizarDescontosVazio();


        } catch (erro) {

            console.error(
                "Erro ao excluir desconto:",
                erro
            );


            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    }

    listaDescontos.addEventListener(
        "click",
        function (event) {

            const botao =
                event.target;


            const item =
                botao.closest(
                    ".desconto-item"
                );


            if (!item) {
                return;
            }


            if (
                botao.classList.contains(
                    "btn-editar-desconto"
                )
            ) {

                descontoEmEdicao =
                    item;


                tituloModalDesconto.textContent =
                    "Editar desconto";


                valorMinimo.value =
                    Number(
                        item.dataset.valor
                    ).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );


                percentualDesconto.value =
                    item.dataset.percentual;


                statusDesconto.value =
                    item.dataset.status;


                modalDesconto.classList.add(
                    "ativo"
                );


                return;

            }


            if (
                botao.classList.contains(
                    "btn-status-desconto"
                )
            ) {

                item.dataset.status =
                    item.dataset.status ===
                    "ativo"
                        ? "inativo"
                        : "ativo";


                montarConteudoDesconto(
                    item
                );


                return;

            }

            if (
                event.target.classList.contains(
                    "btn-excluir-desconto"
                )
            ) {

                const item =
                    event.target.closest(
                        ".desconto-item"
                    );

                if (!item) {
                    return;
                }

                excluirDescontoBanco(
                    item
                );
            }
        }
    );


    btnNovoDesconto.addEventListener(
        "click",
        abrirNovoDesconto
    );

    fecharModalDesconto.addEventListener(
        "click",
        fecharDesconto
    );

    cancelarDesconto.addEventListener(
        "click",
        fecharDesconto
    );

    modalDescontoOverlay.addEventListener(
        "click",
        fecharDesconto
    );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (
                modalProduto.classList.contains(
                    "ativo"
                )
            ) {

                fecharProduto();

            }


            if (
                modalDesconto.classList.contains(
                    "ativo"
                )
            ) {

                fecharDesconto();

            }

        }
    );


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


    if (menuToggle && menu) {

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
    }

    /* =====================================================
    CARREGAR PRODUTOS DO SERVIDOR
    ===================================================== */

    async function carregarProdutos() {

        const token =
            sessionStorage.getItem(
                "topygut_token"
            ) ||
            localStorage.getItem(
                "topygut_token"
            );


        if (!token) {

            console.error(
                "Token não encontrado."
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/produtos`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                console.error(
                    "Erro ao carregar produtos:",
                    dados
                );

                return;

            }


            /* LIMPA A TABELA */

            listaProdutos.innerHTML = "";


            /* CRIA OS PRODUTOS VINDOS DO MYSQL */

            dados.produtos.forEach(
                function (produto) {

                    criarProduto(
                        {   
                            id:
                                 produto.id,

                            nome:
                                produto.nome,

                            categoria:
                                produto.categoria,

                            sabor:
                                produto.sabor || "",

                            tamanho:
                                produto.tamanho,

                            preco:
                                Number(produto.preco),

                            status:
                                produto.status,

                            descricao:
                                produto.descricao || "",

                            imagem:
                                 produto.imagem || "",
                        },

                        "Produto #" +
                        String( produto.id).padStart(3,"0")
                    );

                }
            );


            atualizarProdutos();

        } catch (erro) {

            console.error(
                "Erro ao conectar ao servidor:",
                erro
            );

        }

        

    }

    /* =====================================================
    CARREGAR DESCONTOS DO MYSQL
    ===================================================== */

    async function carregarDescontos() {

        const token =
            sessionStorage.getItem(
                "topygut_token"
            ) ||
            localStorage.getItem(
                "topygut_token"
            );


        if (!token) {
            return;
        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/descontos`,
                    {
                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                console.error(
                    "Erro ao carregar descontos:",
                    dados
                );

                return;

            }


            listaDescontos.innerHTML = "";


            dados.descontos.forEach(
                function (desconto) {

                    criarDesconto({

                        id:
                            desconto.id,

                        valor:
                            Number(
                                desconto.valor_minimo
                            ),

                        percentual:
                            Number(
                                desconto.percentual
                            ),

                        status:
                            desconto.status

                    });

                }
            );


            atualizarDescontosVazio();


        } catch (erro) {

            console.error(
                "Erro ao conectar com descontos:",
                erro
            );

        }

    }

    /* =====================================================
       INICIAL
    ===================================================== */

    carregarProdutos();

    carregarDescontos();

});