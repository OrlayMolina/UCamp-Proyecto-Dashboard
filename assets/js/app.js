console.log("Entro app.js");
const description = document.getElementById("description");
const imagenNasa = document.getElementById("imagen_nasa");
const tbody = document.getElementById('tbody');

const clave = "23Z86A9FIh6Cq1b8nfY6iov2BidVN7K2fk0iLNu9";

async function fetchNasaData() {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${clave}`);
    const datosApi = await response.json();

    // Acceder a la descripción y URL de la imagen en los datos de la API de la NASA
    const descripcion = datosApi.explanation;
    const imagenUrl = datosApi.url;

    // Asignar la descripción al elemento <p>
    description.textContent = descripcion;

    // Asignar la URL de la imagen al atributo src del elemento <img>
    imagenNasa.src = imagenUrl;
  } catch (error) {
    console.error("Error al obtener los datos de la API de la NASA:", error);
  }
}

fetchNasaData();


// Obtener datos de los 10 primeros asteroides
fetch("https://ssd-api.jpl.nasa.gov/sb_sat.api", {
  method: 'GET',
  mode: 'cors'
})
  .then(response => response.json())
  .then(datos => {
    const ctx = document.getElementById('myChart');
    const tbody = document.getElementById('tbody');
    
    // Filtra y ordena los datos de los 10 primeros asteroides
    const asteroides = datos.data.slice(0, 10).sort((a, b) => a.sat.prov_year - b.sat.prov_year);

    // Tratar los valores nulos en sat_fullname
    asteroides.forEach(asteroide => {
      if (!asteroide.sat.sat_fullname) {
        asteroide.sat.sat_fullname = 'El nombre es null para este asteroide';
      }
    });

    // Agrupar los años y contar cuántas veces aparece cada año, se utiliza el toString para unificar ya que la API de la nasa
    // hay valores que estan numericos y otros como string
    const yearCounts = {};
    asteroides.forEach(asteroide => {
      const year = asteroide.sat.prov_year.toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    // Obtener las etiquetas (años) y los valores (conteo) para el gráfico de donut
    const labels = Object.keys(yearCounts);
    const data = Object.values(yearCounts);

    // Colores para los años
    const backgroundColors = ['#FF5733', '#33FFB1', '#336BFF', '#34AEA9', '#C433FF', '#CF5555', '#CF4111'];

    // Crear un conjunto de datos para el gráfico de donut
    const dataset = {
      data: data,
      backgroundColor: backgroundColors,
    };

    // Creación de gráfica
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [dataset],
      },
    });

    // Creación de datos de la tabla
    tbody.innerHTML = "";
    asteroides.forEach((asteroide, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border rounded-md border-slate-300 text-white bg-black px-4">${index + 1}</td>
        <td class="border rounded-md border-slate-300 text-white bg-black px-4">${asteroide.sat.sat_fullname}</td>
        <td class="border rounded-md border-slate-300 text-white text-center bg-black px-4">${asteroide.sat.prov_year}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(error => {
    console.error("Error al obtener los datos de la API de asteroides:", error);
  });
