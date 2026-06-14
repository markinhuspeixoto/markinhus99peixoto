// Carrinho de compras
let carrinho = [];

// Elementos do DOM
const carrinhoIcon = document.querySelector('.carrinho-icon');
const carrinhoModal = document.getElementById('carrinho-modal');
const closeBtn = document.querySelector('.close');
const cartCount = document.querySelector('.cart-count');
const botoesAdicionar = document.querySelectorAll('.product-card .btn-secondary');
const formularioContato = document.getElementById('formulario-contato');
const formularioNewsletter = document.getElementById('formulario-newsletter');

// Abrir carrinho
carrinhoIcon.addEventListener('click', () => {
    carrinhoModal.style.display = 'block';
    atualizarCarrinho();
});

// Fechar carrinho
closeBtn.addEventListener('click', () => {
    carrinhoModal.style.display = 'none';
});

// Fechar carrinho ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === carrinhoModal) {
        carrinhoModal.style.display = 'none';
    }
});

// Adicionar produtos ao carrinho
botoesAdicionar.forEach((botao, index) => {
    botao.addEventListener('click', () => {
        const card = botao.closest('.product-card');
        const nome = card.querySelector('h3').textContent;
        const preco = parseFloat(card.querySelector('.product-price').textContent.replace('R$ ', '').replace(',', '.'));
        
        const produto = {
            id: index,
            nome: nome,
            preco: preco,
            quantidade: 1
        };

        // Verificar se produto já está no carrinho
        const produtoExistente = carrinho.find(p => p.id === produto.id);
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push(produto);
        }

        atualizarCarrinho();
        mostrarNotificacao(`${nome} adicionado ao carrinho!`);
    });
});

// Atualizar carrinho
function atualizarCarrinho() {
    const itemsDiv = document.getElementById('carrinho-items');
    const totalPrice = document.getElementById('total-price');
    
    if (carrinho.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align: center; color: #999;">Seu carrinho está vazio</p>';
        totalPrice.textContent = '0.00';
        cartCount.textContent = '0';
        return;
    }

    itemsDiv.innerHTML = carrinho.map((produto, index) => `
        <div style="
            background: rgba(255, 0, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #FF00FF;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div>
                <h4 style="color: #000; margin-bottom: 0.5rem;">${produto.nome}</h4>
                <p style="color: #666; margin: 0;">
                    R$ ${produto.preco.toFixed(2)} x ${produto.quantidade} = 
                    <strong style="color: #FF00FF;">R$ ${(produto.preco * produto.quantidade).toFixed(2)}</strong>
                </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="alterarQuantidade(${index}, -1)" style="
                    background: #FF00FF;
                    color: #000;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-weight: bold;
                ">−</button>
                <button onclick="alterarQuantidade(${index}, 1)" style="
                    background: #00FFFF;
                    color: #000;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-weight: bold;
                ">+</button>
                <button onclick="removerDoCarrinho(${index})" style="
                    background: #000;
                    color: #FFFF00;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-weight: bold;
                ">✕</button>
            </div>
        </div>
    `).join('');

    // Calcular total
    const total = carrinho.reduce((acc, produto) => acc + (produto.preco * produto.quantidade), 0);
    totalPrice.textContent = total.toFixed(2);
    cartCount.textContent = carrinho.length;
}

// Alterar quantidade
function alterarQuantidade(index, alteracao) {
    carrinho[index].quantidade += alteracao;
    
    if (carrinho[index].quantidade <= 0) {
        removerDoCarrinho(index);
    } else {
        atualizarCarrinho();
    }
}

// Remover do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Enviar formulário de contato
if (formularioContato) {
    formularioContato.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const mensagem = document.getElementById('mensagem').value;

        // Simular envio
        console.log('Formulário enviado:', {
            nome, email, telefone, mensagem
        });

        mostrarNotificacao('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        formularioContato.reset();
    });
}

// Enviar newsletter
if (formularioNewsletter) {
    formularioNewsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = formularioNewsletter.querySelector('input[type="email"]').value;
        
        console.log('Email inscrito na newsletter:', email);
        mostrarNotificacao('Inscrição realizada com sucesso! Verifique seu email.');
        formularioNewsletter.reset();
    });
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF00FF, #00FFFF);
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
}

// Adicionar animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Animar elementos ao scroll
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease';
        }
    });
});

// Observar elementos
document.querySelectorAll('.product-card, .service-card, .footer-section').forEach(el => {
    observador.observe(el);
});

// Adicionar animação de fade in
const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(estilo);

// Menu responsivo
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

console.log('🎨 MarketHub - Site de vendas online carregado com sucesso!');
console.log('💜 Cores: Magenta, Ciano, Amarelo e Preto');
