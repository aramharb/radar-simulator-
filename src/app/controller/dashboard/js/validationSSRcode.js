function validerSSRCode() {
    if (form1.SSRCODE.value == "") {
        alert("Please insert the SSR Code !");
        form1.SSRCODE.focus();
        return false;
    }
    else if (form1.SERIE.value == "") {
        alert("Please insert the SERIE !");
        form1.SERIE.focus();
        return false;
    }
    else if (form1.FLTDEST.value == "") {
        alert("Please insert the FLT Dest !");
        form1.FLTDEST.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}
