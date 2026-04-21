function validerRunway() {
    if (form1.runway.value == "") {
        alert("Please insert the Run Way !");
        form1.runway.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}
