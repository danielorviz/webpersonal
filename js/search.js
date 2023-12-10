document.addEventListener('DOMContentLoaded', function () {
    var searchTerm = getSearchTermFromURL();

    if (searchTerm) {
        doSearch(searchTerm);
    }


});

// Obtener el término de búsqueda de los parámetros de la URL
function getSearchTermFromURL() {
    var currentURL = window.location.search;

    // Crear un objeto URLSearchParams a partir de la URL
    var urlParams = new URLSearchParams(currentURL);

    // Obtener el valor del parámetro 'termino'
    var searchTerm = urlParams.get('termino');

    return searchTerm;
}

function doSearch(searchTerm) {
    var resultsContainer = document.getElementsByTagName("main")[0];

    resultsContainer.innerHTML = "";
    if (searchTerm === null || searchTerm === undefined || searchTerm.length === 0) {
        return;
    }
    var pageUrls = ["index.html", "aficiones.html", "musica.html", "series.html"]; 

    // Realizar búsqueda en cada página
    var peticiones = pageUrls.map(function (url) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Busco todos los parrafos del html para buscar palabras
                var elementosHtml = doc.querySelectorAll("p, h1, h2, h3, h4");
                var resultadosBusqueda = [];
                elementosHtml.forEach(function (element, index) {
                    var content = element.textContent.toLowerCase();

                    if (searchTerm.includes(" ")) {
                        var terminos = searchTerm.split(" ");
                        if (terminos.every(t => content.includes(t))) {

                            var resultItem = element.closest("article, section");
                            if (resultItem && !resultadosBusqueda.contains(resultItem)) {
                                resultadosBusqueda.push(resultItem);
                            }
                        }

                    } else if (content.includes(searchTerm)) {
                        var resultItem = element.closest("article, section");
                        if (resultItem && !resultadosBusqueda.contains(resultItem)) {
                            resultadosBusqueda.push(resultItem);
                        }

                    }
                });
                return resultadosBusqueda;
                
            })
            .catch(error => {
                console.error("Error al cargar la página", error);
                return [];
            });

    });

    Promise.all(peticiones)
        .then(function (resultados){
            resultados.forEach( function (elemento){
                resultsContainer.appendChild(elemento);
            });
        }).catch(error => console.error("Error al mostrar el resultado", error))
        .finally(()=>{

            if (resultsContainer.children.length === 0) {
                var noResultsMessage = document.createElement("p");
                noResultsMessage.textContent = "No se encontraron resultados.";
                resultsContainer.appendChild(noResultsMessage);
            }
    });
    

}