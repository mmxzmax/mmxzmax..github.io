class DaysWidget{
    constructor(data,icons){
        this.icons=icons;
        this.data=data;
        this.render();
    } 
    template(list){
        var block='';
        var wraper='';
        var weekDay=new Date(list[0].dt_txt);
        weekDay=weekDay.getDay();
        for(let day of list ){
            let icon=DaysWidget.choozeIcon(this.icons,day.weather[0].icon);
            let temp=`${DaysWidget.toCelsium(day.main.temp_max)}<span>°C</span>` ;
            let date = new Date(day.dt_txt);
            let curentDay=date.getDay();
            if(weekDay==curentDay){
                block+=this.createElement(day);
            } else {
                wraper+=this.createWraper(block,day);
                block='';
                weekDay=curentDay;
                block+=this.createElement(day);

            }
        }
         return wraper;

    }
    createElement(day){
        let options = {
            hour: 'numeric',
            minute: 'numeric',
            timezone: 'UTC'
        };
        let icon=DaysWidget.choozeIcon(this.icons,day.weather[0].icon);
        let temp=`${DaysWidget.toCelsium(day.main.temp_max)}<span>°C</span>` ;
        let date = new Date(day.dt_txt);
        return `
                <div class="w-item">
                    <div class="date">${date.toLocaleString("ru", options)}</div>
                    <div class="icon">${icon}</div>
                    <div class="temp">${temp}</div>
                </div>
                `;
    }
    createWraper(block,day){
        let options = {
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC'
        };
        let date = new Date(day.dt_txt);
        return `
        <div class="block-wraper">
        <div class="day">
            ${date.toLocaleString("ru", options)}
        </div>
        ${block}
        </div>`;
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
