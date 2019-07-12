/*

*/

function analyze() {
    var remain = document.getElementById('content').textContent;
    //console.log('remain = ' + remain);

    var m, n;

    do {
      m = remain.search("<path");
      console.log('<path   m = ' + m);
      remain = remain.slice(m);

      if ( m == -1){ // skip
        return;
      }

      m = remain.search('d=');
      console.log('d=   m = ' + m);
      remain = remain.slice(m);

      m = remain.search(/m/i);
      console.log('m   m = ' + m);

      n = remain.search(/z/i); // 'z"'  /z/i
      console.log('z   n = ' + n);


      subs = remain.slice(m, n+1); // z 也要包含
      console.log('subs = ' + subs);

      var subs2 = subs.replace('440', '480');
      var subs2 = subs2.replace('462', '262');

      var path = image.path(subs).fill('black').stroke({color:'gray', width:5}).draggable();

      path.plot(subs2).draggable();
      //path.animate(2000).plot(subs2).loop(true, true).draggable();

      // 把路徑 path 斷成一段段
      var newPath = Snap.path.toCubic(subs);
      console.log(' newPath.length = ' + newPath.length);
      //console.table(' newPath = ' + newPath);

      newPath.forEach(function(element) {
        console.log(element);
      });

     // 針對每一段，取得控制點座標，使用 svg.js 畫圓圈圈
      for (var i = 0; i < (newPath.length - 1); i++) {
        for (var j = 0; j < newPath[i].length; j++) {
          console.log(' newPath[' + i + '][j] = ' + newPath[i][j] );
        }

        //if ( i == 0 ) { // M i == 0
        if ( newPath[i][0] == 'M' || newPath[i][0] == 'm' ) { // M i == 0
          var circle = image.circle(20).fill('red').stroke('blue').move(newPath[i][1]-10, newPath[i][2]-10).draggable();
/*
          circle.on('dragstart', function(e) {
            e.preventDefault()
            $('#i1').val(circle.x());
            $('#i2').val(circle.y());
          });

          circle.on('dragend', function(e) {
            e.preventDefault()
            $('#i3').val(circle.x());
            $('#i4').val(circle.y());
            var line = image.line($('#i1').val(), $('#i2').val(), circle.x(), circle.y()).stroke({ color: '#f06', width: 10 });
          });

          circle.on('dragmove', function(e) {
            e.preventDefault()
            var line = image.line($('#i1').val(), $('#i2').val(), circle.x(), circle.y()).stroke({ color: '#f06', width: 10 });
          });
*/
        } else if ( newPath[i][0] == 'S' || newPath[i][0] == 's' ) {
          var circle = image.circle(10).fill('pink').stroke('blue').move(newPath[i][1]-5, newPath[i][2]-5).draggable();
          var circle = image.circle(10).fill('pink').stroke('blue').move(newPath[i][3]-5, newPath[i][4]-5).draggable();
        }
        else { // C
          var circle = image.circle(10).fill('pink').stroke('blue').move(newPath[i][1]-5, newPath[i][2]-5).draggable();
          var circle = image.circle(10).fill('pink').stroke('blue').move(newPath[i][3]-5, newPath[i][4]-5).draggable();
          var circle = image.circle(10).fill('pink').stroke('blue').move(newPath[i][5]-5, newPath[i][6]-5).draggable();
        }
      }

    } while (m > 0);
}

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

        // svg.js
        image = SVG('svgimage2').size(512, 512); // global
        image.svg(document.getElementById('content').textContent);
        //console.log(document.getElementById('content').textContent);

        analyze();
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

function start(e) {

  $(document).mousemove(function(event){
    var p = $( "#svgimage2" );
    var position = p.position();
    //console.log('position = ' + position.left + ', ' + position.top);
    var myX = event.pageX - Math.round(position.left); // - 15
    var myY = event.pageY - Math.round(position.top) + 500;  // - 15

    $("#s5").html("<div style='position:absolute; border-style:none; TOP:"
        + event.pageY + "px; LEFT:"
        + event.pageX + "px;'>" + "&nbsp&nbsp&nbsp&nbsp("
        + myX + ", "
        + myY + ")"
        + "</div>");
  });

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
