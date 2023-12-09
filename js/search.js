

document.addEventListener('DOMContentLoaded', function () {
    var searchTerm = getSearchTermFromURL();

    // Si hay un término de búsqueda, establecerlo en el campo de búsqueda y realizar la búsqueda
    if (searchTerm) {
        console.log(searchTerm);
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

    // Limpiar resultados anteriores
    resultsContainer.innerHTML = "";
    if (searchTerm === null || searchTerm === undefined || searchTerm.length === 0) {
        return;
    }
    // URLs de las páginas que quieres buscar
    var pageUrls = ["index.html", "aficiones.html", "musica.html", "series.html"];  // Agrega las URL de tus páginas aquí

    // Realizar búsqueda en cada página
    pageUrls.forEach(function (url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Recorrer elementos de la página y buscar término
                var elements = doc.querySelectorAll("p");
                elements.forEach(function (element, index) {
                    var content = element.textContent.toLowerCase();

                    if (searchTerm.includes(" ")) {
                        var terminos = searchTerm.split(" ");
                        if (terminos.every(t => content.includes(t))) {

                            var resultItem = element.closest("section");
                            if (!resultsContainer.contains(resultItem)) {
                                resultsContainer.appendChild(resultItem);
                            }
                        }

                    } else if (content.includes(searchTerm)) {
                        var resultItem = element.closest("section");
                        resultsContainer.appendChild(resultItem);
                    }
                });
                if (resultsContainer.children.length === 0) {
                    var noResultsMessage = document.createElement("div");
                    noResultsMessage.textContent = "No se encontraron resultados.";
                    resultsContainer.appendChild(noResultsMessage);
                }
            })
            .catch(error => console.error("Error al cargar la página", error));

    });


}