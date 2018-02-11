var metaTag = document.createElement('meta');
var viewport = document.getElementById('My_viewport');
var splitCol = [];
var Gflag = true;

//
window.addEventListener('resize',onOrchange,false);

 var SITE_BACKGROUND = document.getElementById('SITE_BACKGROUND');
   


function onOrchange(){
   
    defaultMeta();
  
}



appendMeta();


//SET DERIVED
if(viewport.className){

var wholeClass = viewport.className;
var splitSemi = wholeClass.split(';');
    
    for(var i in splitSemi){
 splitCol[i] =  splitSemi[i].split(':');
}
    
    
}



defaultMeta();


function defaultMeta(){

//calc initial orientation of the screen
metaTag.setAttribute('name','viewport');
if (window.innerHeight > window.innerWidth){//portrait
    //SET DEFAULT
metaTag.setAttribute('content','width=device-width,height=device-height,initial-scale=1,user-scalable=yes');

  initiateClass('portrait');

}else{//landscape

metaTag.setAttribute('content','width=device-width,user-scalable=yes,initial-scale=1');
  
  initiateClass('landscape');  
 
 }  
 
}




function autoSet(){

var overflowWidth =  document.body.scrollWidth;
var bodyWidth = document.body.clientWidth;
var extraPixel = overflowWidth - bodyWidth;   
var scaleFactor = extraPixel/overflowWidth;
var actualScale = 1-scaleFactor;


if(scaleFactor == 0){
//do nothing
    
}else{

fixCorrect(actualScale);

}

}

function fixCorrect(actualScale){

metaTag.setAttribute('content','width=device-width,height=device-height,user-scalable=yes');
   
   metaTag.content+=',initial-scale='+actualScale;
//setTimeout(stopEevent,1);
     var bodywidth = window.innerWidth;
     SITE_BACKGROUND.style.width = bodywidth + 'px';
      
}


function initiateClass(name){

  if(viewport.className){
      
setProperties(splitCol,name);

}else{

autoSet();  

}
}
 




function appendMeta(){

document.head.appendChild(metaTag);
  

}


function setProperties(splitCol,name){

    for(var i=0;i<2;i++){
     if(splitCol[i][0] == 'portrait'&&name== 'portrait'){
     
    var portraitProp = splitCol[i][1];
   setPortrait(portraitProp);
    
     }else if(splitCol[i][0] == 'landscape'&&name== 'landscape'){
     
    var landscapeProp = splitCol[i][1];
  setLandscape(landscapeProp);
         
     }
        
       
    }

}



function setPortrait(portraitProp){

metaTag.setAttribute('content',portraitProp);
 
  
}


function setLandscape(landscapeProp){

    metaTag.setAttribute('content',landscapeProp);

}



//FORMAT
//class="portrait:width=device-width,height=device-height,initial-scale=0.31,user-scalable=no;landscape:width=device-width,user-scalable=yes,initial-scale=0.54"


//<script src="viewport.js" type="text/javascript" id="My_viewport" ></script>
