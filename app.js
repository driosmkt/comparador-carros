// Arquivo: app.js

async function fetchComparison() {
    // Pega os IDs dos carros selecionados (ex: ['123', '456'])
    const selectedIds = getSelectedCarIds(); 

    if (selectedIds.length < 2) return;

    // Chama nosso back-end Java
    const response = await fetch(`/api/comparar?ids=${selectedIds.join(',')}`);
    const comparisonData = await response.json();

    // 'comparisonData' tem os dados. Agora vamos construir a tabela.
    renderResultsTable(comparisonData); 
}

function renderResultsTable(data) {
    const highlightsContainer = document.querySelector('.highlights');
    highlightsContainer.innerHTML = ''; // Limpa resultados antigos

    // Exemplo para a linha de Airbags
    const airbagRow = document.createElement('div');
    airbagRow.innerHTML = `
        <span>Airbags</span>
        <span>${data.car1.airbags ? '✔️' : '❌'}</span>
        <span>${data.car2.airbags ? '✔️' : '❌'}</span>
    `;
    highlightsContainer.appendChild(airbagRow);

    // ... Repetir para todos os outros itens ...
}
