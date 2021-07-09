class BasePage {
  Title = null;
  TableList = null;
  Form = null;
  RowId = null;
  HostName = "cukcuk.manhnv.net/v1";
  ApiName = null;
  Data = {};


  constructor() {
    // this.loadData();
    // this.initEvents();
  }

  /**
   * Khởi tạo sự kiện
   * 
   * Author: pthieu (05/07/2021)
   */
  initEvents() {
    let me = this;
    var table = me.TableList;
    var form = me.Form;

    $("#btn-refresh").click(function () {
      me.loadData(true);
    });

    $(table).on("dblclick", "tr", function () {
      // Bỏ tất cả dấu check và xóa background
      $(this).parent().find("i").removeClass("fas fa-check-square").addClass("far fa-square");
      $(this).siblings().removeClass("selected");
      // Thêm check và thêm background
      $(this).find("i").removeClass("far fa-square").addClass("fas fa-check-square");
      $(this).addClass("selected");

      // Hiển thị dialog thông tin chi tiết 
      var id = $(this).data(me.RowId);
      me.getData(id);
      $(form).data(me.RowId, id);
      setTimeout(function() {
        openModal();
      }, 200);

    })

    $(table).on("click", "tr", function () {
      $(this).find("i").toggleClass("far fa-square fas fa-check-square");
      // highlight row -> thay đổi background của tr click
      $(this).toggleClass("selected");
    })

    $(form).find("#btn-submit").click(function () {
      var id = $(form).data(me.RowId);
      console.log(id);
      if(id) {
        me.update(id);
      } else {
        me.add();
      }

      $(form).removeData(me.RowId);
      closeModal();
    });

    var formTitle = $(form).find(".form-title").text();
    $(form).find(".form-icon-close, .m-btn-cancel").click(function () {
      var popupObject = {
        title: `Đóng Form ${formTitle}`,
        text: `Bạn có chắc muốn đóng "Form ${formTitle}" hay không?`,
        btnTextCancel: "Tiếp tục nhập",
        btnTextDo: "Đóng",
        do: function () {
          $(form).removeData(me.RowId);
          closeModal();
        }
      }
      PopUp.add("warning", popupObject);
    });

    $("#btn-delete").click(function () {
      var tr = $(table).find("tr.selected");
      if (tr.length === 0) {
        ToastMessage.add("danger", "Chưa chọn bản ghi!");
      } else {
        var index = $(tr).children("td").eq(1).text();
        var code = $(tr).children("td").eq(2).text();
        var popupObject = {
          title: `Xóa bản ghi #${index}`,
          text: `Bạn có chắc muốn xóa bản ghi #${index} - mã "${code}" hay không?`,
          btnTextCancel: "Hủy",
          btnTextDo: "Xóa",
          do: function () {
            me.delete(tr.data(me.RowId));
          }
        }
        PopUp.add("danger", popupObject);
      }

    });

  }

  /**
   * Định dạng giá trị theo chuẩn để post/put
   * @param {*} value giá trị cần format
   * @param {string} fieldName tên trường trong mẫu json post
   * @returns {*} giá trị đã format
   * 
   * Author: pthieu (08/07/2021)
   */
  formatValueToSave(value, fieldName) {
    return value;
  }

  /**
  * Định dạng giá trị để hiển thị
  * @param {*} value giá trị cần format
  * @param {string} fieldType tên loại định dạng
  * @returns {*} giá trị đã format
  * 
  * Author: pthieu (08/07/2021)
  */
  formatValueToShow(value, formatType) {
    return value;
  }

  //#region 
  /**
   * Load dữ liệu danh sách
   * 
   * Author: pthieu (05/07/2021)
   * 
   */
  loadData(msg = false) {

    let me = this;

    // 1. Lấy dữ liệu từ API về
    $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}`,

    }).done(function (response) {

      // Xác định table sẽ đổ dữ liệu
      let table = me.TableList;
      // 2. Xử lý dữ liệu
      console.log(response);
      let data = response;

      // Làm trống bảng
      $(table).find("tbody").empty();

      // Duyệt từng đối tượng xử lý thông tin
      $.each(data, function (index, item) {

        // Khai báo html cho tr
        let trHtml = $(`<tr></tr`);
        // Lưu thông tin id
        trHtml.data(me.RowId, item[me.RowId]);

        // 2 cột đầu là mặc định: cột 1 chứa checkbox, cột 2 chứa index
        trHtml.append(`<td style="width: 40px;"><i class="far fa-square"></i></td>`);
        trHtml.append(`<td style="width: 50px;">${index + 1}</td>`);

        // Xác định có bao nhiêu cột và mỗi cột sẽ map dữ liệu với thông tin nào (từ cột 3 trở đi)
        let ths = $(table).find("thead th:gt(1)");

        // Lấy thông tin PropertyName sẽ map dữ liệu
        $.each(ths, function (columnIndex, columnItem) {
          var propertyName = columnItem.getAttribute("fieldname");
          var value = item[propertyName];
          var formatType = columnItem.getAttribute("formattype");

          value = me.formatValueToShow(value, formatType)

          var style = columnItem.getAttribute("style");
          var tdHtml = `<td style="${style}">${value}</td>`;
          trHtml.append(tdHtml);

        })

        $(table).find("tbody").append(trHtml);
      })

      if(msg) {
        ToastMessage.add("success", "Dữ liệu đã được cập nhật!");
      }
    }).fail(function (response) {
      ToastMessage.add("danger", "Tải dữ liệu thất bại!");
    })
  }

  /**
   * Load dữ liệu từ API ứng với id
   * @param {string} id 
   * 
   * Author: pthieu (05/07/2021)
   * 
   */
  getData(id) {
    let me = this;
    // 1. Lấy dữ liệu từ API về
    $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}/${id}`,
    }).done(function (response) {
      // 2. Xử lý dữ liệu
      console.log(response);
      var item = response;
      var form = me.Form;
      var inputs = $(form).find(".form-item input");

      $.each(inputs, function (inputIndex, inputItem) {

        var propertyName = $(inputItem).attr("name");
        var value = item[propertyName];
        var formatType = $(inputItem).attr("formattype");
        value = me.formatValueToShow(value, formatType);

        $(inputItem).val(value);
        $(inputItem).trigger("input");
      })

    }).fail(function (response) {
      ToastMessage.add("danger", `Tải dữ liệu #${id} thất bại!`);
    })
  }
  //#endregion

  add() {
    let me = this;

    var data = {...me.Data};
    // let data= Object.assign({}, me.Data);
    // let data = JSON.parse(JSON.stringify(me.Data));
    var form = me.Form;
    var inputs = $(form).find(".form-item input");

    // var date = (new Date()).toJSON();
    // data["createdDate"] = date;
    // data["modifiedDate"] = date;

    $.each(inputs, function (inputIndex, inputItem) {
      var propertyName = $(inputItem).attr("name");
      propertyName = propertyName[0].toLowerCase() + propertyName.slice(1);

      var value = $(inputItem).val();

      data[propertyName] = me.formatValueToSave(value, propertyName);
    })

    // console.log(JSON.stringify(data))

    $.ajax({
      method: "POST",
      url: `http://${me.HostName}/${me.ApiName}`,
      data: JSON.stringify(data), // Tham số cần thiết cho API(nếu có)
      contentType: "application/json",
      dataType: "json"
    }).done(function (response) {
      ToastMessage.add("success", "Thêm mới dữ liệu thành công!");
      me.loadData();
    }).fail(function (response) {
      ToastMessage.add("danger", "Có lỗi xảy ra! Thêm mới thất bại!");
    })
  }

  update(id) {
    let me = this;
    var data = {...me.Data};
    var form = me.Form;
    var inputs = $(form).find(".form-item input");

    $.each(inputs, function (inputIndex, inputItem) {
      var propertyName = $(inputItem).attr("name");
      propertyName = propertyName[0].toLowerCase() + propertyName.slice(1);

      var value = $(inputItem).val();
      data[propertyName] = me.formatValueToSave(value, propertyName);
    })

    $.ajax({
      method: "PUT",
      url: `http://${me.HostName}/${me.ApiName}/${id}`,
      data: JSON.stringify(data), // Tham số cần thiết cho API(nếu có)
      contentType: "application/json",
      dataType: "json"
    }).done(function (response) {
      ToastMessage.add("success", "Cập nhật dữ liệu thành công!");
      me.loadData();
    }).fail(function (response) {
      ToastMessage.add("danger", "Có lỗi xảy ra! Cập nhật thất bại!");
    })
  }

  delete(id) {
    let me = this;

    $.ajax({
      method: "DELETE",
      url: `http://${me.HostName}/${me.ApiName}/${id}`,
    }).done(function (response) {
      ToastMessage.add("success", "Xóa thành công!");
      me.loadData();
    }).fail(function (response) {
      ToastMessage.add("danger", "Xóa thất bại! Hãy thử làm mới dữ liệu!");
    })
  }


}