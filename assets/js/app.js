console.log("Entro app.js");
const description = document.getElementById("description");
const imagenNasa = document.getElementById("imagen_nasa");
const tbody = document.getElementById('tbody');

const clave = "DEMO_KEY";
fetch(`https://api.nasa.gov/planetary/apod?api_key=${clave}`)
  .then(response => response.json())
  .then(datosApi => {
    // Acceder a la descripción y URL de la imagen en los datos de la API de la NASA
    const descripcion = datosApi.explanation;
    const imagenUrl = datosApi.url;

    // Asignar la descripción al elemento <p>
    description.textContent = descripcion;

    // Asignar la URL de la imagen al atributo src del elemento <img>
    imagenNasa.src = imagenUrl;
  })
  .catch(error => {
    console.error("Error al obtener los datos de la API de la NASA:", error);
  });

// Obtener datos de los 10 primeros asteroides
fetch("https://ssd-api.jpl.nasa.gov/sb_sat.api", {
  method: 'GET'
})
  .then(response => response.json())
  .then(datos => {
    const ctx = document.getElementById('myChart');
    
    // Filtra y ordena los datos de los 10 primeros asteroides
    const asteroides = datos.data.slice(0, 10).sort((a, b) => a.sat.prov_year - b.sat.prov_year);

    // Obtener los nombres y años de descubrimiento
    const labels = asteroides.map(asteroide => asteroide.sat.sat_fullname);
    const years = asteroides.map(asteroide => asteroide.sat.prov_year);

    // Crear un conjunto de datos para la gráfica de donut
    const datasets = [{
      data: years,
      backgroundColor: ['#FF5733', '#33FFB1', '#336BFF', '#34FEA9', '#C433FF', '#CF5555','#CF4111'], // Colores para los años
    }];

    // Creación de gráfica
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: datasets,
      },
    });

    // Creación de datos de la tabla
    tbody.innerHTML = "";
    asteroides.forEach((asteroide, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border rounded-md border-slate-300 text-white bg-black px-4">${index + 1}</td>
        <td class="border rounded-md border-slate-300 text-white bg-black px-4">${asteroide.sat.sat_fullname}</td>
        <td class="border rounded-md border-slate-300 text-white bg-black px-4">${asteroide.sat.prov_year}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(error => {
    console.error("Error al obtener los datos de la API de asteroides:", error);
  });