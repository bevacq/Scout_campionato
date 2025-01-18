const squadre = [
    "aquile",
    "castori",
    "falchi",
    "koala",
    "gazzelle",
    "lupi"
];

let classifica = squadre.map(squadra => ({
    nome: squadra,
    vittorie: 0,
    sconfitte: 0,
    pareggi: 0,
    punti: 0
}));

let incontri = [];
const history = [];

// Genera gli incontri di andata e ritorno
function generaIncontri() {
    incontri = [];
    for (let i = 0; i < squadre.length; i++) {
        for (let j = i + 1; j < squadre.length; j++) {
            incontri.push({ casa: squadre[i], ospite: squadre[j], esito: "" });
            incontri.push({ casa: squadre[j], ospite: squadre[i], esito: "" });
        }
    }
}

// Funzione per aggiornare la classifica
function aggiornaClassifica(esito, casa, ospite) {
    const snapshot = JSON.parse(JSON.stringify(classifica)); // Salva lo stato attuale
    history.push(snapshot); // Aggiungi lo stato alla pila

    const squadraCasa = classifica.find(s => s.nome === casa);
    const squadraOspite = classifica.find(s => s.nome === ospite);

    if (esito === "Vittoria Casa") {
        squadraCasa.vittorie++;
        squadraCasa.punti += 3;
        squadraOspite.sconfitte++;
    } else if (esito === "Vittoria Ospite") {
        squadraOspite.vittorie++;
        squadraOspite.punti += 3;
        squadraCasa.sconfitte++;
    } else if (esito === "Pareggio") {
        squadraCasa.pareggi++;
        squadraOspite.pareggi++;
        squadraCasa.punti++;
        squadraOspite.punti++;
    }
    renderClassifica();
}

// Funzione per annullare l'ultima operazione
function undoLastAction() {
    if (history.length > 0) {
        classifica = history.pop(); // Ripristina lo stato precedente
        renderClassifica();
    } else {
        alert("Non ci sono operazioni da annullare.");
    }
}

// Funzione per mostrare la classifica
function renderClassifica() {
    const tbody = document.getElementById("classifica").querySelector("tbody");
    tbody.innerHTML = "";
    classifica.sort((a, b) => b.punti - a.punti);
    classifica.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.nome}</td>
            <td>${s.vittorie}</td>
            <td>${s.sconfitte}</td>
            <td>${s.pareggi}</td>
            <td>${s.punti}</td>
        `;
        tbody.appendChild(row);
    });
}

// Funzione per mostrare e modificare gli incontri
function renderIncontri() {
    const tbody = document.getElementById("incontri").querySelector("tbody");
    tbody.innerHTML = "";
    incontri.forEach((incontro, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="text" value="${incontro.casa}" onchange="modificaIncontro(${index}, 'casa', this.value)" />
            </td>
            <td>
                <input type="text" value="${incontro.ospite}" onchange="modificaIncontro(${index}, 'ospite', this.value)" />
            </td>
            <td>
                <select onchange="aggiornaEsito(${index}, this.value)">
                    <option value="">--Seleziona--</option>
                    <option value="Vittoria Casa" ${incontro.esito === 'Vittoria Casa' ? 'selected' : ''}>Vittoria Casa</option>
                    <option value="Vittoria Ospite" ${incontro.esito === 'Vittoria Ospite' ? 'selected' : ''}>Vittoria Ospite</option>
                    <option value="Pareggio" ${incontro.esito === 'Pareggio' ? 'selected' : ''}>Pareggio</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funzione per modificare un incontro
function modificaIncontro(index, campo, valore) {
    incontri[index][campo] = valore;
    renderIncontri();
}

// Funzione per aggiornare l'esito di un incontro
function aggiornaEsito(index, esito) {
    incontri[index].esito = esito;
    const { casa, ospite } = incontri[index];
    aggiornaClassifica(esito, casa, ospite);
}

// Aggiungi un pulsante di annullamento
function aggiungiPulsanteAnnulla() {
    const undoButton = document.createElement("button");
    undoButton.textContent = "Annulla Ultima Operazione";
    undoButton.onclick = undoLastAction;
    document.body.insertBefore(undoButton, document.body.firstChild);
}

aggiungiPulsanteAnnulla();
generaIncontri();
renderClassifica();
renderIncontri();