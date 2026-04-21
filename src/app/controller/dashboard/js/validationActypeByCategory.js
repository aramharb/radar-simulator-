function validerActype() {
    
    if (form1.actype.value == "") {
        alert("Please insert the actype !");
        form1.actype.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

