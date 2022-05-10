import {http} from "../../lib/http.js";

export class ArticlesService {

    constructor() {
        Reflect.defineProperty(this, 'apiId', {
            value: "092q438094238",
            writable: false,
            enumerable: true,
            configurable: true,
        })
    }

    get baseURL () {
        return "http://localhost:3000/articles";
    }

    getAllArticles() {
        return http.get(this.baseURL);
    };
}

