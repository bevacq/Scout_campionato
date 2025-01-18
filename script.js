// Aggiungi una variabile per identificare se l'utente è amministratore
let isAdmin = true; // Imposta su true per l'amministratore, su false per altri utenti

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

// Funzione per generare gli incontri
function generaIncontri() {
    incontri = [];
    for (let i = 0; i < squadre.length; i++) {
        for (let j = i + 1; j < squadre.length; j++) {
            incontri.push({ casa: squadre[i], ospite: squadre[j], esito: "" });
            incontri.push({ casa: squadre[j], ospite: squadre[i], esito: "" });
        }
    }
}

// Funzione per salvare la classifica nel LocalStorage
function salvaClassifica() {
    localStorage.setItem('classifica', JSON.stringify(classifica));
}

// Funzione per caricare la classifica dal LocalStorage
function caricaClassifica() {
    const data = localStorage.getItem('classifica');
    if (data) {
        classifica = JSON.parse(data);
    }
    renderClassifica();
}

// Funzione per aggiornare la classifica
function aggiornaClassifica(esito, casa, ospite) {
    if (!isAdmin) {
        alert("Solo l'amministratore può aggiornare la classifica.");
        return; // Se l'utente non è amministratore, non permette l'aggiornamento
    }

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
    salvaClassifica(); // Salva dopo ogni aggiornamento
    renderClassifica();
}

// Funzione per annullare l'ultima operazione
function undoLastAction() {
    if (history.length > 0) {
        classifica = history.pop(); // Ripristina lo stato precedente
        salvaClassifica(); // Salva dopo l'undo
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
                <input type="text" value="${incontro.casa}" onchange="modificaIncontro(${index}, 'casa', this.value)" ${isAdmin ? '' : 'disabled'} />
            </td>
            <td>
                <input type="text" value="${incontro.ospite}" onchange="modificaIncontro(${index}, 'ospite', this.value)" ${isAdmin ? '' : 'disabled'} />
            </td>
            <td>
                <select onchange="aggiornaEsito(${index}, this.value)" ${isAdmin ? '' : 'disabled'}>
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
    if (isAdmin) {
        incontri[index][campo] = valore;
        renderIncontri();
    }
}

// Funzione per aggiornare l'esito di un incontro
function aggiornaEsito(index, esito) {
    if (isAdmin) {
        incontri[index].esito = esito;
        const { casa, ospite } = incontri[index];
        aggiornaClassifica(esito, casa, ospite);
    } else {
        alert("Solo l'amministratore può aggiornare l'esito della partita.");
    }
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
caricaClassifica();
renderIncontri();
