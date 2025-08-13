const DATABASE_CONFIG = {
    // Configuración de la base de datos
    url: 'https://script.google.com/macros/s/AKfycbzCjQpY5PondTrx7Mc398UMqUzn3BF5EpZB3h_02ePRt8RYXbWbmkcwKHB7nKEmgRUS/exec',
    timeout: 10000 // 10 segundos de timeout
};

// Data structure to store all financial data
let financialData = {
    income: [
        {
            concept: "Nómina",
            amounts: [2160.42, 2657.82, 2400.00, 2368.76, 5946.57, 3162.55, 4728.08, 0, 0, 0, 0, 0]
        },
        {
            concept: "Otros motivos",
            amounts: [0, 0, 0, 605.66, 11.84, 0, 0, 0, 0, 0, 0, 0]
        }
    ],
    fixedExpenses: [
        {
            concept: "Piso",
            amounts: [317.00, 317.00, 317.00, 317.00, 317.00, 317.00, 634.00, 0, 0, 0, 0, 0]
        },
        {
            concept: "Transporte",
            amounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Luz",
            amounts: [0, 68.95, 0, 66.63, 0, 35.58, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Agua",
            amounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Inversiones",
            amounts: [600.00, 609.80, 609.80, 609.80, 609.80, 609.80, 609.80, 0, 0, 0, 0, 0]
        },
        {
            concept: "Cripto",
            amounts: [100.00, 100.00, 100.00, 100.00, 100.00, 100.00, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Gas",
            amounts: [49.46, 0, 0, 22.10, 0, 43.11, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "WiFi",
            amounts: [0, 0, 0, 0, 0, 0, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00]
        }
    ],
    variableExpenses: [
        {
            concept: "Variado(justificar)",
            amounts: [207.25, 77.00, 0, 300.00, 250.00, 307.11, 140.71, 0, 0, 0, 0, 0]
        },
        {
            concept: "Ocio",
            amounts: [400.00, 100.00, 400.00, 511.14, 365.00, 602.00, 350.00, 0, 0, 0, 0, 0]
        },
        {
            concept: "Ropa",
            amounts: [0, 0, 0, 0, 0, 250.00, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Netflix&sxn&regalos",
            amounts: [246.58, 0, 0, 71.00, 60.00, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Vuelos",
            amounts: [0, 166.35, 167.00, 0, 435.00, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Gimnasio",
            amounts: [0, 0, 171.00, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            concept: "Comida",
            amounts: [0, 100, 200.00, 0, 40.00, 338.06, 0, 0, 0, 0, 0, 0]
        }
    ]
};

// Month names in Spanish
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Section titles
const sectionTitles = {
    summary: "Resumen Mensual",
    control: "Control de Gastos e Ingresos",
    "add-entry": "Añadir Nueva Entrada"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupSidebarToggle();
    setupFormHandlers();
    setupMonthFilter();
    showSection('summary'); // Show summary by default
    
    // Cargar datos desde la base de datos
    loadDataFromDatabase();
    
    // Mostrar información de estado de conexión
    //displayConnectionStatus();
});



// Función de diagnóstico
async function runDiagnostic() {
    console.log('🔍 === INICIANDO DIAGNÓSTICO AUTOMÁTICO ===');
    
    try {
        // Test 1: Verificar URL base
        console.log('🔍 Test 1: Verificando URL base...');
        const baseResponse = await fetch(DATABASE_CONFIG.url);
        console.log('🔍 URL base status:', baseResponse.status);
        
        // Test 2: Verificar endpoint test
        console.log('🔍 Test 2: Verificando endpoint test...');
        const testResponse = await fetch(`${DATABASE_CONFIG.url}?action=test`);
        console.log('🔍 Test endpoint status:', testResponse.status);
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('🔍 Test response:', testData);
        }
        
        // Test 3: Verificar endpoint getData
        console.log('🔍 Test 3: Verificando endpoint getData...');
        const getDataResponse = await fetch(`${DATABASE_CONFIG.url}?action=getData`);
        console.log('🔍 GetData endpoint status:', getDataResponse.status);
        
        if (getDataResponse.ok) {
            const getData = await getDataResponse.json();
            console.log('🔍 GetData response structure:', {
                success: getData.success,
                hasData: !!getData.data,
                dataKeys: getData.data ? Object.keys(getData.data) : 'No data'
            });
        } else {
            console.log('❌ GetData falló con status:', getDataResponse.status);
            const errorText = await getDataResponse.text();
            console.log('❌ Error response:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Error en diagnóstico:', error);
    }
    
    console.log('🔍 === DIAGNÓSTICO COMPLETADO ===');
}

// ===== FUNCIONES DE BASE DE DATOS =====

// Cargar datos desde Google Sheets (GET)
async function loadDataFromDatabase() {
    try {
        showLoadingMessage('Cargando datos...');
        
        // DEBUG: Agregar logs para identificar el problema
        console.log('🔍 DEBUG - Iniciando carga de datos');
        console.log('🔍 URL completa:', `${DATABASE_CONFIG.url}?action=getData`);
        
        // Crear un controlador de aborto para el timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DATABASE_CONFIG.timeout);
        
        const response = await fetch(`${DATABASE_CONFIG.url}?action=getData`, {
            method: 'GET',
            //headers: {
            //  'Content-Type': 'application/json',
            //},
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // DEBUG: Verificar respuesta
        console.log('🔍 Response status:', response.status);
        //console.log('🔍 Response headers:', response.headers);
        
        if (!response.ok) {
            // Si es error 405, intentar sin el header Content-Type
           /*
            if (response.status === 405) {
                console.log('🔍 Intentando sin Content-Type header...');
                
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), DATABASE_CONFIG.timeout);
                
                const response2 = await fetch(`${DATABASE_CONFIG.url}?action=getData`, {
                    method: 'GET',
                    signal: controller2.signal
                });
                
                clearTimeout(timeoutId2);
                
                if (response2.ok) {
                    const data = await response2.json();
                    console.log('🔍 Datos recibidos:', data);
                    
                    if (data.success && data.data) {
                        financialData = data.data;
                        regenerateInterface();
                        showSuccessMessage('Datos cargados correctamente desde la base de datos');
                        return;
                    }
                }
            }
            */
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔍 Datos recibidos:', data);
        
        if (data.success) {
            // Actualizar datos locales con los datos de la base de datos
            if (data.data) {
                financialData = data.data;
            }
            
            regenerateInterface();
            showSuccessMessage('Datos cargados correctamente desde la base de datos');
        } else {
            throw new Error(data.message || 'Error al cargar datos');
        }
        
    } catch (error) {
        console.error('❌ Error loading data from database:', error);
        
        let errorMessage = 'Error al cargar datos: ';
        if (error.name === 'AbortError') {
            errorMessage += 'Tiempo de espera agotado. Verifica tu conexión a internet.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se puede conectar al servidor. Verifica la URL de Google Apps Script y que esté publicado.';
        } else if (error.message.includes('CORS')) {
            errorMessage += 'Error de CORS. Asegúrate de que el script de Google Apps Script esté publicado como "Web app" con acceso "Anyone".';
        } else if (error.message.includes('Unexpected token')) {
            errorMessage += 'Respuesta inválida del servidor. Verifica que el Google Apps Script esté funcionando correctamente.';
        } else if (error.message.includes('405')) {
            errorMessage += 'Error 405: Verifica que el Google Apps Script tenga la función doGet() correctamente implementada y que esté publicado como Web App.';
        } else {
            errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
        
        // En caso de error, usar datos locales como respaldo
        regenerateInterface();
    } finally {
        hideLoadingMessage();
    }
}

// Función helper para regenerar la interfaz
function regenerateInterface() {
    generateSummary();
    generateYearlyStats();
    initializeCharts();
    updateControlTables();
    
    // Reinicializar celdas editables después de actualizar las tablas
    setTimeout(() => {
        initializeEditableCells();
    }, 100);
}

// Guardar datos en Google Sheets (POST)
async function saveDataToDatabase(changeData = null) {
    try {
        showLoadingMessage('Guardando datos...');
        
        const payload = {
            action: 'saveData',
            data: financialData,
            timestamp: new Date().toISOString(),
            changeData: changeData // Información sobre qué cambió específicamente
        };
        
        // Crear un controlador de aborto para el timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DATABASE_CONFIG.timeout);
        
        const response = await fetch(DATABASE_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Datos guardados correctamente en la base de datos');
            return true;
        } else {
            throw new Error(result.message || 'Error al guardar datos');
        }
        
    } catch (error) {
        console.error('Error saving data to database:', error);
        
        let errorMessage = 'Error al guardar datos: ';
        if (error.name === 'AbortError') {
            errorMessage += 'Tiempo de espera agotado. Verifica tu conexión a internet.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se puede conectar al servidor. Verifica la URL de Google Apps Script.';
        } else if (error.message.includes('CORS')) {
            errorMessage += 'Error de CORS. Asegúrate de que el script de Google Apps Script esté publicado correctamente.';
        } else {
            errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
        return false;
    } finally {
        hideLoadingMessage();
    }
}

/*
// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
    try {
        showLoadingMessage('Probando conexión...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos para test
        
        const response = await fetch(`${DATABASE_CONFIG.url}?action=test`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            showSuccessMessage('Conexión exitosa con la base de datos');
            return true;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Error testing database connection:', error);
        
        let errorMessage = 'Error de conexión: ';
        if (error.name === 'AbortError') {
            errorMessage += 'Tiempo de espera agotado';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se puede conectar al servidor';
        } else {
            errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
        return false;
    } finally {
        hideLoadingMessage();
    }
}
*/
// Actualizar las tablas del control con los datos actuales
function updateControlTables() {
    // Actualizar tabla de ingresos
    updateTableWithData('income', financialData.income);
    
    // Actualizar tabla de gastos fijos
    updateTableWithData('fixed', financialData.fixedExpenses);
    
    // Actualizar tabla de gastos variables
    updateTableWithData('variable', financialData.variableExpenses);
}

// Actualizar una tabla específica con datos
function updateTableWithData(category, dataArray) {
    const tableSelector = getTableSelector(category);
    const tableBody = document.querySelector(tableSelector);
    
    if (!tableBody) return;
    
    // Limpiar filas existentes (excepto el header)
    tableBody.innerHTML = '';
    
    // Agregar filas para cada concepto
    dataArray.forEach(item => {
        const row = document.createElement('tr');
        
        // Celda del concepto
        const conceptCell = document.createElement('td');
        
        // Agregar botón de info para "Variado(justificar)"
        if (item.concept === "Variado(justificar)") {
            conceptCell.innerHTML = `
                ${item.concept}
                <button class="info-btn" onclick="showVariadoBreakdown()" title="Ver desglose detallado">
                    <i class="fas fa-info-circle"></i>
                </button>
            `;
        } else {
            conceptCell.textContent = item.concept;
        }
        
        row.appendChild(conceptCell);
        
        // Celdas para cada mes
        for (let month = 0; month < 12; month++) {
            const cell = document.createElement('td');
            cell.className = 'editable-cell';
            cell.setAttribute('data-category', category);
            cell.setAttribute('data-concept', item.concept);
            cell.setAttribute('data-month', month);
            
            const amount = item.amounts[month];
            if (amount && amount > 0) {
                cell.textContent = formatCurrency(amount);
            }
            
            // Agregar iconos de edición
            addEditIconsToCell(cell);
            
            row.appendChild(cell);
        }
        
        // Celda de notas (solo para ingresos)
        if (category === 'income') {
            const notesCell = document.createElement('td');
            notesCell.className = 'notes-cell';
            row.appendChild(notesCell);
        }
        
        tableBody.appendChild(row);
    });
}

// Función para agregar iconos de edición a una celda
function addEditIconsToCell(cell) {
    // Crear iconos de edición
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'edit-icons';
    
    const editIcon = document.createElement('button');
    editIcon.className = 'edit-icon edit-btn';
    editIcon.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editIcon.title = 'Editar';
    
    const saveIcon = document.createElement('button');
    saveIcon.className = 'edit-icon save-icon';
    saveIcon.innerHTML = '<i class="fas fa-check"></i>';
    saveIcon.title = 'Guardar';
    
    iconsContainer.appendChild(editIcon);
    iconsContainer.appendChild(saveIcon);
    cell.appendChild(iconsContainer);
    
    // Event listener para el botón de editar
    editIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        startEditing(cell);
    });
    
    // Event listener para el botón de guardar
    saveIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        saveEditing(cell);
    });
    
    // Event listener para hacer clic en la celda
    cell.addEventListener('click', function(e) {
        if (e.target.closest('.edit-icons')) return;
        if (!this.classList.contains('editing')) {
            startEditing(this);
        }
    });
}

// Obtener el selector de tabla según la categoría
function getTableSelector(category) {
    switch (category) {
        case 'income':
            return '.income-table tbody';
        case 'fixed':
            return '.expenses-table tbody';
        case 'variable':
            return '.variable-expenses-table tbody';
        default:
            return null;
    }
}

// Función para sincronizar manualmente con la base de datos
async function syncWithDatabase() {
    const syncButton = document.querySelector('.btn-sync');
    
    // Agregar estado de carga al botón
    if (syncButton) {
        syncButton.classList.add('syncing');
        syncButton.disabled = true;
    }
    
    try {
        await loadDataFromDatabase();
        showSuccessMessage('Sincronización completada con éxito');
    } catch (error) {
        showErrorMessage('Error durante la sincronización: ' + error.message);
    } finally {
        // Quitar estado de carga
        if (syncButton) {
            syncButton.classList.remove('syncing');
            syncButton.disabled = false;
        }
    }
}

// Setup navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            showSection(section);
            
            // Update page title
            updatePageTitle(sectionTitles[section]);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
}

// Setup sidebar toggle for mobile
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });
}

// Show specific section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update page title
function updatePageTitle(title) {
    document.getElementById('pageTitle').textContent = title;
}

// Close sidebar
function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
}

// Generate yearly statistics
function generateYearlyStats() {
    const yearlyTotals = calculateYearlyTotals();
    
    document.getElementById('totalIncome').textContent = formatCurrency(yearlyTotals.income);
    document.getElementById('totalExpenses').textContent = formatCurrency(yearlyTotals.totalExpenses);
    document.getElementById('totalBalance').textContent = formatCurrency(yearlyTotals.balance);
    
    // Update balance color
    const balanceElement = document.getElementById('totalBalance');
    if (yearlyTotals.balance >= 0) {
        balanceElement.style.color = '#28a745';
    } else {
        balanceElement.style.color = '#dc3545';
    }
}

// Generate monthly summary
function generateSummary() {
    const summaryGrid = document.getElementById('summaryGrid');
    summaryGrid.innerHTML = '';

    for (let month = 0; month < 12; month++) {
        const totalIncome = calculateTotalForMonth(financialData.income, month);
        const totalFixedExpenses = calculateTotalForMonth(financialData.fixedExpenses, month);
        const totalVariableExpenses = calculateTotalForMonth(financialData.variableExpenses, month);
        const totalExpenses = totalFixedExpenses + totalVariableExpenses;
        const balance = totalIncome - totalExpenses;

        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        
        summaryItem.innerHTML = `
            <h4>${monthNames[month]}</h4>
            <div class="summary-details">
                <div class="income-summary">
                    <span>Ingresos:</span>
                    <span class="amount positive">${formatCurrency(totalIncome)}</span>
                </div>
                <div class="fixed-expenses-summary">
                    <span>G. Fijos:</span>
                    <span class="amount negative">${formatCurrency(totalFixedExpenses)}</span>
                </div>
                <div class="variable-expenses-summary">
                    <span>G. Variables:</span>
                    <span class="amount negative">${formatCurrency(totalVariableExpenses)}</span>
                </div>
                <div class="balance-summary" style="border-top: 1px solid #e9ecef; padding-top: 10px; margin-top: 10px; font-weight: bold;">
                    <span>Balance:</span>
                    <span class="amount ${balance >= 0 ? 'positive' : 'negative'}">${formatCurrency(balance)}</span>
                </div>
            </div>
        `;

        summaryGrid.appendChild(summaryItem);
    }
}

// Calculate total for a specific month
function calculateTotalForMonth(dataArray, month) {
    return dataArray.reduce((total, item) => {
        return total + (item.amounts[month] || 0);
    }, 0);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Setup form handlers
function setupFormHandlers() {
    const form = document.getElementById('entryForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Setup edit form handlers
    const editForm = document.getElementById('editEntryForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditFormSubmit);
        
        // Setup dynamic concept loading
        const editCategorySelect = document.getElementById('editCategory');
        editCategorySelect.addEventListener('change', function() {
            populateConceptOptions(this.value, 'editConcept');
        });
        
        // Setup current amount display
        const editConceptSelect = document.getElementById('editConcept');
        const editMonthSelect = document.getElementById('editMonth');
        
        editConceptSelect.addEventListener('change', updateCurrentAmount);
        editMonthSelect.addEventListener('change', updateCurrentAmount);
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const category = document.getElementById('category').value;
    const concept = document.getElementById('concept').value;
    const month = parseInt(document.getElementById('month').value);
    const amount = parseFloat(document.getElementById('amount').value);

    if (!category || !concept || isNaN(month) || isNaN(amount)) {
        showErrorMessage('Por favor, completa todos los campos correctamente.');
        return;
    }

    addNewEntry(category, concept, month, amount);
    updateTable(category, concept, month, amount);
    generateSummary();
    generateYearlyStats();
    
    // Guardar en base de datos
    const changeData = {
        action: 'add',
        category: category,
        concept: concept,
        month: month,
        amount: amount,
        timestamp: new Date().toISOString()
    };
    
    saveDataToDatabase(changeData);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showSuccessMessage('¡Entrada añadida correctamente!');
}

// Add new entry to data structure
function addNewEntry(category, concept, month, amount) {
    let dataArray;
    
    switch(category) {
        case 'income':
            dataArray = financialData.income;
            break;
        case 'fixed':
            dataArray = financialData.fixedExpenses;
            break;
        case 'variable':
            dataArray = financialData.variableExpenses;
            break;
    }

    // Find existing concept or create new one
    let existingItem = dataArray.find(item => item.concept === concept);
    
    if (existingItem) {
        existingItem.amounts[month] += amount;
    } else {
        const newItem = {
            concept: concept,
            amounts: new Array(12).fill(0)
        };
        newItem.amounts[month] = amount;
        dataArray.push(newItem);
    }
}

// Update table display
function updateTable(category, concept, month, amount) {
    let tableSelector;
    
    switch(category) {
        case 'income':
            tableSelector = '#income-section .income-table tbody';
            break;
        case 'fixed':
            tableSelector = '#fixed-section .expenses-table tbody';
            break;
        case 'variable':
            tableSelector = '#variable-section .expenses-table tbody';
            break;
    }

    const tableBody = document.querySelector(tableSelector);
    let existingRow = Array.from(tableBody.rows).find(row => 
        row.cells[0].textContent === concept
    );

    if (existingRow) {
        // Update existing row
        const currentAmount = parseFloat(existingRow.cells[month + 1].textContent.replace(/[€,\s]/g, '')) || 0;
        const newAmount = currentAmount + amount;
        existingRow.cells[month + 1].textContent = formatCurrency(newAmount);
        existingRow.classList.add('new-entry');
        setTimeout(() => existingRow.classList.remove('new-entry'), 500);
    } else {
        // Create new row
        const newRow = document.createElement('tr');
        newRow.classList.add('new-entry');
        
        // Create concept cell
        const conceptCell = document.createElement('td');
        conceptCell.textContent = concept;
        newRow.appendChild(conceptCell);
        
        // Create month cells
        for (let i = 0; i < 12; i++) {
            const cell = document.createElement('td');
            if (i === month) {
                cell.textContent = formatCurrency(amount);
            } else {
                cell.textContent = '';
            }
            newRow.appendChild(cell);
        }
        
        // Add notes cell for income table
        if (category === 'income') {
            const notesCell = document.createElement('td');
            notesCell.textContent = '';
            newRow.appendChild(notesCell);
        }
        
        tableBody.appendChild(newRow);
        setTimeout(() => newRow.classList.remove('new-entry'), 500);
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'success-message';
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => document.body.removeChild(messageElement), 500);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'error-message';
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 5000);
}

// Show loading message
function showLoadingMessage(message) {
    // Remover mensaje de carga existente si existe
    hideLoadingMessage();
    
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'loading-message';
    messageElement.id = 'loadingMessage';
    
    document.body.appendChild(messageElement);
}

// Hide loading message
function hideLoadingMessage() {
    const existingMessage = document.getElementById('loadingMessage');
    if (existingMessage && existingMessage.parentNode) {
        existingMessage.parentNode.removeChild(existingMessage);
    }
}

// Export section data
function exportSection(sectionType) {
    let data;
    let filename;
    
    switch(sectionType) {
        case 'income':
            data = financialData.income;
            filename = 'ingresos_2025.json';
            break;
        case 'fixed':
            data = financialData.fixedExpenses;
            filename = 'gastos_fijos_2025.json';
            break;
        case 'variable':
            data = financialData.variableExpenses;
            filename = 'gastos_variables_2025.json';
            break;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    showSuccessMessage(`Datos de ${sectionTitles[sectionType]} exportados correctamente`);
}

// Export all data function
function exportToJSON() {
    const dataStr = JSON.stringify(financialData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'balance_sheet_2025.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Datos completos exportados correctamente');
}

// Calculate yearly totals
function calculateYearlyTotals() {
    const yearlyIncome = financialData.income.reduce((total, item) => {
        return total + item.amounts.reduce((sum, amount) => sum + amount, 0);
    }, 0);
    
    const yearlyFixedExpenses = financialData.fixedExpenses.reduce((total, item) => {
        return total + item.amounts.reduce((sum, amount) => sum + amount, 0);
    }, 0);
    
    const yearlyVariableExpenses = financialData.variableExpenses.reduce((total, item) => {
        return total + item.amounts.reduce((sum, amount) => sum + amount, 0);
    }, 0);
    
    const yearlyBalance = yearlyIncome - yearlyFixedExpenses - yearlyVariableExpenses;
    
    return {
        income: yearlyIncome,
        fixedExpenses: yearlyFixedExpenses,
        variableExpenses: yearlyVariableExpenses,
        totalExpenses: yearlyFixedExpenses + yearlyVariableExpenses,
        balance: yearlyBalance
    };
}

// Populate concept options based on selected category
function populateConceptOptions(category, selectElementId) {
    const conceptSelect = document.getElementById(selectElementId);
    
    // Clear existing options except the first one
    conceptSelect.innerHTML = '<option value="">Seleccionar concepto</option>';
    
    if (!category) return;
    
    let dataArray;
    switch(category) {
        case 'income':
            dataArray = financialData.income;
            break;
        case 'fixed':
            dataArray = financialData.fixedExpenses;
            break;
        case 'variable':
            dataArray = financialData.variableExpenses;
            break;
        default:
            return;
    }
    
    // Add concepts as options
    dataArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item.concept;
        option.textContent = item.concept;
        conceptSelect.appendChild(option);
    });
}

// Update current amount display
function updateCurrentAmount() {
    const category = document.getElementById('editCategory').value;
    const concept = document.getElementById('editConcept').value;
    const month = document.getElementById('editMonth').value;
    const currentAmountInput = document.getElementById('currentAmount');
    
    if (!category || !concept || month === '') {
        currentAmountInput.value = '';
        return;
    }
    
    let dataArray;
    switch(category) {
        case 'income':
            dataArray = financialData.income;
            break;
        case 'fixed':
            dataArray = financialData.fixedExpenses;
            break;
        case 'variable':
            dataArray = financialData.variableExpenses;
            break;
        default:
            currentAmountInput.value = '';
            return;
    }
    
    const item = dataArray.find(item => item.concept === concept);
    if (item) {
        const currentAmount = item.amounts[parseInt(month)] || 0;
        currentAmountInput.value = formatCurrency(currentAmount);
    } else {
        currentAmountInput.value = formatCurrency(0);
    }
}

// Handle edit form submission
function handleEditFormSubmit(event) {
    event.preventDefault();
    
    const category = document.getElementById('editCategory').value;
    const concept = document.getElementById('editConcept').value;
    const month = parseInt(document.getElementById('editMonth').value);
    const newAmount = parseFloat(document.getElementById('editAmount').value);

    if (!category || !concept || isNaN(month) || isNaN(newAmount)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Confirm the modification
    const currentAmountText = document.getElementById('currentAmount').value;
    const confirmMessage = `¿Estás seguro de que quieres modificar:\n\nConcepto: ${concept}\nMes: ${monthNames[month]}\nCantidad actual: ${currentAmountText}\nNueva cantidad: ${formatCurrency(newAmount)}`;
    
    if (!confirm(confirmMessage)) {
        return;
    }

    // Modify the entry
    modifyEntry(category, concept, month, newAmount);
    updateTableEntry(category, concept, month, newAmount);
    generateSummary();
    generateYearlyStats();
    
    // Reset form
    event.target.reset();
    document.getElementById('currentAmount').value = '';
    
    // Show success message
    showSuccessMessage('¡Entrada modificada correctamente!');
}

// Modify entry in data structure
function modifyEntry(category, concept, month, newAmount) {
    let dataArray;
    
    switch(category) {
        case 'income':
            dataArray = financialData.income;
            break;
        case 'fixed':
            dataArray = financialData.fixedExpenses;
            break;
        case 'variable':
            dataArray = financialData.variableExpenses;
            break;
    }

    // Find existing concept and update amount
    let existingItem = dataArray.find(item => item.concept === concept);
    
    if (existingItem) {
        existingItem.amounts[month] = newAmount;
    }
}

// Update table entry display
function updateTableEntry(category, concept, month, newAmount) {
    let tableSelector;
    
    switch(category) {
        case 'income':
            tableSelector = '#income-section .income-table tbody';
            break;
        case 'fixed':
            tableSelector = '#fixed-section .expenses-table tbody';
            break;
        case 'variable':
            tableSelector = '#variable-section .expenses-table tbody';
            break;
    }

    const tableBody = document.querySelector(tableSelector);
    let existingRow = Array.from(tableBody.rows).find(row => 
        row.cells[0].textContent === concept
    );

    if (existingRow) {
        // Update existing row
        existingRow.cells[month + 1].textContent = formatCurrency(newAmount);
        existingRow.classList.add('new-entry');
        setTimeout(() => existingRow.classList.remove('new-entry'), 500);
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
        closeSidebar();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + E to export all data
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        exportToJSON();
    }
    
    // Ctrl + N to focus on new entry form
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        // Switch to add entry section
        document.querySelector('[data-section="add-entry"]').click();
        setTimeout(() => {
            document.getElementById('category').focus();
        }, 300);
    }
    
    // Ctrl + 1-3 for quick navigation
    if (event.ctrlKey && event.key >= '1' && event.key <= '3') {
        event.preventDefault();
        const sections = ['summary', 'control', 'add-entry'];
        const sectionIndex = parseInt(event.key) - 1;
        if (sections[sectionIndex]) {
            document.querySelector(`[data-section="${sections[sectionIndex]}"]`).click();
        }
    }
});


// Chart instances
let generalChart, incomeChart, expensesChart, savingsChart;

// Chart colors
const chartColors = {
    income: '#059669',
    expenses: '#dc2626',
    savings: '#7c3aed',
    fixed: '#e9a7c4',
    variable: '#d18ba8',
    concepts: [
        '#e9a7c4', '#d18ba8', '#f2c6d4', '#f7d6e4', '#059669',
        '#7c3aed', '#dc2626', '#e9a7c4', '#f2c6d4', '#f7d6e4',
        '#d18ba8', '#f4d4d6'
    ]
};

// Initialize charts
function initializeCharts() {
    // Destruir gráficos existentes antes de crear nuevos
    if (generalChart) {
        generalChart.destroy();
    }
    if (incomeChart) {
        incomeChart.destroy();
    }
    if (expensesChart) {
        expensesChart.destroy();
    }
    if (savingsChart) {
        savingsChart.destroy();
    }
    
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.font.size = 12;
    
    createGeneralChart();
    createIncomeChart();
    createExpensesChart();
    createSavingsChart();
    updateAllCharts('all');
}

// Setup month filter
function setupMonthFilter() {
    const monthFilter = document.getElementById('monthFilter');
    monthFilter.addEventListener('change', function() {
        updateAllCharts(this.value);
        updateStatsForFilter(this.value);
    });
}

// Create general distribution chart
function createGeneralChart() {
    const ctx = document.getElementById('generalChart').getContext('2d');
    generalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ingresos', 'Gastos', 'Ahorro'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [chartColors.income, chartColors.expenses, chartColors.savings],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create income breakdown chart
function createIncomeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create expenses breakdown chart
function createExpensesChart() {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    expensesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gastos Fijos', 'Gastos Variables'],
            datasets: [{
                data: [0, 0],
                backgroundColor: [chartColors.fixed, chartColors.variable],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create savings distribution chart
function createSavingsChart() {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    savingsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update all charts
function updateAllCharts(filterValue) {
    const data = getFilteredData(filterValue);
    
    updateGeneralChart(data);
    updateIncomeChart(data);
    updateExpensesChart(data);
    updateSavingsChart(data);
    
    updateChartLegends(data);
}

// Get filtered data based on month selection
function getFilteredData(filterValue) {
    const result = {
        totalIncome: 0,
        totalFixedExpenses: 0,
        totalVariableExpenses: 0,
        incomeBreakdown: {},
        fixedBreakdown: {},
        variableBreakdown: {},
        savingsBreakdown: {}
    };

    if (filterValue === 'all') {
        // Calculate totals for all months
        financialData.income.forEach(item => {
            const total = item.amounts.reduce((sum, amount) => sum + amount, 0);
            if (total > 0) {
                result.incomeBreakdown[item.concept] = total;
                result.totalIncome += total;
            }
        });

        financialData.fixedExpenses.forEach(item => {
            const total = item.amounts.reduce((sum, amount) => sum + amount, 0);
            if (total > 0) {
                result.fixedBreakdown[item.concept] = total;
                result.totalFixedExpenses += total;
            }
        });

        financialData.variableExpenses.forEach(item => {
            const total = item.amounts.reduce((sum, amount) => sum + amount, 0);
            if (total > 0) {
                result.variableBreakdown[item.concept] = total;
                result.totalVariableExpenses += total;
            }
        });
    } else {
        // Calculate totals for specific month
        const monthIndex = parseInt(filterValue);
        
        financialData.income.forEach(item => {
            const amount = item.amounts[monthIndex] || 0;
            if (amount > 0) {
                result.incomeBreakdown[item.concept] = amount;
                result.totalIncome += amount;
            }
        });

        financialData.fixedExpenses.forEach(item => {
            const amount = item.amounts[monthIndex] || 0;
            if (amount > 0) {
                result.fixedBreakdown[item.concept] = amount;
                result.totalFixedExpenses += amount;
            }
        });

        financialData.variableExpenses.forEach(item => {
            const amount = item.amounts[monthIndex] || 0;
            if (amount > 0) {
                result.variableBreakdown[item.concept] = amount;
                result.totalVariableExpenses += amount;
            }
        });
    }

    // Calculate savings breakdown (simplified - could be enhanced)
    const totalSavings = result.totalIncome - result.totalFixedExpenses - result.totalVariableExpenses;
    if (totalSavings > 0) {
        result.savingsBreakdown['Ahorro Neto'] = totalSavings;
    }

    return result;
}

// Update general chart
function updateGeneralChart(data) {
    const totalExpenses = data.totalFixedExpenses + data.totalVariableExpenses;
    const totalSavings = data.totalIncome - totalExpenses;
    
    generalChart.data.datasets[0].data = [
        data.totalIncome,
        totalExpenses,
        Math.max(0, totalSavings)
    ];
    generalChart.update();
}

// Update income chart
function updateIncomeChart(data) {
    const labels = Object.keys(data.incomeBreakdown);
    const values = Object.values(data.incomeBreakdown);
    const colors = labels.map((_, index) => chartColors.concepts[index % chartColors.concepts.length]);

    incomeChart.data.labels = labels;
    incomeChart.data.datasets[0].data = values;
    incomeChart.data.datasets[0].backgroundColor = colors;
    incomeChart.update();
}

// Update expenses chart
function updateExpensesChart(data) {
    expensesChart.data.datasets[0].data = [
        data.totalFixedExpenses,
        data.totalVariableExpenses
    ];
    expensesChart.update();
}

// Update savings chart
function updateSavingsChart(data) {
    const labels = Object.keys(data.savingsBreakdown);
    const values = Object.values(data.savingsBreakdown);
    const colors = [chartColors.savings];

    savingsChart.data.labels = labels;
    savingsChart.data.datasets[0].data = values;
    savingsChart.data.datasets[0].backgroundColor = colors;
    savingsChart.update();
}

// Update chart legends
function updateChartLegends(data) {
    updateLegend('generalLegend', [
        { label: 'Ingresos', value: data.totalIncome, color: chartColors.income },
        { label: 'Gastos', value: data.totalFixedExpenses + data.totalVariableExpenses, color: chartColors.expenses },
        { label: 'Ahorro', value: Math.max(0, data.totalIncome - data.totalFixedExpenses - data.totalVariableExpenses), color: chartColors.savings }
    ]);

    updateLegend('incomeLegend', Object.entries(data.incomeBreakdown).map(([label, value], index) => ({
        label,
        value,
        color: chartColors.concepts[index % chartColors.concepts.length]
    })));

    updateLegend('expensesLegend', [
        { label: 'Gastos Fijos', value: data.totalFixedExpenses, color: chartColors.fixed },
        { label: 'Gastos Variables', value: data.totalVariableExpenses, color: chartColors.variable }
    ]);

    updateLegend('savingsLegend', Object.entries(data.savingsBreakdown).map(([label, value]) => ({
        label,
        value,
        color: chartColors.savings
    })));
}

// Update individual legend
function updateLegend(legendId, items) {
    const legendContainer = document.getElementById(legendId);
    legendContainer.innerHTML = '';

    items.forEach(item => {
        if (item.value > 0) {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${item.color}"></div>
                <div class="legend-text">
                    <span>${item.label}</span>
                    <span class="legend-value">${formatCurrency(item.value)}</span>
                </div>
            `;
            legendContainer.appendChild(legendItem);
        }
    });
}

// Update stats for filter
function updateStatsForFilter(filterValue) {
    const data = getFilteredData(filterValue);
    const totalExpenses = data.totalFixedExpenses + data.totalVariableExpenses;
    const balance = data.totalIncome - totalExpenses;

    document.getElementById('totalIncome').textContent = formatCurrency(data.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('totalBalance').textContent = formatCurrency(balance);

    // Update balance color
    const balanceElement = document.getElementById('totalBalance');
    if (balance >= 0) {
        balanceElement.style.color = '#28a745';
    } else {
        balanceElement.style.color = '#dc3545';
    }
}

// Función para mostrar el modal de desglose de Variado
function showVariadoBreakdown() {
    const modal = document.getElementById('variadoModal');
    modal.style.display = 'block';
    
    // Cargar el desglose del mes seleccionado por defecto (Enero)
    updateVariadoForMonth();
}

// Función para actualizar el desglose según el mes seleccionado
function updateVariadoForMonth() {
    const monthSelector = document.getElementById('monthSelector');
    const selectedMonth = parseInt(monthSelector.value);
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Datos de ejemplo de gastos variados por mes
    // En una aplicación real, estos datos vendrían de una base de datos
    const variadoDataByMonth = {
        0: [ // Enero - 207,25 €
            { description: "Compra supermercado especial", amount: 85.50 },
            { description: "Farmacia - medicamentos", amount: 34.75 },
            { description: "Gastos taxi urgente", amount: 25.00 },
            { description: "Reparación electrodoméstico", amount: 45.00 },
            { description: "Compra Amazon varia", amount: 17.00 }
        ],
        1: [ // Febrero - 77,00 €
            { description: "Regalo San Valentín", amount: 42.00 },
            { description: "Gastos veterinario", amount: 35.00 }
        ],
        2: [ // Marzo - 0,00 €
            // Sin gastos este mes
        ],
        3: [ // Abril - 300,00 €
            { description: "Compra muebles", amount: 180.00 },
            { description: "Gastos médicos", amount: 65.00 },
            { description: "Reparación coche", amount: 35.00 },
            { description: "Varios pequeños", amount: 20.00 }
        ],
        4: [ // Mayo - 250,00 €
            { description: "Viaje fin de semana", amount: 120.00 },
            { description: "Compra ropa especial", amount: 80.00 },
            { description: "Gastos celebración", amount: 35.00 },
            { description: "Varios del mes", amount: 15.00 }
        ],
        5: [ // Junio - 307,11 €
            { description: "Vacaciones familiares", amount: 200.00 },
            { description: "Equipamiento verano", amount: 67.11 },
            { description: "Gastos varios junio", amount: 40.00 }
        ],
        6: [ // Julio - 140,71 €
            { description: "Actividades verano", amount: 85.71 },
            { description: "Compras varias", amount: 35.00 },
            { description: "Gastos imprevistos", amount: 20.00 }
        ],
        7: [], // Agosto - 0,00 €
        8: [], // Septiembre - 0,00 €
        9: [], // Octubre - 0,00 €
        10: [], // Noviembre - 0,00 €
        11: [] // Diciembre - 0,00 €
    };
    
    const monthData = variadoDataByMonth[selectedMonth] || [];
    const breakdownList = document.getElementById('breakdownList');
    const selectedMonthInfo = document.getElementById('selectedMonthInfo');
    const variadoTotal = document.getElementById('variadoTotal');
    
    // Actualizar la información del mes seleccionado
    selectedMonthInfo.innerHTML = `Desglose detallado para <strong>${monthNames[selectedMonth]}</strong>:`;
    
    // Calcular el total
    const total = monthData.reduce((sum, item) => sum + item.amount, 0);
    
    // Mostrar los gastos o un mensaje si no hay
    if (monthData.length === 0) {
        breakdownList.innerHTML = `
            <div class="no-expenses-message">
                <i class="fas fa-info-circle"></i>
                <p>No hay gastos variados registrados para ${monthNames[selectedMonth]}</p>
            </div>
        `;
    } else {
        breakdownList.innerHTML = monthData.map(item => `
            <li class="breakdown-item">
                ${item.description}
                <span class="breakdown-amount">${item.amount.toFixed(2)} €</span>
            </li>
        `).join('');
    }
    
    // Actualizar el total
    variadoTotal.textContent = `${total.toFixed(2)} €`;
}

// Nueva función para actualizar el desglose según el mes
function updateVariadoBreakdownForMonth(monthIndex) {
    // Esta función es para compatibilidad con código anterior
    const monthSelector = document.getElementById('monthSelector');
    if (monthSelector) {
        monthSelector.value = monthIndex;
        updateVariadoForMonth();
    }
}

// Función para cerrar el modal
function closeVariadoModal() {
    const modal = document.getElementById('variadoModal');
    modal.style.display = 'none';
}

// Función para actualizar el desglose de variado (mantenida para compatibilidad)
function updateVariadoBreakdown() {
    updateVariadoForMonth();
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('variadoModal');
    if (event.target === modal) {
        closeVariadoModal();
    }
}

// Función para hacer celdas editables
document.addEventListener('DOMContentLoaded', function() {
    // Usar setTimeout para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
        initializeEditableCells();
    }, 100);
});

// Función para inicializar celdas editables
function initializeEditableCells() {
    const editableCells = document.querySelectorAll('.editable-cell');
    
    // Añadir iconos de edición a cada celda que no los tenga ya
    editableCells.forEach(cell => {
        // Solo agregar iconos si no existen ya
        if (!cell.querySelector('.edit-icons')) {
            addEditIconsToCell(cell);
        }
    });
}

// Función para iniciar la edición
function startEditing(cell) {
    if (cell.classList.contains('editing')) return;
    
    const currentValue = cell.textContent.replace(/\s+/g, ' ').trim();
    // Remover los iconos del texto
    const textContent = currentValue.replace(/\s*$/, '').trim();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textContent;
    input.className = 'cell-input';
    
    // Guardar el valor original
    cell.setAttribute('data-original-value', textContent);
    
    // Añadir clase de edición
    cell.classList.add('editing');
    
    // Limpiar contenido pero mantener iconos
    const icons = cell.querySelector('.edit-icons');
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.appendChild(icons);
    
    input.focus();
    input.select();
    
    // Guardar al presionar Enter
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEditing(cell);
        }
        if (e.key === 'Escape') {
            cancelEditing(cell);
        }
    });
    
    // Guardar al perder el foco
    input.addEventListener('blur', function() {
        setTimeout(() => {
            if (cell.classList.contains('editing')) {
                saveEditing(cell);
            }
        }, 100);
    });
}

// Función para guardar la edición
function saveEditing(cell) {
    const input = cell.querySelector('input');
    if (!input) return;
    
    const newValue = input.value.trim();
    const originalValue = cell.getAttribute('data-original-value');
    
    // Restaurar el contenido
    cell.classList.remove('editing');
    const icons = cell.querySelector('.edit-icons');
    cell.innerHTML = newValue || originalValue;
    cell.appendChild(icons);
    
    // Si el valor cambió, actualizarlo
    if (newValue && newValue !== originalValue) {
        updateCellValue(cell.dataset.category, cell.dataset.concept, cell.dataset.month, newValue);
        
        // Guardar en base de datos
        const changeData = {
            action: 'edit',
            category: cell.dataset.category,
            concept: cell.dataset.concept,
            month: parseInt(cell.dataset.month),
            oldValue: originalValue,
            newValue: newValue,
            timestamp: new Date().toISOString()
        };
        
        saveDataToDatabase(changeData);
        
        // Mostrar feedback visual
        cell.style.backgroundColor = '#d4edda';
        setTimeout(() => {
            cell.style.backgroundColor = '';
        }, 1000);
    }
    
    cell.removeAttribute('data-original-value');
}

// Función para cancelar la edición
function cancelEditing(cell) {
    const originalValue = cell.getAttribute('data-original-value');
    
    cell.classList.remove('editing');
    const icons = cell.querySelector('.edit-icons');
    cell.innerHTML = originalValue;
    cell.appendChild(icons);
    
    cell.removeAttribute('data-original-value');
}

// Función para actualizar el valor de una celda
function updateCellValue(category, concept, month, value) {
    console.log(`Actualizando: ${category} > ${concept} > Mes ${month} = ${value}`);
    
    // Convertir el valor a número
    const numericValue = parseFloat(value.replace(/[€,\s]/g, '')) || 0;
    
    // Encontrar el array de datos correcto
    let dataArray;
    switch(category) {
        case 'income':
            dataArray = financialData.income;
            break;
        case 'fixed':
            dataArray = financialData.fixedExpenses;
            break;
        case 'variable':
            dataArray = financialData.variableExpenses;
            break;
        default:
            return;
    }
    
    // Encontrar el concepto y actualizar el valor
    let existingItem = dataArray.find(item => item.concept === concept);
    
    if (existingItem) {
        existingItem.amounts[parseInt(month)] = numericValue;
    } else {
        // Crear nuevo concepto si no existe
        const newItem = {
            concept: concept,
            amounts: new Array(12).fill(0)
        };
        newItem.amounts[parseInt(month)] = numericValue;
        dataArray.push(newItem);
    }
    
    // Actualizar resumen y gráficos
    generateSummary();
    generateYearlyStats();
    
    // Actualizar gráficos si estamos en la sección de resumen
    if (document.getElementById('summary-section').classList.contains('active')) {
        const monthFilter = document.getElementById('monthFilter');
        updateAllCharts(monthFilter.value);
    }
}