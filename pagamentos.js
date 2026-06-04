
let reservas = [];

document.addEventListener('DOMContentLoaded', async function() {
    await carregarReservasSelect();
    setupEventListeners();
});

async function carregarReservasSelect() {
    try {
        const response = await fetch('api.php');
        reservas = await response.json();
        const select = document.getElementById('id_reserva');
        select.innerHTML = <option value="">Selecione reserva...</option> + 
            reservas.map(r => <option value="${r.id_reserva}">[Q${r.quarto_numero}] ${r.cliente_nome} - ${r.valor_total.toLocaleString()} KZS</option>).join('');
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}

function setupEventListeners() {
    document.getElementById('pagamentoForm').addEventListener('submit', handlePagamentoSubmit);
    document.getElementById('filtroData').addEventListener('change', filtrarPagamentos);
    document.getElementById('searchPagamentos').addEventListener('input', filtrarPagamentos);
}

async function handlePagamentoSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pagamento = Object.fromEntries(formData);
    
    try {
    // TODO: Implementar POST para pagamentos na API
    mostrarAlerta('Pagamento registrado com sucesso! 💰', 'success');
    e.target.reset();
    await carregarReservasSelect();
} catch (error) {
    mostrarAlerta('Erro ao registrar pagamento: ' + error.message, 'error');
}
}

function filtrarPagamentos() {
    
    
    const termo = document.getElementById('searchPagamentos').value.toLowerCase();
   
}

function mostrarAlerta(mensagem, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensagem;
    document.querySelector('.admin-container').prepend(alerta);
    setTimeout(() => alerta.remove(), 4000);
}