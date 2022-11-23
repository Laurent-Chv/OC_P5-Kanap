

let cart = []

fetch("http://localhost:3000/api/products/")
   .then(data => data.json())
   .then(jsonListProduct => {
      for (product in localStorage)
         if (localStorage.hasOwnProperty(product)) {
            // console.log(product) //#########
            product = JSON.parse(localStorage[product])[0]
            // console.log(product) //#########
            // console.log(product.key) //#########
            let keyId = product.key.split(" ")[0]
            // console.log(keyId) //#########
            let keyColor = product.color.split(" ")
            // console.log(keyColor) //#########:
            for (product_ in jsonListProduct) {
               if (keyId == jsonListProduct[product_]._id) {
                  cart.push(jsonListProduct[product_])
                  inserProductHtml(jsonListProduct[product_], keyId, keyColor)
               }
            }
         }
   });

function inserProductHtml(cartProduct, keyId, keyColor){
   cart__items.innerHTML += 
      `<article class="cart__item" data-id="${keyId}" data-color="${keyColor}">
         <div class="cart__item__img">
            <img src="${cartProduct.imageUrl}" alt="${cartProduct.altTxt}">
         </div>
         <div class="cart__item__content">
            <div class="cart__item__content__description">
               <h2>${cartProduct.name}</h2>
               <p>${keyColor}</p>
               <p>${cartProduct.price + " €"}</p>
            </div>
            <div class="cart__item__content__settings">
               <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
               </div>
               <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
               </div>
            </div>
         </div>
      </article>`
}



