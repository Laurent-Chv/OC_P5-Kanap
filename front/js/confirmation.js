//TODO ****************** Gestion de la page de confirmation ******************

//? ************************************
//? Récupérer et afficher le numéro de commande
//? ************************************

//* Permet de récupérer le numéro de commande à afficher sur la page depuis l'URL
var url = new URL(window.location)
var search_params = new URLSearchParams(url.search)

if (search_params.has('id')) { // Condition permettant de chercher s'il y a "id" dans l'URL et si tel est le cas, d'afficher la valeur de celui-ci (le numéro de commande) sur la page 
   orderId.innerHTML = search_params.get('id')
}

