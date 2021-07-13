const validateEmailObj = {
  type: "email",
  pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  title: "Định dạng email không đúng!"
}

const validatePhoneNumberObj = {
  type: "phone",
  pattern: /^[\+\d]?(?:[\d-.\s()]*)$/,
  title: "Định dạng số điện thoại không đúng!"
}

$(document).ready(function () {
  $("form input").on("blur", function () {
    var el = $(this);
    validateEmpty(el, true) && validateFormat(el, validateEmailObj, true) 
    && validateFormat(el, validatePhoneNumberObj, true) && validateCombobox(el, true);
  })
  $("form input").on("input mySelect", function () {
    var el = $(this);
    validateEmpty(el) && validateFormat(el, validateEmailObj) 
    && validateFormat(el, validatePhoneNumberObj) && validateCombobox(el);
  })

})

/**
 * Thêm style, title báo lỗi khi validate input
 * @param {element} el ô input đang xử lý 
 * @param {string} title title báo lỗi muốn set cho ô input
 * @author pthieu (09-07-2021)
 */
function addInputError(el, title) {
  $(el).addClass("border-red");
  $(el).attr("title", `${title}`);
}

/**
 * Bỏ style, title báo lỗi validate input
 * @param {element} el ô input đang xử lý 
 * @author pthieu (09-07-2021)
 */
function removeInputError(el) {
  $(el).removeClass("border-red");
  $(el).attr("title", "");
}


/**
 * Validate trường bắt buộc
 * @param {element} el ô input đang xử lý 
 * @param {boolean} msg truyền true nếu muốn hiển thị notice báo lỗi
 * @returns {boolean} true | false
 * @author pthieu (09-07-2021)
 */
function validateEmpty(el, msg = false) {
  // Nếu trường này không required thì không cần check
  if(!$(el).is("[required]")) {
    return true;
  }

  // Lấy ra giá trị
  var value = $(el).val();
  // Nếu bị bỏ trống
  if (value === "" || value === undefined || value === null) {
    var title = "Thông tin không được để trống!";
    addInputError(el, title)
    if (msg) {
      addNoticeToInput(el, title);
    }
    return false;
  } else {
    removeInputError(el);
    return true;
  }
}

/**
 * Validate định dạng bằng regex
 * @param {element} el ô input đang xử lý 
 * @param {object} validateObj object chứa các trường:
 * 
 * type (string): thuộc tính tự định nghĩa mô tả loại: email | phone;
 * 
 * pattern (object): pattern regex dùng để test ;
 * 
 * title (string): title báo lỗi muốn set cho ô input;
 * 
 * @param {boolean} msg truyền true nếu muốn hiển thị notice báo lỗi
 * @returns {boolean} true | false
 * @author pthieu (09-07-2021)
 */
function validateFormat(el, validateObj, msg = false) {
  // Nếu trường này không thuộc type thì không cần kiểm tra
  if(!$(el).is(`[${validateObj.type}]`)) {
    return true;
  }

  // Lấy ra giá trị
  var value = $(el).val();
  // test regex
  if(!validateObj.pattern.test(String(value).toLowerCase())) {
    addInputError(el, validateObj.title)
    if (msg) {
      addNoticeToInput(el, validateObj.title);
    }
    return false;
  } else {
    removeInputError(el);
    return true;
  }
}

/**
 * Validate combobox
 * @param {element} el ô input đang xử lý
 * @param {boolean} msg truyền true nếu muốn hiển thị notice báo lỗi
 * @returns {boolean} true | false
 * @author pthieu (09-07-2021)
 */
 function validateCombobox(el, msg = false) {
  // nếu trường này không nằm trong combobox thì không cần check
  if(!$(el).is(".m-combobox__input")) {
    return true;
  }
  
  // Lấy ra combobox
  var container = $(el).parents(".m-combobox");
  // Nếu text của combobox khác rỗng mới check (vì giá trị rỗng là hợp lệ)
  // Khi đó, getValue (lấy id) ra null sẽ báo lỗi
  if(container.getText() !== "" && container.getValue() == null) {
    var title = "Giá trị không tồn tại!";
    addInputError(container, title)
    if (msg) {
      addNoticeToInput(container, title);
    }
    return false;
  } else {
    removeInputError(container);
    return true;
  }
}

/**
 * Hiển thị notice báo lỗi khi validate input
 * @param {element} el ô input đang xử lý 
 * @param {string} msg nội dung thông báo lỗi
 * @author pthieu (09-07-2021)
 */
function addNoticeToInput(el, msg) {
  var notice = $(`<div class="notice">${msg}</div>`);

  // animate xuất hiện
  $(notice).hide();
  $(el).parents(".form-item").append(notice);
  $(notice).fadeIn(500);

  // Tự ẩn sau 2s
  setTimeout(function () {
    $(notice).fadeOut(1000, function () {
      $(this).remove();
    })
  }, 2000)
}

/**
 * Validate các trường trước khi ấn btn submit
 * @param {element} form thẻ form
 * @returns {boolean} true | false
 * @author pthieu (13-07-2021)
 */
function validateBeforeSubmit(form) {
    var inputs = $("form").find("input");
    for(var i = 0; i < inputs.length; ++i) {
      var el = inputs[i];
      if(validateEmpty(el, true) && validateFormat(el, validateEmailObj, true) 
      && validateFormat(el, validatePhoneNumberObj, true) && validateCombobox(el, true)) {
        continue;
      } else {
        return false;
      }
    }
    return true;
}


