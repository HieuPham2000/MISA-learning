$(document).ready(function () {
  loadData();
  initEvents();
})

/** ------------------------------
 * Khởi tạo sự kiện cho các sự kiện
 * Author: PTHieu (05/07/2021)
 */
function initEvents() {
  // nguyên tắc: 1. thành phần được render trước khi gọi lệnh
  // Cách 1: chuyển xuống dưới (chỗ ajax)
  // Cách 2: 

  // không hoạt động đúng do thực hiện trước khi loadData tạo ra tr xong
  // $("tr").click(function() {
  //   alert("Á");
  // })


  // đảm bảo tbody đã có trước
  // có thể dùng document, nhưng khoanh vùng như này rộng quá
  // khoanh vùng càng hẹp càng tốt. Cần khoanh vùng chuẩn.
  $("tbody").on("click", "tr", function() {
    // alert("Á");
    // Hiển thị dialog thông tin chi tiết của nhân viên
    // $(".modal-container").show();

    // highlight row -> thay đổi background của tr click
    // Xóa tất cả background của các tr khác
    // hoặc có thể xóa background của tất cả tr trước
    $("tr").siblings().removeAttr("style");
    $(this).css("background", "greenyellow");    
  })

  $("tbody").on("dblclick", "tr", function() {
    // alert("Á");
    // Hiển thị dialog thông tin chi tiết của nhân viên
    $(".modal-container").show();    
  })

  $(".m-btn").click(function() {
    alert("Ối");
  })
}

/** ------------------------------
 * Load dữ liệu danh sách nhân viên
 * Author: PTHieu (05/07/2021)
 * 
 */
function loadData() {

  // 1. Lấy dữ liệu từ API về
  // $.ajax({
  //   url: "http://cukcuk.manhnv.net/v1/Employees",
  //   method: "GET",
  // }).done(function(res) {
  //   var data = res;
  //   debugger
  // }).fail(function(res) {
  // })
  $.ajax({
    method: "GET", // GET: lấy dữ liệu; POST: thêm mới; PUT: Sửa; DELETE: Xóa (thực tế có thể thay thế nhau, nhưng do chuẩn Restful) 
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
      
      let employeeCode = item.EmployeeCode;
      let fullName = item.FullName;
      let genderName = item.GenderName;
      genderName = genderName ? genderName : "";

      // 1. Định dạng ngày / tháng / năm
      let dateOfBirth = formatDateDDMMYYYY(item.DateOfBirth);
      
      let phoneNumber = item.PhoneNumber;

      // 2. Định dạng tiền lương
      let salary = item.Salary;
      salary = salary ? salary.toLocaleString("it-IT") : "";

      let positionName = item.PositionName;
      positionName = positionName ? positionName : "";

      let email = item.Email;
      let address = item.IdentityPlace;
      let departmentName = item.DepartmentName;
      departmentName = departmentName ? departmentName : "";

      let workStatus = item.WorkStatus;
      workStatus = workStatus ? workStatus : "";
      
      let tr = `
          <tr>
            <td>${employeeCode}</td>
            <td>${fullName}</td>
            <td>${genderName}</td>
            <td class="text-align-center">${dateOfBirth}</td>
            <td>${address}</td>
            <td>${phoneNumber}</td>
            <td>${email}</td>
            <td>${positionName}</td>
            <td>${departmentName}</td>
            <td class="text-align-right">${salary}</td>
            <td>${workStatus}</td>
          </tr>
      `;
      $("tbody").append(tr);
    })


  }).fail(function (response) {
    alert("Load thất bại!");
  })



  // 3. Hiển thị dữ liệu (binding dữ liệu lên table)
}

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
  // return(dateOrigin.toLocaleDateString());
  return dateString;
}