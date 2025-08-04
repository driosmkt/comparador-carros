// --- Simulação dos dados que viriam do Back-End (Java) ---
// No futuro, faremos uma chamada 'fetch' para buscar isso.
const DUMMY_CARS = [
    { id: 101, name: 'Fiat Pulse', price: 'R$ 102.990', image: 'url_da_imagem_do_pulse.jpg' },
    { id: 102, name: 'Fiat Cronos', price: 'R$ 92.990', image: 'url_da_imagem_do_cronos.jpg' },
    { id: 103, name: 'Fiat Fastback', price: 'R$ 117.990', image: 'url_da_imagem_do_fastback.jpg' },
    { id: 201, name: 'Chevrolet Onix', price: 'R$ 84.390', image: 'url_da_imagem_do_onix.jpg' },
    { id: 202, name: 'Chevrolet Tracker', price: 'R$ 134.850', image: 'url_da_imagem_do_tracker.jpg' }
];


// --- Referências aos elementos do HTML ---
const modal = document.getElementById('selection-modal');
const carListContainer = document.getElementById('car-list');
const addCarButtons = document.querySelectorAll('.add-car-btn');

// --- Variável para saber qual "slot" estamos preenchendo ---
let activeSlot = null;


// --- Funções ---

/**
 * Abre o modal de seleção de carros.
 * É chamada quando um dos botões "+ Adicionar" é clicado.
 */
function openModal(slotElement) {
    activeSlot = slotElement; // Guarda qual slot acionou o modal
    carListContainer.innerHTML = ''; // Limpa a lista antiga

    // Cria um item na lista para cada carro da nossa simulação
    DUMMY_CARS.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-list-item'; // Para estilizar no futuro
        carItem.innerHTML = `<strong>${car.name}</strong> - ${car.price}`;
        
        // Adiciona o evento de clique para selecionar o carro
        carItem.onclick = () => selectCar(car);

        carListContainer.appendChild(carItem);
    });

    modal.classList.remove('hidden'); // Mostra o modal!
}

/**
 * Fecha o modal.
 * É chamada pelo botão "Fechar" dentro do modal.
 */
function closeModal() {
    modal.classList.add('hidden'); // Esconde o modal
}

/**
 * Ação de selecionar um carro da lista no modal.
 */
function selectCar(car) {
    // Substitui o botão "+ Adicionar" pelo card do carro selecionado
    activeSlot.innerHTML = `
        <div class="car-card">
            <button class="remove-car-btn" onclick="removeCar(this.parentElement.parentElement)">×</button>
            <img src="${car.image}" alt="${car.name}" style="width:100%; height: 120px; background-color: #eee; border-radius: 4px;">
            <h3>${car.name}</h3>
            <p class="car-price">${car.price}</p>
            <button class="details-btn">Ver detalhes</button>
        </div>
    `;
    closeModal(); // Fecha o modal após a seleção
}

/**
 * Restaura o slot para o botão original "+ Adicionar modelo".
 */
function removeCar(slotElement) {
     slotElement.innerHTML = `
        <button class="add-car-btn">
            <span class="plus-icon">+</span>
            Adicionar modelo
        </button>
    `;
    // Precisamos adicionar o evento de clique novamente ao botão recriado
    slotElement.querySelector('.add-car-btn').addEventListener('click', () => {
        openModal(slotElement);
    });
}


// --- Adicionar os Eventos de Clique aos Botões Iniciais ---

// Para cada botão "+ Adicionar modelo" na tela...
addCarButtons.forEach(button => {
    // ...adicione um "ouvinte" de evento de clique.
    button.addEventListener('click', () => {
        // Quando clicado, chame a função openModal,
        // passando o "slot" (a div pai do botão) como argumento.
        const slot = button.parentElement;
        openModal(slot);
    });
});
