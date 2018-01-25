class Informer{
    constructor(){
        this.informer=document.getElementById('informer');    
    }
    showMessage(message){
        let template=`<div class="informer-body"><i onclick="Informer.hideInformer()">close</i><p>${message}</p></div>`;
        this.informer.innerHTML=template;
        this.informer.classList.add('show');
    }
    updateMessage(){
        let template=`<div class="informer-body">
                        <i onclick="Informer.hideInformer()">close</i>
                        <p>Доступны обновления</p>
                        <button class="button" onclick="updateApp()">Обновить</button>
                        <button class="button" onclick="Informer.hideInformer()">Отмена</button>
                      </div>`;
        this.informer.innerHTML=template;
        this.informer.classList.add('show');
    }
    static hideInformer(){
        document.getElementById('informer').classList.remove('show');
    }
    
}
