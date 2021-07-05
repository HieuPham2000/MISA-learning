$(document).ready( function() {

  $(".header-left > .sidebar").click( function() {
    var toggleWidth = $(".menu").width() == 225 ? "51px" : "225px";
    var pageLeft = $(".menu").width() == 225 ? "52px" : "226px";
    $(".menu").animate({width: toggleWidth});
    $(".page").animate({left: pageLeft});
    // $(".header-left").css("border-bottom", "1px solid #dedede");
  })
})