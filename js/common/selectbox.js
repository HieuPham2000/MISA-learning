$(document).ready(function () {
  SelectBox.makeSelectbox();
})


class SelectBox {
  // Lưu index của item đang focus trong dropdown list
  static currentFocus = 0;
  /**
   * Khởi tạo sự kiện cho các selectbox
   * @author pthieu (12-07-2021)
   */
  static makeSelectbox() {

    // Ẩn tất cả dropdown khi click ra ngoài
    $(document).click(function (event) {
      var el = event.target;
      if ($(".m-selectbox").has(el).length == 0 && !$(".m-selectbox").is(el)) {
        SelectBox.closeAllDropdown();
      }
    })

    // Đóng mở dropdown bằng click chuột
    // Cờ flag dùng để tránh lỗi duplicate click làm cho sự kiện fire 2 lần quá nhanh
    var flag = true
    $(".m-selectbox__content, .m-selectbox__btn").click(function () {
      if (flag === true) {
        flag = false;
        SelectBox.toggleDropdown($(this).parent());
        setTimeout(() => {
          flag = true;
        }, 50);
      }
    })

    // Xử lý các sự kiện ấn bàn phím
    $(".m-selectbox__content, .m-selectbox__btn").on('keydown', function (event) {
      // Lấy ra combobox
      var container = $(this).parent();

      // Lấy ra list item
      var items = container.find(".m-selectbox__dropdown__item");

      
      if (!container.is(".open")) {
        // Nếu dropdown đang đóng, ấn Enter hoặc Alt + Arrow Down để mở
        if (event.key == "Enter" || (event.altKey && event.keyCode == 40)) {
          SelectBox.openDropdown(container);
        }
      } else {
        // Nếu dropdown đang mở
        if (event.altKey && event.keyCode == 38) { // ấn Alt + Arrow Up để đóng
          SelectBox.closeDropdown(container); 
        } else if (event.keyCode == 40) { // ấn Arrow Down để chuyển xuống item bên dưới
          SelectBox.currentFocus++;
          SelectBox.addActive(items);
        } else if (event.keyCode == 38) { // ấn Arrow Up để chuyển lên item bên trên
          SelectBox.currentFocus--;
          SelectBox.addActive(items);
        } else if (event.key == "Enter") { // ấn Enter để chọn item => thay đổi giá trị của input
          SelectBox.selectDropdownItem(items.eq(SelectBox.currentFocus));
        }
      }

    })

    // sư kiện click chọn item trong dropdown list
    $(".m-selectbox__dropdown__item").click(function () {
      SelectBox.selectDropdownItem($(this));
    })
  }

  /**
   * Đóng tất cả selectbox
   * @author pthieu (12-07-2021)
   */
  static closeAllDropdown() {
    // Loại bỏ trạng thái active của tất cả các item trong dropdown list
    SelectBox.removeActive($(".m-selectbox__dropdown__item"));
    // Đóng tất cả selectbox
    $(".m-selectbox").removeClass("open");
  }

  /**
   * Đóng selectbox được chỉ đinh
   * @param {element} el m-selectbox (có class=".m-selectbox")
   * @author pthieu (12-07-2021)
   */
  static closeDropdown(el) {
    // Loại bỏ trạng thái active của tất cả các item trong dropdown list
    SelectBox.removeActive($(el).find(".m-selectbox__dropdown__item"));
    // Đóng selectbox
    $(el).removeClass("open");
  }


  /**
   * Mở selectbox được chỉ đinh
   * @param {element} el m-selectbox (có class=".m-selectbox")
   * @author pthieu (12-07-2021)
   */
  static openDropdown(el) {
    // đóng tất cả selectbox
    SelectBox.closeAllDropdown();
    // mở selectbox được chỉ định
    $(el).addClass("open");

    // Reset giá trị currentFocus và set trạng thái active cho item đầu tiên trong list
    SelectBox.currentFocus = 0;
    $(el).find(".m-selectbox__dropdown__item").eq(0).addClass("active");
  }

  /**
   * Đóng/Mở selectbox
   * @param {element} el m-selectbox (có class=".m-selectbox")
   * @author pthieu (12-07-2021)
   */
  static toggleDropdown(container) {
    if (container.is(".open")) {
      // nếu đang mở thì đóng lại
      SelectBox.closeDropdown(container);
    } else {
      // nếu đang đóng thì mở ra
      SelectBox.openDropdown(container)
    }
  }

  /**
   * Thiết lập trạng thái active cho item trong dropdown list
   * @param {*} items danh sách các item(.m-selectbox__dropdown__item)
   * @author pthieu (12-07-2021)
   */
  static addActive(items) {
    // Loại bỏ trạng thái active của tất cả item
    SelectBox.removeActive(items);

    // Nếu currentFocus vượt quá length thì set = 0
    if (SelectBox.currentFocus >= items.length) {
      SelectBox.currentFocus = 0;
    }

    // Nếu currentFocus âm thì set về cuối danh sách
    if (SelectBox.currentFocus < 0) {
      SelectBox.currentFocus = items.length - 1;
    }

    // Thêm trạng thái active cho item tương ứng với chỉ số currentFocus
    $(items).eq(SelectBox.currentFocus).addClass("active");
  }

  /**
   * Loại bỏ trạng thái active cho tất cả item trong dropdown list
   * @param {*} items danh sách các item(.m-selectbox__dropdown__item)
   * @author pthieu (12-07-2021)
   */
  static removeActive(items) {
    $(items).removeClass("active");
  }

  /**
   * Xử lý sự kiện khi chọn 1 item trong dropdown list (bằng chuột/bàn phím)
   * @param {*} el item(class=".m-selectbox__dropdown__item")
   * @author pthieu (12-07-2021)
   */
  static selectDropdownItem(el) {
    // Lấy ra selectbox => đóng dropdown
    var container = $(el).parents(".m-selectbox");
    SelectBox.closeDropdown(container);

    // set trạng thái selected cho item
    $(el).siblings(".selected").removeClass("selected");
    $(el).addClass("selected");

    // Thay đổi giá trị content
    var content = container.find(".m-selectbox__content");
    content.text($(el).text());
  }
}








