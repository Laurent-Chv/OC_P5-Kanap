//? --------------------------
//? ----- Insérer les produits dans la page d’Accueil de manière dynamique
//? --------------------------

//* ----- Création d'une classe produit qui contient un constructeur de produits au format JSON (format backend)
//* ----- Le constructeur assigne toutes les propriétés du backend à chaque objet produit
class Product {
   constructor(jsonProduct) {
      jsonProduct && Object.assign(this, jsonProduct);
   }
};

//* ----- Cette classe met les produits sous forme de liste de produits
class ProductManager {
   constructor(listProduct) {
      this.listProduct = listProduct;
   }
};

//* ----- Gestion de l'affichage dynamique des produits sur la page d'Accueil
// ----- On requête le serveur afin de récupérer la liste des produits qui y sont enregistrés
fetch("http://localhost:3000/api/products")
   .then(data => data.json())
   .then(jsonListProduct => {
      for (let jsonProduct of jsonListProduct) {
         // ----- Pour chaque produit on crée donc avec notre classe "Product", un objet produit
         let product = new Product(jsonProduct);
         // ----- On va afficher les données sur notre page index.html en faisant des interpolations de variables 
         document.querySelector(".items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                                  <article>
                                                                     <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                     <h3 class="productName">${product.name}</h3>
                                                                     <p class="productDescription">${product.description}</p>
                                                                  </article>
                                                               </a>
                                                               `;
      }
   });

