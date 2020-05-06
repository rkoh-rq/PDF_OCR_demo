function initDraw(canvas_div) {
    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    function setMousePosition(ev) {
        mouse.x = ev.pageX;// + window.pageXOffset;
        mouse.y = ev.pageY;// + window.pageYOffset;
    };

    var element = null;    
    canvas_div.onmousemove = function (e) {
        setMousePosition(e);
        //console.log(mouse.y);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
    }

    canvas_div.onclick = function (e) {
        if (element !== null) {
            var tempcanv=document.createElement('canvas');
            var tctx=tempcanv.getContext('2d');
            // use the extended from of drawImage to draw the
            // cropped area to the temp canvas
            var pdfcanv = document.getElementById('pdf_canvas');
            var position = pdfcanv.getBoundingClientRect();
            var x = position.left;
            var y = position.top;
            var pctx = pdfcanv.getContext('2d');
            var imgData = pctx.getImageData(
                (mouse.x - mouse.startX < 0) ? mouse.x - x: mouse.startX - x, //left
                (mouse.y - mouse.startY < 0) ? mouse.y - y: mouse.startY - y, //top
                Math.abs(mouse.x - mouse.startX), //width
                Math.abs(mouse.y - mouse.startY)); //height
            tctx.canvas.width  = Math.abs(mouse.x - mouse.startX);
            tctx.canvas.height = Math.abs(mouse.y - mouse.startY);
            tctx.putImageData(imgData, 0, 0);
            // return the .toDataURL of the temp canvas
            img = new Image();
            img.src = tempcanv.toDataURL();
            Tesseract.recognize(img,'eng', {logger: m => console.log(m) }).then(({ data: { text } }) => {
                console.log(text);
                if (text!=""){
                    var data_field = document.getElementsByClassName('empty')[0]
                    data_field.value = text;
                    data_field.className = 'filled'
                }
                rem_element = document.getElementsByClassName('rectangle')[0];
                rem_element.parentNode.removeChild(rem_element);
            })
            element = null;
            canvas_div.style.cursor = "default";
            console.log("finished.");
        } else {
            console.log("begun.");
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement('div');
            element.className = 'rectangle'
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            canvas_div.appendChild(element)
            canvas_div.style.cursor = "crosshair";
        }
    }
}

//Tesseract.recognize(myImageData,'eng', {logger: m => console.log(m) }).then(({ data: { text } }) => {console.log(text);})