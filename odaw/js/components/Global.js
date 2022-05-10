project = {
    ctx: new window.AudioContext(),
    beat: 4,
    steps: 4,
    bpm: 120,
    mpb: 500,
    mpbLeft: 0,
    pos: -20,
    noteStrings: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    events: {},
    isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))
};
test = [];

function mapLinearRamp(val, min1, max1, min2, max2) {                        // maps a linear Ramp between from min1~max1 to min2~max2
    if(val <= min1) return min2;                                             // return min2 if val is too high
    if(val >= max1) return max2;                                             // return max2 if val is too low
    return (max2 - min2) * (val - min1) / (max1 - min1) + min2;              // calculate percentage of val to min1~max1 and apply it to min2~max2
}

function mapLinearSymmetricRise(val, min1, max1, width1, min2, max2) {       // maps a symmetric
    if(val <= min1 || val >= max1) return min2;                              // return min2 if val is out of range

    let peak1 = (max1 - min1) / 2 + min1;                                    // calculate midpoint of peak range
    let peakMin = peak1 - width1 / 2;                                        // calculate minimum peak
    let peakMax = peak1 + width1 / 2;                                        // calculate maximum peak
    if(val >= peakMin && val <= peakMax) return max2;                        // return max2 if val is in peak range

    if(val < peakMin) return mapLinearRamp(val, min1, peakMin, min2, max2);  // return up ramp of in range
    else return mapLinearRamp(val, peakMax, max1, max2, min2);               // return down ramp of out range
}

function mapLinearAsymmetricRise(val, min1, max1, peakMin, peakMax, min2, max2) {
    if(val <= min1 || val >= max1) return min2;                              // return min2 if val is out of range

    if(val >= peakMin && val <= peakMax) return max2;                        // return max2 if val is in peak range

    if(val < peakMin) return mapLinearRamp(val, min1, peakMin, min2, max2);  // return up ramp of in range
    else return mapLinearRamp(val, peakMax, max1, max2, min2);               // return down ramp of out range
}
function getExp(x, y) {
    return Math.log(y) / Math.log(x);
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function getDecimals(value) {
    if(value % 1 === 0) return 0;
    return (value + "").split(".")[1].length;
}


$(document).ready(function() {
    $(".icon-button").on("click", function() {
        let me = $(this);
        if(me.parent(".button-wrapper").length != 0) me = me.parent(".button-wrapper");
        if(me.prev(".icon-button").length != 0) {
            console.log("prev");
            if(me.hasClass("pressed") || me.children(".icon-button").hasClass("pressed")) {
                console.log("pressed");
            }
        }
    });
});