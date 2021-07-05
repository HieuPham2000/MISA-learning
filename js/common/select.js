var selects = document.getElementsByTagName("select");

function styleSelect(el) {
  // var el = event.target;
  if(el.value == "") {
    el.style.fontSize = "11px";
    el.style.color = "#bbbbbb";
  } else {
    el.style.fontSize = "13px";
    el.style.color = "#000000";
  }
}

for(var i = 0; i < selects.length; ++i) {
  selects[i].addEventListener("load",  styleSelect(selects[i]));}