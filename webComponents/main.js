if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js')
        .then(function (registration) {
            console.log(registration.scope);
        })
        .catch(function (err) {
            console.error(err.message);
        })
}