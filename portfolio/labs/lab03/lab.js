/*
	https://www.html5rocks.com/en/tutorials/file/dndfiles/
*/


function readFiles(files){
    //files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f= files[i]; i++){
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModiefiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
    }
document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';


document.getElementById('content').innerHTML = '';
document.getElementById('svgimage').innerHTML = '';

//Looop through the FileList and render image files as thumbnails.
for(var i = 0, f; f= files[i]; i++){
    var reader = new FileReader();
    reader.readAsText(files[i], 'UTF-8');

    reader.onload = function(evt){
        var span = document.createElement('span');
        span.setAttribute("class", "svgshow");
        span.innerHTML = evt.target.result;
        document.getElementById('svgimage').insertBefore(span, null);

        var span = document.createElement('span');
        span.setAttribute("class", "svgtext");
        span.textContent = evt.target.result;
         document.getElementById('content').insertBefore(span, null);

    }
}
}
function handleFileSelect(evt){
    var files = evt.target.files; //FileList object

    readFiles(files);
}

function handleFileSelect_drag(evt){
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; //FileList object.

    readFiles(files);
}

function handleDragOver(evt){
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; //Explicitly show this is a copy.
}

function start(e){
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect_drag, false);
}
window.addEventListener( "load", start, false );