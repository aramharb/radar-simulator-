function validerFlt() {
    
    if (form1.fltid.value == "") {
        alert("Please insert the FLT Id !");
        form1.fltid.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

//include('js/alert.js');