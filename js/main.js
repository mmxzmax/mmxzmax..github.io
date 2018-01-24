
var libs=[
    'https://api-maps.yandex.ru/2.1/?lang=ru_RU',
    'js/idb.js',
    'js/renderer.js',
    'js/LocationService.js',
    'js/weater-service.js'
];

class WeaterApp{
    constructor(libs,callBack) {
        this.libs=libs;
        this.callback=callBack;
        this.loadVidget=document.getElementById('load');
        this.initPercent=0;
        this.initPercentChange=1;
        this.appVidget=document.getElementById('app');
        this.initApp();

    }
    loadLibs(lib) {
        return new Promise((resolve, reject)=>{
            let curLib=document.createElement('script');
            curLib.type='text/javascript';
            document.body.appendChild(curLib);
            curLib.src=lib;
            console.log(`loading ${lib}`);
            var self=this;
            curLib.addEventListener('load',function(){
                "use strict";
                self.initPercent=self.initPercent+self.initPercentChange;
                self.loadInfo('load'+lib,self.initPercent);
                console.log(`${lib} ok`);
                resolve();
            });
            curLib.addEventListener('error',function(e){
                "use strict";
                console.log(`${lib} loading error`);
                reject();
            });
        });
    }
    initApp() {
        if ('serviceWorker' in navigator) {
           window.addEventListener('load', function() {
               navigator.serviceWorker.register('/sw.js').then(function(registration) {
                   // Регистрация успешна
                   console.log('ServiceWorker registration successful with scope: ', registration.scope);
               }).catch(function(err) {
                   // Регистрация не успешна
                   console.log('ServiceWorker registration failed: ', err);
               });
           });
        }
        var self=this;
        this.appVidget.classList.add('loading');
        this.loadVidget.classList.add('show');
        self.initPercentChange=self.loadVidget.offsetWidth/self.libs.length;
        console.log('шаг',self.initPercentChange);
        if(this.libs.length>1){

            Promise.all(getLibs()).then(
                ()=>{
                    this.appVidget.classList.remove('loading');
                    this.loadInfo('ready',this.loadVidget.offsetWidth);
                    setTimeout(()=>this.loadVidget.classList.remove('show'),200);
                    console.log('load success');
                    this.start();
                }
            ).catch((data)=>{
                console.log('libs loading error');
            })
        } else {
            this.loadLibs(this.libs[0]).then(
                ()=>{
                    this.appVidget.classList.remove('loading');
                    this.loadInfo('ready',this.loadVidget.offsetWidth);
                    setTimeout(()=>this.loadVidget.classList.remove('show'),200);
                    console.log('load success');
                    this.start();
                }
            ).catch((data)=>{
                console.log('libs loading error');
            })
        }
        function getLibs() {
            var func=[];
            for(let lib of self.libs){
                func.push(self.loadLibs(lib));
            }
            return func;
        }
    }
    loadInfo(message,percent){
        let cur=document.getElementById('load-inner');
        this.loadVidget.setAttribute('data-message',message);
        cur.style.width=parseInt(percent)+'px';
    }
    start (){
        this.callback();
        return true
    }

}

window.app= new WeaterApp(libs,appStart);


function appStart(){
    console.log('ready');
    window.page= new PageRenderer();
    window.page.buildApp();
}
"use strict";