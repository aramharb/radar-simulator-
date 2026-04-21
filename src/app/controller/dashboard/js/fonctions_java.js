
//******   fonction pour la surbrillance d'une ligne lorsqu'elle est selectionnée   **********
var actuel=0;
function briller (row,nbr_col)
{
    if(actuel!=0)
    {
		for(var i=0;i<nbr_col;i++)
		{
    		document.getElementById('Tableau').rows[actuel].cells[i].style.backgroundColor = 'white';
		}
    
    }
	for(var j=0;j<nbr_col;j++)
		{
    		document.getElementById('Tableau').rows[row].cells[j].style.backgroundColor = '#FFFFB0';
		
		}
actuel=row;
}

//************************************************************************* 

//************      fonction d'impression d'une div  ********************** 
function imprime_zone(titre, obj)
		
	{
        // Définie la zone à imprimer
        var zi = document.getElementById(obj).innerHTML;
        
        // Ouvre une nouvelle fenetre
        var f = window.open("", "ZoneImpr", "height=1000, width=800,toolbar=0, menubar=0, scrollbars=1, resizable=1,status=0, location=0, left=0, top=0");
        
        // Définit le Style de la page
        f.document.body.style.color = '#000000';
        f.document.body.style.backgroundColor = '#FFFFFF';
        f.document.body.style.padding = "10px";
        f.document.body.dir = "rtl";
        
        // Ajoute les Données
        //f.document.title = titre;
        f.document.body.innerHTML += " " + zi + " ";
        
        // Imprime et ferme la fenetre
        f.window.print();
        f.window.close();
        return true;
	}
//******************************************************************************* 

// -------------------------- fonction afficher une image -----------------------------//

function image(img)
{
	document.getElementById(img).src= 'images/'+ img + '.png';	
}

function image1(img)
{
	document.getElementById(img).src= 'images/'+ img +'1.png';	
}


// -----------------   fonction pour valider le format de l'heure ---------------//
function valider_heure(val,res)
{
       heure=val.substr(0, 2);
       minute=val.substr(2, 2);
       if((val.length==4)&&(val<2360)&&(val>0)&&(heure<24)&&(heure>=0)&&(minute<60)&&(minute>=0))
            {
            res.value=val.substr(0, 2)+':'+val.substr(2, 2);
            res.style.backgroundColor='white';
            }
        else if(val.substr(2, 1)==':')
            {
             res.value=val;
             res.style.backgroundColor='white';
            }
       else
            {
               res.value='';
               res.style.backgroundColor='#FF9F9F'; 
               
            }
     

}
// -----------------   fonction pour valider le format d'une date  ---------------//
function valider_date(val,res)
{
       jj=val.substr(7, 2);
       mm=val.substr(5, 2);
       aaaa=val.substr(0, 4);
	   
       if((jj<32)&&(jj>0)&&(mm<13)&&(mm>0)&&(aaaa<9999)&&(aaaa>1000))
            {
            res.value=val;
            res.style.backgroundColor='yellow';
            }

       else
            {
               res.value='';
               res.style.backgroundColor='#FF9F9F';                    
            }
     

}
// -----------------   fonction pour valider le format d'un nombre ---------------//
function valider_nbr(nbr,res)
{    
        if(nbr>0)  
           {
                res.value=nbr;
                res.style.backgroundColor='white';
           }
        else
           {
                res.value='';
                res.style.backgroundColor='#FF9F9F';  
           }  
}


// -----------------   fonction pour afficher un objet HTML ---------------//
function afficher(obj)
{
	obj.style.display='block';
}
// -----------------   fonction pour cacher un objet HTML  ---------------//
function cacher(obj)
{
    alert('sdkjfhksjefhkjs');
	obj.style.display='none';
}









