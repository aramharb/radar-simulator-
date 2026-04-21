function validerperf() {
    if (CategoryAdd.CATEGORYNAME.value == "") {
        alert("Please insert the CATEGORYNAME !");
        form1.CATEGORYNAME.focus();
        return false;
    }
    else if (CategoryAdd.MINLEVEL.value == "") {
        alert("Please insert the MIN Level !");
        CategoryAdd.MINLEVEL.focus();
        return false;
    }
    else if (CategoryAdd.MAXLEVEL.value == "") {
        alert("Please insert the MAX Level !");
        CategoryAdd.MAXLEVEL.focus();
        return false;
    }
    else if (CategoryAdd.CLIMBINGRATE.value == "") {
        alert("Please insert the CLIMBINGRATE !");
        CategoryAdd.CLIMBINGRATE.focus();
        return false;
    }
    else if (CategoryAdd.DESCENTRATE.value == "") {
        alert("Please insert the DESCENTRATE !");
        CategoryAdd.DESCENTRATE.focus();
        return false;
    }
    else if (CategoryAdd.climbingspeed.value == "") {
        alert("Please insert the climbing speed !");
        CategoryAdd.climbingspeed.focus();
        return false;
    }
    else if (CategoryAdd.CLIMBINGSPEED.value == "") {
        alert("Please insert the Desent speed !");
        CategoryAdd.CLIMBINGSPEED.focus();
        return false;
    }
    else if (CategoryAdd.STALLINGSPEED.value == "") {
        alert("Please insert the Stalling Speed !");
        CategoryAdd.STALLINGSPEED.focus();
        return false;
    }
    else if (CategoryAdd.CRUISINGSPEED.value == "") {
        alert("Please insert the  Cruising Speed  !");
        CategoryAdd.CRUISINGSPEED.focus();
        return false;
    }
    else if (CategoryAdd.MAXSPEED.value == "") {
        alert("Please insert the  Max Speed  !");
        CategoryAdd.MAXSPEED.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}
