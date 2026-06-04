// ===============================
// SISTEMA DE RESERVAS - CORRIGIDO
// reservas.js
// ===============================

let clientes = [];
let quartos = [];

// ===============================
// INICIALIZAÇÃO
// ===============================

document.addEventListener('DOMContentLoaded', async function () {

    await Promise.all([
        carregarClientesSelect(),
        carregarQuartosSelect(),
        carregarReservas()
    ]);

    setupEventListeners();
});

// ===============================
// CARREGAR CLIENTES
// ===============================

async function carregarClientesSelect() {

    try {

        const response = await fetch('./api.php/clientes');

        if (!response.ok) {
            throw new Error('Erro ao carregar clientes');
        }

        clientes = await response.json();

        const select = document.getElementById('id_cliente');

        select.innerHTML = `
            <option value="">Selecione cliente...</option>

            ${clientes.map(cliente => `
                <option value="${cliente.id_cliente}">
                    ${cliente.nome} (${cliente.bi})
                </option>
            `).join('')} 
        `;

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            'Erro ao carregar clientes',
            'error'
        );
    }
}

// ===============================
// CARREGAR QUARTOS
// ===============================

async function carregarQuartosSelect() {

    try {

        const response = await fetch('./api.php/quartos');

        if (!response.ok) {
            throw new Error('Erro ao carregar quartos');
        }

        quartos = await response.json();

        const select = document.getElementById('id_quarto');

        select.innerHTML = `
            <option value="">Selecione quarto...</option>

            ${quartos
                .filter(quarto => quarto.status === 'Disponível')
                .map(quarto => `
                    <option value="${quarto.id_quarto}">
                        Q${quarto.numero} - 
                        ${quarto.tipo} 
                        (${Number(quarto.preco_diaria).toLocaleString('pt-AO')} KZS)
                    </option>
                `).join('')
            }
        `;

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            'Erro ao carregar quartos',
            'error'
        );
    }
}

// ===============================
// CARREGAR RESERVAS
// ===============================

async function carregarReservas() {

    try {

        const response = await fetch('./api.php/reservas');

        if (!response.ok) {
            throw new Error('Erro ao carregar reservas');
        }

        const reservas = await response.json();

        const tbody = document.querySelector('#reservasTable tbody');

        if (!tbody) return;

        tbody.innerHTML = reservas
            .map(reserva => criarLinhaReserva(reserva))
            .join('');

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            'Erro ao carregar reservas',
            'error'
        );
    }
}

// ===============================
// CRIAR LINHA DA TABELA
// ===============================

function criarLinhaReserva(reserva) {

    const statusClass = {

        'Pendente': 'warning',
        'Confirmada': 'success',
        'Check-in': 'info',
        'Check-out': 'secondary',
        'Cancelada': 'danger'

    }[reserva.status_reserva] || 'secondary';

    return `
        <tr>

            <td>${reserva.cliente_nome}</td>

            <td>
                Q${reserva.quarto_numero}
            </td>

            <td>
                ${new Date(
                    reserva.data_checkin
                ).toLocaleDateString('pt-AO')}
            </td>

            <td>
                ${new Date(
                    reserva.data_checkout
                ).toLocaleDateString('pt-AO')}
            </td>

            <td>
                ${Number(
                    reserva.valor_total
                ).toLocaleString('pt-AO')} KZS
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${reserva.status_reserva}
                </span>
            </td>

            <td>

                <button 
                    class="btn btn-sm btn-primary"
                    onclick="checkIn(${reserva.id_reserva})"
                >
                    Check-in
                </button>

                <button 
                    class="btn btn-sm btn-success"
                    onclick="checkOut(${reserva.id_reserva})"
                >
                    Check-out
                </button>

            </td>

        </tr>
    `;
}

// ===============================
// EVENTOS
// ===============================

function setupEventListeners() {

    const reservaForm =
        document.getElementById('reservaForm');

    if (reservaForm) {

        reservaForm.addEventListener(
            'submit',
            handleReservaSubmit
        );
    }

    const filtroStatus =
        document.getElementById('filtroStatus');

    if (filtroStatus) {

        filtroStatus.addEventListener(
            'change',
            filtrarReservas
        );
    }

    const searchReservas =
        document.getElementById('searchReservas');

    if (searchReservas) {

        searchReservas.addEventListener(
            'input',
            filtrarReservas
        );
    }

    document
        .getElementById('id_quarto')
        ?.addEventListener(
            'change',
            calcularValorTotal
        );

    document
        .getElementById('data_checkin')
        ?.addEventListener(
            'change',
            calcularDias
        );

    document
        .getElementById('data_checkout')
        ?.addEventListener(
            'change',
            calcularDias
        );
}

// ===============================
// SALVAR RESERVA
// ===============================

async function handleReservaSubmit(e) {

    e.preventDefault();

    const formData = new FormData(e.target);

    const reserva = Object.fromEntries(formData);

    try {

        const response = await fetch(
            './api.php/reservas',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(reserva)
            }
        );
        const response = await fetch();

if (!response.ok) {
    throw new Error('Erro ao salvar reserva');
}
        

        mostrarAlerta(
            'Reserva criada com sucesso! ✅',
            'success'
        );

        e.target.reset();

        await Promise.all([
            carregarClientesSelect(),
            carregarQuartosSelect(),
            carregarReservas()
        ]);

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

// ===============================
// CALCULAR DIAS
// ===============================

function calcularDias() {

    const checkin =
        document.getElementById('data_checkin').value;

    const checkout =
        document.getElementById('data_checkout').value;

    if (checkin && checkout) {

        const diffTime =
            new Date(checkout) - new Date(checkin);

        const dias =
            Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            );

        calcularValorTotal(dias);
    }
}

// ===============================
// CALCULAR VALOR
// ===============================

function calcularValorTotal(dias = 1) {

    const quartoId =
        document.getElementById('id_quarto').value;

    const quarto =
        quartos.find(
            q => q.id_quarto == quartoId
        );

    if (quarto) {

        const total =
            Number(quarto.preco_diaria) * dias;

        document.getElementById(
            'valor_total'
        ).value = total.toFixed(2);
    }
}

// ===============================
// FILTRAR RESERVAS
// ===============================

function filtrarReservas() {

    const filtro =
        document.getElementById('filtroStatus').value;

    const termo =
        document.getElementById('searchReservas')
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            '#reservasTable tbody tr'
        );

    rows.forEach(row => {

        const status =
            row.querySelector('.status-badge')
            ?.textContent
            .trim();

        const texto =
            row.textContent.toLowerCase();

        const okStatus =
            !filtro || status === filtro;

        const okTexto =
            !termo || texto.includes(termo);

        row.style.display =
            okStatus && okTexto
                ? ''
                : 'none';
    });
}

// ===============================
// CHECK-IN
// ===============================

function checkIn(id) {

    mostrarAlerta(
        `Check-in da reserva ${id} realizado`,
        'success'
    );
}

// ===============================
// CHECK-OUT
// ===============================

function checkOut(id) {

    mostrarAlerta(
        `Check-out da reserva ${id} realizado`,
        'success'
    );
}

// ===============================
// ALERTAS
// ===============================

function mostrarAlerta(mensagem, tipo) {

    const alerta =
        document.createElement('div');

    alerta.className =
        `alert alert-${tipo}`;

    alerta.textContent = mensagem;

    document
        .querySelector('.admin-container')
        ?.prepend(alerta);

    setTimeout(() => {

        alerta.remove();

    }, 4000);
}