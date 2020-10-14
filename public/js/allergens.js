if ('serviceWorker' in navigator) {
  //service worker per rendere il sito installabile come app
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg)
      })
  })
}
let darkModeToggled = false
function toggleDarkMode(btn) {
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        btn.innerHTML = "🌙"
    }
    $(btn).toggleClass("whiteMode")
    $("#footer *").toggleClass("darkModeLayer1")
    $("#github").toggleClass("invert")
    $("#github").removeClass("darkModeLayer1")
    $("body").toggleClass("darkMode")
    $("html").toggleClass("darkMode")
    $(".box").toggleClass("darkModeLayer1")
    $("#navMenu").toggleClass("darkModeLayer1")
    $("#navMenu *").toggleClass("darkModeLayer1")
    $(".navbar").toggleClass("darkModeLayer1")
    $(".nav-btn").toggleClass("darkModeLayer1")
    $(".layer2").toggleClass("darkMode").toggleClass("darkModeLayer1")
    darkModeToggled = !darkModeToggled
    localStorage.setItem("darkMode", darkModeToggled)
}
if(localStorage.getItem("darkMode") == "true"){
  toggleDarkMode(document.getElementById("darkModeBtn"))
}
