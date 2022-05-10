import {ArticlesService} from "../services/ArticlesService.js";
import {WishlistService} from "../services/WishlistService.js";
import {WishlistDBService} from "../services/WishlistDBService.js";

export class WebsocketComponent extends HTMLElement {
    constructor() {
        super();

        let htmlTemplate = `
        
        <h2>Websocket</h2>

        `;

        let el = document.createElement('div');

        el.innerHTML = htmlTemplate;
        this.appendChild(el);

        this.bindEvents();

    }

    bindEvents() {

    }
}

window.customElements.define('websocket-component', WebworkerComponent);




