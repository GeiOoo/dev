class Effect extends Base{
    constructor() {
        super();

        this.input = ctx.createGain();
        this.output = ctx.createGain();
    }
}