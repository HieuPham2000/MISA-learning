$(document).ready(function() {
  addButtonClearInput();
  makeCombobox();
})

/**
 * Thêm button xóa text trong các ô input
 * Author: pthieu (06/07/2021)
 */
function addButtonClearInput() {
  var selectorTextInput = "input[type=text], input[type=email]";
  $(selectorTextInput).wrap('<div class="input-wrapper"></div>')
  $(selectorTextInput).after(`
      <div class="btn-clear-text">
        <img src="../../content/icon/x.svg" >
      </div> `);

  $(".btn-clear-text").click(function() {
    $(this).siblings("input").val("");
    $(this).hide();
  })
  
  $(selectorTextInput).each(function() {
    if($(this).val()) {
      $(this).siblings(".btn-clear-text").show();
    }
  })
  
  $(selectorTextInput).on("input", function() {
    if($(this).val()) {
      $(this).siblings(".btn-clear-text").show();
    } else {
      $(this).siblings(".btn-clear-text").hide();
    }
  })
}

function makeCombobox() {
  // $(".combobox-dropdown").hide();
  // $(document).click(function(event) {
  //   var el = event.target;
  //   if( !el.matches(".combobox-container, .combobox-container *")) {
  //     closeAllDropdown();
  //   }

  // })

  $(".combobox-container button").click(function() {
    toggleDropdownByButton.call(this);
  })

  $(".combobox-container input").focus(function() {
    openDropdownByInput.call(this);
  })

  $(".combobox-container input").on('input', function() {
    var value = $(this).val().toLowerCase();
    $(this).parents(".combobox-container").find("li").each(function() {
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
  $(".combobox-dropdown").hide();
  $(".combobox-input button").removeClass("selected");
  $(".combobox-input button i").removeClass("rotate-180deg");
}

function toggleDropdownByButton() {
  $(this).parent().siblings(".combobox-dropdown").toggle();
  $(this).find("i").toggleClass("rotate-180deg");
  $(this).toggleClass("selected");
}

function openDropdownByInput() {
  $(this).parents(".combobox-input").siblings(".combobox-dropdown").toggle();
  $(this).parents(".combobox-input").find("i").toggleClass("rotate-180deg");
  $(this).parents(".combobox-input").find("button").toggleClass("selected");
}

function selectItemInDropdown() {
  $(".combobox-dropdown li").click(function() {
    var container = $(this).parents(".combobox-container");


    container.find("button").removeClass("selected");
    container.find("i").removeClass("rotate-180deg");

    var input = container.find("input");
    input.val( $(this).text() );
    input.siblings(".btn-clear-text").show();
 
    $(this).parent().hide();
    $(this).siblings(".selected").removeClass("selected");
    $(this).addClass("selected");
  })
}
