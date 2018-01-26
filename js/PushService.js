class PushService{
    constructor(){
        this.endpoint=null;
        var self=this;
        navigator.serviceWorker.register('pushService.js')
            .then(function(registration) {
                return registration.pushManager.getSubscription()
                    .then(function(subscription) {
                        if (subscription) {
                            return subscription;
                        }
                        return registration.pushManager.subscribe({ userVisibleOnly: true });
                    });
            }).then(function(subscription) {
            self.endpoint = subscription.endpoint;
            document.getElementById('curl').textContent = 'curl -H "TTL: 60" -X POST ' + self.endpoint;


            fetch('./register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint
                })
            });
        });
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


