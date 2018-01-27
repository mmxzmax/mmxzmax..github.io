class Page{
    constructor(id){
        this.appVidget=document.getElementById(id);
        this.template=`
            <div id="weater-widget" class="weater-widget">
                    <div class="icon"></div>
                    <div class="temp"></div>
                    <div class="wind"></div>
            </div>

            <div id="days-widget" class="days-widget"></div>

        `;
        this.render();
    }
    render(){
        this.appVidget.innerHTML = this.template;
    }
}
 