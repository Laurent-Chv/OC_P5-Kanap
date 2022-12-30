//TODO ****************** Gestion de la page de confirmation ******************


var url = new URL(window.location);
var search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
   var orderNumber = search_params.get('id');
}

orderId.innerHTML = orderNumber