$(document).ready(function() {
  addButtonClearInput();
  makeCombobox();
})

/**
 * Thêm button xóa text trong các ô input
 * Author: pthieu (06/07/2021)
 */
function addButtonClearInput() {
  var inputs = $("input[type=text]:not(.header input), input[type=email");
  inputs.wrap('<div class="input-wrapper"></div>')
  inputs.after(`
      <div class="btn-clear-text">
        <img src="../../content/icon/x.svg" >
      </div> `);

  $(".btn-clear-text").click(function() {
    $(this).siblings("input").val("");
    $(this).siblings("input").trigger("input");
    // $(this).hide();
  })
  
  inputs.each(function() {
    if($(this).val()) {
      $(this).siblings(".btn-clear-text").show();
    }
  })
  
  inputs.on("input", function() {
    if($(this).val()) {
      $(this).siblings(".btn-clear-text").show();
    } else {
      $(this).siblings(".btn-clear-text").hide();
    }
  })
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

  $(".combobox-container input:not([readonly])").on('focus input', function() {
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


