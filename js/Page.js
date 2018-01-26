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

            <div class="control-form">
                <div class="form-row">
                    <button class="button" id="data-get-coords" onclick="getYourCoordsWeater();">Обновить для текущего положения</button>
                </div>
                <div class="form-row">
                    <input id="city" type="text" name="city" placeholder="city" >
                    <button  class="button" id="data-get-coords-city" onclick="getCityCoordsWeater();">Обновить для города</button>
                </div>


            </div>
        `;
        this.render();
    }
    render(){
        this.appVidget.innerHTML = this.template;
    }
}
 