// alert("Test")

// --------------------------
// 
// --------------------------
class Produit{
   constructor(jsonProduit){
       jsonProduit && Object.assign(this, jsonProduit);
   }
};


class ProduitManager{
   constructor(listProduit){
       this.listProduit = listProduit;
       return this.listProduit((a, b));
   }
};

fetch("http://localhost:3000/api/products")
   .then(data => data.json())
   .then(jsonListProduit => {
      for (let jsonProduit of jsonListProduit) {
            let produit = new Produit(jsonProduit);
            document.querySelector(".items").innerHTML += `<a href="./product.html?id=${produit._id}">
                                                                  <article>
                                                                     <img src="${produit.imageUrl}" alt="${produit.altTxt}">
                                                                     <h3 class="productName">${produit.name}</h3>
                                                                     <p class="productDescription">${produit.description}</p>
                                                                  </article>
                                                               </a>
                                                               `;
      }
});