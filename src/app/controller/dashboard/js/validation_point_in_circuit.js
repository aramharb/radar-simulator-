function validerPoint_in_circuit() {
    if (form1.circuit.value == "") {
        alert("Please insert the circuit Label !");
        form1.circuit.focus();
        return false;
    }
    else if (form1.point.value == "") {
        alert("Please insert the point Value !");
        form1.point.focus();
        return false;
    }
    else if (form1.level.value == "") {
        alert("Please insert the level Value !");
        form1.level.focus();
        return false;
    }
    else if (form1.speed.value == "") {
        alert("Please insert the speed !");
        form1.speed.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

