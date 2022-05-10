import {ArticlesService} from "../services/ArticlesService.js";
import {WishlistService} from "../services/WishlistService.js";
import {WishlistDBService} from "../services/WishlistDBService.js";

export class WebworkerComponent extends HTMLElement {
    constructor() {
        super();

        let htmlTemplate = `
        
        <h2>Webworker</h2>
        <button id="startWorker" class="btn btn-outline-info">Start Worker</button>
        <output id="output"></output>
        `;

        let el = document.createElement('div');

        el.innerHTML = htmlTemplate;
        this.appendChild(el);
        this.bindEvents();
    }

    bindEvents() {
        this.querySelector("#startWorker")
            .addEventListener('click',  (event) => {

            this.attachWorker();
        })
    }

    attachWorker () {
        let workers = {};
        workers.myWorker = new Worker('worker.js');
        //myWorker = null;
        workers.myWorker.onmessage =  (e) => {
            this.querySelector('#output').textContent = JSON.stringify(e.data);
            workers.myWorker.terminate();
            delete workers.myWorker;
        };
        workers.myWorker.postMessage([3,4,5,6,7]);
        console.log('worker works ... data sent');
    }
}

window.customElements.define('webworker-component', WebworkerComponent);




