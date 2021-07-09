$(document).ready(function () {
  new Combobox(".combobox-container[data-name=Department]", "cukcuk.manhnv.net", "api/Department", "Department");
  new Combobox(".combobox-container[data-name=Position]", "cukcuk.manhnv.net/v1", "Positions", "Position");
  makeCombobox();
})

class Combobox {
  // Container = null;
  // HostName = "cukcuk.manhnv.net/v1";
  // ApiName = null;
  // Name = null;

  constructor(container = null, hostName = "cukcuk.manhnv.net/v1", apiName = null, name = null) {
    this.Container = container;
    this.HostName = hostName;
    this.ApiName = apiName;
    this.Name = name;
    this.loadListItem();
  }

  loadListItem() {
    let me = this;
    let container = $(me.Container);

    $.ajax({
      method: "GET",
      url: `http://${me.HostName}/${me.ApiName}`,

    }).done(function (response) {
      let data = response;
      let list = $(container).children(".dropdown");
      $.each(data, function (index, item) {
        var propertyName = me.Name + "Name";
        var li = `<li><i class="fas fa-check"></i>${item[propertyName]}</li>`;
        list.append(li);
      });




      selectItemInDropdown();

    }).fail(function (response) {
      console.log(response)
      ToastMessage.add("danger", "Tải dữ liệu thất bại!");
    })

  }
}


function makeCombobox() {

  // Ẩn tất cả dropdown khi click ra ngoài
  $(document).click(function (event) {
    var el = event.target;
    // console.log(el)
    if ($(".combobox-container").has(el).length == 0 && !$(".combobox-container").is(el)) {
      // console.log($(".combobox-container").has(el))
      closeAllDropdown();
    }
  })

  $(".combobox-container button").click(function () {
    toggleDropdownByButton.call(this);
  })

  $(".selectbox input").click(function () {
    toggleDropdownByButton.call(this);
  })

  $(".combobox-container input:not([readonly])").on('input', function () {
    var container = $(this).parents(".combobox-container");
    openDropdown(container);
    var value = CommonFunction.nonAccentVietnamese($(this).val()).toLowerCase();
    container.find("li").each(function () {
      var text = CommonFunction.nonAccentVietnamese($(this).text()).toLowerCase();
      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
      if(text == value) {
        $(this).addClass("selected");
      } else {
        $(this).removeClass("selected");
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
  if (container.is(".open-dropdown")) {
    container.removeClass("open-dropdown");
  } else {
    container.find("li").show();
    openDropdown(container);
  }
}

function openDropdown(container) {
  closeAllDropdown();
  container.addClass("open-dropdown");
  var value = container.find(".combobox-input input").val();
  value =  CommonFunction.nonAccentVietnamese(value).toLowerCase();
  console.log(value)
  var lis = container.find(".combobox-dropdown li");
  $.each(lis, function(index, item) {
    var text = CommonFunction.nonAccentVietnamese($(item).text()).toLowerCase();
      if(text == value) {
        $(item).addClass("selected");
      } else {
        $(item).removeClass("selected");
      }
  })
  if (!container.find("input").is("[readonly]")) {
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
  $(".combobox-dropdown li").click(function () {
    var container = $(this).parents(".combobox-container");
    $(this).siblings(".selected").removeClass("selected");
    $(this).addClass("selected");

    container.removeClass("open-dropdown");

    var input = container.find("input");
    input.val($(this).text());
    input.siblings(".btn-clear-text").show();

  })
}




