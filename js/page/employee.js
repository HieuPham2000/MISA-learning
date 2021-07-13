$(document).ready(function () {
  new EmployeePage();
})

class EmployeePage extends BasePage {
  Title = "Danh sách nhân viên";
  TableList = $("#tablelist-employee");
  Form = $("#form-employee");
  RowId = "EmployeeId";
  ApiName = "Employees";
  NewCodeName = "NewEmployeeCode";
  Data = {
    "createdDate": null, // string (date -> json)
    "createdBy": null, // string
    "modifiedDate": null, // string (date -> json)
    "modifiedBy": null, // string
    // "employeeId": null, // string
    "employeeCode": null, // string
    "firstName": null, // string
    "lastName": null, // string
    "fullName": null, // string
    "gender": 0, // number
    "dateOfBirth": null, // string (date -> json)
    "phoneNumber": null, // string
    "email": null, // string
    "address": null, // string
    "identityNumber": null, // string
    "identityDate": "2021-07-08T09:54:44.286Z", // string (date -> json)
    "identityPlace": null,
    "joinDate": "2021-07-08T09:54:44.286Z", // string (date -> json)
    "martialStatus": 0, // number
    "educationalBackground": 0, // number
    "qualificationId": null, // string
    "departmentId": null, // string
    "positionId": null, // string
    "workStatus": 0, // number
    "personalTaxCode": null, // string
    "salary": 0, // number
    "positionCode": null, // string
    "positionName": null, // string
    "departmentCode": null, // string
    "departmentName": null, // string
    "qualificationName": null // string
  }

  constructor() {
    super();
    this.loadData();
    this.initEvents();
    this.filter();
  }

  filter() {
    let me = this;
    $("#filter-department .m-combobox__input").on("change mySelect", function() {
      var container = $(this).parents(".m-combobox");
      var departmentId = container.getValue();
      if(departmentId != null) {
        me.loadDataFilter(departmentId);
      }
      
    })
  }

  /**
   * Định dạng giá trị theo chuẩn để post/put
   * @param {*} text giá trị cần format
   * @param {string} formatType tên loại định dạng
   * @param {element} inputItem phần tử input đang xử lý
   * @returns {*} giá trị đã format
   * 
   * Author: pthieu (08/07/2021)
   */
  formatValueToSave(text, formatType, inputItem) {
    
    switch(formatType) {
      case "salary":
        text = text.replaceAll(".", "");
        text = text.replaceAll(",", "");
        return Number(text);
      case "m-combobox":
        var container = $(inputItem).parents(".m-combobox");
        return $(container).getValue();
      default:
        if(text == "") {
          return null;
        }
        return text;
    }
  }

  /**
   * Định dạng giá trị để hiển thị
   * @param {*} value giá trị cần format
   * @param {string} formatType tên loại định dạng
   * @param {element} inputItem phần tử input đang xử lý
   * @returns {*} giá trị đã format
   * 
   * Author: pthieu (08/07/2021)
   */
   formatValueToShow(value, formatType, inputItem) {
    
    switch(formatType) {
      case "salary":
        return CommonFunction.formatMoney(value);
      case "dd/mm/yyyy":
       return CommonFunction.formatDateDDMMYYYY(value);
      case "yyyy-mm-dd":
        return CommonFunction.formatDateYYYYMMDD(value);
      case "work-status":
        var container = $(".m-combobox[data-name=WorkStatus]");
        var text = $(container).getTextByValue(value);
        return CommonFunction.formatData(text);
      case "m-combobox":
        var container = $(inputItem).parents(".m-combobox");
        return $(container).getTextByValue(value);
      default:
        return CommonFunction.formatData(value);
    }
  }

  loadDataFilter(departmentId, msg = false) {
    console.log(departmentId);
    let me = this;
  
    // 1. Lấy dữ liệu từ API về
    $.ajax({
      method: "GET",
      url: `http://cukcuk.manhnv.net/v1/Employees/employeeFilter?pageSize=10&pageNumber=1&employeeFilter=NV&departmentId=${departmentId}`,
  
    }).done(function (response) {
      console.log(response)
      // Xác định table sẽ đổ dữ liệu
      let table = me.TableList;
      // 2. Xử lý dữ liệu
      let data = response.Data;
  
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
  
      // Nếu tham số msg = true thì hiện toast msg thông báo
      if (msg) {
        ToastMessage.add("success", "Dữ liệu đã được cập nhật!");
      }
    }).fail(function (response) {
      ToastMessage.add("danger", "Tải dữ liệu thất bại!");
    })
  }
}

