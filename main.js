
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});


document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


document.querySelectorAll(a[href^="#"]).forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', async () => {
    await carregarQuartos();
    
    
    let page = 1;
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && page < 3) {
            page++;
            carregarMaisQuartos();
        }
    });
}, { threshold: 0.1 });

observer.observe(document.querySelector('.quartos-grid'));
});


async function carregarQuartos() {
    try {
        const response = await fetch('api.php');
        const quartos = await response.json();
        
         const container = document.getElementById('quartosContainer');
    container.innerHTML = quartos.map(quarto => criarCardQuarto(quarto)).join('');
} catch (error) {
    console.error('Erro ao carregar quartos:', error);
}
}

function criarCardQuarto(quarto) {
    const statusClass = quarto.status === 'Disponível' ? 'status-disponivel' : 'status-ocupado';
    const statusEmoji = quarto.status === 'Disponível' ? '✅' : '⏳';
    
    return 
    <div class="quarto-card">
        <div class="quarto-image">
            <i class="fas fa-bed"></i>
        </div>
        <div class="quarto-info">
            <h3>Quarto ${quarto.numero}</h3>
            <p><strong>${quarto.tipo}</strong></p>
            <div class="quarto-preco">${quarto.preco_diaria.toLocaleString('pt-AO')} KZS/noite</div>
            <div class="quarto-status ${statusClass}">
                ${statusEmoji} ${quarto.status}
            </div>
        </div>
    </div>
;
}

async function carregarMaisQuartos() {
   
    const novosQuartos = [
    { id_quarto: 10, numero: '101', tipo: 'Standard', preco_diaria: 2500, status: 'Disponível' },
    { id_quarto: 11, numero: '102', tipo: 'Premium', preco_diaria: 3500, status: 'Ocupado' },
    { id_quarto: 12, numero: '103', tipo: 'Standard', preco_diaria: 4500, status: 'Disponível' },
    { id_quarto: 13, numero: '104', tipo: 'Premium', preco_diaria: 8500, status: 'Ocupado' },
];

const container = document.getElementById('quartosContainer');
container.innerHTML += novosQuartos.map(quarto => criarCardQuarto(quarto)).join('');
}