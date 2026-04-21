function validerCategory() {

    if (CategoryAdd.name.value == "") {
        alert("Please insert the Category Name !");
        CategoryAdd.name.focus();
        return false;
    }
    else if (CategoryAdd.accelerating.value == "") {
        alert("Please insert the Accelerationg Rate !");
        CategoryAdd.accelerating.focus();
        return false;
    }
    else if (CategoryAdd.reducing.value == "") {
        alert("Please insert the Reducing Rate !");
        CategoryAdd.reducing.focus();
        return false;
    }
    else if (CategoryAdd.climbing.value == "") {
        alert("Please insert the Climbing Rate !");
        CategoryAdd.climbing.focus();
        return false;
    }
    else if (CategoryAdd.descent.value == "") {
        alert("Please insert the Descent Rate !");
        CategoryAdd.descent.focus();
        return false;
    }
    else if (CategoryAdd.climbingS.value == "") {
        alert("Please insert the Climbing Speed !");
        CategoryAdd.climbingS.focus();
        return false;
    }
    else if (CategoryAdd.descentS.value == "") {
        alert("Please insert the Descent Speed !");
        CategoryAdd.descentS.focus();
        return false;
    }
    else if (CategoryAdd.cruising.value == "") {
        alert("Please insert the Cruising Speed !");
        CategoryAdd.cruising.focus();
        return false;
    }
    else if (CategoryAdd.stalling.value == "") {
        alert("Please insert the Stalling Speed !");
        CategoryAdd.stalling.focus();
        return false;
    }
    else if (CategoryAdd.MaxSpeed.value == "") {
        alert("Please insert the Max Speed !");
        CategoryAdd.MaxSpeed.focus();
        return false;
    }
    else if (CategoryAdd.MaxLevel.value == "") {
        alert("Please insert the Max Level !");
        CategoryAdd.MaxLevel.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}

