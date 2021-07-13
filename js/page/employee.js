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
}

