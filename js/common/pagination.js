$(document).ready(function() {
  var currentPage = 1;
  var maxPage = 10;
  var maxRecord = 187;
  var numberBtnPage = 4;


  $(".m-btn-num-page").click(function() {
    $(".m-btn-num-page.active").removeClass("active");
    $(this).addClass("active");
    currentPage = Number($(this).text());
    console.log(currentPage);
    showPageTotalDetail();
  })

  $(".m-btn-prev-page").click(function() {
    if(currentPage == 1) {
      return;
    }

    currentPage --;

    if(currentPage % numberBtnPage == 0) {
      replaceBtnNumPage(currentPage - numberBtnPage + 1);
      $(".m-btn-num-page.active").removeClass("active");
      $(".m-btn-num-page").eq(3).addClass("active");
    } else {
      var el =  $(".m-btn-num-page.active");
      el.removeClass("active");
      el.prev().addClass("active");
    }
    
    console.log(currentPage);
    showPageTotalDetail();
  })

  $(".m-btn-next-page").click(function() {
    if(currentPage == maxPage) {
      return;
    }

    currentPage ++;

    if(currentPage % numberBtnPage == 1) {
      replaceBtnNumPage(currentPage);
      $(".m-btn-num-page.active").removeClass("active");
      $(".m-btn-num-page").eq(0).addClass("active");
    } else {
      var el =  $(".m-btn-num-page.active");
      $(el).removeClass("active");
      $(el).next().addClass("active");
    }
    console.log(currentPage);
    showPageTotalDetail();
  })

  
  $(".m-btn-first-page").click(function() {
    currentPage = 1;
    replaceBtnNumPage(currentPage);
    $(".m-btn-num-page.active").removeClass("active");
    $(".m-btn-num-page").eq(0).addClass("active");
    console.log(currentPage);
  })
  
  $(".m-btn-last-page").click(function() {
    currentPage = maxPage;
    var mod = maxPage % numberBtnPage;
    replaceBtnNumPage(maxPage - mod + 1);
    $(".m-btn-num-page.active").removeClass("active");
    $(".m-btn-num-page").eq(mod - 1).addClass("active");
    console.log(currentPage);
    showPageTotalDetail();
  })

  function replaceBtnNumPage(num) {
    $(".m-btn-num-page").each(function(index, item) {
      if(num + index > maxPage) {
        $(item).hide();
      } else {
        $(item).show();
        $(item).text(num + index);
      }
    })
  }

  function showPageTotalDetail() {
    var pageNum = Number($(".m-btn-num-page.active").text());
    var pageSize = 20;
    var start = 1 + pageSize*(pageNum - 1);
    var end = start + pageSize - 1;
    end = end > maxRecord ? maxRecord : end;
    $(".paging-total-detail").text(`${start}-${end}/${maxRecord}`);
  }
})

