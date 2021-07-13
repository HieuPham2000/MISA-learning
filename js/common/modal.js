/**
 * Hiện modal
 * 
 * Author: pthieu (03/07/2021)
 */
function openModal() {
  // hiện modal
  $(".modal-container").show();
  // Focus vào ô input có class "autofocus"
  $(".modal-container").find(".autofocus").focus();
}

/**
 * Ẩn modal
 * 
 * Author: pthieu (03/07/2021)
 */
function closeModal() {
  // reset các ô input trong form
  $(".modal-container form")[0].reset();
  // remove style validate nếu có
  removeInputError($(".modal-container form input"));
  removeInputError($(".modal-container .m-combobox"));
  // $(".modal-container form input").removeClass("border-red");
  
  // ẩn modal
  $(".modal-container").hide();
}