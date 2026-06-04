
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
   
    const token = localStorage.getItem('admin_token');
if (token) {
    window.location.href = 'dashboard.html';
}
});

function setupEventListeners() {
    const form = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    
    form.addEventListener('submit', handleLogin);
togglePassword.addEventListener('click', togglePasswordVisibility);


document.getElementById('senha').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
const senha = document.getElementById('senha').value;
const remember = document.getElementById('remember').checked;


const btn = e.target.querySelector('.btn-login');
const originalText = btn.innerHTML;
btn.disabled = true;
btn.innerHTML = <i class="fas fa-spinner fa-spin"> Entrando...</i> ;

try {
    const response = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
       
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        
        document.body.classList.add('login-success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    } else {
        throw new Error(data.error || 'Erro no login');
    }
} catch (error) {
    mostrarAlerta('❌ ' + error.message, 'error');
} finally {
    
    btn.disabled = false;
    btn.innerHTML = originalText;
}
}

function togglePasswordVisibility() {
    const senhaInput = document.getElementById('senha');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    toggleIcon.className = 'fas fa-eye-slash toggle-password';
} else {
    senhaInput.type = 'password';
    toggleIcon.className = 'fas fa-eye toggle-password';
}
}

function mostrarAlerta(mensagem, tipo) {
    const alertDiv = document.getElementById('loginAlert');
    alertDiv.textContent = mensagem;
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.style.display = 'block';
    
    
    setTimeout(() => {
    alertDiv.style.display = 'none';
}, 5000);


alertDiv.style.animation = 'shake 0.9s ease-in-out';
setTimeout(() => {
    alertDiv.style.animation = '';
}, 500);
}