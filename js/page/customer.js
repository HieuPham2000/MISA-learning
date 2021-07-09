$(document).ready(function() {
  new CustomerPage();
})
class CustomerPage {
  Title = "Danh sách khách hàng";
  TableList = $("#tbListData")
  constructor() {
    this.loadData();
  }

  /**
   * Lấy dữ liệu danh sách khách hàng
   * 
   * Author: pthieu (07/07/2021)
   */
  loadData() {
    // Gọi api lấy dữ liệu
    $.ajax({
      method: "GET",
      url: "http://cukcuk.manhnv.net/v1/Employees"
    }).done(res => {
      console.log(res);

      $.each(res, function (index, item) {

        // Xử lý dữ liệu
        let employeeCode = formatData(item.EmployeeCode);
  
        let fullName = formatData(item.FullName);
  
        let genderName = formatData(item.GenderName);
  
        // Định dạng ngày / tháng / năm
        let dateOfBirth = formatDateDDMMYYYY(item.DateOfBirth);
        
        let phoneNumber = formatData(item.PhoneNumber);
  
  
        let email = formatData(item.Email);
  
        let address = formatData(item.Address);
  
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
            </tr>
        `;
        $("tbody").append(tr);
        $("tbody tr").last().data("id", item.EmployeeId);
    })
    }).fail(res => {
      alert("Lỗi lấy dữ liệu!");
    })

  }

  add() {

  }

  update() {

  }

  delete() {

  }

  paging() {

  }

  search() {

  }
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