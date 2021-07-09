$(document).ready(function () {
  new EmployeePage();
})

class EmployeePage extends BasePage {
  Title = "Danh sách nhân viên";
  TableList = $("#tablelist-employee");
  Form = $("#form-employee");
  RowId = "EmployeeId";
  ApiName = "Employees";
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
   * @param {*} value giá trị cần format
   * @param {string} fieldName tên trường trong mẫu json post
   * @returns {*} giá trị đã format
   * 
   * Author: pthieu (08/07/2021)
   */
  formatValueToSave(value, fieldName) {
    
    switch(fieldName) {
      case "salary":
        value = value.replaceAll(".", "");
        value = value.replaceAll(",", "");
        return Number(value);
      case "gender":
        var mapGender = {"Nữ": 0, "Nam": 1, "Không xác định": 2};
        return mapGender[value];
      default:
        if(value == "") {
          return null;
        }
        return value;
    }
  }

  /**
   * Định dạng giá trị để hiển thị
   * @param {*} value giá trị cần format
   * @param {string} formatType tên loại định dạng
   * @returns {*} giá trị đã format
   * 
   * Author: pthieu (08/07/2021)
   */
   formatValueToShow(value, formatType) {
    
    switch(formatType) {
      case "salary":
        return CommonFunction.formatMoney(value);
      case "dd/mm/yyyy":
       return CommonFunction.formatDateDDMMYYYY(value);
      case "yyyy-mm-dd":
        return CommonFunction.formatDateYYYYMMDD(value);
      case "work-status":
        return CommonFunction.formatWorkStatus(value);
      case "gender":
        var mapGender = ["Nữ", "Nam", "Không xác định"];
        return mapGender[value];
      default:
        return CommonFunction.formatData(value);
    }
  }
}

