/*

*/

function analyze() {
    var m, n;

    var remain = document.getElementById('content').textContent;
    //console.log('remain = ' + remain);

    var subs = '';

    var i = 0;

    do {
      i++;

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

      var newPath = Snap.path.toCubic(subs);
      console.log(' newPath.length = ' + newPath.length);
      //console.table(' newPath = ' + newPath);

      
      newPath.forEach(function(element) {
        console.log(element);
      });
      


      remain = remain.slice(n+1); // z 也要移除
      //console.log('remain = ' + remain);

      //var pathString = "M382 371C440 281 80 162 82 314 84 467 324 462 382 371z"
      //var newPath = Snap.path.toCubic(pathString);

      var newPath = [];
      var move = '';

      m = subs.search(/c/i);
      console.log('m = subs.search(/c/i);');
      console.log('m = ' + m);

      n = subs.search(/z/i);
      console.log('n = subs.search(/z/i);');
      console.log('n = ' + n);


      // move = 382 371 
      move = subs.slice(1, m);
      console.log('move.length = ' + move.length);
      console.log('move = ' + move);

      move = move.replace(',', ' ');
      console.log('move.length = ' + move.length);
      console.log('move = ' + move);



      // https://stackoverflow.com/questions/40282519/split-string-by-multiple-spaces-nodejs
      var temp;
      temp = move.trim().split(/\s+/);

      console.log('temp.length = ' + temp.length);
      console.log('temp = ' + temp);
      console.log('temp[0] = ' + temp[0]);
      console.log('temp[1] = ' + temp[1]);

      var x, y;
      x = parseInt(temp[0],10);
      y = parseInt(temp[1],10);
      console.log('x = ' + x);
      console.log('y = ' + y);

      var circle = image.circle(20).fill('red').stroke('blue').move(x-10, y-10).draggable();

      /*
      temp.forEach(function(element) {
        newPath.push(element);
      });
      */

      console.log('newPath = ' + newPath);

      subs = subs.slice(m+1, n);  // C 也要移除 (大寫C), z 也要移除 
      console.log('subs = ' + subs);

      temp = subs.trim().split(/\s+/);

      /*
      temp.forEach(function(element) {
        newPath.push(element);
      });
      */
      newPath.push([temp[0],temp[1]]);
      console.log('newPath = ' + newPath);

      //var newPath = Snap.path.toCubic(subs);

      console.log(' newPath.length = ' + newPath.length);

      /*
      //for(var i = 0; i < newPath.length; i++){
      //for(var i = 0; i < (newPath.length - 1); i++){  // 抵銷因為 z 而多出了的最後三個點
      for(var i = 0; i < (newPath.length - 1); i++){  // 抵銷因為 z 而多出了的最後三個點
        var segment = newPath[i], point;

        segment.shift();
        point = setUpPoint(segment);
      }

      */
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
