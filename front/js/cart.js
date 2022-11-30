

let cart = []
let quantityProductTotal = 0
let totalProductPrice = 0

fetch("http://localhost:3000/api/products/")
   .then(data => data.json())
   .then(jsonListProduct => {
      for (product in localStorage)
         if (localStorage.hasOwnProperty(product)) {
            // console.log(product) //#########
            product = JSON.parse(localStorage[product])[0]
            // console.log(product) //#########
            // console.log(product.reference) //#########
            let referenceId = product.reference.split(" ")[0]
            // console.log(referenceId) //#########
            let referenceColor = product.color.split(" ")
            // console.log(referenceColor) //#########
            let cartProductQuantity = product.quantity
            // console.log("Voici la quantité : " + cartProductQuantity) //#########

            for (product_ in jsonListProduct) {
               let cartProductPrice = jsonListProduct[product_].price

               if (referenceId == jsonListProduct[product_]._id) {
                  quantityProductTotal += parseInt(cartProductQuantity)
                  totalProductPrice += parseInt(cartProductPrice) * parseInt(cartProductQuantity)                  
                  cart.push(jsonListProduct[product_])
                  inserProductHtml(jsonListProduct[product_], referenceId, referenceColor, cartProductQuantity)
               }
            }
         }

         let modifierQuantity = document.getElementsByClassName("itemQuantity")
         for (modifierToQuantity in modifierQuantity){
            modifierQuantity[modifierToQuantity].addEventListener("change", addModifierQuantity)
         }

         inserTotalsHtml(quantityProductTotal, totalProductPrice)
         console.log(quantityProductTotal) //#########
         console.log(totalProductPrice) //#########
      });

function inserProductHtml(cartProduct, referenceId, referenceColor, cartProductQuantity){
   cart__items.innerHTML += 
      `<article class="cart__item" data-id="${referenceId}" data-color="${referenceColor}">
         <div class="cart__item__img">
            <img src="${cartProduct.imageUrl}" alt="${cartProduct.altTxt}">
         </div>
         <div class="cart__item__content">
            <div class="cart__item__content__description">
               <h2>${cartProduct.name}</h2>
               <p>${referenceColor}</p>
               <p>${cartProduct.price + " €"}</p>
            </div>
            <div class="cart__item__content__settings">
               <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProductQuantity}">
               </div>
               <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
               </div>
            </div>
         </div>
      </article>`
}

function inserTotalsHtml(quantityTotal, priceTotal){
   totalQuantity.innerHTML += quantityTotal
   totalPrice.innerHTML += priceTotal
}

function addModifierQuantity(){
   // Modifier le localstorage en faisant +/- 1
   // Actualiser les totaux via une fonction (ou voir avec fonction inserTotalsHtml)
}



