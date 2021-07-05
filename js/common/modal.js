// $(document).ready( function() {
//   $(".modal-container").hide();
// })

function openModal() {
  $(".modal-container").show();
}

function closeModal() {
  $(".modal-container form")[0].reset();
  $(".modal-container").hide();
}