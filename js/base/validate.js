$(document).ready(function () {

  $("input[required]").on("blur", function () {
    if(validateEmpty($(this), true) && validateEmail($(this), true)) {
      console.log("OK");
    } else {
      console.log("error")
    };
  })
  $("input[required]").on("input", function () {
    if(validateEmpty($(this)) && validateEmail($(this))) {
      console.log("OK");
    } else {
      console.log("error")
    };
  })

  setMaxDate();
})

function validateEmpty(el, msg = false) {
  var value = $(el).val();
  if (value === "" || value === undefined || value === null) {
    $(el).addClass("border-red");
    $(el).attr("title", "Thông tin không được để trống!");
    if (msg) {
      addNoticeToInput(el, "Thông tin không được để trống!");
    }
    return false;

  } else {
    $(el).removeClass("border-red");
    $(el).attr("title", "");
    return true;
  }
}

function validateEmail(el, msg = false) {
  if(!$(el).is("[type=email")) {
    return true;
  }
  var value = $(el).val();

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!re.test(String(value).toLowerCase())) {

    $(el).addClass("border-red");
    $(el).attr("title", "Định dạng email không đúng!");
    if (msg) {
      addNoticeToInput(el, "Định dạng email không đúng!");
    }
    return false;
  } else {
    $(el).removeClass("border-red");
    $(el).attr("title", "");
    return true;
  }
}

function addNoticeToInput(el, msg) {
  var notice = $(`<div class="notice">${msg}</div>`);

  $(notice).hide();
  $(el).parents(".form-item").append(notice);
  $(notice).fadeIn(500);
  setTimeout(function () {
    $(notice).fadeOut(1000, function () {
      $(this).remove();
    })
  }, 2000)
}

function setMaxDate() {
  var date = new Date().toJSON();

  var yyyymmdd = CommonFunction.formatDateYYYYMMDD(date);
  $("input[type=date]").attr("max", yyyymmdd);

}
