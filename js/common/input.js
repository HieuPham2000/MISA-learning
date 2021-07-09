$(document).ready(function() {
  addButtonClearInput();
})

/**
 * Thêm button xóa text trong các ô input
 * Author: pthieu (06/07/2021)
 */
function addButtonClearInput() {
  var inputs = $("input[type=text]:not(.header input), input[type=email");
  inputs.wrap('<div class="input-wrapper"></div>')
  inputs.after(`
      <div class="btn-clear-text">
        <img src="../../content/icon/x.svg" >
      </div> `);

  $(".btn-clear-text").click(function() {
    var input = $(this).siblings("input");
    $(input).val("");
    $(input).focus();
    $(input).trigger("input");
    // $(this).hide();
  })
  
  inputs.each(function() {
    if($(this).val() !== "") {
      $(this).siblings(".btn-clear-text").show();
    }
  })
  
  inputs.on("myLoad input", function() {
    if($(this).val() !== "") {
      $(this).siblings(".btn-clear-text").show();
    } else {
      $(this).siblings(".btn-clear-text").hide();
    }
  })
}
