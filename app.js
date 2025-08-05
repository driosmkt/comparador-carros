// ===================================================================
// == DADOS SIMULADOS (No futuro, virão da sua API Java)
// ===================================================================
const DUMMY_DATA = {
    "Fiat": {
        "Pulse": { "2024": [{ id: 101, version: "Drive 1.3 AT", price: "R$ 102.990", image: "img/pulse.jpg" }] },
        "Cronos": { "2024": [{ id: 102, version: "Precision 1.3 AT", price: "R$ 110.890", image: "img/cronos.jpg" }] }
    },
    "Chevrolet": {
        "Onix": { "2024": [{ id: 201, version: "LT 1.0 Turbo", price: "R$ 98.450", image: "img/onix.jpg" }] }
    }
};

// ===============================================
// == REFERÊNCIAS AOS ELEMENTOS HTML
// ===============================================
const comparisonContainer = document.querySelector('.comparison-container');
const modal = document.getElementById('selection-modal');
const modalTitle = document.getElementById('modal-title');
const backButton = document.getElementById('modal-back-btn');
const steps = {
    brand: document.getElementById('step-brand'),
    model: document.getElementById('step-model'),
    year: document.getElementById('step-year'),
    version: document.getElementById('step-version')
};

let activeSlot = null;
let currentStep = '';
let selections = {};

// ========================================================
// == CORREÇÃO: USANDO DELEGAÇÃO DE EVENTOS PARA OS CLIQUES
// ========================================================
comparisonContainer.addEventListener('click', function(event) {
    // Procura por um elemento clicado que seja um botão de adicionar ou um ancestral dele.
    const addBtn = event.target.closest('.add-car-btn');
    if (addBtn) {
        // Se encontrou, pega o '.car-slot' pai e abre o modal.
        const slot = addBtn.closest('.car-slot');
        if (slot) {
            openModal(slot);
        }
    }
});

// ==================================
// == FUNÇÕES DE CONTROLE DO MODAL
// ==================================
function showStep(stepName) {
    currentStep = stepName;
    for (let step in steps) { steps[step].classList.add('hidden'); }
    steps[stepName].classList.remove('hidden');
    backButton.classList.toggle('hidden', stepName === 'brand');
}

function openModal(slotElement) {
    activeSlot = slotElement;
    selections = {};
    modalTitle.innerText = "Passo 1: Selecione a Marca";
    populateBrands();
    showStep('brand');
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function goBack() {
    if (currentStep === 'model') { modalTitle.innerText = "Passo 1: Selecione a Marca"; showStep('brand'); }
    else if (currentStep === 'year') { modalTitle.innerText = "Passo 2: Selecione o Modelo"; showStep('model'); }
    else if (currentStep === 'version') { modalTitle.innerText = "Passo 3: Selecione o Ano"; showStep('year'); }
}

// ==================================
// == FUNÇÕES DE SELEÇÃO E LÓGICA
// ==================================
function populateBrands() {
    steps.brand.innerHTML = '';
    Object.keys(DUMMY_DATA).forEach(brand => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerText = brand;
        item.onclick = () => selectBrand(brand);
        steps.brand.appendChild(item);
    });
}

function selectBrand(brandName) {
    selections.brand = brandName;
    modalTitle.innerText = "Passo 2: Selecione o Modelo";
    populateModels(brandName);
    showStep('model');
}

function populateModels(brandName) {
    steps.model.innerHTML = '';
    Object.keys(DUMMY_DATA[brandName]).forEach(model => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerText = model;
        item.onclick = () => selectModel(model);
        steps.model.appendChild(item);
    });
}

function selectModel(modelName) {
    selections.model = modelName;
    modalTitle.innerText = "Passo 3: Selecione o Ano";
    populateYears(selections.brand, modelName);
    showStep('year');
}

function populateYears(brand, model) {
    steps.year.innerHTML = '';
    Object.keys(DUMMY_DATA[brand][model]).forEach(year => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerText = year;
        item.onclick = () => selectYear(year);
        steps.year.appendChild(item);
    });
}

function selectYear(year) {
    selections.year = year;
    modalTitle.innerText = "Passo 4: Selecione a Versão";
    populateVersions(selections.brand, selections.model, year);
    showStep('version');
}

function populateVersions(brand, model, year) {
    steps.version.innerHTML = '';
    DUMMY_DATA[brand][model][year].forEach(car => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerHTML = `${car.version} - <strong>${car.price}</strong>`;
        item.onclick = () => finalSelection(car);
        steps.version.appendChild(item);
    });
}

function finalSelection(carObject) {
    // Insere o card do carro no slot
    activeSlot.innerHTML = `
        <div class="car-card">
            <button class="remove-car-btn" onclick="removeCar(this.closest('.car-slot'))">×</button>
            <img src="${carObject.image}" alt="${selections.model}">
            <h3>${selections.brand} ${selections.model}</h3>
            <p class="car-version">${carObject.version}</p>
            <p class="car-price">${carObject.price}</p>
            <button class="details-btn">Ver detalhes</button>
        </div>
    `;
    activeSlot.classList.add('filled');
    closeModal();
}

// A função de remover agora é muito mais simples
function removeCar(slotElement) {
    slotElement.classList.remove('filled');
    slotElement.innerHTML = `
        <button class="add-car-btn">
            <span class="plus-icon">+</span>
            Adicionar modelo
        </button>
    `;
    // Não precisamos mais readicionar o evento de clique aqui. O vigia principal já cuida disso!
}
