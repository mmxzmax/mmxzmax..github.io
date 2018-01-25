

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
            curLib.async=true;
            console.log(`loading ${lib}`);
            var self=this;
            var start=new Date();

            curLib.onload = function() {
                self.initPercent=self.initPercent+self.initPercentChange;
                WeaterApp.loadInfo('load'+lib,self.initPercent);
                console.log(`${lib} ok`);
                resolve();
                let end=new Date();
                let loadingTime=new Date(end-start);
                console.log('ready after:', loadingTime.getMilliseconds(),'ms');
            };
            curLib.addEventListener('error',function(e){
                "use strict";
                console.log(`${lib} loading error`);
                reject();
            });
        });
    }
    initApp() {
       






        var self=this;
        this.appVidget.classList.add('loading');
        self.initPercentChange=Math.round(self.loadVidget.offsetWidth/self.libs.length);
        console.log('шаг',self.initPercentChange);
        if(this.libs.length>1){
            var i=0;
            var pipe= list(libs);
            load(this.libs,pipe);

        } else {
            this.loadLibs(this.libs[0]).then(
                ()=>{
                    this.appVidget.classList.remove('loading');
                    WeaterApp.loadInfo('ready',this.loadVidget.offsetWidth);
                    console.log('load success');
                    this.start();
                }
            ).catch((data)=>{
                console.log('libs loading error');
            })
        }

        function* list(value) {
            for (var item of value) {
                yield self.loadLibs(item);
            }
        }

        function load(libs,pipe){
            let libsCount=libs.length;
            let loadVidgetWidth=self.loadVidget.offsetWidth;
            let increnent=loadVidgetWidth/libsCount;
            var it=pipe.next();
            if(!it.done){
                i++;
                WeaterApp.loadInfo('loading:'+libs[i],increnent*i);
               it.value.then(()=>{
                   load(libs,pipe);
               })
            } else {
                self.appVidget.classList.remove('loading');
                WeaterApp.loadInfo('ready',loadVidgetWidth);
                console.log('load success');
                self.start();
            }
        }
    }
    static loadInfo(message,percent){
        let cur=document.getElementById('load-inner');
        let vidget=document.getElementById('load');
        if(percent==0){
            vidget.classList.add('show');
        }
        vidget.setAttribute('data-message',message);
        cur.style.width=parseInt(percent)+'px';
        if(percent>=vidget.offsetWidth){
            setTimeout(()=>vidget.classList.remove('show'),200);
        }
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