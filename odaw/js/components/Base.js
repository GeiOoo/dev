class Base {
    constructor() {
        this.multi = true;
    }

    remove() {
        if(this.elem) this.elem.remove();
        delete this;
    }
}