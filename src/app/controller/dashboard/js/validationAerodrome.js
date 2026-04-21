function validerAerodrome() {
    if (form1.label.value == "") {
        alert("Please insert the Label !");
        form1.label.focus();
        return false;
    }
    else if (form1.designation.value == "") {
        alert("Please insert the Designation !");
        form1.designation.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}