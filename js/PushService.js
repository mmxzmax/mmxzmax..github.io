class PushService{
    constructor(){
        this.endpoint=null;
        var self=this;

    }
    sendNot(){
        var delay = 20;
        var ttl = 0;
        fetch('./sendNotification?endpoint=' + self.endpoint + '&delay=' + delay +
            '&ttl=' + ttl,
            {
                method: 'post'
            }
        );
    }
}


