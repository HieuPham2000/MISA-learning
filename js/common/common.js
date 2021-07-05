$(document).ready(function() {
  loadData();
})

function loadData(a) {
  
  // Lấy dữ liệu về
  $.ajax({
    url: "http://cukcuk.manhnv.net/v1/Employees",
    method: "GET",
  }).done(function(res) {
    var data = res;
    debugger
  }).fail(function(res) {
  })
  // binding dữ liệu lên table
}