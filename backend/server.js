const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./database");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs =
    require("fs");

require("dotenv").config();

const {
    BrevoClient
} = require("@getbrevo/brevo");

const brevoClient =
    new BrevoClient({
        apiKey:
            process.env.BREVO_API_KEY
    });


/* =========================================================
   ENVIAR E-MAIL DO PEDIDO
========================================================= */

async function enviarEmailPedido({
    pedido,
    cliente,
    itens
}) {

    const formatarMoeda = (valor) =>
        Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    const nomePagamento = {

        pix: "Pix",

        boleto: "Boleto",

        faturamento_10: "Faturamento em 10 dias"

    };


    let htmlItens = "";


    itens.forEach(
        function (item) {

            let variacao = "";


            if (
                item.variacaoNome
            ) {

                const tipo =
                    item.variacaoTipo ===
                    "tamanho"
                        ? "Tamanho"
                        : "Sabor";


                variacao = `
                    <div style="
                        margin-top:4px;
                        color:#667;
                        font-size:13px;
                    ">
                        ${tipo}: ${item.variacaoNome}
                    </div>
                `;

            }


            htmlItens += `

                <tr>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e8edf1;
                    ">

                        <strong>
                            ${item.produtoNome}
                        </strong>

                        ${variacao}

                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e8edf1;
                        text-align:center;
                    ">
                        ${item.quantidade}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e8edf1;
                        text-align:right;
                    ">
                        ${formatarMoeda( item.precoUnitario )}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e8edf1;
                        text-align:right;
                    ">
                        ${formatarMoeda( item.subtotal )}
                    </td>

                </tr>

            `;
        }
    );

    let htmlDesconto = "";

    if (
        Number(pedido.descontoValor) > 0
    ) {

        htmlDesconto = `

            <tr>

                <td
                    colspan="3"
                    style="
                        padding:8px 0;
                        text-align:right;
                    "
                >
                    Desconto
                    (${Number( pedido.descontoPercentual )}%)
                </td>

                <td style="
                    padding:8px 0;
                    text-align:right;
                    font-weight:bold;
                    color:#c34c62;
                ">
                    - ${formatarMoeda( pedido.descontoValor )}
                </td>

            </tr>

        `;

    }


    const html = `

        <div style="
            font-family:Arial, Helvetica, sans-serif;
            background:#f4f8fb;
            padding:30px;
            color:#163047;
        ">

            <div style="
                max-width:760px;
                margin:0 auto;
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
            ">

                <div style="
                    padding:26px 30px;
                    background:#0f659f;
                    color:#ffffff;
                ">

                    <h1 style="
                        margin:0;
                        font-size:26px;
                    ">
                        Pedido confirmado
                    </h1>

                    <p style="
                        margin:8px 0 0;
                    ">
                        Pedido #${String(
                            pedido.id
                        ).padStart(
                            4,
                            "0"
                        )}
                    </p>

                </div>


                <div style="
                    padding:30px;
                ">

                    <h2 style="
                        margin-top:0;
                        color:#0f659f;
                    ">
                        Dados do cliente
                    </h2>

                    <p style="margin:4px 0;">

                        <strong>
                            ${cliente.razao_social}
                        </strong>

                    </p>

                    <p style="margin:4px 0 20px;">
                        CNPJ:
                        ${cliente.cnpj}
                    </p>


                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            border-collapse:collapse;
                            margin-top:20px;
                        "
                    >

                        <thead>

                            <tr style="
                                background:#f2f7fa;
                            ">

                                <th style="
                                    padding:12px;
                                    text-align:left;
                                ">
                                    Produto
                                </th>

                                <th style="
                                    padding:12px;
                                    text-align:center;
                                ">
                                    Qtd.
                                </th>

                                <th style="
                                    padding:12px;
                                    text-align:right;
                                ">
                                    Unitário
                                </th>

                                <th style="
                                    padding:12px;
                                    text-align:right;
                                ">
                                    Subtotal
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                            ${htmlItens}
                        </tbody>

                    </table>


                    <table
                        width="100%"
                        style="
                            margin-top:24px;
                        "
                    >
                        <tr>

                            <td style="
                                text-align:right;
                                padding:8px 0;
                            ">
                                Subtotal
                            </td>

                            <td style="
                                width:150px;
                                text-align:right;
                                font-weight:bold;
                            ">
                                ${formatarMoeda( pedido.subtotal )}
                            </td>

                        </tr>


                        ${htmlDesconto}


                        <tr>

                            <td style="
                                text-align:right;
                                padding:12px 0 0;
                                font-size:18px;
                                font-weight:bold;
                            ">
                                Total
                            </td>

                            <td style="
                                text-align:right;
                                padding:12px 0 0;
                                font-size:18px;
                                font-weight:bold;
                                color:#1596d2;
                            ">
                                ${formatarMoeda( pedido.total )}
                            </td>

                        </tr>

                    </table>


                    <p style="
                        margin-top:28px;
                    ">

                        <strong>
                            Forma de pagamento:
                        </strong>

                        ${nomePagamento[
                            pedido.formaPagamento
                        ] || pedido.formaPagamento}

                    </p>


                    <p style="
                        margin-top:30px;
                        color:#758795;
                        font-size:13px;
                    ">
                        Este é um e-mail automático da Topy'Gut.
                    </p>

                </div>

            </div>

        </div>

    `;


    const destinatarios = [];


    if (
        cliente.email
    ) {

        destinatarios.push({

            email:cliente.email,

            name: cliente.razao_social

        });

    }


    if (
        process.env.EMAIL_VENDEDOR
    ) {

        destinatarios.push({

            email: process.env.EMAIL_VENDEDOR,

            name: "Topy'Gut Vendas"

        });
    }


    await brevoClient
        .transactionalEmails
        .sendTransacEmail({

            subject:
                `Pedido #${String(
                    pedido.id
                ).padStart(
                    4,
                    "0"
                )} - Topy'Gut`,

            htmlContent: html,

            sender: {
                name: "Topy'Gut",

                email: process.env.EMAIL_VENDEDOR
            },

            to: destinatarios

        });
}


/* =========================================================
   EXPRESS
========================================================= */

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =========================================================
   GARANTE PASTAS DE UPLOAD
========================================================= */

const pastaUploads =
    path.join(
        __dirname,
        "uploads"
    );

const pastaProdutos =
    path.join(
        pastaUploads,
        "produtos"
    );


if (
    !fs.existsSync(
        pastaUploads
    )
) {

    fs.mkdirSync(
        pastaUploads,
        {
            recursive: true
        }
    );
}


if (
    !fs.existsSync(
        pastaProdutos
    )
) {

    fs.mkdirSync(
        pastaProdutos,
        {
            recursive: true
        }
    );
}

/* =========================================================
   ARQUIVOS ESTÁTICOS
========================================================= */

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);

/* =========================================================
   FRONTEND
========================================================= */

app.use(
    express.static(
        path.join(
            __dirname,
            ".."
        )
    )
);

/* =========================================================
   CONFIGURAÇÃO DO MULTER
========================================================= */

const storageProduto =
    multer.diskStorage({

        destination:
            function (
                req,
                file,
                cb
            ) {

                cb(
                    null,
                    "uploads/produtos/"
                );

            },

        filename:
            function (
                req,
                file,
                cb
            ) {

                const nomeArquivo =
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() *
                        1E9
                    ) +
                    path.extname(
                        file.originalname
                    );

                cb(
                    null,
                    nomeArquivo
                );

            }

    });


const uploadProduto =
    multer({

        storage:
            storageProduto,

        fileFilter:
            function (
                req,
                file,
                cb
            ) {

                const tiposPermitidos = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    tiposPermitidos.includes(
                        file.mimetype
                    )
                ) {

                    cb(
                        null,
                        true
                    );

                } else {

                    cb(
                        new Error(
                            "Formato de imagem não permitido."
                        )
                    );

                }

            }

    });


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

function autenticarToken(
    req,
    res,
    next
) {

    const authHeader =
        req.headers.authorization;


    if (
        !authHeader
    ) {

        return res.status(401).json({

            mensagem:
                "Token não informado."

        });

    }


    const partes =
        authHeader.split(" ");


    if (
        partes.length !== 2 ||
        partes[0] !== "Bearer"
    ) {

        return res.status(401).json({

            mensagem:
                "Token inválido."

        });

    }


    const token =
        partes[1];


    try {

        const usuario =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.usuario = usuario;
        next();

    } catch (erro) {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado."

        });
    }
}

/* =========================================================
   MASTER OU ADMIN
========================================================= */

function masterOuAdmin(
    req,
    res,
    next
) {

    if (
        !req.usuario ||
        (
            req.usuario.tipo !== "master" &&
            req.usuario.tipo !== "admin"
        )
    ) {
        return res.status(403).json({
            mensagem: "Acesso não autorizado."

        });
    }
    next();
}

/* =========================================================
   LOGIN
========================================================= */

app.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                senha
            } = req.body;

            if (
                !email ||
                !senha
            ) {

                return res.status(400).json({
                    mensagem: "Informe e-mail e senha."

                });
            }

            const [usuarios] =
                await pool.query(
                    `
                    SELECT
                        id,
                        nome,
                        email,
                        senha_hash,
                        tipo,
                        status
                    FROM usuarios
                    WHERE email = ?
                    LIMIT 1
                    `,
                    [
                        email.trim()
                    ]
                );

            if (
                usuarios.length === 0
            ) {

                return res.status(401).json({

                    mensagem: "E-mail ou senha inválidos."
                });
            }

            const usuario = usuarios[0];

            if (
                usuario.status !== "ativo"
            ) {

                return res.status(403).json({

                    mensagem: "Usuário inativo."
                });

            }

            const senhaCorreta =
                await bcrypt.compare(
                    senha,
                    usuario.senha_hash
                );

            if (
                !senhaCorreta
            ) {

                return res.status(401).json({

                    mensagem:
                        "E-mail ou senha inválidos."

                });

            }


            const token =
                jwt.sign(
                    {
                        id:
                            usuario.id,

                        nome:
                            usuario.nome,

                        email:
                            usuario.email,

                        tipo:
                            usuario.tipo
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "8h"
                    }
                );


            return res.json({

                mensagem:
                    "Login realizado com sucesso.",

                token:
                    token,

                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    email:
                        usuario.email,

                    tipo:
                        usuario.tipo

                }

            });


        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            return res.status(500).json({

                mensagem:
                    "Erro interno do servidor."

            });

        }

    }
);

/* =========================================================
   SOMENTE MASTER
========================================================= */

function somenteMaster(
    req,
    res,
    next
) {

    if (
        !req.usuario ||
        req.usuario.tipo !== "master"
    ) {

        return res.status(403).json({
            mensagem:
                "Apenas o usuário master pode realizar esta ação."
        });

    }

    next();

}


/* =========================================================
   CRIAR ADMINISTRADOR
========================================================= */

app.post(
    "/admins",
    autenticarToken,
    somenteMaster,
    async (req, res) => {

        try {

            const {
                nome,
                email,
                senha,
                status
            } = req.body;


            if (
                !nome ||
                !email ||
                !senha
            ) {

                return res.status(400).json({
                    mensagem:
                        "Preencha nome, e-mail e senha."
                });

            }


            if (
                senha.length < 8
            ) {

                return res.status(400).json({
                    mensagem:
                        "A senha deve ter pelo menos 8 caracteres."
                });

            }


            const statusFinal =
                status === "inativo"
                    ? "inativo"
                    : "ativo";


            const [existentes] =
                await pool.query(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE email = ?
                    LIMIT 1
                    `,
                    [
                        email
                            .trim()
                            .toLowerCase()
                    ]
                );


            if (
                existentes.length > 0
            ) {

                return res.status(409).json({
                    mensagem:
                        "Já existe um usuário cadastrado com esse e-mail."
                });

            }


            const senhaHash =
                await bcrypt.hash(
                    senha,
                    12
                );


            const [resultado] =
                await pool.query(
                    `
                    INSERT INTO usuarios (
                        nome,
                        email,
                        senha_hash,
                        tipo,
                        status
                    )
                    VALUES (?, ?, ?, 'admin', ?)
                    `,
                    [
                        nome.trim(),

                        email
                            .trim()
                            .toLowerCase(),

                        senhaHash,

                        statusFinal
                    ]
                );


            return res.status(201).json({

                mensagem:
                    "Administrador criado com sucesso.",

                administrador: {

                    id:
                        resultado.insertId,

                    nome:
                        nome.trim(),

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    tipo:
                        "admin",

                    status:
                        statusFinal

                }

            });


        } catch (erro) {

            console.error(
                "Erro ao criar administrador:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   LISTAR ADMINISTRADORES
========================================================= */

app.get(
    "/admins",
    autenticarToken,
    somenteMaster,
    async (req, res) => {

        try {

            const [admins] =
                await pool.query(
                    `
                    SELECT
                        id,
                        nome,
                        email,
                        status
                    FROM usuarios
                    WHERE tipo = 'admin'
                    ORDER BY nome ASC
                    `
                );


            return res.json({
                administradores:
                    admins
            });


        } catch (erro) {

            console.error(
                "Erro ao listar administradores:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   ALTERAR STATUS DO ADMINISTRADOR
========================================================= */

app.patch(
    "/admins/:id/status",
    autenticarToken,
    somenteMaster,
    async (req, res) => {

        try {

            const adminId =
                Number(
                    req.params.id
                );


            const {
                status
            } = req.body;


            if (
                !Number.isInteger(adminId) ||
                adminId <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Administrador inválido."
                });

            }


            if (
                status !== "ativo" &&
                status !== "inativo"
            ) {

                return res.status(400).json({
                    mensagem:
                        "Status inválido."
                });

            }


            const [resultado] =
                await pool.query(
                    `
                    UPDATE usuarios
                    SET status = ?
                    WHERE id = ?
                    AND tipo = 'admin'
                    `,
                    [
                        status,
                        adminId
                    ]
                );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Administrador não encontrado."
                });

            }


            return res.json({
                mensagem:
                    "Status do administrador atualizado com sucesso.",

                status:
                    status
            });


        } catch (erro) {

            console.error(
                "Erro ao alterar status do administrador:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   EXCLUIR ADMINISTRADOR
========================================================= */

app.delete(
    "/admins/:id",
    autenticarToken,
    somenteMaster,
    async (req, res) => {

        try {

            const adminId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(adminId) ||
                adminId <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Administrador inválido."
                });

            }


            const [resultado] =
                await pool.query(
                    `
                    DELETE FROM usuarios
                    WHERE id = ?
                    AND tipo = 'admin'
                    `,
                    [
                        adminId
                    ]
                );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Administrador não encontrado."
                });

            }


            return res.json({
                mensagem:
                    "Administrador excluído com sucesso."
            });


        } catch (erro) {

            console.error(
                "Erro ao excluir administrador:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   CRIAR CLIENTE
========================================================= */

app.post(
    "/clientes",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        const conexao =
            await pool.getConnection();


        try {

            const {
                razaoSocial,
                cnpj,
                contato,
                telefone,
                email,
                cep,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                senha,
                status
            } = req.body;


            if (
                !razaoSocial ||
                !cnpj ||
                !contato ||
                !telefone ||
                !email ||
                !cep ||
                !endereco ||
                !numero ||
                !bairro ||
                !cidade ||
                !senha
            ) {

                return res.status(400).json({
                    mensagem:
                        "Preencha todos os campos obrigatórios."
                });

            }


            if (
                senha.length < 8
            ) {

                return res.status(400).json({
                    mensagem:
                        "A senha deve ter pelo menos 8 caracteres."
                });

            }


            const statusFinal =
                status === "inativo"
                    ? "inativo"
                    : "ativo";


            await conexao.beginTransaction();


            /* =============================================
               CONFERE E-MAIL
            ============================================= */

            const [usuarioExistente] =
                await conexao.query(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE email = ?
                    LIMIT 1
                    `,
                    [
                        email
                            .trim()
                            .toLowerCase()
                    ]
                );


            if (
                usuarioExistente.length > 0
            ) {

                await conexao.rollback();

                return res.status(409).json({
                    mensagem:
                        "Já existe um usuário cadastrado com esse e-mail."
                });

            }


            /* =============================================
               CONFERE CNPJ
            ============================================= */

            const [clienteExistente] =
                await conexao.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE cnpj = ?
                    LIMIT 1
                    `,
                    [
                        cnpj.trim()
                    ]
                );


            if (
                clienteExistente.length > 0
            ) {

                await conexao.rollback();

                return res.status(409).json({
                    mensagem:
                        "Já existe um cliente cadastrado com esse CNPJ."
                });

            }


            /* =============================================
               SENHA
            ============================================= */

            const senhaHash =
                await bcrypt.hash(
                    senha,
                    12
                );


            /* =============================================
               CRIA USUÁRIO
            ============================================= */

            const [resultadoUsuario] =
                await conexao.query(
                    `
                    INSERT INTO usuarios (
                        nome,
                        email,
                        senha_hash,
                        tipo,
                        status
                    )
                    VALUES (?, ?, ?, 'cliente', ?)
                    `,
                    [
                        razaoSocial.trim(),

                        email
                            .trim()
                            .toLowerCase(),

                        senhaHash,

                        statusFinal
                    ]
                );


            const usuarioId =
                resultadoUsuario.insertId;


            /* =============================================
               CRIA CLIENTE
            ============================================= */

            const [resultadoCliente] =
                await conexao.query(
                    `
                    INSERT INTO clientes (
                        usuario_id,
                        razao_social,
                        cnpj,
                        contato,
                        telefone,
                        cep,
                        endereco,
                        numero,
                        complemento,
                        bairro,
                        cidade
                    )
                    VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                    `,
                    [
                        usuarioId,
                        razaoSocial.trim(),
                        cnpj.trim(),
                        contato.trim(),
                        telefone.trim(),
                        cep.trim(),
                        endereco.trim(),
                        numero.trim(),

                        complemento
                            ? complemento.trim()
                            : null,

                        bairro.trim(),
                        cidade.trim()
                    ]
                );


            await conexao.commit();


            return res.status(201).json({

                mensagem:
                    "Cliente criado com sucesso.",

                cliente: {

                    id:
                        resultadoCliente.insertId,

                    usuarioId:
                        usuarioId,

                    razaoSocial:
                        razaoSocial.trim(),

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    cnpj:
                        cnpj.trim(),

                    status:
                        statusFinal

                }

            });


        } catch (erro) {

            await conexao.rollback();


            console.error(
                "Erro ao criar cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });


        } finally {

            conexao.release();

        }

    }
);

/* =========================================================
   LISTAR CLIENTES
========================================================= */

app.get(
    "/clientes",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const [clientes] =
                await pool.query(
                    `
                    SELECT
                        clientes.id,
                        clientes.razao_social,
                        clientes.cnpj,
                        clientes.contato,
                        clientes.telefone,
                        clientes.cep,
                        clientes.endereco,
                        clientes.numero,
                        clientes.complemento,
                        clientes.bairro,
                        clientes.cidade,

                        usuarios.email,
                        usuarios.status

                    FROM clientes

                    INNER JOIN usuarios
                        ON usuarios.id = clientes.usuario_id

                    WHERE usuarios.tipo = 'cliente'

                    ORDER BY
                        clientes.razao_social ASC
                    `
                );


            return res.json({
                clientes:
                    clientes
            });


        } catch (erro) {

            console.error(
                "Erro ao listar clientes:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   EDITAR CLIENTE
========================================================= */

app.put(
    "/clientes/:id",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        const conexao =
            await pool.getConnection();


        try {

            const clienteId =
                Number(
                    req.params.id
                );


            const {
                razaoSocial,
                cnpj,
                contato,
                telefone,
                email,
                cep,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                status,
                senha
            } = req.body;


            if (!clienteId) {

                return res.status(400).json({
                    mensagem:
                        "Cliente inválido."
                });

            }


            if (
                !razaoSocial ||
                !cnpj ||
                !contato ||
                !telefone ||
                !email ||
                !cep ||
                !endereco ||
                !numero ||
                !bairro ||
                !cidade
            ) {

                return res.status(400).json({
                    mensagem:
                        "Preencha todos os campos obrigatórios."
                });

            }


            const statusFinal =
                status === "inativo"
                    ? "inativo"
                    : "ativo";


            await conexao.beginTransaction();


            /* =============================================
               BUSCA CLIENTE
            ============================================= */

            const [clientes] =
                await conexao.query(
                    `
                    SELECT
                        clientes.id,
                        clientes.usuario_id
                    FROM clientes
                    WHERE clientes.id = ?
                    LIMIT 1
                    `,
                    [
                        clienteId
                    ]
                );


            if (
                clientes.length === 0
            ) {

                await conexao.rollback();


                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const usuarioId =
                clientes[0].usuario_id;


            /* =============================================
               CONFERE E-MAIL DUPLICADO
            ============================================= */

            const [emailExistente] =
                await conexao.query(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE email = ?
                    AND id <> ?
                    LIMIT 1
                    `,
                    [
                        email
                            .trim()
                            .toLowerCase(),

                        usuarioId
                    ]
                );


            if (
                emailExistente.length > 0
            ) {

                await conexao.rollback();


                return res.status(409).json({
                    mensagem:
                        "Já existe outro usuário com esse e-mail."
                });

            }


            /* =============================================
               CONFERE CNPJ DUPLICADO
            ============================================= */

            const [cnpjExistente] =
                await conexao.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE cnpj = ?
                    AND id <> ?
                    LIMIT 1
                    `,
                    [
                        cnpj.trim(),
                        clienteId
                    ]
                );


            if (
                cnpjExistente.length > 0
            ) {

                await conexao.rollback();


                return res.status(409).json({
                    mensagem:
                        "Já existe outro cliente com esse CNPJ."
                });

            }


            /* =============================================
               ATUALIZA USUÁRIO
            ============================================= */

            await conexao.query(
                `
                UPDATE usuarios
                SET
                    nome = ?,
                    email = ?,
                    status = ?
                WHERE id = ?
                `,
                [
                    razaoSocial.trim(),

                    email
                        .trim()
                        .toLowerCase(),

                    statusFinal,

                    usuarioId
                ]
            );


            /* =============================================
               SENHA OPCIONAL
            ============================================= */

            if (
                senha &&
                senha.trim()
            ) {

                if (
                    senha.length < 8
                ) {

                    await conexao.rollback();


                    return res.status(400).json({
                        mensagem:
                            "A nova senha deve ter pelo menos 8 caracteres."
                    });

                }


                const senhaHash =
                    await bcrypt.hash(
                        senha,
                        12
                    );


                await conexao.query(
                    `
                    UPDATE usuarios
                    SET senha_hash = ?
                    WHERE id = ?
                    `,
                    [
                        senhaHash,
                        usuarioId
                    ]
                );

            }


            /* =============================================
               ATUALIZA CLIENTE
            ============================================= */

            await conexao.query(
                `
                UPDATE clientes
                SET
                    razao_social = ?,
                    cnpj = ?,
                    contato = ?,
                    telefone = ?,
                    cep = ?,
                    endereco = ?,
                    numero = ?,
                    complemento = ?,
                    bairro = ?,
                    cidade = ?
                WHERE id = ?
                `,
                [
                    razaoSocial.trim(),
                    cnpj.trim(),
                    contato.trim(),
                    telefone.trim(),
                    cep.trim(),
                    endereco.trim(),
                    numero.trim(),

                    complemento
                        ? complemento.trim()
                        : null,

                    bairro.trim(),
                    cidade.trim(),

                    clienteId
                ]
            );


            await conexao.commit();


            return res.json({
                mensagem:
                    "Cliente atualizado com sucesso."
            });


        } catch (erro) {

            await conexao.rollback();


            console.error(
                "Erro ao editar cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });


        } finally {

            conexao.release();

        }

    }
);


/* =========================================================
   ALTERAR STATUS DO CLIENTE
========================================================= */

app.patch(
    "/clientes/:id/status",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const clienteId =
                Number(
                    req.params.id
                );


            const {
                status
            } = req.body;


            if (!clienteId) {

                return res.status(400).json({
                    mensagem:
                        "Cliente inválido."
                });

            }


            if (
                status !== "ativo" &&
                status !== "inativo"
            ) {

                return res.status(400).json({
                    mensagem:
                        "Status inválido."
                });

            }


            const [clientes] =
                await pool.query(
                    `
                    SELECT usuario_id
                    FROM clientes
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [
                        clienteId
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const usuarioId =
                clientes[0].usuario_id;


            await pool.query(
                `
                UPDATE usuarios
                SET status = ?
                WHERE id = ?
                `,
                [
                    status,
                    usuarioId
                ]
            );


            return res.json({

                mensagem:
                    "Status atualizado com sucesso.",

                status:
                    status

            });


        } catch (erro) {

            console.error(
                "Erro ao alterar status do cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   EXCLUIR CLIENTE
========================================================= */

app.delete(
    "/clientes/:id",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        const conexao =
            await pool.getConnection();


        try {

            const clienteId =
                Number(
                    req.params.id
                );


            if (!clienteId) {

                return res.status(400).json({
                    mensagem:
                        "Cliente inválido."
                });

            }


            await conexao.beginTransaction();


            const [clientes] =
                await conexao.query(
                    `
                    SELECT usuario_id
                    FROM clientes
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [
                        clienteId
                    ]
                );


            if (
                clientes.length === 0
            ) {

                await conexao.rollback();


                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const usuarioId =
                clientes[0].usuario_id;


            await conexao.query(
                `
                DELETE FROM clientes
                WHERE id = ?
                `,
                [
                    clienteId
                ]
            );


            await conexao.query(
                `
                DELETE FROM usuarios
                WHERE id = ?
                AND tipo = 'cliente'
                `,
                [
                    usuarioId
                ]
            );


            await conexao.commit();


            return res.json({
                mensagem:
                    "Cliente excluído com sucesso."
            });


        } catch (erro) {

            await conexao.rollback();


            console.error(
                "Erro ao excluir cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });


        } finally {

            conexao.release();

        }

    }
);

/* =========================================================
   CRIAR PRODUTO + VARIAÇÕES
========================================================= */

app.post(
    "/produtos",
    autenticarToken,
    masterOuAdmin,
    uploadProduto.single("imagem"),
    async (req, res) => {

        const conexao =
            await pool.getConnection();


        try {

            const {
                nome,
                categoria,
                tamanho,
                descricao,
                preco,
                status,
                variacoes
            } = req.body;


            if (
                !nome ||
                !categoria ||
                !tamanho ||
                !preco
            ) {

                return res.status(400).json({
                    mensagem:
                        "Preencha os campos obrigatórios."
                });

            }


            const categoriasPermitidas = [
                "iogurtes",
                "laticinios",
                "sucos",
                "pao_de_queijo"
            ];


            if (
                !categoriasPermitidas.includes(
                    categoria
                )
            ) {

                return res.status(400).json({
                    mensagem:
                        "Categoria inválida."
                });

            }


            /* =============================================
               PREÇO
            ============================================= */

            const precoNumero =
                Number(
                    String(preco)
                        .replace(/\./g, "")
                        .replace(",", ".")
                );


            if (
                !Number.isFinite(
                    precoNumero
                ) ||
                precoNumero <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Informe um preço válido."
                });

            }


            /* =============================================
               VARIAÇÕES
            ============================================= */

            let variacoesRecebidas =
                [];


            if (variacoes) {

                try {

                    variacoesRecebidas =
                        JSON.parse(
                            variacoes
                        );

                } catch (erro) {

                    return res.status(400).json({
                        mensagem:
                            "Formato das variações inválido."
                    });

                }

            }


            if (
                !Array.isArray(
                    variacoesRecebidas
                )
            ) {

                return res.status(400).json({
                    mensagem:
                        "As variações são inválidas."
                });

            }


            const tiposPermitidos = [
                "sabor",
                "tamanho"
            ];


            for (
                const variacao
                of variacoesRecebidas
            ) {

                if (
                    !variacao.nome ||
                    !tiposPermitidos.includes(
                        variacao.tipo
                    )
                ) {

                    return res.status(400).json({
                        mensagem:
                            "Existe uma variação inválida."
                    });

                }

            }


            const statusFinal =
                status === "inativo"
                    ? "inativo"
                    : "ativo";


            const caminhoImagem =
                req.file
                    ? "/uploads/produtos/" +
                      req.file.filename
                    : null;


            await conexao.beginTransaction();


            /* =============================================
               CRIA PRODUTO
            ============================================= */

            const [resultado] =
                await conexao.query(
                    `
                    INSERT INTO produtos (
                        nome,
                        categoria,
                        sabor,
                        tamanho,
                        descricao,
                        preco,
                        imagem,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        nome.trim(),

                        categoria,

                        null,

                        tamanho.trim(),

                        descricao
                            ? descricao.trim()
                            : null,

                        precoNumero,

                        caminhoImagem,

                        statusFinal
                    ]
                );


            const produtoId =
                resultado.insertId;


            /* =============================================
               SALVA VARIAÇÕES
            ============================================= */

            for (
                const variacao
                of variacoesRecebidas
            ) {

                await conexao.query(
                    `
                    INSERT INTO produto_variacoes (
                        produto_id,
                        tipo,
                        nome,
                        status
                    )
                    VALUES (?, ?, ?, 'ativo')
                    `,
                    [
                        produtoId,
                        variacao.tipo,
                        variacao.nome.trim()
                    ]
                );

            }


            await conexao.commit();


            return res.status(201).json({

                mensagem:
                    "Produto criado com sucesso.",

                produto: {

                    id:
                        produtoId,

                    nome:
                        nome.trim(),

                    categoria:
                        categoria,

                    tamanho:
                        tamanho.trim(),

                    descricao:
                        descricao
                            ? descricao.trim()
                            : null,

                    preco:
                        precoNumero,

                    imagem:
                        caminhoImagem,

                    status:
                        statusFinal,

                    variacoes:
                        variacoesRecebidas

                }

            });


        } catch (erro) {

            await conexao.rollback();


            console.error(
                "Erro ao criar produto:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });


        } finally {

            conexao.release();

        }

    }
);


/* =========================================================
   LISTAR PRODUTOS - ADMIN
========================================================= */

app.get(
    "/produtos",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const [produtos] =
                await pool.query(
                    `
                    SELECT
                        id,
                        nome,
                        categoria,
                        sabor,
                        tamanho,
                        descricao,
                        preco,
                        imagem,
                        status
                    FROM produtos
                    ORDER BY nome ASC
                    `
                );


            return res.json({
                produtos:
                    produtos
            });


        } catch (erro) {

            console.error(
                "Erro ao listar produtos:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   PRODUTOS PÚBLICOS - PÁGINA INICIAL
========================================================= */

app.get(
    "/produtos-publicos",
    async (req, res) => {

        try {

            const [produtos] =
                await pool.query(
                    `
                    SELECT
                        id,
                        nome,
                        categoria,
                        sabor,
                        tamanho,
                        descricao,
                        preco,
                        imagem
                    FROM produtos
                    WHERE status = 'ativo'

                    ORDER BY
                        CASE categoria
                            WHEN 'iogurtes' THEN 1
                            WHEN 'laticinios' THEN 2
                            WHEN 'sucos' THEN 3
                            WHEN 'pao_de_queijo' THEN 4
                            ELSE 5
                        END,

                        nome ASC
                    `
                );


            return res.json({
                produtos:
                    produtos
            });


        } catch (erro) {

            console.error(
                "Erro ao listar produtos públicos:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   EXCLUIR PRODUTO
========================================================= */

app.delete(
    "/produtos/:id",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const produtoId =
                Number(
                    req.params.id
                );


            if (!produtoId) {

                return res.status(400).json({
                    mensagem:
                        "Produto inválido."
                });

            }


            const [produtos] =
                await pool.query(
                    `
                    SELECT imagem
                    FROM produtos
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [
                        produtoId
                    ]
                );


            if (
                produtos.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Produto não encontrado."
                });

            }


            await pool.query(
                `
                DELETE FROM produtos
                WHERE id = ?
                `,
                [
                    produtoId
                ]
            );


            return res.json({
                mensagem:
                    "Produto excluído com sucesso."
            });


        } catch (erro) {

            console.error(
                "Erro ao excluir produto:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   PRODUTOS DISPONÍVEIS PARA O PEDIDO
========================================================= */

app.get(
    "/pedido/produtos",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem acessar esta rota."
                });

            }


            const usuarioId =
                req.usuario.id;


            const [clientes] =
                await pool.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE usuario_id = ?
                    LIMIT 1
                    `,
                    [
                        usuarioId
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const clienteId =
                clientes[0].id;


            /* =============================================
               BUSCA PRODUTOS + PREÇO DO CLIENTE
            ============================================= */

            const [produtos] =
                await pool.query(
                    `
                    SELECT
                        p.id,
                        p.nome,
                        p.categoria,
                        p.tamanho,
                        p.descricao,
                        p.imagem,

                        COALESCE(
                            pc.preco,
                            p.preco
                        ) AS preco

                    FROM produtos p

                    LEFT JOIN precos_clientes pc
                        ON pc.produto_id = p.id
                        AND pc.cliente_id = ?

                    WHERE p.status = 'ativo'

                    ORDER BY
                        CASE p.categoria
                            WHEN 'iogurtes' THEN 1
                            WHEN 'laticinios' THEN 2
                            WHEN 'sucos' THEN 3
                            WHEN 'pao_de_queijo' THEN 4
                            ELSE 5
                        END,

                        p.nome ASC
                    `,
                    [
                        clienteId
                    ]
                );


            /* =============================================
               BUSCA VARIAÇÕES
            ============================================= */

            const [variacoes] =
                await pool.query(
                    `
                    SELECT
                        id,
                        produto_id,
                        tipo,
                        nome
                    FROM produto_variacoes
                    WHERE status = 'ativo'
                    ORDER BY
                        produto_id,
                        id
                    `
                );


            /* =============================================
               JUNTA VARIAÇÕES AOS PRODUTOS
            ============================================= */

            const produtosComVariacoes =
                produtos.map(
                    function (produto) {

                        return {

                            ...produto,

                            variacoes:
                                variacoes.filter(
                                    function (
                                        variacao
                                    ) {

                                        return (
                                            Number(
                                                variacao.produto_id
                                            ) ===
                                            Number(
                                                produto.id
                                            )
                                        );

                                    }
                                )

                        };

                    }
                );


            return res.json({

                clienteId:
                    clienteId,

                produtos:
                    produtosComVariacoes

            });


        } catch (erro) {

            console.error(
                "Erro ao carregar produtos do pedido:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   CRIAR DESCONTO
========================================================= */

app.post(
    "/descontos",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const {
                valorMinimo,
                percentual,
                status
            } = req.body;


            const valorNumero =
                Number(
                    valorMinimo
                );


            const percentualNumero =
                Number(
                    percentual
                );


            if (
                !Number.isFinite(
                    valorNumero
                ) ||
                valorNumero <= 0 ||
                !Number.isFinite(
                    percentualNumero
                ) ||
                percentualNumero <= 0 ||
                percentualNumero > 100
            ) {

                return res.status(400).json({
                    mensagem:
                        "Informe valores válidos para o desconto."
                });

            }


            const statusFinal =
                status === "inativo"
                    ? "inativo"
                    : "ativo";


            const [existentes] =
                await pool.query(
                    `
                    SELECT id
                    FROM descontos
                    WHERE valor_minimo = ?
                    LIMIT 1
                    `,
                    [
                        valorNumero
                    ]
                );


            if (
                existentes.length > 0
            ) {

                return res.status(409).json({
                    mensagem:
                        "Já existe uma regra de desconto para esse valor mínimo."
                });

            }


            const [resultado] =
                await pool.query(
                    `
                    INSERT INTO descontos (
                        valor_minimo,
                        percentual,
                        status
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        valorNumero,
                        percentualNumero,
                        statusFinal
                    ]
                );


            return res.status(201).json({

                mensagem:
                    "Desconto criado com sucesso.",

                desconto: {

                    id:
                        resultado.insertId,

                    valorMinimo:
                        valorNumero,

                    percentual:
                        percentualNumero,

                    status:
                        statusFinal

                }

            });


        } catch (erro) {

            console.error(
                "Erro ao criar desconto:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   LISTAR DESCONTOS
========================================================= */

app.get(
    "/descontos",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const [descontos] =
                await pool.query(
                    `
                    SELECT
                        id,
                        valor_minimo,
                        percentual,
                        status
                    FROM descontos
                    ORDER BY
                        valor_minimo ASC
                    `
                );


            return res.json({
                descontos:
                    descontos
            });


        } catch (erro) {

            console.error(
                "Erro ao listar descontos:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   EXCLUIR DESCONTO
========================================================= */

app.delete(
    "/descontos/:id",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const descontoId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(descontoId) ||
                descontoId <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Desconto inválido."
                });

            }


            const [resultado] =
                await pool.query(
                    `
                    DELETE FROM descontos
                    WHERE id = ?
                    `,
                    [
                        descontoId
                    ]
                );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Desconto não encontrado."
                });

            }


            return res.json({
                mensagem:
                    "Desconto excluído com sucesso."
            });


        } catch (erro) {

            console.error(
                "Erro ao excluir desconto:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   CALCULAR DESCONTO DO PEDIDO
========================================================= */

app.post(
    "/pedido/desconto",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem acessar esta rota."
                });

            }


            const subtotal =
                Number(
                    req.body.subtotal
                );


            if (
                !Number.isFinite(
                    subtotal
                ) ||
                subtotal < 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Subtotal inválido."
                });

            }


            const [regras] =
                await pool.query(
                    `
                    SELECT
                        id,
                        valor_minimo,
                        percentual
                    FROM descontos
                    WHERE status = 'ativo'
                    AND valor_minimo <= ?
                    ORDER BY
                        valor_minimo DESC
                    LIMIT 1
                    `,
                    [
                        subtotal
                    ]
                );


            if (
                regras.length === 0
            ) {

                return res.json({

                    descontoAplicado:
                        false,

                    percentual:
                        0,

                    valorDesconto:
                        0,

                    total:
                        subtotal

                });

            }


            const regra =
                regras[0];


            const percentual =
                Number(
                    regra.percentual
                );


            const valorDesconto =
                subtotal *
                (
                    percentual /
                    100
                );


            const total =
                subtotal -
                valorDesconto;


            return res.json({

                descontoAplicado:
                    true,

                descontoId:
                    regra.id,

                percentual:
                    percentual,

                valorDesconto:
                    valorDesconto,

                total:
                    total

            });


        } catch (erro) {

            console.error(
                "Erro ao calcular desconto:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   CRIAR PEDIDO
========================================================= */

app.post(
    "/pedidos",
    autenticarToken,
    async (req, res) => {

        const conexao =
            await pool.getConnection();


        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem criar pedidos."
                });

            }


            const {
                itens,
                formaPagamento
            } = req.body;


            if (
                !Array.isArray(itens) ||
                itens.length === 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "O pedido não possui itens."
                });

            }


            const formasPermitidas = [
                "pix",
                "boleto",
                "faturamento_10"
            ];


            if (
                !formasPermitidas.includes(
                    formaPagamento
                )
            ) {

                return res.status(400).json({
                    mensagem:
                        "Forma de pagamento inválida."
                });

            }


            /* =============================================
               LOCALIZA CLIENTE LOGADO
            ============================================= */

            const [clientes] =
                await conexao.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE usuario_id = ?
                    LIMIT 1
                    `,
                    [
                        req.usuario.id
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const clienteId =
                clientes[0].id;


            /* =============================================
               INICIA TRANSAÇÃO
            ============================================= */

            await conexao.beginTransaction();


            const itensValidos =
                [];


            let subtotalPedido =
                0;


            /* =============================================
               VALIDA E RECALCULA ITENS
            ============================================= */

            for (
                const item of itens
            ) {

                const produtoId =
                    Number(
                        item.produtoId
                    );


                const quantidade =
                    Number(
                        item.quantidade
                    );


                const variacaoId =
                    item.variacaoId
                        ? Number(
                            item.variacaoId
                        )
                        : null;


                if (
                    !produtoId ||
                    !Number.isInteger(
                        quantidade
                    ) ||
                    quantidade <= 0
                ) {

                    throw new Error(
                        "Item inválido no pedido."
                    );

                }


                const [produtos] =
                    await conexao.query(
                        `
                        SELECT
                            p.id,
                            p.nome,
                            p.categoria,

                            COALESCE(
                                pc.preco,
                                p.preco
                            ) AS preco

                        FROM produtos p

                        LEFT JOIN precos_clientes pc
                            ON pc.produto_id = p.id
                            AND pc.cliente_id = ?

                        WHERE p.id = ?
                        AND p.status = 'ativo'

                        LIMIT 1
                        `,
                        [
                            clienteId,
                            produtoId
                        ]
                    );


                if (
                    produtos.length === 0
                ) {

                    throw new Error(
                        "Produto inválido ou inativo."
                    );

                }


                const produto =
                    produtos[0];


                let variacaoTipo =
                    null;


                let variacaoNome =
                    null;


                if (
                    variacaoId
                ) {

                    const [variacoes] =
                        await conexao.query(
                            `
                            SELECT
                                id,
                                tipo,
                                nome
                            FROM produto_variacoes
                            WHERE id = ?
                            AND produto_id = ?
                            AND status = 'ativo'
                            LIMIT 1
                            `,
                            [
                                variacaoId,
                                produtoId
                            ]
                        );


                    if (
                        variacoes.length === 0
                    ) {

                        throw new Error(
                            "Variação inválida."
                        );

                    }


                    variacaoTipo =
                        variacoes[0].tipo;


                    variacaoNome =
                        variacoes[0].nome;

                }


                const precoUnitario =
                    Number(
                        produto.preco
                    );


                const subtotalItem =
                    precoUnitario *
                    quantidade;


                subtotalPedido +=
                    subtotalItem;


                itensValidos.push({

                    produtoId:
                        produto.id,

                    produtoNome:
                        produto.nome,

                    variacaoId:
                        variacaoId,

                    variacaoTipo:
                        variacaoTipo,

                    variacaoNome:
                        variacaoNome,

                    quantidade:
                        quantidade,

                    precoUnitario:
                        precoUnitario,

                    subtotal:
                        subtotalItem

                });

            }


            /* =============================================
               CALCULA DESCONTO
            ============================================= */

            const [regras] =
                await conexao.query(
                    `
                    SELECT
                        id,
                        percentual
                    FROM descontos
                    WHERE status = 'ativo'
                    AND valor_minimo <= ?
                    ORDER BY
                        valor_minimo DESC
                    LIMIT 1
                    `,
                    [
                        subtotalPedido
                    ]
                );


            let descontoPercentual =
                0;


            let descontoValor =
                0;


            if (
                regras.length > 0
            ) {

                descontoPercentual =
                    Number(
                        regras[0].percentual
                    );


                descontoValor =
                    subtotalPedido *
                    (
                        descontoPercentual /
                        100
                    );

            }

            /* =========================================================
            EXCLUIR DESCONTO
            ========================================================= */

            app.delete(
                "/descontos/:id",
                autenticarToken,
                masterOuAdmin,
                async (req, res) => {

                    try {

                        const descontoId =
                            Number(
                                req.params.id
                            );


                        if (
                            !Number.isInteger(
                                descontoId
                            ) ||
                            descontoId <= 0
                        ) {

                            return res.status(400).json({
                                mensagem:
                                    "Desconto inválido."
                            });

                        }


                        const [resultado] =
                            await pool.query(
                                `
                                DELETE FROM descontos
                                WHERE id = ?
                                `,
                                [
                                    descontoId
                                ]
                            );


                        if (
                            resultado.affectedRows === 0
                        ) {

                            return res.status(404).json({
                                mensagem:
                                    "Desconto não encontrado."
                            });

                        }


                        return res.json({
                            mensagem:
                                "Desconto excluído com sucesso."
                        });


                    } catch (erro) {

                        console.error(
                            "Erro ao excluir desconto:",
                            erro
                        );


                        return res.status(500).json({
                            mensagem:
                                "Erro interno do servidor."
                        });

                    }

                }
            );

            const totalPedido =
                subtotalPedido -
                descontoValor;


            /* =============================================
               CRIA PEDIDO
            ============================================= */

            const [resultadoPedido] =
                await conexao.query(
                    `
                    INSERT INTO pedidos (
                        cliente_id,
                        subtotal,
                        desconto_percentual,
                        desconto_valor,
                        total,
                        forma_pagamento,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, 'pendente')
                    `,
                    [
                        clienteId,
                        subtotalPedido,
                        descontoPercentual,
                        descontoValor,
                        totalPedido,
                        formaPagamento
                    ]
                );


            const pedidoId =
                resultadoPedido.insertId;


            /* =============================================
               CRIA ITENS DO PEDIDO
            ============================================= */

            for (
                const item
                of itensValidos
            ) {

                await conexao.query(
                    `
                    INSERT INTO pedido_itens (
                        pedido_id,
                        produto_id,
                        variacao_id,
                        produto_nome,
                        variacao_tipo,
                        variacao_nome,
                        quantidade,
                        preco_unitario,
                        subtotal
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        pedidoId,
                        item.produtoId,
                        item.variacaoId,
                        item.produtoNome,
                        item.variacaoTipo,
                        item.variacaoNome,
                        item.quantidade,
                        item.precoUnitario,
                        item.subtotal
                    ]
                );

            }


            /* =============================================
               CONFIRMA TRANSAÇÃO
            ============================================= */

            await conexao.commit();


            /* =============================================
               ENVIA E-MAIL DO PEDIDO
            ============================================= */

            try {

                const [dadosCliente] =
                    await pool.query(
                        `
                        SELECT
                            c.razao_social,
                            c.cnpj,
                            u.email

                        FROM clientes c

                        INNER JOIN usuarios u
                            ON u.id = c.usuario_id

                        WHERE c.id = ?

                        LIMIT 1
                        `,
                        [
                            clienteId
                        ]
                    );


                if (
                    dadosCliente.length > 0
                ) {

                    await enviarEmailPedido({

                        pedido: {

                            id:
                                pedidoId,

                            subtotal:
                                subtotalPedido,

                            descontoPercentual:
                                descontoPercentual,

                            descontoValor:
                                descontoValor,

                            total:
                                totalPedido,

                            formaPagamento:
                                formaPagamento

                        },

                        cliente:
                            dadosCliente[0],

                        itens:
                            itensValidos

                    });


                    console.log(
                        "E-mail do pedido enviado com sucesso:",
                        pedidoId
                    );

                }


            } catch (erroEmail) {

                console.error(
                    "Pedido salvo, mas o e-mail não foi enviado:",
                    erroEmail
                );

            }


            /* =============================================
               RESPOSTA
            ============================================= */

            return res.status(201).json({

                mensagem:
                    "Pedido criado com sucesso.",

                pedido: {

                    id:
                        pedidoId,

                    subtotal:
                        subtotalPedido,

                    descontoPercentual:
                        descontoPercentual,

                    descontoValor:
                        descontoValor,

                    total:
                        totalPedido,

                    formaPagamento:
                        formaPagamento,

                    status:
                        "pendente"

                }

            });


        } catch (erro) {

            try {

                await conexao.rollback();

            } catch (erroRollback) {

                console.error(
                    "Erro ao desfazer transação:",
                    erroRollback
                );

            }


            console.error(
                "Erro ao criar pedido:",
                erro
            );


            return res.status(500).json({

                mensagem:
                    erro.message ||
                    "Erro interno do servidor."

            });


        } finally {

            conexao.release();

        }

    }
);

/* =========================================================
   LISTAR TODOS OS PEDIDOS - ADMIN / MASTER
========================================================= */

app.get(
    "/admin/pedidos",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const [pedidos] =
                await pool.query(
                    `
                    SELECT
                        p.id,
                        p.subtotal,
                        p.desconto_percentual,
                        p.desconto_valor,
                        p.total,
                        p.forma_pagamento,
                        p.status,
                        p.criado_em,

                        c.id AS cliente_id,
                        c.razao_social,
                        c.cnpj

                    FROM pedidos p

                    INNER JOIN clientes c
                        ON c.id = p.cliente_id

                    ORDER BY
                        CASE p.status
                            WHEN 'pendente' THEN 1
                            WHEN 'separado' THEN 2
                            WHEN 'entregue' THEN 3
                            WHEN 'cancelado' THEN 4
                            ELSE 5
                        END,
                        p.criado_em DESC
                    `
                );


            return res.json({
                pedidos:
                    pedidos
            });


        } catch (erro) {

            console.error(
                "Erro ao listar pedidos administrativos:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   DETALHES DO PEDIDO - ADMIN / MASTER
========================================================= */

app.get(
    "/admin/pedidos/:id",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const pedidoId =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(
                    pedidoId
                ) ||
                pedidoId <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Pedido inválido."
                });

            }


            const [pedidos] =
                await pool.query(
                    `
                    SELECT
                        p.id,
                        p.subtotal,
                        p.desconto_percentual,
                        p.desconto_valor,
                        p.total,
                        p.forma_pagamento,
                        p.status,
                        p.criado_em,

                        c.id AS cliente_id,
                        c.razao_social,
                        c.cnpj

                    FROM pedidos p

                    INNER JOIN clientes c
                        ON c.id = p.cliente_id

                    WHERE p.id = ?

                    LIMIT 1
                    `,
                    [
                        pedidoId
                    ]
                );


            if (
                pedidos.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Pedido não encontrado."
                });

            }


            const [itens] =
                await pool.query(
                    `
                    SELECT
                        id,
                        produto_id,
                        variacao_id,
                        produto_nome,
                        variacao_tipo,
                        variacao_nome,
                        quantidade,
                        preco_unitario,
                        subtotal

                    FROM pedido_itens

                    WHERE pedido_id = ?

                    ORDER BY id ASC
                    `,
                    [
                        pedidoId
                    ]
                );


            return res.json({

                pedido:
                    pedidos[0],

                itens:
                    itens

            });


        } catch (erro) {

            console.error(
                "Erro ao buscar pedido:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   ALTERAR STATUS DO PEDIDO - ADMIN / MASTER
========================================================= */

app.patch(
    "/admin/pedidos/:id/status",
    autenticarToken,
    masterOuAdmin,
    async (req, res) => {

        try {

            const pedidoId =
                Number(
                    req.params.id
                );


            const {
                status
            } = req.body;


            const statusPermitidos = [
                "pendente",
                "separado",
                "entregue",
                "cancelado"
            ];


            if (
                !Number.isInteger(
                    pedidoId
                ) ||
                pedidoId <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "Pedido inválido."
                });

            }


            if (
                !statusPermitidos.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    mensagem:
                        "Situação do pedido inválida."
                });

            }


            const [resultado] =
                await pool.query(
                    `
                    UPDATE pedidos
                    SET status = ?
                    WHERE id = ?
                    `,
                    [
                        status,
                        pedidoId
                    ]
                );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Pedido não encontrado."
                });

            }


            return res.json({

                mensagem:
                    "Situação atualizada com sucesso.",

                status:
                    status

            });


        } catch (erro) {

            console.error(
                "Erro ao atualizar situação do pedido:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   MEUS PEDIDOS - CLIENTE
========================================================= */

app.get(
    "/meus-pedidos",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem acessar esta rota."
                });

            }


            /* =============================================
               LOCALIZA O CLIENTE LOGADO
            ============================================= */

            const [clientes] =
                await pool.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE usuario_id = ?
                    LIMIT 1
                    `,
                    [
                        req.usuario.id
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            const clienteId =
                clientes[0].id;


            /* =============================================
               BUSCA PEDIDOS
            ============================================= */

            const [pedidos] =
                await pool.query(
                    `
                    SELECT
                        id,
                        subtotal,
                        desconto_percentual,
                        desconto_valor,
                        total,
                        forma_pagamento,
                        status,
                        criado_em

                    FROM pedidos

                    WHERE cliente_id = ?

                    ORDER BY
                        criado_em DESC
                    `,
                    [
                        clienteId
                    ]
                );


            /* =============================================
               BUSCA ITENS DE CADA PEDIDO
            ============================================= */

            const pedidosComItens =
                [];


            for (
                const pedido
                of pedidos
            ) {

                const [itens] =
                    await pool.query(
                        `
                        SELECT
                            id,
                            produto_id,
                            variacao_id,
                            produto_nome,
                            variacao_tipo,
                            variacao_nome,
                            quantidade,
                            preco_unitario,
                            subtotal

                        FROM pedido_itens

                        WHERE pedido_id = ?

                        ORDER BY id ASC
                        `,
                        [
                            pedido.id
                        ]
                    );


                pedidosComItens.push({

                    ...pedido,

                    itens:
                        itens

                });

            }


            return res.json({
                pedidos:
                    pedidosComItens
            });


        } catch (erro) {

            console.error(
                "Erro ao carregar pedidos do cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);


/* =========================================================
   DADOS DO PAINEL DO CLIENTE
========================================================= */

app.get(
    "/cliente/painel",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem acessar esta rota."
                });

            }


            const [clientes] =
                await pool.query(
                    `
                    SELECT
                        c.id,
                        c.razao_social,
                        c.cnpj,
                        c.telefone,
                        u.email

                    FROM clientes c

                    INNER JOIN usuarios u
                        ON u.id = c.usuario_id

                    WHERE c.usuario_id = ?

                    LIMIT 1
                    `,
                    [
                        req.usuario.id
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            return res.json({
                cliente:
                    clientes[0]
            });


        } catch (erro) {

            console.error(
                "Erro ao carregar painel do cliente:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   FRONTEND
========================================================= */

const frontendPath =
    path.resolve(__dirname, "..");

app.use(
    express.static(frontendPath)
);

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );

});


/* =========================================================
   TRATAMENTO DE ERROS DO MULTER
========================================================= */

app.use(
    (
        erro,
        req,
        res,
        next
    ) => {

        if (
            erro instanceof multer.MulterError
        ) {

            console.error(
                "Erro do Multer:",
                erro
            );


            return res.status(400).json({
                mensagem:
                    "Erro ao enviar imagem."
            });

        }


        if (
            erro &&
            erro.message ===
                "Formato de imagem não permitido."
        ) {

            return res.status(400).json({
                mensagem:
                    erro.message
            });

        }


        console.error(
            "Erro não tratado:",
            erro
        );


        return res.status(500).json({
            mensagem:
                "Erro interno do servidor."
        });

    }
);

/* =========================================================
   MINHA CONTA - DADOS DO CLIENTE LOGADO
========================================================= */

app.get(
    "/cliente/minha-conta",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem acessar esta rota."
                });

            }


            const [clientes] =
                await pool.query(
                    `
                    SELECT
                        c.id,
                        c.razao_social,
                        c.cnpj,
                        c.contato,
                        c.telefone,
                        c.cep,
                        c.endereco,
                        c.numero,
                        c.complemento,
                        c.bairro,
                        c.cidade,

                        u.email,
                        u.status

                    FROM clientes c

                    INNER JOIN usuarios u
                        ON u.id = c.usuario_id

                    WHERE c.usuario_id = ?

                    LIMIT 1
                    `,
                    [
                        req.usuario.id
                    ]
                );


            if (
                clientes.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Cliente não encontrado."
                });

            }


            return res.json({
                cliente:
                    clientes[0]
            });


        } catch (erro) {

            console.error(
                "Erro ao carregar dados da conta:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   ALTERAR SENHA - CLIENTE LOGADO
========================================================= */

app.patch(
    "/cliente/alterar-senha",
    autenticarToken,
    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.tipo !== "cliente"
            ) {

                return res.status(403).json({
                    mensagem:
                        "Apenas clientes podem alterar esta senha."
                });

            }


            const {
                senhaAtual,
                novaSenha
            } = req.body;


            if (
                !senhaAtual ||
                !novaSenha
            ) {

                return res.status(400).json({
                    mensagem:
                        "Informe a senha atual e a nova senha."
                });

            }


            if (
                novaSenha.length < 8
            ) {

                return res.status(400).json({
                    mensagem:
                        "A nova senha deve ter pelo menos 8 caracteres."
                });

            }


            if (
                senhaAtual === novaSenha
            ) {

                return res.status(400).json({
                    mensagem:
                        "A nova senha deve ser diferente da senha atual."
                });

            }


            const [usuarios] =
                await pool.query(
                    `
                    SELECT
                        id,
                        senha_hash
                    FROM usuarios
                    WHERE id = ?
                    AND tipo = 'cliente'
                    LIMIT 1
                    `,
                    [
                        req.usuario.id
                    ]
                );


            if (
                usuarios.length === 0
            ) {

                return res.status(404).json({
                    mensagem:
                        "Usuário não encontrado."
                });

            }


            const usuario =
                usuarios[0];


            const senhaCorreta =
                await bcrypt.compare(
                    senhaAtual,
                    usuario.senha_hash
                );


            if (
                !senhaCorreta
            ) {

                return res.status(401).json({
                    mensagem:
                        "A senha atual está incorreta."
                });

            }


            const novaSenhaHash =
                await bcrypt.hash(
                    novaSenha,
                    12
                );


            await pool.query(
                `
                UPDATE usuarios
                SET senha_hash = ?
                WHERE id = ?
                `,
                [
                    novaSenhaHash,
                    usuario.id
                ]
            );


            return res.json({
                mensagem:
                    "Senha alterada com sucesso."
            });


        } catch (erro) {

            console.error(
                "Erro ao alterar senha:",
                erro
            );


            return res.status(500).json({
                mensagem:
                    "Erro interno do servidor."
            });

        }

    }
);

/* =========================================================
   INICIAR SERVIDOR
========================================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor rodando em http://localhost:${PORT}`
        );

    }
);