


var url = new URL(window.location);
var search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
   var orderId = search_params.get('id');
}

fetch("http://localhost:3000/api/products/" + orderId)
.then(data => data.json())
.then(jsonListProduct => {
   document.querySelector(".orderId").innerHTML = jsonListProduct.orderId
});

// function inserOrderNumberHtml(orderId){
//    orderId.innerHTML += orderId
// }