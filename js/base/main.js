$(document).ready( function() {
  toggleMenu();
})

/**-------------------------------
 * Mở rộng/ thu hẹp sidebar (menu)
 * Author: pthieu (03/07/2021)
 */
function toggleMenu() {
  $(".header-left > .sidebar").click( function() {
    var toggleWidth = $(".menu").width() == 225 ? "51px" : "225px";
    var pageLeft = $(".menu").width() == 225 ? "52px" : "226px";
    $(".menu").animate({width: toggleWidth});
    $(".page").animate({left: pageLeft});
  })
}