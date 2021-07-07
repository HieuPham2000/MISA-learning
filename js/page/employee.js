$(document).ready(function () {
  loadData();
  initEvents();
})

/** ------------------------------
 * Khởi tạo sự kiện
 * Author: pthieu (05/07/2021)
 */
function initEvents() {
  $("tbody").on("dblclick", "tr", function() {
    // Bỏ tất cả dấu check
    $(this).parent().find("i").removeClass("fas fa-check-square").addClass("far fa-square");
    // Xóa background
    $(this).siblings().removeClass("selected");
    // Thêm check
    $(this).find("i").removeClass("far fa-square").addClass("fas fa-check-square");
    // Thêm background
    $(this).addClass("selected");

    // Hiển thị dialog thông tin chi tiết của nhân viên
    $(".modal-container").show();  
  })

  // $("tbody").on("click", "i", function() {
  //   $(this).toggleClass("far fa-square");    
  //   $(this).toggleClass("fas fa-check-square");  
  //   // highlight row -> thay đổi background của tr có checkbox được check
  //   $(this).parents("tr").toggleClass("selected");
  // })

  $("tbody").on("click", "tr", function() {
    $(this).find("i").toggleClass("far fa-square");    
    $(this).find("i").toggleClass("fas fa-check-square");  
    // highlight row -> thay đổi background của tr click
    $(this).toggleClass("selected");
  })

}

/** ------------------------------
 * Load dữ liệu danh sách nhân viên
 * Author: pthieu (05/07/2021)
 * 
 */
function loadData() {

  // 1. Lấy dữ liệu từ API về
  $.ajax({
    method: "GET", // GET: lấy dữ liệu; POST: thêm mới; PUT: Sửa; DELETE: Xóa
    url: "http://cukcuk.manhnv.net/v1/Employees",
    // data: "" // Tham số cần thiết cho API(nếu có)
    // contentType: "application/json",
    // dataType: "json"
  }).done(function (response) {
    // 2. Xử lý dữ liệu
    console.log(response);
    // console.table(response);
    let data = response;

    // $("tbody").empty();

    // Duyệt từng đối tượng xử lý thông tin
    $.each(data, function (index, item) {

      // Xử lý dữ liệu
      let employeeCode = formatData(item.EmployeeCode);

      let fullName = formatData(item.FullName);

      let genderName = formatData(item.GenderName);

      // Định dạng ngày / tháng / năm
      let dateOfBirth = formatDateDDMMYYYY(item.DateOfBirth);
      
      let phoneNumber = formatData(item.PhoneNumber);

      // Định dạng tiền lương
      let salary = formatMoney(item.Salary);

      let positionName = formatData(item.PositionName);

      let email = formatData(item.Email);

      let address = formatData(item.IdentityPlace);

      let departmentName = formatData(item.DepartmentName);

      let workStatus = formatWorkStatus(item.WorkStatus);

      // 3. Hiển thị dữ liệu (binding dữ liệu lên table)
      let tr = `
          <tr>
            <td><i class="far fa-square"></i></td>
            <td>${index + 1}</td>
            <td>${employeeCode}</td>
            <td>${fullName}</td>
            <td>${genderName}</td>
            <td class="text-align-center">${dateOfBirth}</td>
            <td>${address}</td>
            <td>${phoneNumber}</td>
            <td>${email}</td>
            <td>${positionName}</td>
            <td>${departmentName}</td>
            <td class="text-align-right padding-right-10px">${salary}</td>
            <td>${workStatus}</td>
          </tr>
      `;
      $("tbody").append(tr);
    })
  }).fail(function (response) {
    alert("Load dữ liệu thất bại!");
  })
}

/**
 * Định dạng dữ liệu lấy từ loadData, nếu null thì trả về ""
 * @param {*} data 
 * @returns string
 * Author: pthieu (06/07/2021)
 */
 function formatData(data) {
  if(data) {
    return data;
  }
  return "";
}

/** --------------------------------------------------
 * Format dữ liệu ngày tháng theo định dạng dd/mm/yyyy
 * Author: pthieu (05/07/2021)
 */
function formatDateDDMMYYYY(date) {
  // if(date == null || date == undefined) {
  //   alert("Lỗi ngày tháng");
  // }
  if(!date) {
    return '';
  }
  let dateOrigin = new Date(date);

  let d = dateOrigin.getDate();
  d = d > 9 ? d : `0${d}`;
  let m = dateOrigin.getMonth() + 1; // tháng bắt đầu từ 0
  m = m > 9 ? m : `0${m}`;
  let y = dateOrigin.getFullYear();
  let dateString = `${d}/${m}/${y}`;
  return dateString;
  // return(dateOrigin.toLocaleDateString());
}

/**
 * Định dạng tiền lương theo dạng xxx.xxx.xxx
 * @param {number} salary giá trị tiền lương
 * @returns string định dang xxx.xxx.xxx
 * Author: pthieu (06/07/2021)
 */
function formatMoney(salary) {
  return salary ? salary.toLocaleString("it-IT") : "";
}

/**
 * Chuyển mã work status sang trạng thái tương ứng
 * @param {number} code 
 * @returns string tương ứng mã code
 * Author: pthieu (06/07/2021)
 */

 function formatWorkStatus(code) {
  const code1 = "Đã nghỉ việc";
  const code2 = "Đang thử việc";
  const code3 = "Đang làm việc";
  switch(code) {
    case 1:
      return code1;
    case 2:
      return code2;
    case 3:
      return code3;
    default:
      return "";
  }
}

