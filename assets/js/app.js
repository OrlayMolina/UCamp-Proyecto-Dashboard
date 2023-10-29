console.log("Entro app.js");
const description = document.getElementById("description");
const imagenNasa = document.getElementById("imagen_nasa");

const clave = "DEMO_KEY";
fetch(`https://api.nasa.gov/planetary/apod?api_key=${clave}`)
  .then(response => response.json())
  .then(datosApi => {
    // Acceder a la descripción y URL de la imagen en los datos de la API
    const descripcion = datosApi.explanation;
    const imagenUrl = datosApi.url;

    // Asignar la descripción al elemento <p> en tu HTML
    description.textContent = descripcion;

    // Asignar la URL de la imagen al atributo src del elemento <img>
    imagenNasa.src = imagenUrl;
  })
  .catch(error => {
    console.error("Error al obtener los datos de la API:", error);
  });
