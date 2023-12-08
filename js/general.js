function searchPages() {
    var searchTerm = document.getElementById("search").value.toLowerCase();
    var resultsContainer = document.getElementById("searchResults");

    // Limpiar resultados anteriores
    resultsContainer.innerHTML = "";

    // URLs de las páginas que quieres buscar
    var pageUrls = ["index.html", "aficiones.html"];  // Agrega las URL de tus páginas aquí

    // Realizar búsqueda en cada página
    pageUrls.forEach(function (url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Recorrer elementos de la página y buscar término
                var elements = doc.querySelectorAll("h1, p");
                elements.forEach(function (element, index) {
                    var content = element.textContent.toLowerCase();
                    if (content.includes(searchTerm)) {
                        // Crear un nuevo elemento para mostrar el resultado
                        var resultItem = document.createElement("div");
                        resultItem.textContent = content;

                        // Agregar un evento de clic al resultado para la navegación
                        resultItem.addEventListener("click", function() {
                            // Navegar hacia el elemento correspondiente en la página original
                            var originalElement = document.querySelector(url + " " + element.tagName + ":nth-child(" + (index + 1) + ")");
                            if (originalElement) {
                                originalElement.scrollIntoView({ behavior: "smooth" });
                            }
                        });

                        // Agregar el nuevo elemento al área de resultados
                        resultsContainer.appendChild(resultItem);
                    }
                });
            })
            .catch(error => console.error("Error al cargar la página", error));
    });

    // Mostrar un mensaje si no se encuentran resultados
    if (resultsContainer.children.length === 0) {
        var noResultsMessage = document.createElement("div");
        noResultsMessage.textContent = "No se encontraron resultados.";
        resultsContainer.appendChild(noResultsMessage);
    }
}
