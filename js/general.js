function searchPages() {
    var searchTerm = document.getElementById("search").value.toLowerCase();
    window.location.href = "search.html?termino="+searchTerm;

}
