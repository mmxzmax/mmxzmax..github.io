class DaysWidget{
    constructor(data,icons){
        this.icons=icons;
        this.data=data;
        this.render();
    }
    template(list){
        var block='';
        let options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            timezone: 'UTC'
        };
        for(let day of list ){
            let icon=DaysWidget.choozeIcon(this.icons,day.weather[0].icon);
            let temp=`${DaysWidget.toCelsium(day.main.temp_max)}<span>°C</span>` ;
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
         return block;

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
        document.getElementById('days-widget').innerHTML=this.template(this.data.list);
        console.log('daysWidget ready')
    }
}
