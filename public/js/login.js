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
                console.log('Service worker registered.', reg);
            })
    })
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installPWA.style.display = "block"
  console.log("catched install")
});
installPWA.addEventListener('click', (e) => {
    installPWA.style.display = "none"
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  });
window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    console.log('INSTALL: Success');
});
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
if (localStorage.getItem("credentials")) {
    let credentials = JSON.parse(localStorage.getItem("credentials"))
    document.getElementById("username").value = credentials.username
    document.getElementById("password").value = credentials.password
}
let identification = localStorage.getItem("identification")
if(identification == null){
    identification = {
        id: makeid(8),
        userAgent: navigator.userAgent
    }
    console.log("registered identification")
    localStorage.setItem("identification",JSON.stringify(identification))
}
function login() {
    let username = document.getElementById("username").value
    if(username == "showID"){
        let identification = localStorage.getItem("identification")
        if(identification != null){
            identification = JSON.parse(identification)
            showError(identification.id,5000)
        }else{
            showError("Nessun ID",2000)
        }
        return
    }
    let password = document.getElementById("password").value
    if(username == "" || password ==""){
        showError("Scrivi le credenziali!", 2000)
        return
    }
    let request = new XMLHttpRequest();
    request.open("POST", "../php/login.php");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
        let response = JSON.parse(res.target.response)
        if (response.sent) {
            showError(response.message, 2000)
            setTimeout(() => {
                if (credentials.username == "Paninaro") {
                    document.location.href = '../html/orders.html'
                } else {
                    document.location.href = '../html/food_list.html'
                }
            }, 500);
            localStorage.setItem("credentials", JSON.stringify(credentials))
        } else {
            showError(response.message, 2000)
        }
    }
    request.onerror = function (e) {
        console.log(e)
    };
    let credentials = {
        username: username,
        password: password
    }
    request.send(JSON.stringify(credentials))
}

let darkModeToggled = false
function toggleDarkMode(btn) {
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        btn.innerHTML = "🌙"
    }
    $("body").toggleClass("darkMode")
    $("#github").toggleClass("invert")
    $("html").toggleClass("darkMode")
    $("#footer *").toggleClass("darkModeLayer1")
    $("#navMenu").toggleClass("darkModeLayer1")
    $("#navMenu *").toggleClass("darkModeLayer1")
    $("#navMenu a").removeClass("darkModeLayer1")
    $(".box").toggleClass("darkModeLayer1")
    $(".title").toggleClass("darkModeLayer1")
    $(".input").toggleClass("darkModeLayer2")
    $(".is-icon").toggleClass("invert")
    $(btn).removeClass("darkModeLayer1")
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

if (localStorage.getItem("darkMode") == "true") {
    toggleDarkMode(document.getElementById("darkModeBtn"))
}
HTMLElement.prototype.fadeIn = function () {
    this.style.animation = "fadeIn 0.2s"
}
HTMLElement.prototype.fadeOut = function () {
    this.style.animation = "fadeOut 0.2s"
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 //A function to hide and show password's text clicking an image*/
 function showPassword() {
   if(document.password.type == "text") {
     document.password.type = "password";
     document.eye.src="../images/eye.svg";
   } else {
     document.password.type = "text";
     document.eye.src="../images/eye-slash.svg";
   }
 }
