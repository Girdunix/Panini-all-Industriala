/*
  MIT License

Copyright (c) 2020, the respective contributors, as shown by the AUTHORS file. 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
if ('serviceWorker' in navigator) {
  //service worker per rendere il sito installabile come app
  window.addEventListener('load', () => {
    return //da rimuovere in production
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg)
      })
  })
}

//------------------------------------------------------------------------------------------//

let selectedType = "Pizze"

function toggleSelect(toShow) {
  document.getElementById("addToCart").disabled = true
  //Una funzione che mostra il tipo di cibo selezionato, toShow è il pulsate "pizze, panini, dolci"
  document.getElementById("typeWrapper").style.display = "block"
  //document.getElementById("currentType").innerText = toShow.innerHTML
  selectedType = toShow.innerHTML
  let select = document.getElementsByClassName("selHide")
  //prende tutti gli elementi che hanno come classe selHide e li rende invisibili
  Array.from(select).forEach(select => {
    select.style.display = "none"
  })
  toShow.parentElement.querySelectorAll("*").forEach(button => {
    button.style.backgroundColor = "transparent"
    button.style.color = "#f14668"
  })
  document.getElementById("quantity").innerHTML = "1"
  toShow.style.backgroundColor = "#f14668"
  toShow.style.color = "white"
  //rende visibile il select selezionato
  toShow = "select" + toShow.innerHTML
  document.getElementById(toShow).style.display = "block"
  document.getElementById(toShow).selectedIndex = 0
}

//------------------------------------------------------------------------------------------//

function changeNum(num) {
  num = parseInt(document.getElementById("quantity").innerHTML) + num
  if (num > 0) {
    document.getElementById("quantity").innerHTML = num
  }
}

function addToCart() {
  document.getElementById("addToCart").disabled = true
  let type = selectedType.replace("select", "")
  let select = document.getElementById("select" + selectedType)
  let food = select.options[select.selectedIndex].value
  let quantity = parseInt(document.getElementById("quantity").innerHTML)
  document.getElementById("quantity").innerHTML = 1
  //trova i dettagli del cibo all'interno dell'ogggetto menu preso dal json
  let globalFood = globalMenu[type].find(foodName => {
    return foodName.name == food
  })
  let description = globalFood.description
  let price = globalFood.price
  let id = globalFood.id
  //crea un nuovo oggetto Food e lo aggiunge al carrello
  let foodObj = new Food(type.toLowerCase(), food, description, quantity, price, id)
  globalOrder.addFood(foodObj)
  renderCart()
  showError("Aggiunto al carrello!", 2000)
  document.getElementById("select" + selectedType).selectedIndex = 0
}

document.querySelector("#cart").addEventListener("click",function(e){
  e.stopImmediatePropagation()
  e.preventDefault()
})
document.querySelector(".contentWrapper").addEventListener("click",function(){
  hideCart()
})
function hideCart() {
  document.getElementById("cart").classList.add("invisible")
}
//------------------------------------------------------------------------------------------//

let globalMenu = {}
async function initializeFood() {
  //Fetcha il json menu.json che contiene tutti i dettagli del menu
  let menu = await fetch("/data/menu.json").then(data => data.json())
  globalMenu = menu
  let keys = Object.keys(menu)
  //itera nell'oggetto e crea le opzioni per i tipi di cibo e le aggiunge al select
  //keys sono i nomi delle proprietà dell'oggetto, cioè pizze panini dolci
  for (let i = 0; i < keys.length; i++) {
    let foodType = document.getElementById("select" + keys[i])
    let option = document.createElement("option")
    option.value = "Seleziona"
    option.innerHTML = "Seleziona"
    option.selected = true
    option.disabled = true
    foodType.appendChild(option)
    for (let j = 0; j < menu[keys[i]].length; j++) {
      let option = document.createElement("option")
      option.value = menu[keys[i]][j].name
      option.innerHTML = menu[keys[i]][j].name
      foodType.appendChild(option)
    }
  }
}

//------------------------------------------------------------------------------------------//

function changeQuantity(amount, food, type) {
  if (amount === 1) {
    globalOrder.increaseQuantity(type, food)
  } else {
    globalOrder.reduceQuantity(type, food)
  }
  renderCart()
}

function renderCart() {
  let order = globalOrder.order
  //prende ogni proprietà nell'oggetto ordine e li aggiunge alla div del tipo corretto nel carrello
  let cart = document.getElementById("cartTable")
  let cartWrapper = cart.parentElement.parentElement.parentElement.parentElement
  cartWrapper.classList.add("invisible")
  document.getElementById("cartPrice").innerHTML = "Totale: " + globalOrder.price.toFixed(2) + "€"
  document.getElementById("cartText").innerHTML = "Il carrello è vuoto!"
  cart.innerHTML = ""
  Object.keys(order).forEach(type => {
    let row = document.createElement("tr")
    row.className = "foodType"
      row.innerHTML = "<th>" + type.capitalize() + "</th><th></th><th></th>"
    if (order[type].length > 0) cart.append(row)
    order[type].forEach(food => {
      document.getElementById("cartText").innerHTML = "Il tuo ordine:"
      let innerRow = document.createElement("tr")
      cartWrapper.classList.remove("invisible")
      innerRow.className = "underlined"
      innerRow.innerHTML =
        '<tr>' +
        '<td colspan="2">' + food.name + '</td>' +
        '<td class="has-text-right quantityRow">x' + food.quantity + "&ensp;" +
        `<button class="minusBtn" onclick="changeQuantity(-1,'` + food.name + `','` + type + `')">-</button>` +
        `<button class="plusBtn" onclick="changeQuantity(1,'` + food.name + `','` + type + `')">+</button>` +
        '</tr>'
      cart.append(innerRow)
      if(darkModeToggled){
        cart.querySelectorAll("*").forEach(e =>{
          if(e.tagName == "BUTTON") return
          e.classList.add("darkModeLayer1")
        })
      }
    })
  })
}

//------------------------------------------------------------------------------------------//

function toggleCart() {
  let cart = document.getElementById("cart")
  cart.classList.toggle("invisible")
}

//------------------------------------------------------------------------------------------//

function enableAddToCart() {
  document.getElementById("addToCart").disabled = false
}

//------------------------------------------------------------------------------------------//
let darkModeToggled = false
function toggleDarkMode(btn) {
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        btn.innerHTML = "🌙"
    }
    $(btn).toggleClass("whiteMode")
    $(".is-footer").toggleClass("darkModeLayer1")
    $("body").toggleClass("darkMode")
    $("html").toggleClass("darkMode")
    $("tr").toggleClass("darkModeLayer1")
    $("th").toggleClass("darkModeLayer1")
    $("td").toggleClass("darkModeLayer1")
    $(".is-receipt").toggleClass("darkModeLayer1")
    $("table").toggleClass("darkModeLayer1")
    $(".className").toggleClass("darkModeLayer1") 
    $(".expand").toggleClass("darkModeLayer1")
    $("#confirmWrapper").toggleClass("whiteMode")
    $(".box").toggleClass("darkModeLayer1")
    $("#navMenu").toggleClass("darkModeLayer1")
    $("#navMenu *").toggleClass("darkModeLayer1")
    $("strong").toggleClass("darkModeLayer1")
    $(".navbar").toggleClass("darkModeLayer1")
    $(".nav-btn").toggleClass("darkModeLayer1")
    $(".foodType").toggleClass("foodTypeDark")
    $("td button").removeClass("darkModeLayer1")
    $(".cartPortrait").removeClass("darkModeLayer1")
    $("select").toggleClass("darkModeLayer2")
    darkModeToggled = !darkModeToggled
    localStorage.setItem("darkMode", darkModeToggled)
}
if(localStorage.getItem("darkMode") == "true"){
  toggleDarkMode(document.getElementById("darkModeBtn"))
}

function placeOrder() {

  let dataStr = "data:text/json;charset=utf-8,"
  dataStr += encodeURIComponent(JSON.stringify(globalOrder));
  let dlAnchorElem = document.createElement("a")
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "order.json");
  //dlAnchorElem.click(); //per scaricare
  dlAnchorElem.remove()
  let request = new XMLHttpRequest();
  request.open("POST", "/placeOrder");
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
  request.onload = (res) => {
    let response = JSON.parse(res.target.response)
    if (response.sent) {
      showError(response.message, 2000)
      globalOrder = new Order()
      renderCart()
    } else {
      showError(response.message, 2000)
    }
  };
  request.onerror = function (e) {
    console.log(e)
  };
  globalOrder.class = globalCredentials.username
  let orderToSend = {
    order: globalOrder,
    credentials: globalCredentials
  }
  request.send(JSON.stringify(orderToSend))
}
class Order {
  //Classe per l'ordine
  constructor() {
    this.price = 0
    this.class = ""
    this.date = Date.now()
    this.order = {
      pizze: [],
      panini: [],
      dolci: []
    }

    this.addFood = function (food) {
      //aggiunge un cibo alla lista, controlla se esiste già, se esiste incrementa solo la quantità
      let isSaved = this.order[food.type].findIndex((savedFood) => {
        return savedFood.name == food.name
      })
      //la funzione findIndex trova l'indice dell'elemento, se è -1 vuol dire che non è presente
      if (isSaved !== -1) {
        this.order[food.type][isSaved].quantity += food.quantity
      } else {
        this.order[food.type].push(food)
      }
      this.price += food.price * food.quantity
    }

    this.increaseQuantity = function (type, name) {
      //trova l'indice del cibo selezionato e ne incrementa la quantità
      let index = this.order[type].findIndex((savedFood) => {
        return savedFood.name == name
      })
      this.order[type][index].quantity += 1
      this.price += this.order[type][index].price
    }

    this.reduceQuantity = function (type, name) {
      //trova l'indice del cibo selezionato e ne decrementa la quantità
      let index = this.order[type].findIndex((savedFood) => {
        return savedFood.name == name
      })
      this.order[type][index].quantity -= 1
      this.price -= this.order[type][index].price
      if (this.order[type][index].quantity < 1) {
        this.order[type].splice(index, 1)
      }
    }
    this.deleteFood = function (type, name) {
      //trova l'indice del cibo selezionato e lo elimina
      let index = this.order[type].findIndex((savedFood) => {
        return savedFood.name == name
      })
      if (index !== -1) {
        let price = this.order[type][index].quantity * this.order[type][index].price
        this.order[type].splice(index, 1)
        this.price -= price
      }
    }
  }

}

//------------------------------------------------------------------------------------------//

class Food {
  constructor(type, name, description, quantity, price, id) {
    this.type = type
    this.name = name
    this.description = description
    this.quantity = quantity
    this.price = price
    this.id = id
  }
}

//------------------------------------------------------------------------------------------//

function showError(message, timeout) {
  //funzione che mostra un messaggio di errore fluttuante 
  let floatingMessage = document.getElementById("floatingMessage")
  floatingMessage.innerHTML = message
  if (floatingMessage.style.display == "flex") return
  floatingMessage.style.display = "flex"
  floatingMessage.fadeIn()
  setTimeout(() => {
    floatingMessage.fadeOut()
    setTimeout(() => {
      floatingMessage.style.display = "none"
    }, 200);
  }, timeout);
}

//------------------------------------------------------------------------------------------//
let globalOrder = new Order()
//funzione per capitalizzare una stringa, da ciao a Ciao
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
HTMLElement.prototype.fadeIn = function () {
  this.style.animation = "fadeIn 0.2s"
}
HTMLElement.prototype.fadeOut = function () {
  this.style.animation = "fadeOut 0.2s"
}
initializeFood()
let globalCredentials = localStorage.getItem("credentials")
if (globalCredentials == null) {
  globalCredentials = false
  document.getElementById("classNamePage").innerHTML = "Non loggato"
} else {
  globalCredentials = JSON.parse(globalCredentials)
  document.getElementById("classNamePage").innerHTML = globalCredentials.username
}

if (globalCredentials.username != "Paninaro") document.getElementById("showOrders").style.display = "none"