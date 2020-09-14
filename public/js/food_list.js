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

class Ordine {
  constructor() {
    this.price = 0
    this.date = 0,
      this.order = {
        pizze: [],
        panini: [],
        dolci: []
      }
  }
}

class Cibo {
  constructor(name, description, quantity, price, id) {
    this.name = name
    this.description = description
    this.quantity = quantity
    this.price = price
    this.id = id
  }
}