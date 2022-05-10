export class WishlistDBService {
    constructor() {
        var db = new Dexie("wishlist");
        this.db.version(1).stores({
            wishes: '++id, wishlistid'
        });
    }

    add (id) {
       return this.db.put({wishlistid: id});
    }
}