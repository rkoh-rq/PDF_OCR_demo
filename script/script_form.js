var f = document.getElementsByTagName('form');
var y= f[0].getElementsByTagName('input');

for (i = 0; i < y.length; i++) {
    // If a field is empty...
    y[i].className="empty";
    y[i].onchange=function(){
        if (y[i].value=""){
            y[i].className="empty";
        }
        else{
            y[i].className="filled";
        }
    };
}
