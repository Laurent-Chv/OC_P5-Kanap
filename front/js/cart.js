

let cart = []
productsCart()

function productsCart(bool = true) {
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
               let referenceId = product.reference.split("_")[0]
               // console.log(referenceId) //#########
               let referenceColor = product.color.split("_")
               // console.log(referenceColor) //#########
               let cartProductQuantity = product.quantity
               // console.log("Voici la quantité : " + cartProductQuantity) //#########

               for (product_ in jsonListProduct) {
                  let cartProductPrice = jsonListProduct[product_].price

                  if (referenceId == jsonListProduct[product_]._id) {
                     quantityProductTotal += parseInt(cartProductQuantity)
                     totalProductPrice += parseInt(cartProductPrice) * parseInt(cartProductQuantity)
                     cart.push(jsonListProduct[product_])
                     bool && inserProductHtml(jsonListProduct[product_], referenceId, referenceColor, cartProductQuantity)
                  }
               }
            }

         if (bool) {
            let modifierQuantity = document.getElementsByClassName("itemQuantity")
            for (modifierToQuantity in modifierQuantity)
               if (modifierQuantity.hasOwnProperty(modifierToQuantity)) {
                  console.log(modifierQuantity[modifierToQuantity])
                  modifierQuantity[modifierToQuantity].addEventListener("change", addModifierQuantity)
               }

            let deletedProductCart = document.getElementsByClassName("deleteItem")
            for (deletedProductToCart in deletedProductCart)
               if (deletedProductCart.hasOwnProperty(deletedProductToCart)) {
                  // console.log(deletedProductCart[deletedProductToCart])
                  deletedProductCart[deletedProductToCart].addEventListener("click", deletedProduct)
               }
         }

         inserTotalsHtml(quantityProductTotal, totalProductPrice)
         console.log("Voici la quantité TT du panier : " + quantityProductTotal) //#########
         console.log("Voici le prix TT du panier : " + totalProductPrice) //#########
      })
}

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
   totalQuantity.innerHTML = quantityTotal
   totalPrice.innerHTML = priceTotal
}

function addModifierQuantity(e) {
   const id = e.target.closest("article.cart__item").dataset["id"]
   const color = e.target.closest("article.cart__item").dataset["color"]

   // console.log(id, color)
   let product = JSON.parse(localStorage[id + "_" + color])
   product[0].quantity = e.target.value
   localStorage[id + "_" + color] = JSON.stringify(product)
   productsCart(false)
   console.log(product)
}

function deletedProduct(e) {
   const id = e.target.closest("article.cart__item").dataset["id"]
   const color = e.target.closest("article.cart__item").dataset["color"]

   // console.log(id, color)
   delete localStorage[id + "_" + color]
   e.target.closest("article.cart__item").remove()
   productsCart(false)
}




// ****************** FORMULAIRE ****************

document.forms[0].addEventListener('submit', function(e){
   e.preventDefault()
   validForm()
})


function validForm(){
   // const ordered = {concact: {}, products: []}
   if (validFirstName() && validLastName() && validAddress() && validCity() && validEmail()) {
      alert("La saisie du formulaire est correcte.")
      const products = []
      const concact = {
         firstName: document.forms[0].firstName.value,
         lastName: document.forms[0].lastName.value,
         address: document.forms[0].address.value,
         city: document.forms[0].city.value,
         email: document.forms[0].email.value
      }
      for (product in localStorage)
         if (localStorage.hasOwnProperty(product)) {
            products.push(JSON.parse(localStorage[product])[0].id)
         }
      const ordered = { concact, products }
      console.log(ordered)
   } else {
      alert("La saisie du formulaire est incorrecte.\nVeuillez recommencer.")
   }
}

function validFirstName(){
   elt=document.forms[0].elements['firstName'];
   const alphabetical = /[_A-Za-z]/
   // Regex qui permet la saisie alphabétique (lettres)
   if(alphabetical.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un prénom valide");
     return false;
   }
 }

function validLastName(){
   elt=document.forms[0].elements['lastName'];
   const alphabetical = /[_A-Za-z]/
   // Regex qui permet la saisie alphabétique (lettres)
   if(alphabetical.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un nom valide");
     return false;
   }
 }

function validAddress(){
   elt=document.forms[0].elements['address'];
   const alphanumericReg = /[_A-Za-z0-9]/
   // Regex qui permet la saisie alphanumérique (chiffres et lettres)
   if(alphanumericReg.test(elt.value)) {
   // if(/^[A-Z]+$/.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir une addresse valide");
     return false;
   }
 }

function validCity(){
   elt=document.forms[0].elements['city'];
   const alphanumericReg = /[_A-Za-z0-9]/
   // Regex qui permet la saisie alphanumérique (chiffres et lettres)
   if(alphanumericReg.test(elt.value)) {
   // if(elt.value != "") {
     return true;
   }
   else {
     alert("Veuillez saisir un nom de ville valide");
     return false;
   }
 }

function validEmail(){
   elt=document.forms[0].elements['email'];
   const emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i)
   // Regex pour vérifier un mail
   if(emailReg.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un email valide");
     return false;
   }
 }




