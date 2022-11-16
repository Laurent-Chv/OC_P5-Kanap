


var url = new URL(window.location);
var search_params = new URLSearchParams(url.search); 
if(search_params.has('id')) {
   var idProduit = search_params.get('id');
}

fetch("http://localhost:3000/api/products/" + idProduit)
   .then(data => data.json())
   .then(jsonListProduit => {
      document.querySelector(".item__img").innerHTML +=
      `<img src="${jsonListProduit.imageUrl}" alt="${jsonListProduit.imageUrl}">`;
      title.innerHTML += jsonListProduit.name;
      price.innerHTML += jsonListProduit.price;
      description.innerHTML += jsonListProduit.description;
      for (let color of jsonListProduit.colors) {
         colors.innerHTML +=
         `<option value="${color}">${color}</option>`
      }

      }
);