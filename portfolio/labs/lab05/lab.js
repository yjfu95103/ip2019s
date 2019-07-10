/*

*/

function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}


/*
function update() {
    //document.getElementById('svgimage').innerHTML = '';
    document.getElementById('svgimage').innerHTML = document.getElementById('content').value;
    console.log(document.getElementById('content').value);
}
*/

function start(e) {
  document.getElementById('content').innerHTML = document.getElementById('mysvg').innerHTML;
  document.getElementById('svgimage').innerHTML = document.getElementById('mysvg').innerHTML;

  //document.getElementById('content').addEventListener("input", update);

  document.getElementById('content').addEventListener("input", function(){
    document.getElementById('svgimage').innerHTML = document.getElementById('content').value;
  });

  document.getElementById('save').addEventListener("click", function(){
  	var fn = document.getElementById('svgfilename').value;
  	saveText( document.getElementById('content').value ,  fn);
  });
}

window.addEventListener( "load", start, false );
