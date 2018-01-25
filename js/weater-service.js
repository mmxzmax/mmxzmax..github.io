 class WeaterService {
     constructor() {
     }
     static getWeater(coords, token) {
         let latitude = coords[0];
         let longitude = coords[1];
         let url = `https://api.openweathermap.org/data/2.5/weather?APPID=${token}&lat=${latitude}&lon=${longitude}`;
        // url = 'resp.json';
         return new Promise((resolve, reject)=> {

             var xhr = new XMLHttpRequest();
             xhr.open('GET', url, true);
             xhr.send();
             xhr.onreadystatechange = function () { // (3)
                 if (xhr.readyState != 4) return;
                 console.log('getting weater');
                 if (xhr.status != 200) {
                     reject(xhr.status)
                 } else {
                     resolve(xhr.responseText);
                 }
             }

         })
     }
     static getDailyWeater(coords, token) {
         let latitude = coords[0];
         let longitude = coords[1];
         let url = `https://api.openweathermap.org/data/2.5/forecast?APPID=${token}&lat=${latitude}&lon=${longitude}`;
         //url = '16days.json';
         return new Promise((resolve, reject)=> {

             var xhr = new XMLHttpRequest();
             xhr.open('GET', url, true);
             xhr.send();
             xhr.onreadystatechange = function () { // (3)
                 if (xhr.readyState != 4) return;
                 console.log('getting weater');
                 if (xhr.status != 200) {
                     reject(xhr.status)
                 } else {
                     resolve(xhr.responseText);

                 }
             }

         })
     }
 }
