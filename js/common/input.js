$(document).ready(function() {
  addButtonClearInput();
})

/**
 * Thêm button xóa text trong các ô input
 * 
 * Author: pthieu (06/07/2021)
 */
function addButtonClearInput() {

  // tạo element wrapper và btn clear text
  var inputs = $("input[type=text], input[type=email");
  inputs.wrap('<div class="input-wrapper"></div>')
  inputs.after(`
      <div class="btn-clear-text">
        <img src="/content/icon/x.svg" >
      </div> `);

  // sự kiện khi ấn vào btn clear text
  $(".btn-clear-text").click(function() {
    var input = $(this).siblings("input");
    $(input).val("");
    $(input).focus();
    $(input).trigger("input");
  })
  
  // ban đầu duyệt 1 lần giá trị của các input để ẩn/hiện btn clear text
  inputs.each(function() {
    if($(this).val() !== "") {
      $(this).siblings(".btn-clear-text").show();
    }
  })
  
  // sự kiện myLoad và input
  // myLoad là sự kiện từ định nghĩa, sẽ gọi thông qua trigger khi cần
  inputs.on("myLoad input", function() {
    if($(this).val() !== "") {
      $(this).siblings(".btn-clear-text").show();
    } else {
      $(this).siblings(".btn-clear-text").hide();
    }
  })
}
