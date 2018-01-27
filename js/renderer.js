class PageRenderer{
    constructor() {
        this.initPercent=0;
        this.initPercentChange=1;
        this.appVidget=document.getElementById('app');
        this.getIcons('weater_icons.json').then((respond)=>{
            this.icons=JSON.parse(respond);
        });
    }
    buildApp(){
        this.initUi();
    }
    getIcons(url){
        return new Promise((resolve, reject)=>{
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onreadystatechange = function() { // (3)
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    reject(xhr.status)
                } else {
                    resolve(xhr.responseText);
                }
            }

        })
    }
    initUi(){
        this.page=new Page('app');
    }
    renderWidget(data){
       window.weaterWidget= new WeaterWidget(data,this.icons);
    }
    renderDays(data){
        window.daysWidget= new DaysWidget(data,this.icons);
    }
}
 