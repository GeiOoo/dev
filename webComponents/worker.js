/*console.log('asdf');
console.log(this);*/
// importScripts('');

onmessage = function (e) {
    let data = e.data; // Array aus dem aufrufenden Script
    setTimeout(function () {
        let newData = data.map(item =>  item * 5);
        postMessage(newData);
    }, 2000);
};
