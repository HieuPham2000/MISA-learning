$(document).ready(function() {
  $("#filter-department .m-combobox__input").on("change mySelect", function() {
    var container = $(this).parents(".m-combobox");
    var departmentId = container.getValue();
    if(departmentId != null) {
      loadDataFilter(departmentId);
    }
    
  })
})

 function loadDataFilter(departmentId, msg = false) {

  let me = this;

  // 1. Lấy dữ liệu từ API về
  $.ajax({
    method: "GET",
    url: `http://cukcuk.manhnv.net/v1/Employees/employeeFilter?pageSize=100&pageNumber=1&employeeFilter=NV&departmentId=${departmentId}`,

  }).done(function (response) {

    // Xác định table sẽ đổ dữ liệu
    let table = me.TableList;
    // 2. Xử lý dữ liệu
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

    // Nếu tham số msg = true thì hiện toast msg thông báo
    if (msg) {
      ToastMessage.add("success", "Dữ liệu đã được cập nhật!");
    }
  }).fail(function (response) {
    ToastMessage.add("danger", "Tải dữ liệu thất bại!");
  })
}