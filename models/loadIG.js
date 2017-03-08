$( document ).ready(function() {
  $.getJSON('https://www.instagram.com/9gag/media/', function(data) {
      $('#igjson').append(data);
  });
});
