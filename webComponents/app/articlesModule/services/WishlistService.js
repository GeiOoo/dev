import {storage} from "../../lib/storage.js";

export class WishlistService {
    constructor() {
        this.storage = new storage('wishlist');
    }

    add (id) {
        let list;
        if (this.storage.entries === null) {
            list = [];
        } else {
            list = this.storage.entries;
        }

        list.push(id);

        let set = new Set(list);
        list = Array.from(set);

        this.storage.save(list);
    }
}