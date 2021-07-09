$(document).ready(function() {
  makeCombobox();
})

class Combobox {
  Title = null;
  List = null;
  HostName = "cukcuk.manhnv.net/v1";
  ApiName = null;

  constructor() {
    this.loadListItem();
  }

  loadListItem() {
    let me = this;

    // 1. Lấy dữ liệu từ API về
    $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}`,

    }).done(function (response) {

      let list = me.List;

      console.log(response);
      let data = response;

      // Làm trống bảng
      $(table).find("tbody").empty();

      // Duyệt từng đối tượng xử lý thông tin
      $.each(data, function (index, item) {


        $(table).find("tbody").append(trHtml);
      })

    }).fail(function (response) {
      ToastMessage.add("danger", "Tải dữ liệu thất bại!");
    })

  }
}

function makeCombobox() {
  
  // Ẩn tất cả dropdown khi click ra ngoài
  $(document).click(function(event) {
    var el = event.target;
    // console.log(el)
    if( $(".combobox-container").has(el).length == 0 && !$(".combobox-container").is(el)) {
      // console.log($(".combobox-container").has(el))
      closeAllDropdown();
    }
  })

  $(".combobox-container button").click(function() {
    toggleDropdownByButton.call(this);
  })

  $(".selectbox input").click(function() {
    toggleDropdownByButton.call(this);
  })

  $(".combobox-container input:not([readonly])").on('input', function() {
    var container = $(this).parents(".combobox-container");
    openDropdown(container);
    var value = $(this).val().toLowerCase();
    container.find("li").each(function() {
      if($(this).text().toLowerCase().indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    })
  })

  selectItemInDropdown();

}

function closeAllDropdown() {
  $(".combobox-container").removeClass("open-dropdown");
  $(".combobox-input").css("border", "1px solid #bbbbbb");
  $(".selectbox .combobox-input").css("border", "none");
}

function toggleDropdownByButton() {
  // $(this).parents(".combobox-container").toggleClass("open-dropdown");
  var container = $(this).parents(".combobox-container");
  if(container.is(".open-dropdown")) {
    container.removeClass("open-dropdown");
  } else {
    openDropdown(container);
  }
}

function openDropdown(container) {
  closeAllDropdown();
  container.addClass("open-dropdown");
  if(!container.find("input").is("[readonly]")) {
    container.children(".combobox-input").css("border", "1px solid #019160");
  }

}

function openDropdownByInput() {
  $(this).parents(".combobox-container").addClass("open-dropdown");
}

/**
 * 
 */
function selectItemInDropdown() {
  $(".combobox-dropdown li").click(function() {
    var container = $(this).parents(".combobox-container");
    $(this).siblings(".selected").removeClass("selected");
    $(this).addClass("selected");

    container.removeClass("open-dropdown");

    var input = container.find("input");
    input.val( $(this).text() );
    input.siblings(".btn-clear-text").show();

  })
}




