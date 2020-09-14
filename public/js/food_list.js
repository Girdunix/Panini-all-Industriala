if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/public/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg)
      })
  })
}

let selectedType = "Pizze"
function toggleSelect(toShow) {
  document.getElementById("typeWrapper").style.display = "block"
  document.getElementById("currentType").innerText = toShow.innerHTML
  selectedType = toShow.innerHTML
  let select = document.getElementsByClassName("selHide")
  Array.from(select).forEach(select => {
    select.style.display = "none"
  })
  toShow = "select" + toShow.innerHTML
  document.getElementById(toShow).style.display = "block"
}

function addToCart(){
  let type = selectedType.replace("select","")
  let select = document.getElementById("select"+selectedType)
  let food = select.options[select.selectedIndex].value
  let quantity = parseInt(document.getElementById("quantity").value)
  document.getElementById("quantity").value = 1
  let globalFood = globalMenu[type].find(foodName => {
    return foodName.name == food 
  })
  let description = globalFood.description
  let price = globalFood.price
  let id = globalFood.id
  let foodObj = new Food(type.toLowerCase(),food, description,quantity, price, id)
  globalOrder.addFood(foodObj)
  renderCart()
}
let globalMenu = {}
async function initializeFood() {
  let menu = await fetch("/data/menu.json").then(data => data.json())
  globalMenu = menu
  let keys = Object.keys(menu)
  for (let i = 0; i < keys.length; i++) {
    let foodType = document.getElementById("select" + keys[i])
    for (let j = 0; j < menu[keys[i]].length; j++) {
      let option = document.createElement("option")
      option.value = menu[keys[i]][j].name
      option.innerHTML = menu[keys[i]][j].name
      foodType.appendChild(option)
    }
  }
}
function renderCart(){
  let order = globalOrder.order
  Object.keys(order).forEach(type => {
    let cartWrapper = document.getElementById("cart"+type.capitalize())
    cartWrapper.innerHTML = ""
    order[type].forEach(food => {
      let element = document.createElement("div")
      element.innerHTML += food.name + " x " + food.quantity
      cartWrapper.appendChild(element)
    })
  })
}
function toggleCart(){
  let cart = document.getElementById("cart")
  cart.classList.toggle("invisible")
}
initializeFood()
class Order {
  constructor() {
    this.price = 0
    this.date = Date.now()
    this.order = {
      pizze: [],
      panini: [],
      dolci: []
    }

    this.addFood = function(food){
      let isSaved = this.order[food.type].findIndex((savedFood) =>{
        return savedFood.name == food.name
      })
      if(isSaved !== -1){
        this.order[food.type][isSaved].quantity += food.quantity
      }else{
        this.order[food.type].push(food)
      }
      this.price += food.price * food.quantity
    }

    this.increaseQuantity = function(type,name){
      let index = this.order[type].findIndex((savedFood) =>{
        return savedFood.name == name
      })
      this.order[type][index].quantity += 1
      this.price += this.order[type][index].price
    }

    this.reduceQuantity = function(type,name){
      let index = this.order[type].findIndex((savedFood) =>{
        return savedFood.name == name
      })
      this.order[type][index].quantity -= 1
      this.price -= this.order[type][index].price
      if(this.order[type][index].quantity < 1){
        this.order[type].splice(index, 1)
      }
    }
    this.deleteFood = function(type,name){
      let index = this.order[type].findIndex((savedFood) =>{
        return savedFood.name == name
      })
      if(index !== -1){
        let price = this.order[type][index].quantity * this.order[type][index].price
        this.order[type].splice(index, 1)
        this.price -= price
      }
    }
  }

}

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
const globalOrder = new Order()
String.prototype.capitalize = function(){return this.charAt(0).toUpperCase() + this.slice(1)}