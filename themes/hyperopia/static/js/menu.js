window.addEventListener("resize", menuResize);

function menuResize(){
  var w = document.documentElement.clientWidth;
  if (w < 840) {
    document.getElementById('quicklinks').style.display='none';
    document.getElementById('openquicklinks').style.display='inline';
    document.getElementById('closequicklinks').style.display='none';
    document.getElementById('quickctrl').style.display='inline';
  }
  else {
    document.getElementById('openquicklinks').style.display='none';
    document.getElementById('closequicklinks').style.display='none';
    document.getElementById('quickctrl').style.display='none';
    document.getElementById('quicklinks').style.display='inline';
  }
}

function menuOpen() {
  document.getElementById('quicklinks').style.display='block';
  document.getElementById('openquicklinks').style.display='none';
  document.getElementById('closequicklinks').style.display='inline';
}

function menuClose() {
  document.getElementById('quicklinks').style.display='none';
  document.getElementById('openquicklinks').style.display='inline';
  document.getElementById('closequicklinks').style.display='none';
}