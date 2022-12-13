


var url = new URL(window.location);
var search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
   var productId = search_params.get('id');
}

fetch("http://localhost:3000/api/products/" + productId)
   .then(data => data.json())
   .then(jsonListProduct => {
      document.querySelector(".item__img").innerHTML +=
         `<img src="${jsonListProduct.imageUrl}" alt="${jsonListProduct.imageUrl}">`;
      title.innerHTML += jsonListProduct.name;
      price.innerHTML += jsonListProduct.price;
      description.innerHTML += jsonListProduct.description;
      for (let color of jsonListProduct.colors) {
         colors.innerHTML +=
            `<option value="${color}">${color}</option>`
      }
   });

function addToCart() {
   // localStorage.clear() //#########
   let cartList = []
   let productQuantity = document.getElementById("quantity")
   let productColorsList = document.getElementById("colors")
   let productReference = `${productId}` + "_" + `${colors.value}`
   let newItemJSON = {
      reference: productReference,
      id: productId,
      quantity: productQuantity.value,
      color: productColorsList.value,
   };

   let newProductQuantity = newItemJSON.quantity

   if (localStorage.getItem(productReference)) {
      let currentProduct = JSON.parse(localStorage.getItem(productReference))
      let currentProductQuantity = currentProduct[0].quantity
      let productQuantityAdded = parseInt(currentProductQuantity) + parseInt(newProductQuantity)
      newItemJSON = {
         reference: productReference,
         id: productId,
         quantity: productQuantityAdded,
         color: productColorsList.value
      }
      increaseItem(newItemJSON, cartList, productReference)
   } else {
      increaseItem(newItemJSON, cartList, productReference)
   }
}

function increaseItem(newItemJSON, cartList, productReference){
   cartList.push(newItemJSON)
   newItem = JSON.stringify(cartList)
   localStorage.setItem(productReference, newItem)
   console.log(localStorage) //#########
}

window.onload = function () {
   let buttonAddToCart = document.getElementById("addToCart")
   buttonAddToCart.addEventListener("click", addToCart, false)
}


