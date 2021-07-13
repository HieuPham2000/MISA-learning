$(document).ready(function () {

  // $("m-combobox").replaceWith(function(index) {
  //   var id = $(this).attr('id');
  //   var name = $(this).attr('name');
  //   var placeholder = $(this).attr('placeholder');
  //   var dataName = $(this).attr('data-name');
  //   var cbx = 
  //   $(`<div class="m-combobox" id="${id}" data-name="${dataName}">
  //       <input class="m-combobox__input" type="text" placeholder="${placeholder}" name="${name}">
  //       <div class="m-combobox__btn" tabindex="-1"><i class="fas fa-chevron-down"></i></div>
  //       <ul class="m-combobox__dropdown"></ul>
  //     </div>`);
  //   return cbx;
  // });
  new Combobox(".m-combobox[data-name=Department]", "cukcuk.manhnv.net", "api/Department", "Department");
  new Combobox(".m-combobox[data-name=Position]", "cukcuk.manhnv.net/v1", "Positions", "Position");
  Combobox.loadGenderData();
  Combobox.loadWorkStatusData();

  Combobox.makeCombobox();
})

class Combobox {

  constructor(container = null, hostName = "cukcuk.manhnv.net/v1", apiName = null, name = null) {
    this.Container = container;
    this.HostName = hostName;
    this.ApiName = apiName;
    this.Name = name;
    this.loadListItem();
  }

  /**
   * Load dữ liệu combobox qua api
   * @author pthieu (11-07-2021)
   */
  loadListItem() {
    let me = this;
    let container = $(me.Container);

    $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}`,

    }).done(function (response) {
      var list = $(container).children(".m-combobox__dropdown");
      var data = [];
      var propertyName = me.Name + "Name";
      var propertyId = me.Name + "Id";

      // Duyệt qua từng đối tượng trong kết quả trả về
      $.each(response, function (index, item) {
        // Thêm thông tin vào mảng data
        data.push({ text: `${item[propertyName]}`, value: `${item[propertyId]}` })
        // Tạo và thêm m-combobox__dropdown__item
        var li =
          `<li class="m-combobox__dropdown__item"><i class="fas fa-check"></i>${item[propertyName]}</li>`;
        list.append(li);
      });

      // set sự kiện cho các m-combobox__dropdown__item
      list.children().click(function () {
        Combobox.selectDropdownItem($(this));
      })
      // lưu data vào combobox
      container.data("data", data);
    }).fail(function (response) {
      console.log(response)
      ToastMessage.add("danger", "Tải dữ liệu thất bại!");
    })

  }

  /**
   * Load (fix cứng) dữ liệu cho combobox Gender
   * @author pthieu (12-07-2021)
   */
  static loadGenderData() {
    var container = $(".m-combobox[data-name=Gender]");
    var list = $(container).children(".m-combobox__dropdown");

    // dữ liệu fix cho combobox Gender
    var data = [
      { value: 0, text: "Nữ" },
      { value: 1, text: "Nam" },
      { value: 2, text: "Không xác định" }
    ];
    container.data("data", data);

    // tạo và thêm các m-combobox__dropdown__item
    data.forEach(function (item) {
      var li =
        `<li class="m-combobox__dropdown__item"><i class="fas fa-check"></i>${item.text}</li>`;
      list.append(li);
    })
  }

  /**
   * Load (fix cứng) dữ liệu cho combobox WorkStatus
   * @author pthieu (12-07-2021)
   */
  static loadWorkStatusData() {
    var container = $(".m-combobox[data-name=WorkStatus]");
    var list = $(container).children(".m-combobox__dropdown");

    // dữ liệu fix cho combobox WorkStatus
    var data = [
      { value: 1, text: "Đã nghỉ việc" },
      { value: 2, text: "Đang thử việc" },
      { value: 3, text: "Đang làm việc" }
    ];
    container.data("data", data);

    // tạo và thêm các m-combobox__dropdown__item
    data.forEach(function (item) {
      var li =
        `<li class="m-combobox__dropdown__item"><i class="fas fa-check"></i>${item.text}</li>`;
      list.append(li);
    })
  }


  // Lưu index của item đang focus trong dropdown list
  static currentFocus = 0;
  /**
   * Khởi tạo sự kiện cho các combobox
   * @author pthieu (12-07-2021)
   */
  static makeCombobox() {

    // Ẩn tất cả dropdown khi click ra ngoài
    $(document).click(function (event) {
      var el = event.target;
      if ($(".m-combobox").has(el).length == 0 && !$(".m-combobox").is(el)) {
        Combobox.closeAllDropdown();
      }
    })

    // Đóng mở dropdown bằng click button
    // Cờ flag dùng để tránh lỗi duplicate click làm cho sự kiện fire 2 lần quá nhanh
    var flag = true
    $(".m-combobox__btn").click(function () {
      if (flag === true) {
        flag = false;
        Combobox.toggleDropdownByButton($(this));
        setTimeout(() => {
          flag = true;
        }, 50);
      }
    })

    //#region sự kiện của .m-combobox__input
    // Đóng tất cả dropdown khi chuyển sang input/combobox input mới
    // $(".m-combobox__input").on('focusin', function () {
    //   Combobox.closeAllDropdown();
    // })
    $("input").on('focusin', function () {
      Combobox.closeAllDropdown();
    })


    // Mở dropdown khi nhập input
    $(".m-combobox__input").on('input', function () {
      Combobox.openDropdownByInput($(this));
    })


    // Xử lý các sự kiện ấn bàn phím
    $(".m-combobox__input, .m-combobox__btn").on('keydown', function (event) {
      // Lấy ra combobox
      var container = $(this).parents(".m-combobox");
      var itemsHide = container.find(".m-combobox__dropdown__item.hide");

      // Các items không bị ẩn
      var itemsShow = container.find(".m-combobox__dropdown__item:not(.hide)");
      // set trạng thái active
      Combobox.addActive(itemsShow);

      if (!container.is(".open")) {
        // Nếu dropdown đang đóng, ấn Enter hoặc Alt + Arrow Down để mở
        if (event.key == "Enter" || (event.altKey && event.keyCode == 40)) {
          Combobox.openDropdown(container);
        }
      } else {
        // Nếu dropdown đang mở
        if (event.altKey && event.keyCode == 38) { // ấn Alt + Arrow Up để đóng
          Combobox.closeDropdown(container); 
        } else if (event.keyCode == 40) { // ấn Arrow Down để chuyển xuống item bên dưới
          Combobox.currentFocus++; 
          Combobox.addActive(itemsShow);
        } else if (event.keyCode == 38) { // ấn Arrow Up để chuyển lên item bên trên
          Combobox.currentFocus--;
          Combobox.addActive(itemsShow);
        } else if (event.key == "Enter") { // ấn Enter để chọn item => thay đổi giá trị của input
          Combobox.selectDropdownItem(itemsShow.eq(Combobox.currentFocus));
        }
      }

    })
    //#endregion

    // sư kiện click chọn item trong dropdown list
    $(".m-combobox__dropdown__item").click(function () {
      Combobox.selectDropdownItem($(this));
    })


  }

  /**
   * Đóng tất cả combobox
   * @author pthieu (12-07-2021)
   */
  static closeAllDropdown() {
    // Loại bỏ trạng thái active của tất cả các item trong dropdown list
    Combobox.removeActive($(".m-combobox__dropdown__item"));
    // đóng tất cả combobox
    $(".m-combobox").removeClass("open");
  }

   /**
   * Đóng combobox được chỉ đinh
   * @param {element} el m-combobox (có class=".m-combobox")
   * @author pthieu (12-07-2021)
   */
  static closeDropdown(el) {
    // Loại bỏ trạng thái active của các item
    Combobox.removeActive($(el).find(".m-combobox__dropdown__item"));
    // đóng combobox
    $(el).removeClass("open");
  }

  /**
   * Mở combobox được chỉ đinh
   * @param {element} el m-combobox (có class=".m-combobox")
   * @author pthieu (12-07-2021)
   */
  static openDropdown(el) {
    // Đóng tất cả combobox
    Combobox.closeAllDropdown();

    // Mở combobox được chỉ định
    $(el).addClass("open");

    // Reset giá trị currentFocus và set trạng thái active cho item đầu tiên trong list
    Combobox.currentFocus = 0;
    var itemsShow = $(el).find(".m-combobox__dropdown__item:not(.hide)");
    Combobox.addActive(itemsShow);

    // Lấy ra giá trị text trong ô input
    var value = $(el).getText();
    // var value = $(el).find(".m-combobox__input").val();

    // add/remove trạng thái selected của các item trong list
    $(itemsShow).each(function () {
      if ($(this).text() == value) {
        $(this).addClass("selected");
      } else {
        $(this).removeClass("selected");
      }
    })
  }

  /**
   * Đóng/Mở combobox bằng .m-combobox__btn
   * @param {element} el m-combobox__btn (có class=".m-combobox__btn")
   * @author pthieu (12-07-2021)
   */
  static toggleDropdownByButton(el) {
    // Lấy ra combobox
    var container = $(el).parent();

    if (container.is(".open")) {
      // Nếu combobox đang mở thì đóng lại
      Combobox.closeDropdown(container);
    } else {
      // Nếu combobox đang đóng thì mở ra
      // Hiện tất cả các item trong dropdown list
      container.find(".m-combobox__dropdown__item").removeClass("hide");
      Combobox.openDropdown(container)
    }
  }

  /**
   * Mở combobox bằng .m-combobox__input
   * @param {element} el m-combobox__input (có class=".m-combobox__input")
   * @author pthieu (12-07-2021)
   */
  static openDropdownByInput(el) {
    // Lấy ra combobox
    // Chú ý input đã được tự động wrap khi thêm btn clear text
    // Vì vậy input không còn là con trực tiếp của combobox
    var container = $(el).parents(".m-combobox");

    // Giá trị của input
    var value = $(el).val();
    // Loại bỏ dấu tiếng Việt
    var valueNonAccent = CommonFunction.nonAccentVietnamese(value);

    // Duyệt tất cả item trong dropdown list
    container.find(".m-combobox__dropdown__item").each(function () {
      // Lấy text
      var text = $(this).text();

      // Cắt text và loại bỏ dấu tiếng Việt
      var textSliceNonAccent = CommonFunction.nonAccentVietnamese(text.slice(0, value.length));

      // Thiết lập ẩn/hiện item
      if (textSliceNonAccent === valueNonAccent) {
        $(this).removeClass("hide");
      } else {
        $(this).addClass("hide");
      }

      // Thiết lập trạng thái selected cho item
      if (text == value) {
        $(this).addClass("selected");
      } else {
        $(this).removeClass("selected");
      }
    });

    // mở combobox
    Combobox.openDropdown(container);
  }

  /**
   * Thiết lập trạng thái active cho item trong dropdown list
   * @param {*} itemsShow danh sách các item(.m-combobox__dropdown__item) đang ở trạng thái hiện
   * @author pthieu (12-07-2021)
   */
  static addActive(itemsShow) {
    // Loại bỏ trạng thái active của tất cả item
    Combobox.removeActive(itemsShow);

    // Nếu currentFocus vượt quá length thì set = 0
    if (Combobox.currentFocus >= itemsShow.length) {
      Combobox.currentFocus = 0;
    }

    // Nếu currentFocus âm thì set về cuối danh sách
    if (Combobox.currentFocus < 0) {
      Combobox.currentFocus = itemsShow.length - 1;
    }

    // Thêm trạng thái active cho item tương ứng với chỉ số currentFocus
    $(itemsShow).eq(Combobox.currentFocus).addClass("active");
  }

  /**
   * Loại bỏ trạng thái active cho tất cả item trong dropdown list
   * @param {*} itemsShow danh sách các item(.m-combobox__dropdown__item) đang ở trạng thái hiện
   * @author pthieu (12-07-2021)
   */
  static removeActive(itemsShow) {
    $(itemsShow).removeClass("active");
  }

  /**
   * Xử lý sự kiện khi chọn 1 item trong dropdown list (bằng chuột/bàn phím)
   * @param {*} el item(class=".m-combobox__dropdown__item")
   * @author pthieu (12-07-2021)
   */
  static selectDropdownItem(el) {
    // Lấy ra combobox => đóng dropdown
    var container = $(el).parents(".m-combobox");
    Combobox.closeDropdown(container);

    // set trạng thái selected cho item
    $(el).siblings(".selected").removeClass("selected");
    $(el).addClass("selected");

    // Thay đổi giá trị trong ô input
    var input = container.find(".m-combobox__input");
    input.val($(el).text());
    // Kích hoạt sự kiện myLoad (ẩn/hiện btn clear text)
    // Kích hoạt sự kiện mySelect (validate)
    input.trigger("myLoad");
    input.trigger("mySelect");
  }

}


// Bổ sung 1 số hàm cho jQuery selector
jQuery.fn.extend({

  /**
   * Lấy ra dữ liệu của combobox
   * @returns {array} mảng data | null
   * @author pthieu (12-07-2021)
   */
  getData: function () {
    if ($(this).is(".m-combobox")) {
      return $(this).data("data");
    }
    return null;
  },
  /**
   * Lấy ra value (id) tương ứng với giá trị trong ô input của combobox
   * @returns {string} value (id) | null
   * @author pthieu (12-07-2021)
   */
  getValue: function () {
    if ($(this).is(".m-combobox")) {
      var inputValue = $(this).find(".m-combobox__input").val();
      var data = $(this).getData();
      var len = data.length;
      for (var i = 0; i < len; ++i) {
        if (data[i].text === inputValue) {
          return data[i].value;
        }
      }
    }
    return null;
  },
  /**
   * Lấy ra giá trị trong ô input của combobox
   * @returns {string} text | null
   * @author pthieu (12-07-2021)
   */
  getText: function () {
    if ($(this).is(".m-combobox")) {
      var inputValue = $(this).find(".m-combobox__input").val();
      // var data = $(this).getData();
      // var len = data.length;
      // for(var i = 0; i < len; ++i) {
      //   if(data[i].text === inputValue) {
      //     return inputValue;
      //   }
      // }
      return inputValue;
    }
    return null;
  },
  /**
   * Lấy ra text tương ứng với id (trong dữ liệu data của combobox)
   * @param {string} value id
   * @returns {string} text | null
   * @author pthieu (12-07-2021)
   */
  getTextByValue: function (value) {
    if ($(this).is(".m-combobox")) {
      var data = $(this).getData();
      var len = data.length;
      for (var i = 0; i < len; ++i) {
        if (data[i].value === value) {
          return data[i].text;
        }
      }
    }
    return null;
  }

})






