class WeaterWidget{
    constructor(data,icons){
        this.icons=icons;
        this.data=data;
        this.render();
    }
    template(data,date,icon,temp,tempVarIcon){
        let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC'
        };
        return `
            <div class="city">
            ${data.name}
            </div>
            <div class="today">${date.toLocaleString("ru", options)}</div>
            <div class="icon">${icon}</div>
            <div class="temp">${temp}</div>
            <div class="temp-var">${data.weather[0].description}<div class="ic">${tempVarIcon}</div></div>
            <div class="wind"></div>
        `;
    }
    static toCelsium(temp) {
        return Math.round((temp-273) * 100) / 100;
    }
    static choozeIcon(data,code){
        for(let i=0;i<data.length;i++){
            if(data[i].code == code){
                return data[i].data;
            }
        }
    }
    render(){
        let date='';
        let temp='';
        let tempVarIcon='';
        let icon='';
        let data={};
        data.weather=[
            {
                description:''
            }
        ];
        data.name='';

        if(this.data){
            date= new Date();
            data=this.data;
            temp=WeaterWidget.toCelsium(data.main.temp)+'<span>°C</span>';
            tempVarIcon='';
            if(WeaterWidget.toCelsium(data.main.temp_max)>15){
                tempVarIcon=WeaterWidget.choozeIcon(this.icons,'thermometerHotIcon');
            } else if(WeaterWidget.toCelsium(data.main.temp_max)<-15) {
                tempVarIcon=WeaterWidget.choozeIcon(this.icons,'thermometerColdIcon');
            }
            icon=WeaterWidget.choozeIcon(this.icons,data.weather[0].icon);
        }
        document.getElementById('weater-widget').innerHTML=this.template(data,date,icon,temp,tempVarIcon);
        console.log('weater widget ready');
    }
}
 