document.addEventListener('DOMContentLoaded', function () {
    var terminoABuscar = getTerminoBusqueda();

    if (terminoABuscar) {
        realizarBusqueda(terminoABuscar);
    }


});

// Obtengo el término de búsqueda de los parámetros de la URL
function getTerminoBusqueda() {
    var currentURL = window.location.search;
    var urlParams = new URLSearchParams(currentURL);

    var terminoABuscar = urlParams.get('termino');

    return terminoABuscar;
}
function contieneTexto(contenido,texto) {
    if (texto.includes(" ")) {
        var terminos = texto.split(" ");
        if (terminos.every(t => contenido.includes(t))) {
            return true;
        }
    } else if (contenido.includes(texto)) {
        return true;
    }
    return false;
}

function realizarBusqueda(terminoAbuscar) {
    var mainContainer = document.getElementsByTagName("main")[0];

    mainContainer.innerHTML = "";
    if (terminoAbuscar === null || terminoAbuscar === undefined || terminoAbuscar.length === 0) {
        return ;
    }
    var paginasBusqueda = ["index.html", "aficiones.html", "musica.html", "series.html"];

    // Preparo todas las peticiones para realizar búsqueda en cada página
    var peticiones = paginasBusqueda.map(async function (url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            // Busco todos los parrafos o titulos del html para buscar palabras
            var elementosHtml = doc.querySelectorAll("p, h1, h2, h3, h4");
            var resultadosBusqueda = [];
            elementosHtml.forEach(function (element) {
                var content = element.textContent.toLowerCase();

                if (contieneTexto(content, terminoAbuscar)) {
                    var resultItem = element.closest("article, section");
                    if (resultItem && !resultadosBusqueda.includes(resultItem)) {
                        var regex = new RegExp(terminoAbuscar, "g");
                        var contenidoResaltado = resultItem.innerHTML.replace(regex,'<span style="background-color: yellow;">$&</span>');
                        resultItem.innerHTML = contenidoResaltado;
                        resultadosBusqueda.push(resultItem);
                    }
                }
            });
            return resultadosBusqueda;
        } catch (error) {
            console.error("Error al cargar la página", error);
            return [];
        }

    });

    Promise.all(peticiones)
        .then(function (resultado) {
            resultado.forEach(function (elementos) {
                elementos.forEach(function (elemento) {
                    mainContainer.appendChild(elemento);
                });
            });
        }).catch(error => console.error("Error al mostrar el resultado", error))
        .finally(() => {

            if (mainContainer.children.length === 0) {
                var noResultsMessage = document.createElement("p");
                noResultsMessage.textContent = "No se encontraron resultados.";
                mainContainer.appendChild(noResultsMessage);
            }
        });


}