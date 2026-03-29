// Selección de elementos del DOM
const numJugadoresInput = document.getElementById('numJugadores');
const listaJugadoresDiv = document.getElementById('listaJugadores');
const btnCalcular = document.getElementById('btnCalcular');
const btnLimpiar = document.getElementById('btnLimpiar');
const resultadosSection = document.getElementById('resultados');

// Evento para generar campos de jugadores automáticamente
numJugadoresInput.addEventListener('input', generarCamposJugadores);

function generarCamposJugadores() {
    const cantidad = parseInt(numJugadoresInput.value);
    listaJugadoresDiv.innerHTML = ''; // Limpiar lista actual

    // Validar límite de 1 a 12
    const total = Math.max(1, Math.min(cantidad, 12));
    
    for (let i = 1; i <= total; i++) {
        const div = document.createElement('div');
        div.className = 'player-row';
        div.innerHTML = `
            <span>Jugador ${i}</span>
            <input type="number" class="copas-input" placeholder="Copas" min="0" data-index="${i}">
        `;
        listaJugadoresDiv.appendChild(div);
    }
}

// Lógica de Cálculo
btnCalcular.addEventListener('click', () => {
    const gRojasTotal = parseInt(document.getElementById('gemasRojas').value) || 0;
    const gAzulesTotal = parseInt(document.getElementById('gemasAzules').value) || 0;
    const inputsCopas = document.querySelectorAll('.copas-input');
    
    // 1. Separar el 10% y el 90%
    const repartirRojas = Math.floor(gRojasTotal * 0.9);
    const guardarRojas = gRojasTotal - repartirRojas;
    
    const repartirAzules = Math.floor(gAzulesTotal * 0.9);
    const guardarAzules = gAzulesTotal - repartirAzules;

    // 2. Obtener copas y calcular total global
    let jugadores = [];
    let totalCopasGlobal = 0;

    inputsCopas.forEach(input => {
        const copas = parseInt(input.value) || 0;
        totalCopasGlobal += copas;
        jugadores.push({
            id: input.dataset.index,
            copas: copas,
            rojas: 0,
            azules: 0
        });
    });

    // Evitar división por cero si nadie tiene copas
    if (totalCopasGlobal === 0 && jugadores.length > 0) {
        alert("Por favor, ingresa las copas de los jugadores.");
        return;
    }

    // 3. Reparto inicial (piso matemático)
    let rojasAsignadas = 0;
    let azulesAsignadas = 0;

    jugadores.forEach(j => {
        j.rojas = Math.floor((j.copas / totalCopasGlobal) * repartirRojas);
        j.azules = Math.floor((j.copas / totalCopasGlobal) * repartirAzules);
        rojasAsignadas += j.rojas;
        azulesAsignadas += j.azules;
    });

    // 4. Repartir sobrantes al podio (quien tiene más copas)
    // Ordenamos una copia de los jugadores por copas de mayor a menor
    let podio = [...jugadores].sort((a, b) => b.copas - a.copas);

    let sobranteRojas = repartirRojas - rojasAsignadas;
    let iR = 0;
    while(sobranteRojas > 0) {
        podio[iR % podio.length].rojas++;
        sobranteRojas--;
        iR++;
    }

    let sobranteAzules = repartirAzules - azulesAsignadas;
    let iA = 0;
    while(sobranteAzules > 0) {
        podio[iA % podio.length].azules++;
        sobranteAzules--;
        iA++;
    }

    mostrarResultados(guardarRojas, guardarAzules, jugadores);
});

function mostrarResultados(rClan, aClan, lista) {
    resultadosSection.style.display = 'block';
    
    document.getElementById('resumenClan').innerHTML = `
        <strong>Reserva del Clan (10%):</strong><br>
        ❤️ Rojas: ${rClan} | 💙 Azules: ${aClan}
    `;

    const tabla = document.getElementById('tablaResultados');
    tabla.innerHTML = '<h4>Distribución (90%):</h4>';
    
    lista.forEach(j => {
        const item = document.createElement('div');
        item.className = 'player-result';
        item.style = "padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;";
        item.innerHTML = `
            <span><strong>J${j.id}</strong> (${j.copas} 🏆)</span>
            <span>❤️${j.rojas} | 💙${j.azules}</span>
        `;
        tabla.appendChild(item);
    });

    // Scroll suave hacia los resultados en móvil
    resultadosSection.scrollIntoView({ behavior: 'smooth' });
}

// Botón Limpiar
btnLimpiar.addEventListener('click', () => {
    document.getElementById('gemasRojas').value = '';
    document.getElementById('gemasAzules').value = '';
    numJugadoresInput.value = 1;
    generarCamposJugadores();
    resultadosSection.style.display = 'none';
});

// Inicializar un campo al cargar
generarCamposJugadores();