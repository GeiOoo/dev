class Input extends Base {
    constructor(data) {
        super();

        this.id = this.setID();

        if(!data) data = {};
        this.type = data.type;
    }

    getID() {
        return this.id;
    }



    static setID() {
        if(this.id === undefined) this.id = 0;
        else this.id++;

        return this.id;
    }
}