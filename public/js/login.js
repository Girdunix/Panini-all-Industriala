if ('serviceWorker' in navigator) {
    //service worker per rendere il sito installabile come app
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            })
    })
}
function showError(message,timeout){
    //funzione che mostra un messaggio di errore fluttuante 
    let floatingMessage = document.getElementById("floatingMessage")
    floatingMessage.innerHTML = message
    if(floatingMessage.style.display == "flex") return
    floatingMessage.style.display = "flex"
    floatingMessage.fadeIn()
    setTimeout(() => {
       floatingMessage.fadeOut()
       setTimeout(() => {
           floatingMessage.style.display = "none"
       }, 200);
    }, timeout);
}
if(localStorage.getItem("credentials")){
    let credentials = JSON.parse(localStorage.getItem("credentials"))
    document.getElementById("username").value = credentials.username
    document.getElementById("password").value = credentials.password
}
function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    if(!(username && password)){
    }else{
        showError("Scrivi le credenziali!",2000)
    }
    let request = new XMLHttpRequest();
    request.open("POST", "/login");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    request.onload = (res) => {
      let response = JSON.parse(res.target.response)
        if(response.sent){
            showError(response.message,2000)
            setTimeout(() => {
                if(credentials.username == "Paninaro"){
                    document.location.href='/html/orders.html'
                }else{
                    document.location.href='/html/food_list.html'
                }
            }, 500);
            localStorage.setItem("credentials",JSON.stringify(credentials))
        }else{
            showError(response.message,2000)
        }
    }
    request.onerror = function (e) {
      console.log(e)
    };
    let credentials = {username:username,password:password}
    request.send(JSON.stringify(credentials))
}

HTMLElement.prototype.fadeIn = function(){ this.style.animation = "fadeIn 0.2s"}
HTMLElement.prototype.fadeOut = function(){ this.style.animation = "fadeOut 0.2s"}
