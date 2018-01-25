class LocationService{
    static getYourCoords(){
        return new Promise((resolve,reject)=>{
            window.ymaps.geolocation.get({
                provider: 'yandex',
                autoReverseGeocode: true
            }).then((result)=>{
                resolve(result.geoObjects.get(0).geometry._coordinates);
            }).catch(()=>console.log('error'));
        });

    }
    static  getCityCoords(city){
        return new Promise((resolve,reject)=>{
            var myGeocoder = window.ymaps.geocode(city);
            myGeocoder.then(
                (res)=>{
                    resolve(res.geoObjects.get(0).geometry._coordinates);
                },
                (err) => {
                    console.log('error')
                }
            ).catch(()=>console.log('error'));
        });

    }
}
