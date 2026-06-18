async function initDashboard() {
    try {
        const response = await fetch("http://localhost:3000/projetos");
        const projetos = await response.json();
        
        renderizarGraficoCategorias(projetos);
        renderizarGraficoVoluntarios(projetos);
    } catch (error) {
        console.error(error);
    }
}
Chart.defaults.font.size = 18
function renderizarGraficoCategorias(projetos) {
    const categorias = {};
    
    projetos.forEach(p => {
        categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
    });

    const ctx = document.getElementById("graficoCategorias").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                backgroundColor: ["#198754", "#20c997", "#28a745", "#a3cfbb", "#146c43"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function renderizarGraficoVoluntarios(projetos) {
    const labels = projetos.map(p => p.titulo);
    const dados = projetos.map(p => {
        const num = p.voluntarios ? String(p.voluntarios).match(/\d+/) : null;
        return num ? parseInt(num[0]) : 0;
    });

    const ctx = document.getElementById("graficoVoluntarios").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Quantidade de Voluntários",
                data: dados,
                backgroundColor: "#28a745",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", initDashboard);