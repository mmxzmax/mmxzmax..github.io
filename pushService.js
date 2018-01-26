self.addEventListener('push', function(event) {
    event.waitUntil(
            self.registration.showNotification('Weather PWA', {
                body: 'Hello word!'
            })
    );
});
