/*

*/

function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

function readFiles(files){
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

    //document.getElementById('content').innerHTML = '';    
    //document.getElementById('svgimage').innerHTML = '';

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.readAsText(files[i], 'UTF-8');

      reader.onload = function(evt) {
        document.getElementById('content').innerHTML = evt.target.result;
        document.getElementById('svgimage').innerHTML = evt.target.result;
      }
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    readFiles(files);
}

function handleFileSelect_drag(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.

    readFiles(files);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


function preventKey(event, expectedKey, expectedCode) {
  const code = event.which || event.keyCode;

  if (expectedKey === event.key || code === expectedCode) {
    return true;
  }
  return false;
}



function start(e) {
  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect_drag, false);

  // listener
  document.getElementById('content').addEventListener("input", function(){
    document.getElementById('svgimage').innerHTML = document.getElementById('content').value;
  });

  document.getElementById('save').addEventListener("click", function(){
    var fn = document.getElementById('svgfilename').value;
    saveText( document.getElementById('content').value ,  fn);
  });

  /*
    https://stackoverflow.com/questions/905222/enter-key-press-event-in-javascript
  */
  document.getElementById('svgfilename').addEventListener('keydown', function(event) {
  
    if (preventKey(event, 'Enter', 13)) {
      event.preventDefault();
      //alert(event.target);
      var fn = document.getElementById('svgfilename').value;
      saveText( document.getElementById('content').value ,  fn);
    }
  });


  // animation
  setInterval(function(){ 
    document.getElementById("drop_zone").style.borderColor = "Crimson";
    document.getElementById("drop_zone").style.color = "Crimson";
    document.getElementById("files").style.color = "Crimson";
  }, 500);

  setInterval(function(){ 
    document.getElementById("drop_zone").style.borderColor = "gray";
    document.getElementById("drop_zone").style.color = "gray";
    document.getElementById("files").style.color = "gray";
  }, 1000);

}

window.addEventListener( "load", start, false );
