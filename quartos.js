// ===============================
// QUARTOS.JS CORRIGIDO
// ===============================

document.addEventListener('DOMContentLoaded', async function () {

    await carregarQuartos();

    setupEventListeners();
});

// ===============================
// CARREGAR QUARTOS
// ===============================

async function carregarQuartos() {

    try {

        const response =
            await fetch('./api.php/quartos');

        if (!response.ok) {
            throw new Error(
                'Erro ao carregar quartos'
            );
        }

        const quartos =
            await response.json();

        const tbody =
            document.querySelector(
                '#quartosTable tbody'
            );

        if (!tbody) return;

        tbody.innerHTML =
            quartos
                .map(quarto => criarLinhaQuarto(quarto))
                .join('');

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

// ===============================
// LINHA DA TABELA
// ===============================

function criarLinhaQuarto(quarto) {

    const statusBadge = {

        'Disponível': '✅ Disponível',
        'Ocupado': '⏳ Ocupado',
        'Manutenção': '🔧 Manutenção'

    }[quarto.status] || quarto.status;

    return `
        <tr>

            <td>
                <strong>
                    Q${quarto.numero}
                </strong>
            </td>

            <td>
                ${quarto.tipo}
            </td>

            <td>
                ${Number(
                    quarto.preco_diaria
                ).toLocaleString('pt-AO')} KZS
            </td>

            <td>
                <span class="status-badge ${quarto.status.toLowerCase()}">
                    ${statusBadge}
                </span>
            </td>

            <td>

                <button
                    class="btn btn-sm btn-primary"
                    onclick="editarQuarto(${quarto.id_quarto})"
                >
                    Editar
                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="excluirQuarto(${quarto.id_quarto})"
                >
                    Excluir
                </button>

            </td>

        </tr>
    `;
}

// ===============================
// EVENTOS
// ===============================

function setupEventListeners() {

    const quartoForm =
        document.getElementById('quartoForm');

    if (quartoForm) {

        quartoForm.addEventListener(
            'submit',
            handleQuartoSubmit
        );
    }

    const searchQuartos =
        document.getElementById('searchQuartos');

    if (searchQuartos) {

        searchQuartos.addEventListener(
            'input',
            filtrarQuartos
        );
    }
}

// ===============================
// SALVAR QUARTO
// ===============================

async function handleQuartoSubmit(e) {

    e.preventDefault();

    const formData =
        new FormData(e.target);

    const quarto =
        Object.fromEntries(formData);

    try {

        const response =
            await fetch(
                './api.php/quartos',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(quarto)
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'Erro ao salvar quarto'
            );
        }

        mostrarAlerta(
            'Quarto cadastrado com sucesso! ✅',
            'success'
        );

        e.target.reset();

        await carregarQuartos();

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

// ===============================
// FILTRAR
// ===============================

function filtrarQuartos() {

    const termo =
        document.getElementById(
            'searchQuartos'
        )
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            '#quartosTable tbody tr'
        );

    rows.forEach(row => {

        const texto =
            row.textContent.toLowerCase();

        row.style.display =
            texto.includes(termo)
                ? ''
                : 'none';
    });
}

// ===============================
// EDITAR
// ===============================

function editarQuarto(id) {

    mostrarAlerta(
        `Editar quarto ${id}`,
        'info'
    );
}

// ===============================
// EXCLUIR
// ===============================

async function excluirQuarto(id) {

    if (!confirm(
        'Deseja excluir este quarto?'
    )) return;

    try {

        const response =
            await fetch(
                `./api.php/quartos/${id}`,
                {
                    method: 'DELETE'
                }
            );

        if (!response.ok) {
            throw new Error(
                'Erro ao excluir quarto'
            );
        }

        mostrarAlerta(
            'Quarto excluído!',
            'success'
        );

        await carregarQuartos();

    } catch (error) {

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

// ===============================
// ALERTAS
// ===============================

function mostrarAlerta(mensagem, tipo) {

    const alerta =
        document.createElement('div');

    alerta.className =
        `alert alert-${tipo}`;

    alerta.textContent =
        mensagem;

    document
        .querySelector('.admin-container')
        ?.prepend(alerta);

    setTimeout(() => {

        alerta.remove();

    }, 4000);
}