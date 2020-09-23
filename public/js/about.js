let darkModeToggled = false
function toggleDarkMode(btn) {
    btn.innerHTML = "☀️"
    if (darkModeToggled) {
        btn.innerHTML = "🌙"
    }
    $(btn).toggleClass("whiteMode")
    $("#footer *").toggleClass("darkModeLayer1")
    $(".github").toggleClass("invert")
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