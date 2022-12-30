//TODO ****************** Gestion de la page panier ******************

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




// ****************** FORMULAIRE ******************

document.forms[0].addEventListener('submit', function(e){
   e.preventDefault()
   validForm()
})


// ****************** REDIRECTION VERS PAGE DE CONFIRMATION ******************
//TODO: Envoyer le formulaire au backend
//TODO: Récupèrer le numéro de confirmation



async function sendForm(order) {

   let response = await fetch('http://localhost:3000/api/products/order/', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json;charset=utf-8',
         'Accept': 'application/json',
      },
      body: JSON.stringify(order)
   });

   let orderConfirmation = await (response.json())

   alert("Votre commande à été prise en compte !\nVous allez être rediriger vers la page de confirmation de commande.")
   const redirectionAddress = "./confirmation.html?id=" + await orderConfirmation.orderId
   location.href = redirectionAddress
}

function validForm() {
   if(localStorage.length == 0){
      alert("Attention : votre panier est vide !")
   } else if (validFirstName() && validLastName() && validAddress() && validCity() && validEmail()) {
      // alert("La saisie du formulaire est correcte.")
      const products = []
      const contact = {
         firstName: document.forms[0].firstName.value,
         lastName: document.forms[0].lastName.value,
         address: document.forms[0].address.value,
         city: document.forms[0].city.value,
         email: document.forms[0].email.value
      }
      for (product in localStorage)
         // var productInLocalStorage = localStorage.hasOwnProperty(product)
      // if (productInLocalStorage && (typeof productInLocalStorage) == "string") {
         if (localStorage.hasOwnProperty(product)) {
         products.push(JSON.parse(localStorage[product])[0].id)
         // alert("Voici le type d'un product : " + productInLocalStorage)
      }

      alert("La saisie du formulaire est correcte.")
      const orderObject = { contact, products }
      // console.log(orderObject)

      sendForm(orderObject)

   } else {
      alert("La saisie du formulaire est incorrecte.\nVeuillez recommencer.")
   }
}

// ****************** Fonctions de validations des champs du formulaire ******************

function validFirstName(){
   elt=document.forms[0].elements['firstName'];
   const alphabeticalReg = new RegExp ("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   if(alphabeticalReg.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un prénom valide");
     return false;
   }
 }

function validLastName(){
   elt=document.forms[0].elements['lastName'];
   const alphabeticalReg = new RegExp ("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   if(alphabeticalReg.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un nom valide");
     return false;
   }
 }

function validAddress(){
   elt=document.forms[0].elements['address'];
   const alphanumericReg = new RegExp ("^((?:\\w|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), numériques, et les caractères de séparation suivant : les tirets et l'espace 
   if(alphanumericReg.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir une addresse valide");
     return false;
   }
 }

function validCity(){
   elt=document.forms[0].elements['city'];
   const alphabeticalReg = new RegExp ("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   if(alphabeticalReg.test(elt.value)) {
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
   // Regex pour vérifier un email
   if(emailReg.test(elt.value)) {
     return true;
   }
   else {
     alert("Veuillez saisir un email valide");
     return false;
   }
 }



