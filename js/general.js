function searchPages() {
    var searchTerm = document.getElementById("search").value.toLowerCase();
    if (searchTerm === null || searchTerm === undefined || searchTerm.length === 0) {
        return;
    }
    window.location.href = "search.html?termino="+searchTerm;

}
