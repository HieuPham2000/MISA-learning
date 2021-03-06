$(document).ready(function() {

  $("input[number]").on("keypress", function(event) {
    return isNumber(event);
  });

  $("input[salary]").on("input", function(event) {
    formatInputMoney(event);
  });

  var yyyymmdd = getMaxDate();
  $("input[date]").attr("max", yyyymmdd);
})
/**
 * Kiểm tra phím vừa ấn có phải phím số hay không
 * Dùng khi nhập input có giá trị số (số CMND, số điện thoại, mã số thuế, tiền lương...)
 * @param {object} event html event
 * @returns {boolean} giá trị boolean
 * 
 * Author: pthieu (03/07/2021) 
 */
function isNumber(event) {
  var charCode = (event.which) ? event.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
  return true;
}

/**
 * Định dạng tiền theo kiểu 123.456.789
 * @param {object} event html event
 * 
 * Author: pthieu (03/07/2021)
 */
function formatInputMoney(event) {
  var el = event.target;
  var value = el.value;
  if(value == "") {
    return;
  }
  value = value.replaceAll(",", "");
  value = value.replaceAll(".", "");
  // value = parseInt(value).toLocaleString().replaceAll(",", ".");

  // Dùng BigInt để tránh tràn khi số lớn
  // value = BigInt(value).toLocaleString().replaceAll(",", ".");
  value = BigInt(value).toLocaleString("it-IT");
  el.value = value;
}

/**
 * Lấy ra giá trị ngày hiện tại
 * @returns {string} date dạng yyyy-mm-dd
 * @author pthieu (07-07-2021)
 */
function getMaxDate() {
  var date = new Date().toJSON();
  var yyyymmdd = CommonFunction.formatDateYYYYMMDD(date);
  return yyyymmdd;
}