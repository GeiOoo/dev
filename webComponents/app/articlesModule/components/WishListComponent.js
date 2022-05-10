import {ArticlesService} from "../services/ArticlesService.js";
import {WishlistService} from "../services/WishlistService.js";
import {WishlistDBService} from "../services/WishlistDBService.js";

export class WishListComponent extends HTMLElement {
    constructor() {
        super();

        this.bindEvents();

        let htmlTemplate = `
        
        <h2>Wishlist</h2>
         <table class="table table-striped">
        <thead>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Price</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="content">

        <tr>
            <td>{{id}}</td>
            <td>{{title}}</td>
            <td>{{price}}</td>
            <td>
             <button class="btn btn-outline-danger" data-wishlistid="{{wishlistid}}">Wish</button>
             <button class="btn btn-warning">Delete</button>
            </td>
        </tr>

        </tbody>
    </table>
        `;

        let el = document.createElement('div');
        el.innerHTML = htmlTemplate;

        const templateElement = el.querySelector('#content');
        const templateHTML = templateElement.innerHTML;

        const articlesService = new ArticlesService();

        console.log(articlesService);
        articlesService.getAllArticles()
            .then((dataOrig) => {
                return dataOrig.map((item) => {
                    item.wishlistid = item.id;
                    return item;
                });
            })
            .then((data) => {
            console.log(data);
            let output = '';
            data.forEach((item) => {
                let template = templateHTML;

                Object.keys(item).forEach( (key) => {
                    var p = '{{' + key + '}}';
                    template = template.replace(p, item[key]);
                });

                output += template;
            });

            templateElement.innerHTML = output;
        });
        this.appendChild(el);
    }

    bindEvents() {

        this.addEventListener('click', function (event) {
            if(event.target.dataset.wishlistid) {
                let wishlistId = event.target.dataset.wishlistid;
                let wishlist = new WishlistService();
                wishlist.add(wishlistId);

                let wishlistDB = new WishlistDBService();
                wishlistDB.add(wishlistId).then(() => {
                    console.log('done');
                })
            }
        })
    }
}

window.customElements.define('wish-list', WishListComponent);




