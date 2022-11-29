

let cart = []

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

            const calculatePriceTotal = []

            for (product_ in jsonListProduct) {
               if (referenceId == jsonListProduct[product_]._id) {


                  let cartProductPrice = jsonListProduct[product_].price
                  // console.log("Voici le prix : " + cartProductPrice) //#########

                  // let productTotal = 0
                  // let totalPrice = 0

                  // totalsCalulated(referenceId, cartProductQuantity, cartProductPrice)
                  // const [productTotal, totalPrice] = totalsCalulated(referenceId, cartProductQuantity, cartProductPrice)
                  const [productTotal, totalPrice] = [0, 0]
                  
                  // // console.log("Voici le referenceId[product_].quantity : " + jsonListProduct[product_].quantity) //#########

                  // const productTotal = jsonListProduct[product_].quantity.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
                  //    // referenceId[product_].quantity * lot[v].price;
                  //    // referenceId[product_].quantity * jsonListProduct[product_].price;
                  //    // cartProductQuantity * cartProductPrice;

                  // console.log("Voici la quantité " + productTotal)

                  // calculatePriceTotal.push(jsonListProduct[productTotal]);

                  // const initialValue = 0
                  // // const reducer = ((accumulator, currentValue) => accumulator + currentValue, initialValue);
                  // // const totalPrice = calculatePriceTotal.reduce(reducer);
                  // const totalPrice = calculatePriceTotal.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
                  // // const totalPrice = calculatePriceTotal;

                  // console.log("Voici la quantité " + productTotal + ", pour un total de : " + totalPrice)
                  // inserTotalsHtml(productTotal, totalPrice)

                  cart.push(jsonListProduct[product_])
                  inserProductHtml(jsonListProduct[product_], referenceId, referenceColor, cartProductQuantity)
                  inserTotalsHtml(productTotal, totalPrice)
               }
            }
         }
   });

// function totalsCalulated(reference, quantity, price){
//    if (reference == reference){
//       let quantityTotal = 0
//       quantityTotal += quantity
//       console.log("Voici la quantité totale : " + quantityTotal)
//       // let reducer = (accumulator, curr) => accumulator + curr;
//       const initialValue = 0
//       let productTotal = quantityTotal.reduce(
//          (accumulator, currentValue) => accumulator + currentValue,
//          initialValue
//       )
//       // let productTotal = quantityTotal.reduce((accumulator, curr) => accumulator + curr);
//       // let productTotal = quantityTotal.reduce((accumulator, currentValue) => accumulator + currentValue, quantityTotal)
//       // let totalPrice = quantity * price.reduce((accumulator, currentValue) => accumulator + currentValue)
//       // let productTotal = quantityTotal
//       let totalPrice = quantity * price
//       console.log("Voici la quantité " + productTotal)
//       console.log("Voici le prix " + totalPrice)
//       return [productTotal, totalPrice]
//    }
// }

function inserProductHtml(cartProduct, referenceId, referenceColor, cartProductQuantity){
   const cartProductPrice = cartProductQuantity * cartProduct.price
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
               <p>${cartProductPrice + " €"}</p>
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



