//TODO ****************** Gestion de la page produit ******************

//? ************************************
//? Récupérer l’ID du produit à afficher
//? ************************************

//* Permet de récupérer l'identifiant produit et de le stocker dans une variable depuis l'URL
var url = new URL(window.location)
var search_params = new URLSearchParams(url.search)

if (search_params.has('id')) { // Condition permettant de chercher s'il y a "id" dans l'URL et si tel est le cas, de stocker la valeur de celui-ci dans la variable "productId" 
   var productId = search_params.get('id')
}

//? ************************************
//? Insérer le produit et ses détails dans la page Produit
//? ************************************

//* Gestion de l'affichage dynamique des produits sur la page Produit
// On requête le serveur afin de récupérer le produit selon son ID récupéré plus tôt
fetch("http://localhost:3000/api/products/" + productId)
   .then(data => data.json())
   .then(jsonListProduct => {
      // On va afficher les données sur notre page product.html en faisant des interpolations de variables 
      document.querySelector(".item__img").innerHTML =
         `<img src="${jsonListProduct.imageUrl}" alt="${jsonListProduct.imageUrl}">`
      title.innerHTML = jsonListProduct.name
      price.innerHTML = jsonListProduct.price
      description.innerHTML = jsonListProduct.description

      for (let color of jsonListProduct.colors) { // Permet de gérer l'affichage des différentes couleurs d'un produit en faisant une boucle sur la liste de données dans "colors"
         colors.innerHTML +=
            `<option value="${color}">${color}</option>`
      }
   })

//? ************************************
//? Ajouter des produits dans le panier
//? ************************************

//* Fonction qui permet de créer ou d'actualiser la fiche du produit à ajouter au panier selon une clé de référence (ID + couleur) elle-même créée dans la variable "productReference"
function addToCart() {
   let cartList = []
   let productQuantity = document.getElementById("quantity")
   let productColorsList = document.getElementById("colors")
   let productReference = `${productId}` + "_" + `${colors.value}`
   let newItemJSON = {
      reference: productReference,
      id: productId,
      name: document.querySelector("#title").innerHTML,
      quantity: productQuantity.value,
      color: productColorsList.value,
   }

   let newProductQuantity = newItemJSON.quantity

   if (checkInput()) { // Si la fonction "checkInput()" est vraie (retourne "true"), alors on entre dans la condition
      // Condition qui permet d'ajouter le produit selon si celui-ci existe déjà ou pas dans le panier (et cela en fonction de sa référence (ID + couleur))
      if (localStorage.getItem(productReference)) { // Si le produit existe déjà dans le panier selon sa réf (ID + couleur), alors on actualise seulement la quantité
         let currentProduct = JSON.parse(localStorage.getItem(productReference))
         let currentProductQuantity = currentProduct[0].quantity
         let productQuantityAdded = parseInt(currentProductQuantity) + parseInt(newProductQuantity)
         newItemJSON = {
            reference: productReference,
            id: productId,
            name: document.querySelector("#title").innerHTML,
            quantity: productQuantityAdded,
            color: productColorsList.value
         }
         increaseItem(newItemJSON, cartList, productReference)
      } else { // Si le produit n'existe pas encore dans le panier selon sa réf (ID + couleur), alors on ajoute le nouveau produit au panier
         increaseItem(newItemJSON, cartList, productReference)
      }
   }
}

//* Fonction qui permet d'ajouter un produit au panier avec un message de confirmation et une demande de redirection
function increaseItem(newItemJSON, cartList, productReference) {
   cartList.push(newItemJSON)
   newItem = JSON.stringify(cartList)
   localStorage.setItem(productReference, newItem)
   // Message de confirmation de l'ajout du/des produit(s) au panier avec demande de redirection vers le panier ou de poursuite des achats
   let validPorduct = confirm(`Le produit "${newItemJSON.name}" de couleur "${newItemJSON.color}" a été ajouté au panier avec succès !\n
   Voulez-vous aller au panier ? (Ok) Ou continué vos achats ? (Annuler)`)
   if (validPorduct) { //* => Condition permettant la redirection ou non selon la saisie utilisateur Ok/Annuler pour "validPorduct"
      location.href = "./cart.html"
   }
}

//* Fonction qui permet de vérifier qu'une couleur et une quantité ont bien été saisie
function checkInput() {
   if (colors.value == "") { // S'il n'y a pas de couleur saisie, on envoie un message d'alerte
      alert("Veuillez choissir une couleur")
      return false
   } else if (1 > parseInt(quantity.value) || parseInt(quantity.value) > 100) { // S'il n'y a pas de quantité saisie comprise entre 1 et 100, on envoie un message d'alerte  
      alert("Veuillez choissir une quantité entre 1 et 100")
      return false
   } else { // Si aucune des deux conditions précédentes n'est vérifiées, on retourne "true"
      return true
   }
}

//* Permet d'ajouter le produit lors du clic sur l'élément HTML "<button id="addToCart">Ajouter au panier</button>"
window.onload = function () {
   let buttonAddToCart = document.getElementById("addToCart")
   buttonAddToCart.addEventListener("click", addToCart, false)
}

