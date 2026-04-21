function validerPoint() {
    if (form1.pointlabel.value == "") {
        alert("Please insert the Point Label !");
        form1.pointlabel.focus();
        return false;
    }
    else if (form1.x.value == "") {
        alert("Please insert the X Value !");
        form1.x.focus();
        return false;
    }
    else if (form1.y.value == "") {
        alert("Please insert the Y Value !");
        form1.y.focus();
        return false;
    }
    else if (form1.type.value == "") {
        alert("Please insert the type !");
        form1.y.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

