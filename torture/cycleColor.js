// cycleColor.js -- torture: change nonPhysical property (color) of many entities AFAP

var NUM_OBJECTS = 1000;

var BOX_SIDE = 0.5;
var DIMENSIONS = { x: BOX_SIDE, y: BOX_SIDE, z: BOX_SIDE };
var LIFE_SPAN = 90; // seconds

var FLOCK_RADIUS = 4.0;
var FLOCK_UP_OFFSET = 0.0;
var FLOCK_FORWARD_OFFSET = 1.5 * FLOCK_RADIUS;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };
var flockCenter = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_OFFSET));

var TWO_PI = 2.0 * Math.PI;

function colorByPhase(phase) {
    // transform into gradians
    var gPhase = phase / TWO_PI;
    if (gPhase > 1.0) {
        gPhase -= 1.0;
    }
    // each color moves along a sawtooth wave
    var red = 2.0 * gPhase;
    if (red > 1.0) {
        red = 2.0 - red;
    }
    // green is ahead of red by one third revolution
    var green = 2.0 * (gPhase + 0.33333);
    if (green > 2.0) {
        green = green - 2.0;
    } else if (green > 1.0) {
        green = 2.0 - green;
    }
    // blue is ahead of red by two thirds revolution
    var blue = 2.0 * (gPhase + 0.66666) - 1.0;
    if (blue > 2.0) {
        blue = blue - 2.0;
    } else if (blue > 1.0) {
        blue = 2.0 - blue;
    }
    return { red: 255 * red, green: 255 * green, blue: 255 * blue };
}

var NUM_COLORS = 16;
var colors = [];
function buildColors() {
    for (var i = 0; i < NUM_COLORS; i++) {
        var phase = i * TWO_PI / NUM_COLORS;
        var color = colorByPhase(i * TWO_PI / NUM_COLORS);
        colors.push(color);
    }
}
buildColors();

var objects = [];
function createObjects() {
    var circumfrence = TWO_PI * FLOCK_RADIUS;
    var revolutionPerObject = BOX_SIDE / circumfrence;
    var phasePerObject = TWO_PI * revolutionPerObject;
    var liftPerObject = BOX_SIDE * revolutionPerObject;
    var phase = 0;
    var height = 0;
    for (var i = 0; i < NUM_OBJECTS; i++) {
        var spiralOffset = { x: FLOCK_RADIUS * Math.sin(phase), y: height, z: FLOCK_RADIUS * Math.cos(phase) };
        var position = Vec3.sum(flockCenter, spiralOffset);
        var rotation = { x: 0, y: Math.sin(0.5 * phase), z: 0, w: Math.cos(0.5 * phase) };
        var color = colors[i % NUM_COLORS];
        var properties = {
            type: "Box",
            lifetime: LIFE_SPAN,
            position: position,
            rotation: rotation,
            color: colors[i % NUM_COLORS],
            dimensions: DIMENSIONS
        };
        objects.push(Entities.addEntity(properties));
        phase += phasePerObject;
        height += liftPerObject;
    }
}
createObjects();

var colorOffset = 1;
function cycleColors(dt) {
    colorOffset = (colorOffset + 1) % NUM_COLORS;
    for (var i = 0; i < NUM_OBJECTS; i++) {
        Entities.editEntity(objects[i], { color: colors[(i + colorOffset) % NUM_COLORS] });
    }
}
Script.update.connect(cycleColors);

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < NUM_OBJECTS; i++) {
        Entities.deleteEntity(objects[i]);
    }
});
