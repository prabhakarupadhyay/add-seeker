var  http = require('http');
var fs = require('fs');
var request = require('request');
//var cors = require('cors')//cors refers to cross origin resourse sharing,
//it helps in enabling the resourses that r not usually shared or accessable by sites on the server side
//var cook = request.cookie("fff");
var mime = require('mime');
var path = require('path');
var events = require('events');
var mysql = require('mysql');
var socketio = require('socket.io');
var io;
//var jsdom = require('jsdom');
//var $ = require('jquery')(jsdom.jsdom().parentWindow);
   //var jsdom = require("jsdom");
var cheerio = require('cheerio');

// var FB = require('fb');
var eventemit = new events.EventEmitter();
//var passport = require('passport');
//var SSE = require('sse');
//sse refers to server side event its a one way key to the client and helps propagate server string info to the client

/*
var reqObj = {uri:'file://localhost/Users/prabhakar/Desktop/LiveTvInfo/private/upload.html',method:'GET'};
 

var handle = request(reqObj,function(error, response, body){
    
    console.log(error);
    console.log(response);
    console.log(body);
    
    });

*/

//require('./passport')(passport);
//require('./routes.js')(passport);
var cache = {};
var flag=false;
var dataRead;
 var firstData =[]; 
var dataBase = {};
var nameIdSave = [];
var newsIdSave = [];
var channelStoreHouse = [];
var onLoadShows = [];



var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP ;

if(typeof server_ip_address ==='undefined'){
   
 server_ip_address = '127.0.0.1';
   
   
}

/*
FB.api('/me', { fields: ['id', 'name'] }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res.id);
  console.log(res.name);
});
*/


//////open up the mysql connection



var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
  port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
  database : process.env.OPENSHIFT_APP_NAME
 });






var server = http.createServer(function(req,res){
console.log(req.url);

      //initialize all the headers to accept the request 
      setHead(res);
 dataRead = '';
 var filepath='./';
 
    if(req.url == '/'){
    var abspath = filepath + 'public/signup.html';

    fileRead(res,req,abspath);
    }
    
   else if(req.url=='/56741123857'){
    
   if(req.headers['content-length'] >= 60){
   
   console.log('not applicable ----- ');

      serverError(res);
}
    else{
       
       console.log('aplicable ----- ');
 
    showHttpInfo(req); 
   passHttpRequest(res,req,dataRead); 
 
    }
    
    
   
   /*
  //ALTERNATE WAY OF FETCHING A REQUEST WITHOUT CREATING A SERVER (http.createServer...) 
   var option = {
    //path:'file://localhost/Users/prabhakar/Desktop/LiveTvInfo/private/upload.html',
    method:'POST',
    url:'/56741123857',
    };
  //this is another way to fetch the request by the server from client
    var req1 = http.request(option,callback);
    req1.write('request proccessed');
    req1.end();
  */
   
   }
   else if(req.url == '/sse'){
    console.log('working sse');
setTimeout(function(){eventemit.emit('blow2');},4000) ;
   res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
 
   //var hello =1;
   
 //res.write('data:'+hello+'\n\n')
 //hello++;
 
 eventemit.on('blow',function(dat){
    console.log('-=-=-=-=--=-=-=-=-=-=-=-='+dat)
    res.write('data:'+dat+'\n\n');
    });
 
 eventemit.on('blow2',function(){
    for(var i = 0; i<firstData.length;i++){
        
     res.write('data:'+dataBase[firstData[i]]+'\n\n');
        
    }
    
    });
    
   }
   
   else if(req.url == '/sse2'){
 
     
   }
   
   else if(req.url == '/tokensignin'){
  readToken(req,res);
   }
   
   else if(req.url == '/27.0.0.1:8080/64347869870854'){
          
     req.on('data',function(dataa){
      console.log(dataa.toString());
            }); 
      
   }
   
   else{
    
    var abspath = filepath +'public'+ req.url;
    fileRead(res,req,abspath);
      
   }

    });

server.listen(server_port, server_ip_address, function () {
console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});

io = socketio.listen(server);
io.set('transports', ['websocket', 
                      'flashsocket', 
                      'htmlfile', 
                      'xhr-polling', 
                      'jsonp-polling', 
                      'polling']);


 
var coun;

 function recursive(coun){
if(newsIdSave){
  
  var newsid = newsIdSave[coun];
   var newsTime = newsIdSave[coun]+'_TIME';
 leaveUpdate(newsid,newsTime)

}
 }

  // connection.query('DROP TABLE SUBSCRIPTION');
function leaveUpdate(newsid,newsTime){

   connection.query('SELECT '+newsTime+',USER_ID FROM SUBSCRIPTION WHERE '+newsTime+'< NOW()',function(er,ro){
 
      if(er){//console.log(er);
         pardonMe(newsid)   
      
      }else{
  // console.log(ro);
     
      if(ro == ''|| ro == null ||ro == undefined){
        
       // console.log('no update');
          pardonMe(newsid)     
        
      }else{
               console.log('-=-=-=-=-=-=-=-'+newsid + '  '+ro[0].USER_ID);
       connection.query('UPDATE SUBSCRIPTION SET '+newsTime+' = ?,'+newsid+' = ? WHERE USER_ID LIKE ?',[null,'cancel',ro[0].USER_ID],function(err,res){
          if(err){
            console.log('serious error '+err);
            pardonMe(newsid)
            }else{
              console.log(newsid);
            console.log('-=-=-=-=-=-'+JSON.stringify(ro, null, 1));
             eventemit.emit('finalBlow',newsid);
             
            pardonMe(newsid)
            
            }
             
         });        
      }
      }
      });

}

function pardonMe(newsid){
  
  
    if(newsid == null){
                coun = 0;
                recursive(coun);
  }else{
             coun++;
             recursive(coun);
        }
  
}





/*

$.ajaxSettings.xhr=function(){
  return new XMLHttpRequest();
};

*/


var setOnce = 0;
 var showList = ['http://www.in.com/tv/channel/zee-news-395.html',
                  'http://www.in.com/tv/channel/india-tv-362.html',
                  'http://www.in.com/tv/channel/aaj-tak-338.html',
                  'http://www.in.com/tv/channel/ndtv-india-160.html',
                 'http://www.in.com/tv/channel/cnnibn-50.html',
                  'http://www.in.com/tv/channel/cnn-86.html',
                  'http://www.in.com/tv/channel/times-now-127.html',
                  
                  'http://www.in.com/tv/channel/star-movies-59.html',
                  'http://www.in.com/tv/channel/star-movies-hd-245.html',
                  'http://www.in.com/tv/channel/hbo-8.html',
                  'http://www.in.com/tv/channel/zee-studio-63.html',
                  'http://www.in.com/tv/channel/star-movies-action-315.html',
                  'http://www.in.com/tv/channel/sony-pix-53.html',
                  'http://www.in.com/tv/channel/wb-99.html',
                  'http://www.in.com/tv/channel/movies-now-207.html',
                  'http://www.in.com/tv/channel/movies-now-plus-663.html',
                  'http://www.in.com/tv/channel/star-gold-64.html',
                  'http://www.in.com/tv/channel/star-gold-hd-243.html',
                  'http://www.in.com/tv/channel/movies-ok-272.html',
                  'http://www.in.com/tv/channel/-pictures-610.html',
                  'http://www.in.com/tv/channel/utv-action-73.html',
                  'http://www.in.com/tv/channel/utv-movies-76.html',
                  
                  
                  
                  'http://www.in.com/tv/channel/colors-66.html',
                  'http://www.in.com/tv/channel/zee-tv-32.html',
                   'http://www.in.com/tv/channel/tv-698.html',
                  'http://www.in.com/tv/channel/sony-entertainment-tv-78.html',
                  'http://www.in.com/tv/channel/sony-tv-hd-539.html',
                  'http://www.in.com/tv/channel/star-plus-29.html',
                  'http://www.in.com/tv/channel/star-plus-hd-239.html',
                  'http://www.in.com/tv/channel/star-world-23.html',
                  'http://www.in.com/tv/channel/star-world-hd-241.html',
                  'http://www.in.com/tv/channel/axn-1.html',
                  'http://www.in.com/tv/channel/zee-cafe-65.html',
                  'http://www.in.com/tv/channel/fx-169.html',
                  'http://www.in.com/tv/channel/tlc-61.html',
                  
                  
                  
                  'http://www.in.com/tv/channel/discovery-channel-46.html',
                  'http://www.in.com/tv/channel/animal-planet-45.html',
                  'http://www.in.com/tv/channel/national-geographic-channel-71.html',
                  'http://www.in.com/tv/channel/nat-geo-wild-180.html',
                  'http://www.in.com/tv/channel/discovery-turbo-171.html',
                  'http://www.in.com/tv/channel/history-tv-18-265.html',
                  
                  
                  'http://www.in.com/tv/channel/cartoon-network-3.html',
                  'http://www.in.com/tv/channel/pogo-58.html',
                  'http://www.in.com/tv/channel/nickelodeon-79.html',
                  'http://www.in.com/tv/channel/hungama-tv-130.html',
                 'http://www.in.com/tv/channel/zeeq-303.html',
                 'http://www.in.com/tv/channel/nick-junior-345.html',
                  'http://www.in.com/tv/channel/disney-channel-93.html',
                  
                  
                  'http://www.in.com/tv/channel/dd-sports-273.html',
                  'http://www.in.com/tv/channel/ten-sports-105.html',
                  'http://www.in.com/tv/channel/ten-hd-460.html',
                  'http://www.in.com/tv/channel/sony-six-322.html',
                  'http://www.in.com/tv/channel/sony-six-hd-467.html',
                 'http://www.in.com/tv/channel/sony-max-652.html',
                  'http://www.in.com/tv/channel/star-sports-1-102.html',
                  'http://www.in.com/tv/channel/star-sports-hd-1-666.html',
                  'http://www.in.com/tv/channel/star-sports-2-645.html',
                  'http://www.in.com/tv/channel/star-sports-hd-2-667.html',
                  'http://www.in.com/tv/channel/star-sports-3-103.html',
                  'http://www.in.com/tv/channel/star-sports-hd-3-668.html',
                  'http://www.in.com/tv/channel/star-sports-4-101.html',
                  'http://www.in.com/tv/channel/star-sports-hd-4-669.html'
                  
                  ];
  
  
 var showListNames = ['ZEENEWS','INDIATV','AAJTAK','NDTV','CNN','CNNLIVE','TIMESNOW',                                 'STARMOVIES','STARMOVIESHD','HBO','ZEESTUDIOS',
                      'STARMOVIESACTION','SONYPIX','WB','MOVIESNOW',                                         'MOVIESNOWHD','STARGOLD','STARGOLDHD','MOVIESOK',
                      'ANDPICTURES','UTVACTION','UTVMOVIES',
                      'COLORS','ZEETV','ANDTV','SONY','SONYHD','STARPLUS',
                     'STARPLUSHD','STARWORLD','STARWORLDHD','AXN','ZEECAFE','FX',
                      'TLC',
                      'DISCOVERY','ANIMALPLANET','NATGEO','NATGEOWILD',
                      'DISCOVERYTURBO','HISTORY',
                      'CARTOONNETWORK','POGO','NICK','HUNGAMA',
                      'ZEEQ','NICKJR','DISNEY',
        
                     'DDSPORTS','TENSPORTS','TENSPORTSHD','SONYSIX','SONYSIXHD',
                      'SONYMAX','STARSPORTS1','STARSPORTS1HD','STARSPORTS2',
                      'STARSPORTS2HD','STARSPORTS3','STARSPORTS3HD',
                      'STARSPORTS4','STARSPORTS4HD'
          
                      
                     ];
 
 
 
 //
 
//var repeatAfter5H;


 
 io.sockets.on('connection',function(socket){
    socket.join('ADSEEKER');
    
      eventemit.on('fillName',function(Names){
         console.log('fillName updated '+Names)
     nameIdSave[socket.id] = Names; 
      });
     
     
       //onload shows
     for(var i in showListNames){
         if(onLoadShows[showListNames[i]]){
             
             console.log(showListNames[i]+'-----yoyoy---'+onLoadShows[showListNames[i]]);
             
             socket.emit('getRequest',[showListNames[i],onLoadShows[showListNames[i]]]);
         }
     
     }
     
     
     
       
         if(setOnce ==0){
    setInterval(showTime,120000);
  setOnce = 1;
  }
     
  /*   
     
  jsdom.env(
  "http://nodejs.org/dist/",
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
    console.log("there have been", window.$("a").length, "nodejs releases!");
  }
);
     
    */ 
     
     
     function showTime(){
     var n = 0;
  /*      repeatAfter5H+=10;
        
       if(repeatAfter5H == 18000){
       
       repeatAfter5H = 0;
       
           for(var i in showListNames){
           
           delete channelStoreHouse[showListNames[i]];
           
           }
           
       }  
    */     
         
      
     if(channelStoreHouse[showListNames[n]]){
     console.log('logged');
     
     takeRequest(channelStoreHouse[showListNames[n]],true);
      
      }else{
        
         console.log('not logged');
         
              var reqObj = {uri:showList[n],method:'GET'};
var handle = request(reqObj,function(error, response, body){
    if(error){
      console.log(error);
      }else{
         takeRequest(body,false);
        
         }
    });

      }
      
     function takeRequest(body,bool){
     var countCurrent = 0;
        $ = cheerio.load(body);
               
               if(bool != true){
              channelStoreHouse[showListNames[n]] = body;
              }
              
                  if($('.schedule_details').length == 0){
         
              delete channelStoreHouse[showListNames[n]];
         
         }
          
         
          if($('.schedule_details') == 'undefined'|| $('.schedule_details') == null){
                  
                  ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[n]];
                  
                  }
         
              $('.schedule_details').each(function(){
                
                countCurrent++;
                
                // var re = new RegExp('\n');
      var startTime = $(this).find('.show_start_time').prop('value');
      var endTime = $(this).find('.show_end_time').prop('value');
      
      var splitSTime = startTime.split(' ');
      var splitETime = endTime.split(' ');
      var startSTime = splitSTime[3].split(':');
      var endSTime = splitETime[3].split(':');
       var showHoursS = parseInt(startSTime[0]);
      var showHoursE = parseInt(endSTime[0]);              
      var showMinutesS = startSTime[1];
      var showMinutesE = endSTime[1];
      
        var hour = new Date().getUTCHours().valueOf()+5;
       var min  = new Date().getUTCMinutes().valueOf()+30;
       
       var time = hour+':'+min;
       
       
       if(min>=60){

              hour++;
        
        min = min-60;
        
       }  
       
       if(hour >= 24){
        
        hour = hour-24;
        
       }
       var totCTime = hour*60+min;
       var totstart = parseInt(startSTime[0])*60+ parseInt(startSTime[1]);
       var totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
       
        
    if(totend < totstart){
         if(hour == 0){
            totCTime = 24*60+min;
          }else if(hour == 1){
            totCTime = 25*60+min;
          }else  if(hour == 2){
            totCTime = 26*60+min;
          }else  if(hour == 3){
            totCTime = 27*60+min;
          }else  if(hour == 4){
            totCTime = 28*60+min;
          }
          
       
        if(endSTime[0] == '00'){
          
          endSTime[0] = '24';
          totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
         
        }else if(endSTime[0] == '01'){
           
          
         endSTime[0] = '25';
        totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
        
         }
       else if(endSTime[0] == '02'){
        
          endSTime[0] = '26';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       } else if(endSTime[0] == '03'){
        
          endSTime[0] = '27';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       } else if(endSTime[0] == '04'){
        
          endSTime[0] = '28';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       }
            
         
       }
      
                  
                  
                 
       if(totCTime >=totstart && totCTime <= totend){
       var splitSTime12Hours = ((showHoursS + 11) % 12 + 1);
      var splitETime12Hours = ((showHoursE + 11) % 12 + 1);
           
    var timeToStringS = splitSTime12Hours.toString()+":"+showMinutesS;
    var timeToStringE = splitETime12Hours.toString()+":"+showMinutesE;    

  /*
           if(countCurrent == $('.schedule_details').length){
           
           ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[n]];
        
   }
    */    
        
        
       console.log( showListNames[n]+'  ' +$('.schedule_details').length + '  ' + countCurrent+'  '+startSTime+'---===-'+ $(this).find('a').prop('title')+'------=='+'  ('+timeToStringS+' - '+timeToStringE+')');
       var doet = $(this).find('a').prop('title') +'  ('+timeToStringS+' - '+timeToStringE+')';
           
           onLoadShows[showListNames[n]] = doet;
           
        socket.to('ADSEEKER').emit('getRequest',[showListNames[n],doet]);
        
       }
                  
        /*        
        if($('.schedule_details') == 'undefined'|| $('.schedule_details') == null){
                  
                  ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[n]];
                  
                  }
                  
          */ 
                 if(totCTime == 1620 || totCTime == 180||totCTime == 1500|| totCTime == 60||totCTime == 1560 || totCTime == 120||totCTime==240){
                  
                      for(var i in showListNames){
                        delete channelStoreHouse[showListNames[i]];
                      }
                  
                  }
                  
       
 });
         
         
         
          
          
       
  
      if(n == showList.length-1){
     
        }else{
          repeatThis(n+1);
          
        }
      
   
     }
     
     } 
      
      
        
     // eventemit.on('godaddy',function(letsSee){
     
     
     
     
     
     
     
     
     function repeatThis(letsSee){
        
        
      if(channelStoreHouse[showListNames[letsSee]]){
      console.log('logged')
       takeRequest(channelStoreHouse[showListNames[letsSee]],true);
      }else{
        
         console.log('not logged')
     
       var reqObj = {uri:showList[letsSee],method:'GET'};
var handle = request(reqObj,function(error, response, body){
    if(error){
      console.log(error);
      }else{

         takeRequest(body,false);
        
          }
    });
        
     
      }
        
         function takeRequest(body,bool){
     var countCurrent = 0;
        $ = cheerio.load(body);
     
               if(bool != true){
              channelStoreHouse[showListNames[letsSee]] = body;
              }
         if($('.schedule_details').length == 0){
         
              delete channelStoreHouse[showListNames[letsSee]];
         
         }
              if($('.schedule_details') == 'undefined'|| $('.schedule_details') == null){
                  
                  ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[letsSee]];
                  
                  }
               
               
              $('.schedule_details').each(function(){
                // var re = new RegExp('\n');
               
                countCurrent++;
               
      var startTime = $(this).find('.show_start_time').prop('value');
      var endTime = $(this).find('.show_end_time').prop('value');
      
      var splitSTime = startTime.split(' ');
      var splitETime = endTime.split(' ');
      var startSTime = splitSTime[3].split(':');
      var endSTime = splitETime[3].split(':');
       var showHoursS = parseInt(startSTime[0]);
      var showHoursE = parseInt(endSTime[0]);              
      var showMinutesS = startSTime[1];
      var showMinutesE = endSTime[1];
      
      
       var hour = new Date().getUTCHours().valueOf()+5;
       var min  = new Date().getUTCMinutes().valueOf()+30;
       var time = hour+':'+min;
  
  
  
      
       if(min>=60){
              hour++;
        min = min-60;
            
       }
       
       if(hour >= 24){
        
        hour = hour-24;
        
       }
       
       
       /* 
     if(endSTime[1] == 0){
       endSTime[1] = 60;
        
       }
      */
       
       
        var totCTime = hour*60+min;
       var totstart = parseInt(startSTime[0])*60+ parseInt(startSTime[1]);
       var totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
       
         //console.log('beofooooooooore'+hour +'  '+min + '  <utc - ind> '+ totCTime+$(this).find('a').prop('title')+'  start s '+splitSTime[3]+'  end s '+splitETime[3]);
       
        if(totend < totstart){
         if(hour == 0){
            totCTime = 24*60+min;
          }else if(hour == 1){
            totCTime = 25*60+min;
          }else  if(hour == 2){
            totCTime = 26*60+min;
          }else  if(hour == 3){
            totCTime = 27*60+min;
          }else  if(hour == 4){
            totCTime = 28*60+min;
          }
          
       
        if(endSTime[0] == '00'){
          
          endSTime[0] = '24';
          totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
          
        }else if(endSTime[0] == '01'){
           
          
         endSTime[0] = '25';
        totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]);
        
         }
       else if(endSTime[0] == '02'){
        
          endSTime[0] = '26';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       } else if(endSTime[0] == '03'){
        
          endSTime[0] = '27';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       } else if(endSTime[0] == '04'){
        
          endSTime[0] = '28';
         totend = parseInt(endSTime[0])*60+parseInt(endSTime[1]); 
     
       }
            
       
       }

       
       if(totCTime >=totstart && totCTime <= totend){
                    
       var splitSTime12Hours = ((showHoursS + 11) % 12 + 1);
      var splitETime12Hours = ((showHoursE + 11) % 12 + 1);
           
    var timeToStringS = splitSTime12Hours.toString()+":"+showMinutesS;
    var timeToStringE = splitETime12Hours.toString()+":"+showMinutesE;    

  /*
           if(countCurrent == $('.schedule_details').length){
           
           ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[letsSee]];
        
   }
    */    
        
        
       console.log( showListNames[letsSee]+'  ' +$('.schedule_details').length + '  ' + countCurrent+'  '+startSTime+'---===-'+ $(this).find('a').prop('title')+'------=='+'  ('+timeToStringS+' - '+timeToStringE+')');
       var doet = $(this).find('a').prop('title') +'  ('+timeToStringS+' - '+timeToStringE+')';
           onLoadShows[showListNames[letsSee]]=doet;

         socket.to('ADSEEKER').emit('getRequest',[showListNames[letsSee],doet]);
        
       }
                  
                  
              /*    
                   if($('.schedule_details') == 'undefined'|| $('.schedule_details') == null){
                  
                  ///REFRESH THE LIST
           delete channelStoreHouse[showListNames[letsSee]];
                  
                  }
                */
                    
                   if(totCTime == 1620 || totCTime == 180||totCTime == 1500|| totCTime == 60||totCTime == 1560 || totCTime == 120||totCTime==240){
                  
                      for(var i in showListNames){
                        delete channelStoreHouse[showListNames[i]];
                      }
                  
                  }
                  
       
 });
             
             
             
                            
        
  
      
      if(letsSee == showList.length-1){
        
        }else{
           repeatThis(letsSee+1);
          
        }
      
      
  
     }
     }
      //  });
     
     
      
      
    
    
    
     socket.on('liveServerRefresh',function(){
       for(var i = 0; i<firstData.length;i++){
      socket.emit('liveServerRefresh',dataBase[firstData[i]]) 
    }  
      });
    


   socket.on('dataOnLoad',function(dats){
      
      console.log(dats.length);
   
      if(newsIdSave[0] == null){
           for(var j in dats){
        newsIdSave[j] = dats[j];
}
recursive(0);
}
      
      for(var i in dats){
        console.log(dats[i]);
        var name = dats[i];
        
        connection.query('SELECT COUNT(*) AS '+name+' FROM SUBSCRIPTION WHERE '+name+' LIKE ?',['yes'],function(oops,smart){
          if(oops){
          }else{
           //console.log('-=-=-=-=-=-'+JSON.stringify(smart, null, 4));
          socket.emit('dataOnLoad',[smart,'yes']);
          }
          });
        
          connection.query('SELECT COUNT(*) AS '+name+' FROM SUBSCRIPTION WHERE '+name+' LIKE ?',['no'],function(oops,smart){
          if(oops){
          }else{
          socket.emit('dataOnLoad',[smart,'no']);
          }
          
          });
        
      }
      
      });


  
   socket.on('initialize',function(result){
        console.log('socket id  lets see:'+socket.id);
        
        if(result.name != undefined){
       socket.emit('userInfo',{userinfo:result.name,success:true});
        }else{
         
          socket.emit('userInfo',{userinfo:result.name,success:false});
         
        }
      });
   
   
   
   
   eventemit.on('finalBlow',function(newsNaame){

            connection.query('SELECT COUNT(*) AS '+newsNaame+' FROM SUBSCRIPTION WHERE '+newsNaame+' LIKE ?',['yes'],function(oops,smart){
          if(oops){
          }else{
         // socket.emit('dataOnLoad',[smart,'no']);
          socket.in('ADSEEKER').emit('message',[smart,'yes']);
            socket.emit('message',[smart,'yes']);    
          }
          
          });
      
        
          connection.query('SELECT COUNT(*) AS '+newsNaame+' FROM SUBSCRIPTION WHERE '+newsNaame+' LIKE ?',['no'],function(oops,smart){
          if(oops){
          }else{
          //socket.emit('dataOnLoad',[smart,'no']);
           socket.in('ADSEEKER').emit('message',[smart,'no']);
            socket.emit('message',[smart,'no']);  
          }
          
          });
          
      
      });
   
   
   
 
  socket.on('message',function(data){

      console.log('message being proccessed----');
      connection.query('SELECT USER_ID FROM SUBSCRIPTION WHERE USER_ID LIKE ?',[data.realId],function(initError,initRes){
        
          var newsName = data.newsName;
        var newsValue = data.newsValue;
        var idd = data.realId;
        
        if(initError){
          console.log('eeeeeeeeeee'+initError);
          
          }else{
            
         if(initRes[0] != undefined){
   connection.query('SELECT '+newsName +' FROM SUBSCRIPTION',function(err,row,col){
        
      if(err){    
         console.log(err);
         
                  console.log('undefined column preparing to add '+newsName);
         
           connection.query('ALTER TABLE SUBSCRIPTION ADD COLUMN ('+ newsName +' VARCHAR(255),' + newsName+'_TIME' +' DATETIME)',function(err2,result2){
         
 
  /*
  connection.query('UPDATE SUBSCRIPTION SET '+zeenews_TIME+'= NOW() WHERE USER_ID LIKE ?',['7'],function(err3,results3){
      
      if(err3){
  console.log('oeoeoeoe '+err3)
  }
  
  else{
    
    console.log('done '+results3);
    console.log('-=-=-=-=-=-'+JSON.stringify(results3, null, 4)); 
  }
      });
  */
         if(err2){
              
            console.log('error insurting the column' + err2);
            
            }else{
               
               console.log('success creating 2 new columns ' + newsName +' and '+newsName+'_TIME');
                 
              connection.query('UPDATE SUBSCRIPTION SET '+newsName+'_TIME'+'= NOW() + INTERVAL 5 MINUTE ,' +newsName+'= ? WHERE USER_ID LIKE ?',[newsValue,idd],function(err3,results3){
                if(err3){
                     
                     console.log("err updating the rows "+err3);
                     
                     }else{
                    
                    console.log('sucess updating new row value : ' + newsValue +' in column '+newsName);
                    console.log('sucess updating new row currentTime : ' + ' in column '+newsName+'_TIME');
           //showDataInfo();

                     }
               
               });
      
            }
         });
         
      }
      
      else{
         
       console.log('-=-=-=-=-=-'+JSON.stringify(row, null, 4));
         //////PROCESS THE QUERY HERE
         
          connection.query('SELECT '+newsName+' FROM SUBSCRIPTION WHERE USER_ID LIKE ?',[idd],function(ee,rr,cc){
        
        if(ee){
          console.log('erororororororororor'+ee);
         
           }else{    
                  
     console.log( 'eeeeeeevaluueeeeeeee : '+JSON.stringify(cc, null, 4));
      //var ss = new Array();
      //ss[0] = cc[0].name;
    //  console.log(Object.getOwnPropertyNames(rr[0]));
          
         var conValueToString = JSON.stringify(rr[0]);
         var ans = conValueToString.split('"');
          
          if(newsValue == ans[3]){
            
             console.log('same value ' + ans[3]);
            socket.emit('sameMessage',{message:'Cannot update the same Ad'});
             
          }else{
             
           console.log('column present preparing to update');
              connection.query('UPDATE SUBSCRIPTION SET '+newsName+'_TIME'+'= NOW() + INTERVAL 5 MINUTE ,'+newsName+'= ? WHERE USER_ID LIKE ?',[newsValue,idd],function(err3,results3){
                if(err3){
                     
                     console.log("one more  "+err3);
                     
                     }else{
                    
                    console.log('sucess jabbing 2 new rows');
                     socket.emit('sameMessage',{message:'Successfully Updated'});
            
    
                             
      // showDataInfo();
       console.log('sucess updating new row value : ' + newsValue +' in column '+newsName);
       console.log('sucess updating new row currentTime : ' + ' in column '+newsName+'_TIME');
     
      
       connection.query('SELECT COUNT(*) AS '+newsName+' FROM SUBSCRIPTION WHERE '+newsName+' LIKE ?',['yes'],function(oops,smart){
          if(oops){
          }else{
         // socket.emit('dataOnLoad',[smart,'no']);
          socket.in('ADSEEKER').emit('message',[smart,'yes']);
            socket.emit('message',[smart,'yes']);    
          }
          
          });
      
        
          connection.query('SELECT COUNT(*) AS '+newsName+' FROM SUBSCRIPTION WHERE '+newsName+' LIKE ?',['no'],function(oops,smart){
          if(oops){
          }else{
          //socket.emit('dataOnLoad',[smart,'no']);
           socket.in('ADSEEKER').emit('message',[smart,'no']);
            socket.emit('message',[smart,'no']);  
          }
          
          });
    }
        
        });
      
                   
                   
          }      
                   
                  }
              });    
      }
      
      
      });
          }else{
  
           socket.emit('sameMessage',{message:'Unknown user.please login to Update'});
          
          }
         }
        });
      
      });
       
       
            
      //done    


    
   
    socket.on('disconnect',function(){
   console.log(socket.id +" left from adseeker");
   
   //remove value once user leaves the site
   
   /*
   if(nameIdSave[socket.id]){

     for(var i in newsIdSave){
       console.log('helloooooooo'+newsIdSave[i]);
     console.log('gogogo');   
       connection.query('UPDATE SUBSCRIPTION SET '+newsIdSave[i] +'= ? WHERE USER_ID LIKE ? AND ('+newsIdSave[i]+' LIKE ?'+' OR '+newsIdSave[i]+' LIKE ? )',['cancel',nameIdSave[socket.id],'yes','no'],function(err3,results3){
                if(err3){
                     
                     console.log("one more  "+err3);
                     
                     }else{
                   
                      if(results3.affectedRows){
              
          console.log('sucess jabbing a new row '+ newsIdSave[i]);
        console.log('-=-=-=-=-=-'+JSON.stringify(smart, null, 4));
                        
                      }else{
                        
                        console.log('value is neither yes nor it is no...so no update')
                        
                      }
                  
           //console.log('-=-=-=-=-=-'+JSON.stringify(smart, null, 4));

       
          }
          });
     }

      }
      
       for(var j in newsIdSave){
      
       connection.query('SELECT COUNT(*) AS '+newsIdSave[j]+' FROM SUBSCRIPTION WHERE '+newsIdSave[j]+' LIKE ?',['yes'],function(oops,smart){
          if(oops){
            console.log('ererer'+oops);
          }else{
        // console.log('-=-=-=-=-=-'+JSON.stringify(smart, null, 4));
          socket.in('ADSEEKER').emit('message',[smart,'yes']);
            
          }
          
          });
      
        
          connection.query('SELECT COUNT(*) AS '+newsIdSave[j]+' FROM SUBSCRIPTION WHERE '+newsIdSave[j]+' LIKE ?',['no'],function(oops,smart){
          if(oops){
             console.log('erererooooooo'+oops);
          }else{
      // console.log('-=-=-=-=-=-'+JSON.stringify(smart, null, 4));
           socket.in('ADSEEKER').emit('message',[smart,'no']);
           
          }
          
          });
        
      
       }  
      */
     
   });
   

   });  




///////////functions start here//////////







function fileRead(res,req,abspath){
    var head = mime.lookup(path.basename(abspath));
    if(cache[abspath]){
      console.log("-=-=path-=-=-"+abspath);
  console.log("-=-=-=-head=-=-=-=-"+head);
  
       writeServer(res,req,cache[abspath],head);
    }
    else{
    fs.exists(abspath,function(exist){
        if(exist){
    fs.readFile(abspath,function(err, data){
if(err){
    serverError(res);
}
  
  else{
   cache[abspath]=data;

  writeServer(res,req,data,head);
  
}
    } );
    }
    
    else{
        serverError(res);
    }
    });
    } 

}
  

//request('http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg').pipe(fs.createWriteStream('doodle.png'))

 
function writeServer(res,req,data,head){

    res.writeHead(200,{'Content-Type':head});
    res.end(data);
    //console.log(req.socket.remoteAddress);
   
}


function setHead(res){

     // Website you wish to allow connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
   // res.setHeader('Access-Control-Allow-Methods', 'GET, POST');// OPTIONS, PUT, PATCH, DELETE

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

}



function showHttpInfo(req){
    
    
      console.log('header---------'+req.headers['host']);
    console.log('url----------'+req.url)
   var parse = req.url.split('/');
   parse.shift();
var data = parse[0];
    
    console.log('split  -------- '+ data);
    //console.log('shift  -   - '+info);
    
}


 function passHttpRequest(res,req,dataRead){
    
     req.on('data',function(data){
     dataRead = data;
     flag = true;
    console.log('=========='+data);
    fillDataBase(dataRead.toString());//filling up the database to show live info even on refresh of page
    
eventemit.emit('blow',dataRead.toString());
 //sendRequestToPubClient(dataRead.toString());
    });

 
    req.on('end',function(){
     
    console.log('*****ended****');
    var head = req.headers['content-type'];
    console.log(head);
    
   writeServer(res,dataRead,head)
dataRead = '';
 
    });

    
}


//////////READ TOKEN FOR SIGN IN

function readToken(req,res){
    req.on('data',function(data){
      var stringtoken = data.toString();
      var splittoken = stringtoken.split("=");
      splittoken.shift();
      readSignInUser(req,res,splittoken)
      });
    
    req.on('end',function(){
        console.log('****end req****');  
    });
}


//function  makeSocketConnection(){
   
     
   
//}

function readSignInUser(req,res,splittoken){
   
      request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+splittoken,function(error,response,body){
         if(!error && response.statusCode == 200){
            
            console.log('hellooooooooooooooo');
            //makeSocketConnection();
            //var abspath = './public/signup.html';
            //fileRead(res,req,abspath);
           // serverError(res);
            var obj = JSON.parse(body);
             selectFromDataBase(req,res,obj.name,obj.email,obj.sub);
  }    
         else{
            console.log("ERROR=-=-="+error+"RESPONSE=-=-=-"+response.statusCode)         
         }
   });
  
}

function showDataInfo(){
   
connection.query('SELECT * FROM SUBSCRIPTION',function(errs,ro){
               if(errs){
            
               console.log('1sr error '+errs);
               }else
               {
        console.log('-=-=-=-=-=-'+JSON.stringify(ro, null, 4));
               }
});

}

function selectFromDataBase(req,res,name,email,id){
   
   //console.log(id + "  "+ name);
  // connection.query('UPDATE SUBSCRIPTION SET ? WHERE ?',[{USER_ID:id},{USER_NAME:name}]);
  //connection.query('DROP TABLE SUBSCRIPTION',function(err,r){if(err){console.log(err)}else{console.log('done')}}); 
      
   
            connection.query('SELECT USER_ID,USER_EMAIL,USER_NAME FROM SUBSCRIPTION',function(errs,result){
               
               if(errs){
             createNewTable(name,email,id);
               console.log('1sr error '+errs);
               }else
               {
                            
                  connection.query('SELECT USER_ID FROM SUBSCRIPTION WHERE USER_ID LIKE ?',[id],function(errr,rows,col){
                    console.log(rows[0]+"  "+rows[0])
                     if(errr){
                        console.log('-=-=--errorrrr-=--=-=-==-'+errr);
              }
               
               else{
                insertIntoDataBase(req,res,name,email,id,rows,col);
             }
         });
               
       }
    });
            
}




function insertIntoDataBase(req,res,name,email,id,rows,col){
    
            if(rows[0]== undefined){
              var post = {
              USER_ID:id,
              USER_EMAIL:email,
              USER_NAME:name
              };
              
               connection.query('INSERT INTO SUBSCRIPTION SET ?',post,function(err,results){
                  
                  if(err){
                     
                     console.log("one more  "+err);
                     
                     }else{
                         eventemit.emit('fillName',id);
                      // eventemit.emit('blow3',name); 
                    console.log('sucess '+results);    
                     }
                  
                  });
               }else{   
                
         for (var i in rows) {   
        console.log('id  : '+rows[i].USER_ID);
         console.log('found -----id: ');
    }
    console.log('send to client');
   eventemit.emit('fillName',id);
   // eventemit.emit('blow3',name);
    updateDataBase(id,name);
             
 }
   
   
}


function updateDataBase(id,name){
   
    connection.query('SELECT USER_NAME FROM SUBSCRIPTION WHERE USER_NAME LIKE ?',[name],function(err,row){
   
   if(row[0] == undefined){
      
      connection.query('UPDATE SUBSCRIPTION SET ? WHERE ?',[{USER_NAME:name},{USER_ID:id}]);
      
    //eventemit.emit('blow3',name);
      }else{ 
      //eventemit.emit('blow3',name);
      console.log('profile up to date: send to client');
      
      
   }
   
   });
    
}


function createNewTable(name,email,id){
   
   
connection.query('CREATE TABLE SUBSCRIPTION(USER_ID VARCHAR(100) NOT NULL,USER_NAME VARCHAR(100),'+
                  'USER_EMAIL VARCHAR(100),PRIMARY KEY(USER_ID))',function(err,result){
                     
                   if(err){
                     console.log(err);
                     
                     }else{
                        
                        console.log('table created'+result);              
                 
               }  
                    
       });  
}




////////////DATA BASE

function fillDataBase(dataRead){
    var flag2 = false;
    var dataSplit = dataRead.split('/');
    
    if(firstData[0]==null){
    firstData.push(dataSplit[0]);
       dataBase[dataSplit[0]] = dataRead;
       flag2=true;
    }
else{
    for(var index = 0;index<firstData.length; index++){
        if(firstData.indexOf(dataSplit[0])==-1){
     firstData.push(dataSplit[0]);
     dataBase[dataSplit[0]] = dataRead;
     flag2=true;
    //console.log(firstData);
}
    }
}
    
    if(flag2 != true){
            dataBase[dataSplit[0]]=dataRead;
            console.log('[][][][][][][][][][]['+dataBase[dataSplit[0]]);
    }
    
}



function serverError(res){
    
    res.writeHead(404,'Content-Type:text/plain');
    res.write('404 error : resourse not found');
    res.end();

}

//server side event using sse module an alternate way to send request to client from server
//ps. cant be used because it could only be run when the request is passed and cant be run at runtime.
/*

function sendRequestToPubClient(dataRead){

var sse = new SSE(server); 
sse.on('connection',function(client){
    client.send(dataRead);
 flag=false;
    });

  
}
*/

  function mysqlHints(){     
    /*
    connection.query('ALTER TABLE SUBSCRIPTION DROP COLUMN zeenews',function(e,r){
   if(e){
      console.log('eeeerrrr'+e);
   }else{
      
      console.log('dropped')
   }
      });
    var h = null;
    connection.query('DELETE FROM SUBSCRIPTION WHERE USER_NAME ?'[h],function(ee,re){
      
       if(ee){
      console.log('eeeeeerrrrrrerrrr'+ee);
   }else{
      
      console.log('deleted')
      
   }  
      });
    */
    
       /*   
              connection.query('INSERT INTO SUBSCRIPTION SET '+newsName+ ' = ?',[newsValue],function(err3,results3){
                if(err3){
                     
                     console.log("one more  "+err3);                 
                     }else{
                    console.log('sucess jabbing a new row'+results3);
                     }
               
               });          
 */
      }
      

