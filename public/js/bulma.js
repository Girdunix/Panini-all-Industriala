//This function make the navbar's hamburger working
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});

//---------------------------------------------------------------------------------------------//
//This function create a "Scroll To Top" buttons//Get the button:
mybutton = document.getElementById("scrollToTopButton");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//---------------------------------------------------------------------------------------------//
//This function make the button on "notification" working
document.addEventListener('DOMContentLoaded', () => {
  let acceptedWarning = localStorage.getItem("acceptedWarning")
  if (acceptedWarning != null) {
    acceptedWarning = JSON.parse(acceptedWarning)
    if (acceptedWarning) return
  }
  if(!document.querySelector('.notification .delete')) return
  document.querySelector('.notification').style.display = "block"
  document.querySelector('.notification .delete').addEventListener('click',function(){
    this.parentNode.remove()
    localStorage.setItem("acceptedWarning", "true")
  })
})
