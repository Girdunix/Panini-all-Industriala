if ('serviceWorker' in navigator) {
    //service worker per rendere il sito installabile come app
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg)
            })
    })
}

function expandOrder(btn, ignore = false) {
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
        if (ignore) return
        setTimeout(() => {
            btn.parentElement.parentElement.querySelector("button").parentElement.style.display = "block"
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
        if (ignore) return
        setTimeout(() => {
            btn.parentElement.parentElement.querySelector("button").parentElement.style.display = "none"
        }, 150);
    }
}

//-----------------------------------------------------------------------------//

let confirmedOrdersWrapper = document.getElementById("confirmedOrders")

function confirmOrder(order) {
    document.getElementById("noOrdersSaved").style.display = "none"
    let clonedNode = order.parentElement.parentElement.parentElement.cloneNode(true)
    clonedNode.querySelector(".is-success").remove()
    confirmedOrdersWrapper.appendChild(clonedNode)
    clonedNode.querySelector(".expand").click()
    clonedNode.querySelector(".orderWrapper").style.maxHeight = "0vh"
    order.parentElement.parentElement.parentElement.remove()
}

//-----------------------------------------------------------------------------//

function deleteOrder(order) {
    if (confirm("Sicuro di voler annullare l'ordine?")) {
        let request = new XMLHttpRequest();
        request.open("POST", "/removeOrder");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        request.onload = (res) => {
            let response = JSON.parse(res.target.response)
            if (response.sent) {
                order.parentElement.parentElement.parentElement.remove()
            } else {
                //showError("Errore!",2000)
                console.log(response.message)
            }
        };
        request.onerror = function (e) {
            console.log(e)
        };
        let name = order.parentElement.parentElement.parentElement.querySelector(".className").innerHTML
        request.send(JSON.stringify({
            password: "test",
            username: "master",
            name: name
        }))
    }
}

//-----------------------------------------------------------------------------//

async function initPage() {
    let request = new XMLHttpRequest();
    request.open("POST", "/getOrders");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
        let response = JSON.parse(res.target.response)
        if (response.sent) {
            response.message.forEach(order => {
                makeOrder(order)
            })
        } else {
            showError(response.message, 2000)
        }
    };
    request.onerror = function (e) {
        console.log(e)
    };
    if (globalCredentials === false) {
        showError("Non sei loggato!", 2000)
    } else {
        request.send(JSON.stringify(globalCredentials))
    }

}

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
//-----------------------------------------------------------------------------//

let globalLayersBackground = ["rgb(27 25 35)", "rgb(42 41 51)", "white"] //["#181a1b","#272b2d"]
let globalLayersText = ["#e0e0e0", "#4a4a4a"]
let darkModeToggled = false
document.querySelector(".navbar").style.backgroundColor = "rgb(39, 43, 45)"

function toggleDarkMode(btn) {
    layersColor = globalLayersBackground
    textColor = globalLayersText
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        layersColor = ["white", "white", "rgb(42 41 51)"]
        textColor = ["#4a4a4a", "white"]
        btn.innerHTML = "🌙"
    }
    darkModeToggled = !darkModeToggled
    document.body.style.backgroundColor = layersColor[0]
    document.querySelectorAll("table").forEach((e) => {
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".className").forEach(e => {
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".expand").forEach(e => {
        e.style.color = textColor[0]
    })
    document.querySelectorAll(".box").forEach((e) => {
        if (e.id == "confirmWrapper") {
            e.style.backgroundColor = layersColor[2]
            e.style.color = textColor[0]
            return
        }
        e.style.backgroundColor = layersColor[1]
        e.style.color = textColor[0]
    })
    document.querySelectorAll("th").forEach((e) => {
        e.style.color = textColor[0]
    })
    document.getElementById("noOrdersSaved").style.color = textColor[1]
    document.querySelector("footer").style = " background-color:" + layersColor[1] + "; color:" + textColor[0]
    document.querySelector("strong").style = "color:" + textColor[0]
    document.getElementById("confirmWrapper").querySelector(".expand").style.color = textColor[1]
    document.getElementById("confirmWrapper").querySelector(".className").style.color = textColor[1]
}

//-----------------------------------------------------------------------------//

function makeOrder(order) {
    let template = document.getElementById("template").cloneNode(true)
    template.style.display = "block"
    template.querySelector(".className").innerHTML = order.class
    let classWrapper = document.getElementById("classWrapper")
    let keys = Object.keys(order.order)
    let tbody = template.querySelector("tbody")
    template.querySelector(".price").innerHTML = "Totale: " + order.price.toFixed(2) + "€"
    keys.forEach(key => {
        let row = document.createElement("tr")
        row.innerHTML = "<th>" + key.capitalize() + "</th><th></th><th></th>"
        tbody.appendChild(row)
        order.order[key].forEach(food => {
            let row =
                '<tr onclick="selectRow(this)">' +
                '<td colspan="2">-&ensp;' + food.name + '</td>' +
                '<td class="has-text-right">x' + food.quantity + '</td>' +
                '</tr>'
            tbody.innerHTML += row
        })
    })
    classWrapper.appendChild(template)
}

//-----------------------------------------------------------------------------//

function selectRow(row) {
    row.classList.toggle("selectedRow")
}

//-----------------------------------------------------------------------------//
let globalCredentials = localStorage.getItem("credentials")
if (globalCredentials == null) {
    globalCredentials = false
} else {
    globalCredentials = JSON.parse(globalCredentials)
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
HTMLElement.prototype.fadeIn = function () {
    this.style.animation = "fadeIn 0.2s"
}
HTMLElement.prototype.fadeOut = function () {
    this.style.animation = "fadeOut 0.2s"
}
initPage()