class BasePage {
  Title = null;
  TableList = null;
  Form = null;
  RowId = null;
  HostName = "cukcuk.manhnv.net/v1";
  ApiName = null;
  NewCodeName = null;
  Data = {};


  constructor() {
    // this.loadData();
    // this.initEvents();
  }

  //#region Khởi tạo sự kiện
  /**
   * Khởi tạo sự kiện
   * 
   * Author: pthieu (05/07/2021)
   */
  initEvents() {
    let me = this;
    var table = me.TableList;
    var form = me.Form;
    var inputs = $(form).find("input");
    var inputEntityCode = $(inputs).eq(0);


    // Sự kiện cho nút refresh trên thanh toolbar
    $("#btn-refresh").click(function () {
      me.loadData(true);
    });

    // Sự kiện double click vào hàng => mở fỏm
    $(table).on("dblclick", "tr", async function () {
      // Bỏ tất cả dấu check và xóa background
      $(this).parent().find("i").removeClass("fas fa-check-square").addClass("far fa-square");
      $(this).siblings().removeClass("selected");
      // Thêm check và thêm background
      $(this).find("i").removeClass("far fa-square").addClass("fas fa-check-square");
      $(this).addClass("selected");

      // Hiển thị dialog thông tin chi tiết 
      var id = $(this).data(me.RowId);
      var flag = await me.getData(id);
      if (flag) {
        $(form).data(me.RowId, id);
        openModal();
      }
    })

    // Sự kiện click hàng => thay đổi checkbox và highlight
    $(table).on("click", "tr", function () {
      $(this).find("i").toggleClass("far fa-square fas fa-check-square");
      // highlight row -> thay đổi background của tr click
      $(this).toggleClass("selected");
    })

    //#region Sự kiện mở form thêm mới (trước đó cần lấy mã code mới để set cho form)

    // Cách 1: sử dụng hàm getNewCode() với $.ajax async = false
    // $("#btn-open-form").click(function () {
    //   var newCode = me.getNewCode();
    //   if (newCode) {
    //     openModal();
    //     $(form).find("input").eq(0).val(newCode);
    //   }
    // })

    // Cách 2: sử dụng promise then...
    // $("#btn-open-form").click(function () {
    //   me.getNewCode().then(
    //     function(value) {
    //       console.log(value)
    //       // if (value) {
    //         openModal();
    //         $(form).find("input").eq(0).val(value);
    //       // }
    //     },
    //     function(error) {
    //       console.log(error);
    //     }
    //   );
    // })

    // Cách 3: sử dụng async/await
    $("#btn-open-form").click(async function () {
      var value = await me.getNewCode()
      if (value) {
        // $(form).find("input").eq(0).val(value);
        inputEntityCode.val(value);
      }
      // mở form cả khi lấy mã mới bị lỗi
      inputs.trigger("myLoad");
      openModal();
    });
    //#endregion


    // Sự kiện submit form (add/update)
    $(form).find("#btn-submit").click(function () {
      var id = $(form).data(me.RowId);
      console.log(id);
      if (id) {
        me.update(id);
      } else {
        me.add();
      }

      $(form).removeData(me.RowId);
      closeModal();
    });

    // Sự kiện đóng form
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

    // Sự kiện ấn nút xóa
    $("#btn-delete").click(function () {
      var trs = $(table).find("tr.selected");
      if (trs.length === 0) {
        ToastMessage.add("danger", "Chưa chọn bản ghi!");
      } else if (trs.length === 1) {
        var index = $(trs).children("td").eq(1).text();
        var code = $(trs).children("td").eq(2).text();
        var popupObject = {
          title: `Xóa bản ghi #${index}`,
          text: `Bạn có chắc muốn xóa bản ghi #${index} - mã "${code}" hay không?`,
          btnTextCancel: "Hủy",
          btnTextDo: "Xóa",
          do: function () {
            me.delete(trs.data(me.RowId));
          }
        }
        PopUp.add("danger", popupObject);
      } else {
        var popupObject = {
          title: `Xóa ${trs.length} bản ghi`,
          text: `Bạn có chắc muốn xóa ${trs.length} bản ghi hay không?`,
          btnTextCancel: "Hủy",
          btnTextDo: "Xóa",
          do: function () {
            me.deleteMany(trs);
          }
        }
        PopUp.add("danger", popupObject);
      }

    });

  }
  //#endregion

  //#region format value
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
  //#endregion

  //#region get/load data
  /**
   * Load tất cả dữ liệu danh sách 
   * @param {boolean} msg truyền true nếu muốn trả về toast message, mặc định là fasle
   * 
   * Author: pthieu (05/07/2021)
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

      if (msg) {
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
  async getData(id) {
    let me = this;
    let res = false;
    // 1. Lấy dữ liệu từ API về
    res = await $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}/${id}`,
    }).done(function (response) {
      // 2. Xử lý dữ liệu
      try {
        console.log(response)
        var item = response;
        var form = me.Form;
        var inputs = $(form).find(".form-item input");

        $.each(inputs, function (inputIndex, inputItem) {

          var propertyName = $(inputItem).attr("name");
          var value = item[propertyName];
          var formatType = $(inputItem).attr("formattype");
          value = me.formatValueToShow(value, formatType);

          $(inputItem).val(value);
          // if($(this).val() !== "") {
          //   $(this).siblings(".btn-clear-text").show();
          // }
          $(inputItem).trigger("myLoad");
        })

        res = true;
      } catch (error) {
        console.log(error);
        ToastMessage.add("danger", `Có lỗi xảy ra! Hãy thử làm mới dữ liệu!`);
      }
    }).fail(function (response) {
      console.log(error);
      ToastMessage.add("danger", `Có lỗi xảy ra! Hãy thử làm mới dữ liệu!`);
    })
    return res;
  }

  /**
   * Lấy mã nhân viên mới (sử dụng async = false)
   * @returns null | mã code
   * 
   * Author: pthieu (09/07/2021)
   */
  // getNewCode() {
  //   let me = this;
  //   var res = null;
  //   $.ajax({
  //     method: "GET",
  //     url: `http://${me.HostName}/${me.ApiName}/${me.NewCodeName}`,
  //     async: false,
  //   }).done(function (response) {
  //     // console.log(response)
  //     res = response;
  //   }).fail(function (response) {
  //     ToastMessage.add("danger", `Có lỗi xảy ra! Hãy thử làm mới dữ liệu!`);
  //   })

  //   return res;
  // }

  /**
   * Lấy mã nhân viên mới (sử dụng async/await)
   * @returns null | mã code
   * 
   * Author: pthieu (09/07/2021)
   */
  async getNewCode() {
    let me = this;
    var res = null;
    try {
      res = await $.ajax({
        method: "GET",
        url: `http://${me.HostName}/${me.ApiName}/${me.NewCodeName}`,
      })
    } catch (error) {
      console.error(error)
      ToastMessage.add("danger", `Lấy mã mới không thành công!`);
    }

    return res;
  }
  //#endregion

  //#region add/update data
  /**
   * Thêm bản ghi mới
   * @author pthieu (09-07-2021)
   */
  add() {
    let me = this;

    var data = { ...me.Data };
    // let data= Object.assign({}, me.Data);
    // let data = JSON.parse(JSON.stringify(me.Data));
    var form = me.Form;
    var inputs = $(form).find(".form-item input");

    $.each(inputs, function (inputIndex, inputItem) {
      var propertyName = $(inputItem).attr("name");
      propertyName = propertyName[0].toLowerCase() + propertyName.slice(1);

      var value = $(inputItem).val();

      data[propertyName] = me.formatValueToSave(value, propertyName);
    })

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

  /**
   * Cập nhật bản ghi ứng với id
   * @param {string} id vd: EmployeeId
   * @author pthieu (09-07-2021)
   */
  update(id) {
    let me = this;
    var data = { ...me.Data };
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
      console.log(response)
      ToastMessage.add("danger", "Có lỗi xảy ra! Cập nhật thất bại!");
    })
  }
  //#endregion

  //#region delete data
  /**
   * Xóa bản ghi tương ứng với id
   * @param {string} id RowId (Vd: EmployeeId)
   * 
   * Author: pthieu (08/07/2021)
   */
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

  /**
   * Xóa các bản ghi tương ứng các row được chọn
   * @param {object} trs jQuery.fn.init - danh sách các selected row lấy bằng jQuery selector
   * 
   * Author: pthieu (09/07/2021)
   */
  deleteMany(trs) {
    let me = this;
    var success = [];
    var error = [];

    $.each(trs, function (trIndex, trItem) {
      var id = $(trItem).data(me.RowId);
      var obj = {
        id: id,
        code: $(trItem).children("td").eq(1).text()
      }
      $.ajax({
        method: "DELETE",
        url: `http://${me.HostName}/${me.ApiName}/${id}`,
      }).done(function (response) {
        success.push(obj);
      }).fail(function (response) {
        error.push(obj);
      })
    })

    ToastMessage.add("warning", `Đang xóa ${trs.length} bản ghi! Bạn vui lòng chờ trong giây lát!`);

    setTimeout(function () {
      if (success.length != 0) {
        ToastMessage.add("success", `Xóa thành công ${success.length} bản ghi!`);
      }

      if (error.length != 0) {
        ToastMessage.add("danger", `Xóa thất bại ${error.length} bản ghi!`);
      }
      me.loadData();
    }, 2000);
  }
  //#endregion


}