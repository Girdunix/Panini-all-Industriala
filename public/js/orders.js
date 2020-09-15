function expandOrder(btn) {
    let element = btn.parentElement.getElementsByClassName("order")[0]
        btn = btn.getElementsByClassName("expand")[0]
    if (element.style.maxHeight != "80vh") {
        $(element).animate({
            "max-height": "80vh"
        }, 600)
        $(btn).animate({
            borderSpacing: 90
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 200
        }, 'linear');
    } else {
        $(element).animate({
            "max-height": "0"
        }, 200)
        $(btn).animate({
            borderSpacing: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 200
        }, 'linear');
    }
}

async function initBasicOrder() {
    let order = await fetch("/data/exampleOrder2.json").then(data => data.json())
    makeOrder(order)
    makeOrder(order)

}
let globalLayersBackground = ["rgb(27 25 35)","rgb(42 41 51)"]  //["#181a1b","#272b2d"] 
let globalLayersText = ["#e0e0e0"]
let darkModeToggled = false
document.querySelector(".navbar").style.backgroundColor = "rgb(39, 43, 45)"
function toggleDarkMode(btn){
    layersColor = globalLayersBackground
    textColor = globalLayersText
    btn.innerHTML = "☀️"
    if(darkModeToggled){
        layersColor = ["white","white"]
        textColor = ["#4a4a4a"]
        btn.innerHTML = "🌙"
    }
    darkModeToggled = !darkModeToggled
    document.body.style.backgroundColor = layersColor[0]
    document.querySelectorAll(".box").forEach((e) =>{
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll("table").forEach((e) =>{
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll("th").forEach((e) =>{
        e.style.color = textColor[0]
    })
    document.querySelector("footer").style = " background-color:"+layersColor[1]+"; color:"+textColor[0]
    document.querySelector("strong").style = "color:"+textColor[0]
}
function makeOrder(order) {
    let orderWrapper = document.getElementById("orderWrapper")
    let tile = document.createElement("div")
    tile.className = "tile"
    let box = document.createElement("div")
    box.className = "box has-text-centered"
    tile.appendChild(box)
    orderWrapper.appendChild(tile)

    let classTitle = document.createElement("div")
    classTitle.className = "classTitle"
    let className = document.createElement("span")
    className.innerHTML = order.class
    let expandBtn = document.createElement("div")
    expandBtn.className = "expand"
    expandBtn.innerHTML = ">"
    classTitle.addEventListener("click", function () {
        expandOrder(this)
    })
    box.appendChild(classTitle)
    classTitle.appendChild(className)
    classTitle.appendChild(expandBtn)

    let innerOrder = document.createElement("div")
    innerOrder.className = "order collapse"
    let table = document.createElement("table")
    table.className = "table has-text-left"
    let tbody = document.createElement("tbody")
    let keys = Object.keys(order.order)
    keys.forEach(key => {
        let row = document.createElement("tr")
        row.innerHTML = "<th>" + key.capitalize() + "</th><th></th><th></th>"
        tbody.appendChild(row)
        order.order[key].forEach(food => {
            let row = document.createElement("tr")
            row.addEventListener("click",function(){
                this.classList.toggle("selectRow") 
            })
            let name = document.createElement("td")
            name.innerHTML = food.name
            name.style = "width: 100%;"
            let space = document.createElement("td")
            space.className = "has-text-centered"
            let quantity = document.createElement("td")
            quantity.className = "has-text-right"
            quantity.innerHTML = "x" + food.quantity
            row.append(name, space, quantity)
            tbody.appendChild(row)
        })
    })
    let tfoot = document.createElement("tfoot")
    footRow = document.createElement("tr")
    let space = document.createElement("th")
    let space2 = document.createElement("th")
    let price = document.createElement("th")
    price.innerText = "Totale: " + order.price + "€"
    price.style = "width: 100%; white-space:nowrap;"
    price.className = "has-text-right"
    console.log(order)
    footRow.append(space, space2, price)
    tfoot.appendChild(footRow)
    box.appendChild(innerOrder)
    let buttonsWrapper = document.createElement("div")
    buttonsWrapper.className = "buttonsWrapper"
    let accept = document.createElement("button")
    accept.className = "accept"
    accept.innerHTML = "Conferma"
    let deny = document.createElement("button")
    deny.className = "deny"
    deny.innerHTML = "Annulla"
    buttonsWrapper.append(accept,deny)
    innerOrder.appendChild(table)
    innerOrder.appendChild(buttonsWrapper)  
    table.appendChild(tbody)
    table.appendChild(tfoot)
}
initBasicOrder()
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}