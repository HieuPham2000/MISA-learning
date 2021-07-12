/**
 * Hiện modal
 * Author: pthieu (03/07/2021)
 */
function openModal() {
  $(".modal-container").show();
  $(".modal-container").find(".autofocus").focus();
}

function closeModal() {
  $(".modal-container form")[0].reset();
  $(".modal-container form input").removeClass("border-red");
  $(".modal-container").hide();
}