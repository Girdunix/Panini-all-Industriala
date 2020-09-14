function hide(id) {
  let x = document.getElementById("sel" + id)
  let num = 3 //il numero di select

  for (let i = 0; i < num; i++) {
    document.getElementById("sel" + i).style.display = "none"
  }

  x.style.display = "block"
}
