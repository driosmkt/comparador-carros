// ===================================================================
// == PASSO 1: SIMULAÇÃO DE DADOS HIERÁRQUICOS (COMO VIRIA DA API) ==
// ===================================================================
const DUMMY_DATA = {
    "Fiat": {
        "Pulse": {
            "2024": [
                { id: 101, version: "Drive 1.3 AT", price: "R$ 102.990", image: "img/pulse.jpg" }
            ]
        },
        "Cronos": {
            "2024": [
                { id: 102, version: "Drive 1.0", price: "R$ 92.990", image: "img/cronos.jpg" },
                { id: 103, version: "Precision 1.3 AT", price: "R$ 110.890", image: "img/cronos.jpg" }
            ]
        }
    },
    "Chevrolet": {
        "Onix": {
            "2024": [
                { id: 201, version: "1.0 Aspirado", price: "R$ 84.390", image: "img/onix.jpg" },
                { id: 202, version: "LT 1.0 Turbo", price: "R$ 98.450", image: "img/onix.jpg" }
            ]
        },
        "Tracker": {
            "2024": [
                { id: 203, version: "1.0 Turbo AT", price: "R$ 134.850", image: "img/tracker.jpg" },
                { id: 204, version: "Premier 1.2 Turbo", price: "R$ 164.850", image: "img/tracker.jpg" }
            ]
        }
    }
};

// ===============================================
// == PASSO 2: VARIÁVEIS DE ESTADO E REFERÊNCIAS ==
// ===============================================
const modal = document.getElementById('selection-modal');
const modalTitle = document.getElementById('modal-title');
const backButton = document.getElementById('modal-back-btn');
const steps = {
    brand: document.getElementById('step-brand'),
    model: document.getElementById('step-model'),
    year: document.getElementById('step-year'),
    version: document.getElementById('step-version')
};

let activeSlot = null; // Qual slot (1, 2 ou 3) está sendo preenchido
let currentStep = ''; // 'brand', 'model', 'year', 'version'
let selections = {}; // Onde guardamos as escolhas: { brand: 'Fiat', model: 'Cronos', ... }

// ==================================
// == PASSO 3: FUNÇÕES DE CONTROLE ==
// ==================================

// ---- Funções de Visibilidade ----
function showStep(stepName) {
    currentStep = stepName;
    // Esconde todos os passos
    for (let step in steps) {
        steps[step].classList.add('hidden');
    }
    // Mostra o passo atual
    steps[stepName].classList.remove('hidden');

    // Controla o botão "Voltar"
    backButton.classList.toggle('hidden', stepName === 'brand');
}

function openModal(slotElement) {
    activeSlot = slotElement;
    selections = {}; // Limpa seleções anteriores
    modalTitle.innerText = "Passo 1: Selecione a Marca";
    populateBrands();
    showStep('brand');
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function goBack() {
    if (currentStep === 'model') {
        modalTitle.innerText = "Passo 1: Selecione a Marca";
        showStep('brand');
    } else if (currentStep === 'year') {
        modalTitle.innerText = "Passo 2: Selecione o Modelo";
        showStep('model');
    } else if (currentStep === 'version') {
        modalTitle.innerText = "Passo 3: Selecione o Ano";
        showStep('year');
    }
}

// ---- Funções de Preenchimento e Seleção ----

function populateBrands() {
    steps.brand.innerHTML = '';
    const brands = Object.keys(DUMMY_DATA);
    brands.forEach(brand => {
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
    const models = Object.keys(DUMMY_DATA[brandName]);
    models.forEach(model => {
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
    const years = Object.keys(DUMMY_DATA[brand][model]);
    years.forEach(year => {
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
    const versions = DUMMY_DATA[brand][model][year];
    versions.forEach(car => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerHTML = `${car.version} - <strong>${car.price}</strong>`;
        // Passamos o objeto completo do carro para a função final
        item.onclick = () => finalSelection(car);
        steps.version.appendChild(item);
    });
}

function finalSelection(carObject) {
    // Reutilizamos a lógica de preencher o card da versão anterior
    activeSlot.innerHTML = `
        <div class="car-card">
            <button class="remove-car-btn" onclick="removeCar(this.closest('.car-slot'))">×</button>
            <img src="${carObject.image}" alt="${selections.model}" style="width:100%; height: 120px; object-fit: cover; background-color: #eee; border-radius: 4px;">
            <h3>${selections.brand} ${selections.model}</h3>
            <p class="car-version">${carObject.version}</p>
            <p class="car-price">${carObject.price}</p>
            <button class="details-btn">Ver detalhes</button>
            function finalSelection(carObject) {
    // ... (o código que monta o innerHTML do card) ...
    activeSlot.innerHTML = `...`; 

    activeSlot.classList.add('filled'); // <<< ADICIONE ESTA LINHA

    closeModal();
}
        </div>
    `;
    closeModal();
}

function removeCar(slotElement) {
    slotElement.innerHTML = `
        <button class="add-car-btn">
            <span class="plus-icon">+</span>
            Adicionar modelo
        </button>
        function removeCar(slotElement) {
    slotElement.classList.remove('filled'); // <<< ADICIONE ESTA LINHA

    // ... (o resto do código que restaura o botão "+ Adicionar") ...
    slotElement.innerHTML = `...`;
    // ...
}
    `;
    slotElement.querySelector('.add-car-btn').addEventListener('click', () => {
        openModal(slotElement);
    });
}

// =========================================================
// == PASSO 4: ADICIONAR OS EVENTOS DE CLIQUE AOS BOTÕES  ==
// =========================================================
document.querySelectorAll('.add-car-btn').forEach(button => {
    button.addEventListener('click', () => {
        openModal(button.parentElement);
    });
});
