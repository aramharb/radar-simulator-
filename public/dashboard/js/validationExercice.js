function validerExercice() {
    if (ExerciceAdd.name.value == "") {
        alert("Please insert the Exercice Name !");
        ExerciceAdd.name.focus();
        return false;
    }
    else if (ExerciceAdd.accelerating.value == "") {
        alert("Please insert the Aerodrome !");
        ExerciceAdd.accelerating.focus();
        return false;
    }
    else if (ExerciceAdd.reducing.value == "") {
        alert("Please insert the SSR Code !");
        ExerciceAdd.reducing.focus();
        return false;
    }
    else if (ExerciceAdd.climbing.value == "") {
        alert("Please insert the SSR Status !");
        ExerciceAdd.climbing.focus();
        return false;
    }
    else if (ExerciceAdd.descent.value == "") {
        alert("Please insert the Fltid !");
        ExerciceAdd.descent.focus();
        return false;
    }
    else if (ExerciceAdd.descentS.value == "") {
        alert("Please insert the Show time !");
        ExerciceAdd.descentS.focus();
        return false;
    }
    else if (ExerciceAdd.climbingS.value == "") {
        alert("Please insert the Starting time !");
        ExerciceAdd.climbingS.focus();
        return false;
    }
    else if (ExerciceAdd.cruising.value == "") {
        alert("Please insert the Flt Scope !");
        ExerciceAdd.cruising.focus();
        return false;
    }
    else if (ExerciceAdd.stalling.value == "") {
        alert("Please insert the Status !");
        ExerciceAdd.stalling.focus();
        return false;
    }
    else if (ExerciceAdd.MaxSpeed.value == "") {
        alert("Please insert the Transponder !");
        ExerciceAdd.MaxSpeed.focus();
        return false;
    }
    else if (ExerciceAdd.MaxLevel.value == "") {
        alert("Please insert the Modec !");
        ExerciceAdd.MaxLevel.focus();
        return false;
    }
    else
        return true;
}

function include(fileName) {
    document.write("<script type='text/javascript' src='" + fileName + "'></script>");
}
