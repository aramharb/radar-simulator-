function validerCircuit() {
    
    if (form1.circuitlabel.value == "") {
        alert("Please insert the Circuit Label !");
        form1.circuitlabel.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

