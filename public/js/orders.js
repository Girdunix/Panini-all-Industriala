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
        navigator.serviceWorker.register('../service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg)
            })
    })
}

function expandOrder(btn, ignore = false) {
    let element = btn.parentElement.getElementsByClassName("orderWrapper")[0]
    btn = btn.getElementsByClassName("expand")[0]
        //se è su pc, usare una max width minore così da non riempire lo schermo
        expandHeight = "70vh"
    if (screen.width > screen.height) {
        expandHeight = "60vh"
    }
        //se non è stato aperto, esegui animazione e ruota il pulsante
    if (element.style.maxHeight == "0vh") {
        $(element).animate({
            "max-height": expandHeight
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

function confirmOrder(order) {
    //muove l'ordine confermato nella sezione di ordini confermati
    let clonedNode = order.parentElement.parentElement.parentElement.cloneNode(true)
    clonedNode.style.padding = 0
    clonedNode.style.marginTop = "1rem"
    //elimina il vecchio elemento
    document.getElementById("confirmedOrders").appendChild(clonedNode)
    clonedNode.querySelector(".expand").click()
    clonedNode.querySelector(".orderWrapper").style.maxHeight = "0vh"
    let className = clonedNode.querySelector(".className").innerHTML
    changeStatus(className,"confermato")
    order.parentElement.parentElement.parentElement.remove()
}

//-----------------------------------------------------------------------------//

function deleteOrder(order) {
    if (confirm("Sicuro di voler annullare l'ordine?")) {
        let name = order.parentElement.parentElement.parentElement.querySelector(".className").innerHTML
        //muove l'ordine confermato nella sezione di ordini confermati
        let clonedNode = order.parentElement.parentElement.parentElement.cloneNode(true)
        clonedNode.style.padding = 0
        clonedNode.style.marginTop = "1rem"
        //elimina il vecchio elemento
        document.getElementById("rejectedOrders").appendChild(clonedNode)
        clonedNode.querySelector(".expand").click()
        clonedNode.querySelector(".orderWrapper").style.maxHeight = "0vh"
        let className = clonedNode.querySelector(".className").innerHTML
        changeStatus(className,"rifiutato")
        order.parentElement.parentElement.parentElement.remove()
    }
}

//-----------------------------------------------------------------------------//
let setupDarkMode = false
async function initPage() {
    //render della pagina, aggiungendo gli ordini ricevuti dal server
    let request = new XMLHttpRequest();
    request.open("POST", "../php/getOrders.php");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
        let response = JSON.parse(res.target.response)
        if (response.sent) {
            //render di ogni ordine ricevuto dal server
            document.getElementById("confirmedOrders").innerHTML = ""
            document.getElementById("rejectedOrders").innerHTML = ""
            document.getElementById("classWrapper").innerHTML = ""

            response.message.forEach(order => {
                try{
                    makeOrder(order.order,order.status,order.classNumber,order.order.identification)
                }catch(e){
                    console.log("Error with order: ", order)
                }
            })
        } else {
            showError(response.message, 2000)
        }
        if(localStorage.getItem("darkMode") == "true"){
            if(setupDarkMode) return $("th").addClass("darkModeLayer1")
            toggleDarkMode(document.getElementById("darkModeBtn"))
            setupDarkMode = true
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
    $("tr").toggleClass("darkModeLayer1")
    $("body").toggleClass("darkMode")
    $("#github").toggleClass("invert")
    $(".classNumber").toggleClass("darkModeLayer1")
    $("html").toggleClass("darkMode")
    $("tr").toggleClass("darkModeLayer1")
    $("th").toggleClass("darkModeLayer1")
    $(".is-receipt").toggleClass("darkModeLayer1")
    $("table").toggleClass("darkModeLayer1")
    $(".className").toggleClass("darkModeLayer1") 
    $(".expand").toggleClass("darkModeLayer1")
    $(".statusWrapper").toggleClass("whiteMode")
    $(".statusName").toggleClass("whiteMode")
    $("#footer *").toggleClass("darkModeLayer1")
    $(".message").toggleClass("darkMode")
    $("#navMenu").toggleClass("darkModeLayer1")
    $("#navMenu *").toggleClass("darkModeLayer1")
    $("#navMenu a").removeClass("darkModeLayer1")
    if(darkModeToggled){
        $("#navMenu a").css({"color":""}) 
    }else{
        $("#navMenu a").css({"color":"white"})
    }

    $(".navbar").toggleClass("darkModeLayer1")
    $("#github").removeClass("darkModeLayer1")
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

function showOrderID(element){
    element.parentElement.querySelector(".orderID").style.display = "block"
}
//-----------------------------------------------------------------------------//

function makeOrder(order,status,classNumber,identification) {
    let template = document.getElementById("template").cloneNode(true)
    template.id = order.class
    template.style.display = "block"
    template.querySelector(".className").innerHTML = order.class
    template.querySelector(".classNumber").innerHTML = classNumber
    template.querySelector(".orderID").innerHTML = identification.id
    let keys = Object.keys(order.order)
    let tbody = template.querySelector("tbody")
    template.querySelector(".price").innerHTML = "Totale: " + order.price.toFixed(2) + "€"
    if(order.message != undefined){
        if(order.message.length < 151) template.querySelector(".message").innerHTML = order.message
    } 
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
    switch(status){
        case "confermato":{
            template.style.padding = 0
            template.style.marginTop = "1rem"
            document.getElementById("confirmedOrders").appendChild(template)
            break;
        }
        case "rifiutato":{
            template.style.padding = 0
            template.style.marginTop = "1rem"
            document.getElementById("rejectedOrders").appendChild(template)
            break;
        }
        default: {
            document.getElementById("classWrapper").appendChild(template)
        }
    }
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
function changeStatus(name,status){
    let request = new XMLHttpRequest();
    request.open("POST", "../php/changeOrderStatus.php");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
        let response = JSON.parse(res.target.response)
        if(response.sent){
            initPage()
        }else{
            showError(response.message,2000)
        }
    };
    request.onerror = function (e) {
        console.log(e)
    };
    let data = {
        credentials: globalCredentials,
        name:name,
        status:status
    }
    request.send(JSON.stringify(data))
}