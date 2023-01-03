//TODO ****************** Gestion de la page panier ******************

//? ************************************
//? Afficher le récapitulatif des achats
//? ************************************

let cart = []
productsCart()

//* Fonction qui permet de récupérer la liste des articles précédemment ajoutés au Panier afin de permettre leur affichage ainsi que la gestion des quantité et la suppression
function productsCart(bool = true) {
   let quantityProductTotal = 0
   let totalProductPrice = 0
   fetch("http://localhost:3000/api/products/") //! Requête de l'API afin d'avoir accès et d'utiliser les données produits de celle-ci
      .then(data => data.json())
      .then(jsonListProduct => {

         for (product in localStorage) // Boucle permettant de récupérer tous les produits précédemment ajoutés dans le localStorage

            if (localStorage.hasOwnProperty(product)) { // Si des articles ont précédemment été ajoutés au panier, la condition permet de les récupérer via le localStorage
               product = JSON.parse(localStorage[product])[0]
               let referenceId = product.reference.split("_")[0]
               let referenceColor = product.color.split("_")
               let cartProductQuantity = product.quantity

               for (product_ in jsonListProduct) { // Boucle permettant de récupérer les données produit depuis l'API
                  let cartProduct = jsonListProduct[product_]
                  let cartProductPrice = cartProduct.price

                  if (referenceId == cartProduct._id) { // Condition permettant d'incrémenter la quantité et le prix total des éléments du panier pour les afficher selon lorsque l'ID d'un produit est identique entre celui de l'API et celui stocké dans le localstorage
                     quantityProductTotal += parseInt(cartProductQuantity)
                     totalProductPrice += parseInt(cartProductPrice) * parseInt(cartProductQuantity)
                     cart.push(cartProduct)
                     bool && inserProductHtml(cartProduct, referenceId, referenceColor, cartProductQuantity) //! le sens de "bool" ici ?
                  }
               }
            }

         if (bool) { //! "bool" étant définit sur "true", cette condition permet de 

            let modifierQuantity = document.getElementsByClassName("itemQuantity")
            for (modifierToQuantity in modifierQuantity) // Boucle sur chaque "input.itemQuantity" de la page
               if (modifierQuantity.hasOwnProperty(modifierToQuantity)) { //! Si l'élément possède une classe "itemQuantity"
                  // alors on appelle la fonction "addModifierQuantity" à chaque fois que le bouton "itemQuantity" subit une modification (donc qu'on modifie la quantité du produit)
                  modifierQuantity[modifierToQuantity].addEventListener("change", addModifierQuantity)
               }

            let deletedProductCart = document.getElementsByClassName("deleteItem")
            for (deletedProductToCart in deletedProductCart) // Boucle sur chaque "p.deleteItem" de la page
               if (deletedProductCart.hasOwnProperty(deletedProductToCart)) { //! Si l'élément possède une classe "deleteItem"
                  // alors on appelle la fonction "deletedProduct" lorsqu'on clique sur l'élément "Supprimer" de classe "deleteItem" (donc qu'on supprime un produit)
                  deletedProductCart[deletedProductToCart].addEventListener("click", deletedProduct)
               }
         }

         inserTotalsHtml(quantityProductTotal, totalProductPrice)
      })
}

//* Fonction permettant d'afficher sur la page un produit précédemment ajoutés
function inserProductHtml(cartProduct, referenceId, referenceColor, cartProductQuantity) {
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

//* Fonction qui permet d'afficher sur la page la quantité et le prix totale de produits ajoutés au panier
function inserTotalsHtml(quantityTotal, priceTotal) {
   totalQuantity.innerHTML = quantityTotal
   totalPrice.innerHTML = priceTotal
}

//? ************************************
//? Gestion de la modification et de la suppression de produits
//? ************************************

//* Fonction permettant de modifier la quantité d'un produit (grâce à son identifiant et sa couleur) selon la valeur d'un élément cliqué
function addModifierQuantity(e) {
   const id = e.target.closest("article.cart__item").dataset["id"]
   const color = e.target.closest("article.cart__item").dataset["color"]
   let product = JSON.parse(localStorage[id + "_" + color])

   product[0].quantity = e.target.value
   localStorage[id + "_" + color] = JSON.stringify(product)

   productsCart(false) //! Pourquoi il renvoie "false"
}

//* Fonction permettant de supprimer tout un produit (grâce à son identifiant et sa couleur) selon un élément cliqué
function deletedProduct(e) {
   const id = e.target.closest("article.cart__item").dataset["id"]
   const color = e.target.closest("article.cart__item").dataset["color"]

   delete localStorage[id + "_" + color]
   e.target.closest("article.cart__item").remove()

   productsCart(false)
}

//? ************************************
//? Vérifier et passer la commande (panier + formulaire) avant de rediriger l’utilisateur sur la page Confirmation 
//? ************************************

//* Permet de désacticver le bouton "Commander !" du formulaire tant que le formulaire n'est pas saisie et la commande validée via la fonction "validOrder()"
document.forms[0].addEventListener('submit', function(e){
   e.preventDefault()
   validOrder()
})

//! => Dans l'étape 11, il est demandé à ce que le numéro de commande puisse être affiché, celui-ci ne devant pas être conservé/stocké.
//! Est-ce qu'en faisant appel aux fonctions "sendOrder" et "moveToConfirmation" cela convient ?

//* Fonction mermettant de rediriger l'utilisateur vers la page de Confirmation en passant le numéro de commande dans l’URL
async function moveToConfirmation(orderNumber){
   alert("Félicitation, votre commande a bien été prise en compte !\nVous allez être redirigé vers la page de confirmation de commande.")
   const redirectionAddress = "./confirmation.html?id=" + (await (orderNumber.json())).orderId
   location.href = redirectionAddress
}

//* Fonction permettant de passer/envoyer la commande et de récupérer le numéro de commande
async function sendOrder(order) {
   let response = await fetch('http://localhost:3000/api/products/order/', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json;charset=utf-8',
         'Accept': 'application/json',
      },
      body: JSON.stringify(order)
   });

   moveToConfirmation (response)
   // let orderConfirmation = await (response.json())
   // moveToConfirmation (await (response.json()))
   // let orderConfirmation = await (response.json())
   // moveToConfirmation (orderConfirmation)

   //! Ou alors il vaut mieux privilégier cette manière et donc de ne pas faire appel à la fonction "moveToConfirmation"
   // alert("Félicitation, votre commande a bien été prise en compte !\nVous allez être redirigé vers la page de confirmation de commande.")
   // const redirectionAddress = "./confirmation.html?id=" + (await (response.json())).orderId
   // location.href = redirectionAddress
}

//* Fonction permettant de récupérer et de vérifier la conformité de la commande avant de la valider
function validOrder() {
   // Condition permettant de vérifier le panier avant de valider la commande
   if (localStorage.length == 0) { // On vérifie si le panier est vide ou non et auquel cas on affiche un message d'alerte
      alert("Votre panier est vide !\nImpossible de passer commande.")
   } else if (validFirstName() && validLastName() && validAddress() && validCity() && validEmail()) { // On vérifie la conformité de la saisie du formaulaire avant de constituer un objet conctat et un tableau de produits
      const products = []
      const contact = {
         firstName: document.forms[0].firstName.value,
         lastName: document.forms[0].lastName.value,
         address: document.forms[0].address.value,
         city: document.forms[0].city.value,
         email: document.forms[0].email.value
      }

      for (product in localStorage) // Boucle permettant d'ajouter les produits du panier dans le tableau "products"
         if (localStorage.hasOwnProperty(product)) {
            products.push(JSON.parse(localStorage[product])[0].id)
         }

      const orderObject = { contact, products }
      sendOrder(orderObject)

   } else { // Si aucune condition n'est vrai, alors la saisie du formulaire comporte une erreur, un message d'alerte s'affiche alors.
      alert("La saisie du formulaire est incorrecte.\nVeuillez recommencer.")
   }
}

// ****************** Fonctions de validations des champs du formulaire ******************

//* Fonction permettant de vérifier si le champ "Prénom" du formulaire est valide selon la RegEx "alphabeticalReg"
function validFirstName() {
   elt = document.forms[0].elements['firstName'];
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   const alphabeticalReg = new RegExp("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Condition permettant de tester la saisie utilisateur selon les critères de la RegEx
   if (alphabeticalReg.test(elt.value)) { // Si la saisie utilisateur répond aux critères de la RegEx, alors la saisie est valide, donc on retourne "true"
      return true;
   }
   else { // Si la saisie utilisateur ne répond pas aux critères de la RegEx, alors la saisie n'est pas valide, on affiche un message d'alerte et on retourne "false"
      alert("Veuillez saisir un prénom valide");
      return false;
   }
}

//* Fonction permettant de vérifier si le champ "Nom" du formulaire est valide selon la RegEx "alphabeticalReg"
function validLastName() {
   elt = document.forms[0].elements['lastName'];
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   const alphabeticalReg = new RegExp("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Condition permettant de tester la saisie utilisateur selon les critères de la RegEx
   if (alphabeticalReg.test(elt.value)) { // Si la saisie utilisateur répond aux critères de la RegEx, alors la saisie est valide, donc on retourne "true"
      return true;
   }
   else { // Si la saisie utilisateur ne répond pas aux critères de la RegEx, alors la saisie n'est pas valide, on affiche un message d'alerte et on retourne "false"
      alert("Veuillez saisir un nom valide");
      return false;
   }
}

//* Fonction permettant de vérifier si le champ "Adresse" du formulaire est valide selon la RegEx "alphanumericReg"
function validAddress() {
   elt = document.forms[0].elements['address'];
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), numériques, et les caractères de séparation suivant : les tirets et l'espace 
   const alphanumericReg = new RegExp("^((?:\\w|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Condition permettant de tester la saisie utilisateur selon les critères de la RegEx
   if (alphanumericReg.test(elt.value)) { // Si la saisie utilisateur répond aux critères de la RegEx, alors la saisie est valide, donc on retourne "true"
      return true;
   }
   else { // Si la saisie utilisateur ne répond pas aux critères de la RegEx, alors la saisie n'est pas valide, on affiche un message d'alerte et on retourne "false"
      alert("Veuillez saisir une addresse valide");
      return false;
   }
}

//* Fonction permettant de vérifier si le champ "Ville" du formulaire est valide selon la RegEx "alphabeticalReg"
function validCity() {
   elt = document.forms[0].elements['city'];
   // Regex qui accepte tous les caractères alphabétiques (avec ou sans accents), et les caractères de séparation suivant : les tirets et l'espace 
   const alphabeticalReg = new RegExp("^((?:([A-Za-z])|[\\-_ ](?![\\-_ ])|[\\u00C0\\u00C1\\u00C2\\u00C3\\u00C4\\u00C5\\u00C6\\u00C7\\u00C8\\u00C9\\u00CA\\u00CB\\u00CC\\u00CD\\u00CE\\u00CF\\u00D0\\u00D1\\u00D2\\u00D3\\u00D4\\u00D5\\u00D6\\u00D8\\u00D9\\u00DA\\u00DB\\u00DC\\u00DD\\u00DF\\u00E0\\u00E1\\u00E2\\u00E3\\u00E4\\u00E5\\u00E6\\u00E7\\u00E8\\u00E9\\u00EA\\u00EB\\u00EC\\u00ED\\u00EE\\u00EF\\u00F0\\u00F1\\u00F2\\u00F3\\u00F4\\u00F5\\u00F6\\u00F9\\u00FA\\u00FB\\u00FC\\u00FD\\u00FF\\u0153])+)$", "i")
   // Condition permettant de tester la saisie utilisateur selon les critères de la RegEx
   if (alphabeticalReg.test(elt.value)) { // Si la saisie utilisateur répond aux critères de la RegEx, alors la saisie est valide, donc on retourne "true"
      return true;
   }
   else { // Si la saisie utilisateur ne répond pas aux critères de la RegEx, alors la saisie n'est pas valide, on affiche un message d'alerte et on retourne "false"
      alert("Veuillez saisir un nom de ville valide");
      return false;
   }
}

//* Fonction permettant de vérifier si le champ "Email" du formulaire est valide selon la RegEx "emailReg"
function validEmail() {
   elt = document.forms[0].elements['email'];
   // Regex pour vérifier un email
   const emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i)
   // Condition permettant de tester la saisie utilisateur selon les critères de la RegEx
   if (emailReg.test(elt.value)) { // Si la saisie utilisateur répond aux critères de la RegEx, alors la saisie est valide, donc on retourne "true"
      return true;
   }
   else { // Si la saisie utilisateur ne répond pas aux critères de la RegEx, alors la saisie n'est pas valide, on affiche un message d'alerte et on retourne "false"
      alert("Veuillez saisir un email valide");
      return false;
   }
}

