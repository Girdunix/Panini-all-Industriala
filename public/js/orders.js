function expandOrder(btn,ignore = false) {
    let element = btn.parentElement.getElementsByClassName("orderWrapper")[0]
        btn = btn.getElementsByClassName("expand")[0]
    if (element.style.maxHeight != "70vh") {
        $(element).animate({
            "max-height": "70vh"
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
        if(ignore) return
        setTimeout(() => {
            btn.parentElement.parentElement.querySelector("button").parentElement.classList.toggle("is-hidden")
        }, 300);
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
        if(ignore) return
        setTimeout(() => {
            btn.parentElement.parentElement.querySelector("button").parentElement.classList.toggle("is-hidden")
        }, 150);   
    }
}

let confirmedOrdersWrapper = document.getElementById("confirmedOrders")
function confirmOrder(order){
    document.getElementById("noOrdersSaved").style.display = "none"
    let clonedNode = order.parentElement.parentElement.parentElement.cloneNode(true)
    clonedNode.querySelector(".is-success").remove()
    confirmedOrdersWrapper.appendChild(clonedNode)
    clonedNode.querySelector(".expand").click()
    clonedNode.querySelector(".orderWrapper").style.maxHeight = "0vh"
    order.parentElement.parentElement.parentElement.remove()
}
function deleteOrder(order){
    if(confirm("Sicuro di voler annullare l'ordine?")){
        order.parentElement.parentElement.parentElement.remove()
    }
}
async function initBasicOrder() {
    let order = await fetch("/data/exampleOrder.json").then(data => data.json())
    makeOrder(order)
    order = await fetch("/data/exampleOrder2.json").then(data => data.json())
    makeOrder(order)
    makeOrder(order)
}
let globalLayersBackground = ["rgb(27 25 35)","rgb(42 41 51)","white"]  //["#181a1b","#272b2d"] 
let globalLayersText = ["#e0e0e0","#4a4a4a"]
let darkModeToggled = false
document.querySelector(".navbar").style.backgroundColor = "rgb(39, 43, 45)"
function toggleDarkMode(btn){
    layersColor = globalLayersBackground
    textColor = globalLayersText
    btn.innerHTML = "☀️"
    if(darkModeToggled){
        layersColor = ["white","white","rgb(42 41 51)"]
        textColor = ["#4a4a4a","white"]
        btn.innerHTML = "🌙"
    }
    darkModeToggled = !darkModeToggled
    document.body.style.backgroundColor = layersColor[0]
    document.querySelectorAll("table").forEach((e) =>{
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".className").forEach(e =>{
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".expand").forEach(e =>{
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".box").forEach((e) =>{
        if(e.id == "confirmWrapper"){
            e.style.backgroundColor = layersColor[2]
            e.style.color = textColor[0]
            return
        }
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll("th").forEach((e) =>{
        e.style.color = textColor[0]
    })
    document.getElementById("noOrdersSaved").style.color = textColor[1]
    document.querySelector("footer").style = " background-color:"+layersColor[1]+"; color:"+textColor[0]
    document.querySelector("strong").style = "color:"+textColor[0]
    document.getElementById("confirmWrapper").querySelector(".expand").style.color = textColor[1]
    document.getElementById("confirmWrapper").querySelector(".className").style.color = textColor[1]
}
function makeOrder(order) {
    let template = document.getElementById("template").cloneNode(true)
    template.style.display = "block"
    template.querySelector(".className").innerHTML = order.class
    let classWrapper = document.getElementById("classWrapper")
    let keys = Object.keys(order.order)
    let tbody = template.querySelector("tbody")
    template.querySelector(".price").innerHTML = "Totale: "+order.price+"€"
    keys.forEach(key => {
        let row = document.createElement("tr")
        row.innerHTML = "<th>" + key.capitalize() + "</th><th></th><th></th>"
        tbody.appendChild(row)
        order.order[key].forEach(food => {
            let row = 
            '<tr onclick="selectRow(this)">'
            +'<td>-&ensp;'+food.name+'</td>'
            +'<td class="has-text-centered"></td>'
            +'<td class="has-text-right">x'+food.quantity+'</td>'
            +'</tr>'
            tbody.innerHTML +=row
        })
    })
    classWrapper.appendChild(template)
}
function selectRow(row){
    row.classList.toggle("selectedRow")
}
initBasicOrder()
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}