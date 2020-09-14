if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/public/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg)
      })
  })
}

function toggleSelect(toShow) {
  let select = document.getElementsByClassName("selHide")
  Array.from(select).forEach(select => {
    select.style.display = "none"
  })
  toShow = "select" + toShow.innerHTML
  document.getElementById(toShow).style.display = "block"
}

async function initializeFood() {
  let menu = await fetch("/data/menu.json").then(data => data.json())
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
let order = new Order()
function addOrder(){
  let food = new Food("pizze","Margherita","Pomodoro e mozzarella",2,1,2)
  let food2 = new Food("pizze","Marinara","Pomodoro e origano",1,1,2)
  let food3 = new Food("pizze","Margherita","Pomodoro e mozzarella",2,1,2)
  order.addFood(food)
  order.addFood(food3)
  order.addFood(food2)
  order.increaseQuantity("pizze","Margherita")
  order.reduceQuantity("pizze","Margherita")
  order.deleteFood("pizze","Marinara")
  console.log(order)
}
addOrder()