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
        navigator.serviceWorker.register('../service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg)
            })
    })
}

function expandOrder(btn, ignore = false) {
    let element = btn.parentElement.getElementsByClassName("orderWrapper")[0]
    btn = btn.getElementsByClassName("expand")[0]
    let expandHeight = "70vh"
        //se è su pc, usare una max width minore così da non riempire lo schermo
    if (screen.width > screen.height) {
        expandHeight = "60vh"
    }
        //se non è stato aperto, esegui animazione e ruota il pulsante
        let height = element.getBoundingClientRect().y
    if (element.style.maxHeight == "0vh") {
        $(element).animate({
            "max-height": height
        }, 300)
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
        //se è su mobile, esegui un animazione per scrollare fino all'elemento se su mobile
        if (screen.width < screen.height) {
            setTimeout(() => {
                goToElement(element)
            }, 200);
        }
        if (ignore) return
        //una volta che l'animazione è finita, mostra i pulsanti per conferma/annulla
        setTimeout(() => {
            btn.parentElement.parentElement.querySelector("button").parentElement.style.display = "block"
        }, 200);
    } else {
        $(element).animate({
            "max-height": "0vh"
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
    //muove l'ordine confermato nella sezione di ordini confermati
    document.getElementById("noOrdersSaved").style.display = "none"
    let clonedNode = order.parentElement.parentElement.parentElement.cloneNode(true)
    clonedNode.style.padding = 0
    clonedNode.style.marginTop = "1rem"
    //elimina il vecchio elemento
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
        request.open("POST", "../php/removeOrder.php");
        //invia una richiesta post per l'eliminazione di un ordine
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        request.onload = (res) => {
            let response = JSON.parse(res.target.response)
            if (response.sent) {
                order.parentElement.parentElement.parentElement.remove()
                showError(response.message, 2000)
            } else {
                showError(response.message, 2000)
            }
        };
        request.onerror = function (e) {
            console.log(e)
        };
        let name = order.parentElement.parentElement.parentElement.querySelector(".className").innerHTML
        request.send(JSON.stringify({
            password: globalCredentials.password,
            username: globalCredentials.username,
            name: name
        }))
    }
}

//-----------------------------------------------------------------------------//

async function initPage() {
    //render della pagina, aggiungendo gli ordini ricevuti dal server
    let request = new XMLHttpRequest();
    request.open("POST", "../php/getOrders.php");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
        let response = JSON.parse(res.target.response)
        if (response.sent) {
            //render di ogni ordine ricevuto dal server
            response.message.forEach(order => {
                makeOrder(order)
            })
        } else {
            showError(response.message, 2000)
        }
        if(localStorage.getItem("darkMode") == "true"){
            toggleDarkMode(document.getElementById("darkModeBtn"))
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

let darkModeToggled = false
function toggleDarkMode(btn) {
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        btn.innerHTML = "🌙"
    }
    $(".is-footer").toggleClass("darkModeLayer1")

    $("tr").toggleClass("darkModeLayer1")
    $("body").toggleClass("darkMode")
    $("html").toggleClass("darkMode")
    $("tr").toggleClass("darkModeLayer1")
    $("th").toggleClass("darkModeLayer1")
    $(".is-receipt").toggleClass("darkModeLayer1")
    $("table").toggleClass("darkModeLayer1")
    $(".className").toggleClass("darkModeLayer1") 
    $(".expand").toggleClass("darkModeLayer1")
    $("#confirmWrapper").toggleClass("whiteMode")
    document.getElementById("confirmWrapper").querySelector(".className").classList.toggle("whiteMode")
    document.getElementById("confirmWrapper").querySelector(".expand").classList.toggle("whiteMode")
    $("#footer *").toggleClass("darkModeLayer1")
    $("#navMenu").toggleClass("darkModeLayer1")
    $("#navMenu *").toggleClass("darkModeLayer1")
    $("#navMenu a").removeClass("darkModeLayer1")
    if(darkModeToggled){
        $("#navMenu a").css({"color":""}) 
    }else{
        $("#navMenu a").css({"color":"white"})
    }

    $(".navbar").toggleClass("darkModeLayer1")
    darkModeToggled = !darkModeToggled
    localStorage.setItem("darkMode", darkModeToggled)
}

function goToElement(element, scroll = 0.9) {
    //function to scroll the body to a selected element, scroll is the offset
    element = element.parentElement.parentElement
    $("body,html").animate({
        scrollTop: $(element).offset().top
    }, 300)

}

//-----------------------------------------------------------------------------//

function makeOrder(order) {
    let template = document.getElementById("template").cloneNode(true)
    template.id = order.class
    template.style.display = "block"
    template.querySelector(".className").innerHTML = order.class
    let classWrapper = document.getElementById("classWrapper")
    let keys = Object.keys(order.order)
    let tbody = template.querySelector("tbody")
    template.querySelector(".price").innerHTML = "Totale: " + order.price.toFixed(2) + "€"
    keys.forEach(key => {
        let row = document.createElement("tr")
        row.innerHTML = "<th>" + key.capitalize() + "</th><th></th><th></th>"
        if (order.order[key].length > 0) tbody.appendChild(row)
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
