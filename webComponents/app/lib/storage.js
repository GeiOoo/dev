export class storage {
    constructor(storeId) {
        this.storeId = storeId;

        // null oder json
        this.entriesJSON = localStorage.getItem(this.storeId);
        this.entries = JSON.parse(this.entriesJSON);
    }

    save (data) {
        let dataString = JSON.stringify(data);
        localStorage.setItem(this.storeId, dataString);
    }

    delete () {

    }

    reset () {
    }

    search () {

    }
}