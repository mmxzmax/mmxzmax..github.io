window.dataBase = new AppDb('weater-pwa','keyval-store');
class AppLogic{
    constructor(){
        this.setEvents();
        this.displayFromCache();
        this.informer= new Informer();


        navigator.serviceWorker.register('/sw.js').then((reg)=> {

            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                this._updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                this._trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', ()=>{
                this._trackInstalling(reg.installing);
            });
        });
 

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });

    }

    _trackInstalling(worker) {
        var indexController = this;
        worker.addEventListener('statechange', function() {
            if (worker.state == 'installed') {
                indexController._updateReady(worker);
            }
        });
    };

    _updateReady(worker) {
        this.worker=worker;
        this.informer.updateMessage();
    };
    
    displayFromCache(){
        window.dataBase.getDataFromDb('today').then((weater)=>{
            if(weater){
                window.page.renderWidget(weater);
            } else {
                LocationService.getYourCoords().then((cords)=>{
                    WeaterService.getWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                        let weater=JSON.parse(response);
                        window.page.renderWidget(weater);
                        window.dataBase.setDataToDb('today',weater)
                    }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
                }).catch(()=>this.informer.showMessage('Сервис геолокации недоступен!'))
            }


        });
        window.dataBase.getDataFromDb('days').then((weater)=>{
            if(weater){
                window.page.renderDays(weater);
            } else {
                LocationService.getYourCoords().then((cords)=>{
                    WeaterService.getDailyWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                        let weater=JSON.parse(response);
                        window.page.renderDays(weater);
                        window.dataBase.setDataToDb('days',weater)
                    }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
                }).catch(()=>this.informer.showMessage('Сервис геолокации недоступен!'))
            }
        });

    }
    setEvents(){
        $('#settings').on('click',function(){
            var form=$('.control-form');
            if(form.hasClass('show')){
                $('.control-form').removeClass('show');
            } else {
                $('.control-form').addClass('show');
            }

        });

        window.getYourCoordsWeater = function(){
            LocationService.getYourCoords().then((cords)=>{
                WeaterService.getWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                    let weater=JSON.parse(response);
                    window.page.renderWidget(weater);
                    window.dataBase.setDataToDb('today',weater)
                }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
                WeaterService.getDailyWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                    let weater=JSON.parse(response);
                    window.page.renderDays(weater);
                    window.dataBase.setDataToDb('days',weater)
                }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
            })
        };

        window.getCityCoordsWeater = function(){
            let city=$('#city').val();
            LocationService.getCityCoords(city).then((cords)=>{
                WeaterService.getWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                    let weater=JSON.parse(response);
                    window.page.renderWidget(weater);
                    window.dataBase.setDataToDb('today',weater)
                }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
                WeaterService.getDailyWeater(cords,'91f72fb1d01d11d45af8058227e50524').then((response)=>{
                    let weater=JSON.parse(response);
                    window.page.renderDays(weater);
                    window.dataBase.setDataToDb('days',weater)
                }).catch(()=>this.informer.showMessage('невозможно подключиться к сервису погоды!'));
            })
        }
    }
    updateApp(){
        this.worker.postMessage({action: 'skipWaiting'});
    }
}
window.applogic= new AppLogic();
window.updateApp = function() {
    applogic.updateApp();
};

