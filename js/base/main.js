$(document).ready( function() {
  toggleMenu();
  // $(function() {
  //   $(".form-modal").draggable().resizable();
  // })
  
})

/**-------------------------------
 * Mở rộng/ thu hẹp sidebar (menu)
 * 
 * Author: pthieu (03/07/2021)
 */
var flag = true;
function toggleMenu() {
  $(".header-left > .sidebar").click( function() {
    if(flag) {
      flag = false;

      $(".menu").toggleClass("collapse");
      $(".page").toggleClass("expand");
      setTimeout(() => {
        flag = true;
      }, 100);
    } 
    
  })
}

/**
 * Lớp ToastMessage: tạo toast message
 * @author pthieu (08-07-2021)
 */
class ToastMessage {
  static icon = {
    danger: `<i class="fas fa-exclamation-triangle"></i>`,
    warning: `<i class="fas fa-exclamation-circle"></i>`,
    success: `<i class="fas fa-check"></i>`,
    info: `<i class="fas fa-info"></i>`
  }
  /**
   * Tạo toast message
   * @param {string} type "danger" | "warning" | "success" | "info"
   * @param {string} msg nội dung
   * @author pthieu (08-07-2021)
   */
  static add(type, msg) {
    var toast = 
    $(`<div class="toast-msg toast-msg-${type}">
      <div class="toast-msg-icon">
        ${ToastMessage.icon[type]}
      </div>
      <div class="toast-msg-content">${msg}</div>
      <div class="toast-msg-close">
        <i class="fas fa-times"></i>
      </div>
    </div>`);

    $(toast).children(".toast-msg-close").click(function() {
      var parent = $(this).parent();
      parent.slideUp(500, function() {
        $(this).remove();
      })
    });

    // animate
    $(toast).hide();
    $("#toast-msg-container").append(toast);
    $(toast).fadeIn();

    setTimeout(function() {
      $(toast).slideUp(500, function() {
        $(this).remove();
      });
    }, 2000); 
  }

}

/**
 * Lớp PopUp: tạo các popup
 * @author pthieu (08-07-2021)
 */
class PopUp {
  /**
   * Tạo pop up tương ứng với thông tin truyền vào
   * @param {string} type "danger" | "warning" | "info"
   * @param {object} popupObject {title: "string", text: "string", btnTextCancel: "string", btnTextDo: "string", do: callback}
   * @author pthieu (08-07-2021)
   */
  static add(type, popupObject) {

    var popup = $(`
    <div class="popup">
      <div class="popup-icon-close">
        <img src="/content/icon/x.svg">
      </div>
      <div class="popup-title">${popupObject.title}</div>
      <div class="popup-content">
        <div class="popup-icon">
          <img src="">
        </div>
        <div class="popup-text">${CommonFunction.decoString(popupObject.text)}</div>
        </div>
      <div class="popup-footer">
      </div>
    </div>`);

    
    switch (type) {
      case "danger":
        $(popup).find(".popup-icon img").attr("src", "/content/icon/alarm.png");
        $(popup).find(".popup-footer").append(`
          <button type="button" class="m-btn-default m-btn-cancel">${popupObject.btnTextCancel}</button>
          <button class="m-btn-default m-btn-danger">${popupObject.btnTextDo}</button>
        `);
        break;
      
      case "warning":
        $(popup).find(".popup-icon img").attr("src", "/content/icon/warning.png");
        $(popup).find(".popup-footer").append(`
          <button type="button" class="m-btn-default m-btn-cancel">${popupObject.btnTextCancel}</button>
          <button class="m-btn-default m-btn-do">${popupObject.btnTextDo}</button>
        `);
        break;
      
      case "info":
        toast = 
        $(popup).find(".popup-icon").remove();
        $(popup).find(".popup-footer").append(`
          <button class="m-btn-default m-btn-do">${popupObject.btnTextDo}</button>
        `);
        break;
    }

    $(popup).find(".popup-footer .m-btn-cancel,.popup-icon-close").click(function() {
      $(popup).fadeOut(200, function() {
        $(this).parent().hide();
        $(this).remove();
      });
    })

    $(popup).find(".popup-footer").children("button").eq(1).click(function() {
      popupObject.do();
      $(popup).fadeOut(200, function() {
        $(this).parent().hide();
        $(this).remove();
      });
    })

    $("#popup-container").show();
    $("#popup-container").append(popup).hide().fadeIn(100);

  }


}