function isNumber(event) {
  var charCode = (event.which) ? event.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
  return true;
}

function formatMoney(event) {
  var el = event.target;
  var value = el.value;
  if(value == "") {
    return;
  }
  value = value.replaceAll(".", "");
  // value = parseInt(value).toLocaleString().replaceAll(",", ".");
  value = BigInt(value).toLocaleString().replaceAll(",", ".");
  el.value = value;
}