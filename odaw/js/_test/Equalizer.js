function FiveBandEqualizer(name, from, to, elem) {
    var me = this,
        one = ctx.createBiquadFilter(),
        two = ctx.createBiquadFilter(),
        three = ctx.createBiquadFilter(),
        four = ctx.createBiquadFilter(),
        five = ctx.createBiquadFilter(),
        input = ctx.createGain(),
        output = ctx.createGain();


    input.gain.value = 1;
    input.connect(one);

    one.connect(two);
    one.frequency.value = 80;
    one.Q.value = 1.1;
    one.gain.value = 0;
    one.type = "peaking";

    two.connect(three);
    two.frequency.value = 230;
    two.Q.value = 0.98;
    two.gain.value = 0;
    two.type = "peaking";

    three.connect(four);
    three.frequency.value = 490;
    three.Q.value = 3.1;
    three.gain.value = 20;
    three.type = "peaking";

    four.connect(five);
    four.frequency.value = 1200;
    four.Q.value = 0.71;
    four.gain.value = -20;
    four.type = "peaking";

    five.connect(output);
    five.frequency.value = 3500;
    five.Q.value = 0.71;
    five.gain.value = -40;
    five.type = "peaking";

    output.gain.value = 1;

    from.connect(input);
    output.connect(to);

    return this;
}