if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/public/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            })
    })
}
function showError(message,timeout){
    let floatingMessage = document.getElementById("floatingMessage")
    floatingMessage.innerHTML = message
    if(floatingMessage.style.display == "flex") return
    floatingMessage.style.display = "flex"
    floatingMessage.fadeIn()
    setTimeout( () => {
       floatingMessage.fadeOut()
       setTimeout(() => {
           floatingMessage.style.display = "none"
       }, 200);
    }, timeout);
}

function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    console.log(username,password)
    if(username && password){
        showError("Login!",2000)
    }else{
        showError("Scrivi le credenziali!",2000)
    }
}

HTMLElement.prototype.fadeIn = function(){ this.style.animation = "fadeIn 0.2s"}
HTMLElement.prototype.fadeOut = function(){ this.style.animation = "fadeOut 0.2s"}