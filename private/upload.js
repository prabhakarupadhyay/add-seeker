
window.onload = function(){


var xhr = new XMLHttpRequest();
var formBody = document.getElementById("formBody");
var form = document.getElementById('forms');
 
    var input = document.createElement('input');
    
    input.setAttribute('type','reset');
    input.setAttribute('id','reset');
    form.appendChild(input);
    var inputSubmits = new Array();
    var inputElements = new Array();
    var nodes = form.childNodes;
    
    
var count=0;
 var count2=0;  
    var targeted;
      for(var j=0; j<nodes.length;j++){
         
          if(nodes[j].nodeName == 'INPUT'){
          inputElements[count] = j; 
          count++;
                
          }
          if(nodes[j].type == 'submit'){
             
          inputSubmits[count2]=j; 
              count2++;
          
          }
    
      }


 /*   
text.onfocus = function(){
 
    if(text.value == 'type here'){
    
    text.value = '';
    }
};
    
    
    text.onblur = function(){
    
    if (text.value == ''){
    
    text.value = 'type here';
    
    }
    };
  */  
       
    form.onclick = function(evt){
 targeted =  evt.target.id
 
 };  


form.onsubmit = function(evt){
    
submitCheck(xhr,inputElements,nodes,targeted);
          
     
    return false;
};

};


function submitCheck(xhr,inputElements,nodes,targeted){

 var data = '';
 var trueIdentity='';
    var absData;

for (var k=0;k<inputElements.length;k++){ 
 var num = inputElements[k];
    if(nodes[num].checked){ 
      if(nodes[num].name == targeted){
     
      trueIdentity = nodes[num].name;
        data= nodes[num].value;
        absData = trueIdentity + '/' + data;
            sendData(absData,xhr);
        
        }
            }
    }
   

}



function sendData(data,xhr){
    
console.log(data)
     var id = '56741123857';
      xhr.open('POST','http://nodejs-adseeker.rhcloud.com/'+id,'true');
       xhr.setRequestHeader("Content-Type", "plain/text;charset=UTF-8");
   
    
       xhr.onreadystatechange = function(){
      if(xhr.status==200 && xhr.readyState==4){
     console.log(xhr.responseText);
     

    }    
};

    
    xhr.send(data);
    

}

