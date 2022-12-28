//? --------------------------
//? ----- Récupérer l’ID du produit à afficher
//? --------------------------

//* ----- Permet de comprendre quel produit afficher sur la page Produit parmi ceux préssent dans l'API
var url = new URL(window.location)
var search_params = new URLSearchParams(url.search)
if (search_params.has('id')) {
   var productId = search_params.get('id')
}

//? --------------------------
//? ----- Insérer le produit et ses détails dans la page Produit
//? --------------------------

//* ----- Gestion de l'affichage dynamique des produits sur la page Produit
// ----- On requête le serveur afin de récupérer le produit selon son ID
fetch("http://localhost:3000/api/products/" + productId)
   .then(data => data.json())
   .then(jsonListProduct => {
      // ----- On va afficher les données sur notre page product.html en faisant des interpolations de variables 
      document.querySelector(".item__img").innerHTML =
         `<img src="${jsonListProduct.imageUrl}" alt="${jsonListProduct.imageUrl}">`
      title.innerHTML = jsonListProduct.name
      price.innerHTML = jsonListProduct.price
      description.innerHTML = jsonListProduct.description
      // ----- Permert de gérer l'affichage des différentes couleurs d'un produit en faisant une boucle sur la liste de données dans "colors"
      for (let color of jsonListProduct.colors) {
         colors.innerHTML +=
            `<option value="${color}">${color}</option>`
      }
   })

//? --------------------------
//? ----- Ajouter des produits dans le panier
//? --------------------------

//* ----- Fonction qui permet de créer la fiche du produit à ajouter au panier selon une clé de référence (ID + couleur)
function addToCart() {
   let cartList = []
   let productQuantity = document.getElementById("quantity") // => Récupère la quantité saisie dans une variable
   let productColorsList = document.getElementById("colors") // => Récupère la couleur saisie dans une variable
   let productReference = `${productId}` + "_" + `${colors.value}` // => Création d'une clé de référence du produit selon son ID et la couleur sélectionnée
   let newItemJSON = { // => Création d'un nouvel élément de type array avec les informations nécessaire du produit
      reference: productReference,
      id: productId,
      name: document.querySelector("#title").innerHTML,
      quantity: productQuantity.value,
      color: productColorsList.value,
   }

   let newProductQuantity = newItemJSON.quantity /* => Création d'une variable qui retourne la quantité actuellement saisie.
   Cela permettra par la suite d'actualiser la quantité du produit avec cette nouvelle quantité si celui-ci était déjà présent dans le panier selon sa référence (ID + couleur)*/

   if (checkInput()) { // => Si la fonction "checkInput()" est vraie, alors on entre dans la condition
      //* ----- Condition qui permet d'ajouter le produit selon si celui-ci existe déjà dans le panier en fonction de sa référence (ID + couleur)
      if (localStorage.getItem(productReference)) {// => Si le produit existe déjà dans le panier selon sa réf (ID + couleur) 
         let currentProduct = JSON.parse(localStorage.getItem(productReference)) // => On récuppère la clé de référence (ID + couleur) du produit saisie
         let currentProductQuantity = currentProduct[0].quantity // => On récuppère la quantité du produit déjà dans le panier
         let productQuantityAdded = parseInt(currentProductQuantity) + parseInt(newProductQuantity) // => On crée une variable qui additionne la quantité déjà dans le panier avec celle actuellement saisie
         newItemJSON = { // => Mise à jour de la nouvelle quantité du produit
            reference: productReference,
            id: productId,
            name: document.querySelector("#title").innerHTML,
            quantity: productQuantityAdded,
            color: productColorsList.value
         }
         increaseItem(newItemJSON, cartList, productReference) // => On actualise le produit déjà dans le panier
      } else { // => Si le produit n'existe pas encore dans le panier selon sa réf (ID + couleur) 
         increaseItem(newItemJSON, cartList, productReference) // => On ajoute le nouveau produit au panier
      }
   }
}

//* ----- Fonction qui permet d'ajouter un produit au panier avec message de confirmation
function increaseItem(newItemJSON, cartList, productReference){
   cartList.push(newItemJSON) // => On ajoute à notre liste panier le nouveau produit au format JSON
   newItem = JSON.stringify(cartList) // => On transforme notre nouveau produit au format String
   localStorage.setItem(productReference, newItem) // => On ajoute notre nouveau produit au localstorage avec sa référence (ID + couleur) afin de pouvoir y accéder depuis la page Panier
   // Message de confirmation de l'ajout du/des produit(s) au panier avec demande de redirection vers le panier ou de poursuite des achats
   let validPorduct = confirm(`Le produit "${newItemJSON.name}" de couleur "${newItemJSON.color}" a été ajouté au panier avec succès !\n
   Voulez-vous aller au panier ? (Ok) Ou continué vos achats ? (Annuler)`)
   if(validPorduct){ //* => Condition permettant la redirection ou non selon la saisie utilisateur pour "validPorduct"
      location.href="./cart.html"
   }
}

//* ----- Fonction qui permet de vérifier la saisie d'une couleur et dune quantité
function checkInput(){
   // console.log(1 > parseInt(quantity.value))
   if(colors.value == ""){ //* => S'il n'y a pas de couleur saisie
      alert("Veuillez choisisr une couleur") // Message d'alerte couleur
      return false // => Retourne faux pour être réutiliser dans une autre condition
   } else if (1 > parseInt(quantity.value) || parseInt(quantity.value) > 100){ //* => S'il n'y a pas de quantité saisie comprise entre 1 et 100
      alert("Veuillez choisisr une quantité entre 1 et 100")  // Message d'alerte quantité
      return false  // => Retourne faux pour être réutiliser dans une autre condition
   } else {
      return true  // => Retourne vrai pour accédé à une autre condition
   }
}

window.onload = function () {
   let buttonAddToCart = document.getElementById("addToCart")
   buttonAddToCart.addEventListener("click", addToCart, false)
}

