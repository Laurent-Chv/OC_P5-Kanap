//TODO ****************** Gestion de la page d'accueil ******************

//? ************************************
//? Insérer les produits dans la page d’Accueil de manière dynamique
//? ************************************

//* Création d'une classe produit qui contient un constructeur qui assigne toutes les propriétés de produits au format JSON (format backend)
class Product {
   constructor(jsonProduct) {
      jsonProduct && Object.assign(this, jsonProduct)
   }
}

//* Cette classe gère les produits sous forme d'objet
class ProductManager {
   constructor(listProduct) {
      this.listProduct = listProduct
   }
}

//* Gestion de l'affichage dynamique des produits sur la page d'Accueil via une requête du serveur
fetch("http://localhost:3000/api/products")
   .then(data => data.json())
   .then(jsonListProduct => {
      for (let jsonProduct of jsonListProduct) {
         let product = new Product(jsonProduct)
         document.querySelector(".items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                                  <article>
                                                                     <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                     <h3 class="productName">${product.name}</h3>
                                                                     <p class="productDescription">${product.description}</p>
                                                                  </article>
                                                               </a>
                                                               `
      }
   })

