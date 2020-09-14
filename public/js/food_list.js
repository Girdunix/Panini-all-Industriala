function hide(id) {
  var x = document.getElementById("sel" + id);
  var num = 3; //il numero di select

  for (var i = 0; i < num; i++) {
    document.getElementById("sel" + i).style.display = "none";
  }

  x.style.display = "block";
}
