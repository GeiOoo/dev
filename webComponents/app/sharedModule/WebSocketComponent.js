import {ArticlesService} from "../articlesModule/services/ArticlesService.js";
import {WishlistService} from "../articlesModule/services/WishlistService.js";
import {WishlistDBService} from "../articlesModule/services/WishlistDBService.js";

export class WebSocketComponent extends HTMLElement {
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

window.customElements.define('websocket-component', WebSocketComponent);




