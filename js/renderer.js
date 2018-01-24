class PageRenderer{
    constructor() {
        this.initPercent=0;
        this.initPercentChange=1;
        this.weater=null;
        this.daysWeater=null;
        this.appVidget=document.getElementById('app');
        this.icons=null;
        console.log('render ready');
    }
    buildApp(){
        this.initUi();
        this.dbPromise = idb.open('keyval-store', 1, upgradeDB => {
            upgradeDB.createObjectStore('keyval');
        });
        this.getIcons('weater_icons.json').then((respond)=>{
            this.icons=JSON.parse(respond);
        })

    }
    getIcons(url){
        return new Promise((resolve, reject)=>{
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onreadystatechange = function() { // (3)
                if (xhr.readyState != 4) return;
                console.log('getting icons');
                if (xhr.status != 200) {
                    reject(xhr.status)
                } else {
                    resolve(xhr.responseText);
                }
            }

        })
    }
    initUi(){
        let template=`
            <div id="weater-widget" class="weater-widget">
                    <div class="icon"></div>
                    <div class="temp"></div>
                    <div class="wind"></div>
            </div>
            
            <div id="days-widget" class="days-widget"></div>
           
            <div class="control-form">
                <div class="form-row">
                    <button class="button" id="data-get-coords">Обновить для текущего положения</button>
                </div>
                <div class="form-row">
                    <input id="city" type="text" name="city" placeholder="city" >
                    <button  class="button" id="data-get-coords-city">Обновить для города</button>
                </div>
            </div>  
        `;
        this.appVidget.innerHTML = template;
        this.setEvents();
        setTimeout(()=>this.displayFromCashe('wData'),1);
        setTimeout(()=>this.displayFromCashe('wDaysData'),200);
    }
    setEvents(){
        document.getElementById('data-get-coords').addEventListener('click',()=>{
            LocationService.getYourCoords()
                .then((result)=>{
                    WeaterService.getWeater(result,'91f72fb1d01d11d45af8058227e50524')
                        .then((response)=>{
                            this.weater=JSON.parse(response);
                            console.log(this.weater);
                            this.renderWidget(this.weater);
                            this.setDataToDb('wData',this.weater);
                        }).catch(()=>{
                        this.dbPromise
                            .then((db)=> {
                                var tx = db.transaction('keyval');
                                var keyValStore = tx.objectStore('keyval');
                                return keyValStore.get('wData');
                            })
                            .then((val)=> {
                                this.renderWidget(val);
                            });
                    });
                    WeaterService.getDailyWeater(result,'ea5aae815b26bc6c2c0b29e41d44ad9a')
                        .then((response)=>{
                            this.daysWeater=JSON.parse(response);
                            console.log(this.daysWeater);
                            this.renderDays(this.daysWeater);
                            this.setDataToDb('wDaysData',this.daysWeater);
                        }).catch(()=>{
                        this.dbPromise
                            .then((db)=> {
                                var tx = db.transaction('keyval');
                                var keyValStore = tx.objectStore('keyval');
                                return keyValStore.get('wDaysData');
                            })
                            .then((val)=> {
                                this.renderDays(val);
                            });
                    })
                })
            });

        document.getElementById('data-get-coords-city').addEventListener('click',()=>{
            let value=document.getElementById('city').value;
            LocationService.getCityCoords(value)
                .then((result)=>{
                    WeaterService.getWeater(result,'91f72fb1d01d11d45af8058227e50524')
                        .then((response)=>{
                            this.weater=JSON.parse(response);
                            console.log(this.weater);
                            this.renderWidget(this.weater);
                            this.setDataToDb('wData',this.weater);
                        }).catch(()=>{
                        this.dbPromise
                            .then((db)=> {
                                var tx = db.transaction('keyval');
                                var keyValStore = tx.objectStore('keyval');
                                return keyValStore.get('wData');
                            })
                            .then((val)=> {
                                this.renderWidget(val);
                            });
                    });
                    WeaterService.getDailyWeater(result,'ea5aae815b26bc6c2c0b29e41d44ad9a')
                        .then((response)=>{
                            this.daysWeater=JSON.parse(response);
                            console.log(this.daysWeater);
                            this.renderDays(this.daysWeater);
                            this.setDataToDb('wDaysData',this.daysWeater);
                        }).catch(()=>{
                        this.dbPromise
                            .then((db)=> {
                                var tx = db.transaction('keyval');
                                var keyValStore = tx.objectStore('keyval');
                                return keyValStore.get('wDaysData');
                            })
                            .then((val)=> {
                                this.renderDays(val);
                            });
                    })
                })
        });

        document.getElementById('settings').addEventListener('click',()=>{
            let menu=document.getElementsByClassName('control-form')[0];
            if(menu.classList.contains('show')){
                menu.classList.remove('show');
            } else {
                menu.classList.add('show');
            }
        })


    }
    displayFromCashe(key){
        this.dbPromise.then((db)=> {
            var tx = db.transaction('keyval');
            var keyValStore = tx.objectStore('keyval');
            return keyValStore.get(key);
        }).then((val)=> {
            if(key =='wDaysData'){
                this.renderDays(val);
            } else {
                this.renderWidget(val);
            }
        }).catch(()=>{
            console.log('get data from cashe error')
        });
    }
    setDataToDb(index,data){
        this.dbPromise.then(function(db) {
            var tx = db.transaction('keyval', 'readwrite');
            var keyValStore = tx.objectStore('keyval');
            keyValStore.put(data, index);
            return tx.complete;
        }).then(function() {
            console.log('Added data');
        });
    }
    choozeIcon(data,code){
        for(let i=0;i<data.length;i++){
            if(data[i].code == code){
                return data[i].data;
            }
        }
    }
    renderWidget(data){
        console.log('widget create');
        let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC'
        };
        let date= new Date();
        let temp=this.toCelsium(data.main.temp)+'<span>°C</span>';
        let tempVarIcon='';
        if(this.toCelsium(data.main.temp_max)>30){
            tempVarIcon=this.choozeIcon(this.icons,'thermometerHotIcon');
        } else if(data.main.temp_max<-15) {
            tempVarIcon=this.choozeIcon(this.icons,'thermometerColdIcon');
        }
        let icon=this.choozeIcon(this.icons,data.weather[0].icon);
        let template=`
            <div class="city">
            ${data.name}
            </div>
            <div class="today">${date.toLocaleString("ru", options)}</div>
            <div class="icon">${icon}</div>
            <div class="temp">${temp}</div>
            <div class="temp-var">${data.weather[0].description}<div class="ic">${tempVarIcon}</div></div>
            <div class="wind"></div>
        `;
        document.getElementById('weater-widget').innerHTML=template;
    }
    toCelsium(temp) {
        return Math.round((temp-273) * 100) / 100;
    }
    renderDays(data){
        let options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            timezone: 'UTC'
        };


       
        let list=data.list;

        console.log(list);
        var block='';

        for(let day of list ){
            let  icon=this.choozeIcon(this.icons,day.weather[0].icon);
            let temp=` ${this.toCelsium(day.main.temp_max)}<span>°C</span>` ;
            let date = new Date(day.dt_txt);
            let template=`
                <div class="w-item">
                    <div class="date">${date.toLocaleString("ru", options)}</div>
                    <div class="icon">${icon}</div>
                    <div class="temp">${temp}</div>
                </div>
                `;
            block+=template;
        }
        document.getElementById('days-widget').innerHTML=block;
    }
        

}
