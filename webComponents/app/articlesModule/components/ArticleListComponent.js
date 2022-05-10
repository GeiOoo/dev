import {ArticlesService} from "../services/ArticlesService.js";

export class ArticleListComponent extends HTMLElement {
    constructor() {
        super();

        let htmlTemplate = `
        
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
            <button class="btn btn-outline-danger">Wish</button>
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

        articlesService.getAllArticles().then((data) => {
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
}

window.customElements.define('article-list', ArticleListComponent);




