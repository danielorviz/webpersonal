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
    pageUrls.forEach(function (url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Busco todos los parrafos del html para buscar palabras
                var elements = doc.querySelectorAll("p, h1, h2, h3, h4");
                elements.forEach(function (element, index) {
                    var content = element.textContent.toLowerCase();

                    if (searchTerm.includes(" ")) {
                        var terminos = searchTerm.split(" ");
                        if (terminos.every(t => content.includes(t))) {

                            var resultItem = element.closest("article, section");
                            if (!resultsContainer.contains(resultItem)) {
                                resultsContainer.appendChild(resultItem);
                            }
                        }

                    } else if (content.includes(searchTerm)) {
                        var resultItem = element.closest("article, section");
                        resultsContainer.appendChild(resultItem);

                    }
                });
                
            })
            .catch(error => console.error("Error al cargar la página", error))
            .finally(()=>{
                if (resultsContainer.children.length === 0) {
                    var noResultsMessage = document.createElement("div");
                    noResultsMessage.textContent = "No se encontraron resultados.";
                    resultsContainer.appendChild(noResultsMessage);
                }
        });
    });
    

}