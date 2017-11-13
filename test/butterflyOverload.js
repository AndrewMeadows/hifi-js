// butterflyOverload.js -- many animating entities with 90 sec lifetime

var numButterflies = 1000;

var startTimeInSeconds = new Date().getTime() / 1000;

var NATURAL_SIZE_OF_BUTTERFLY = { x:0.5, y: 0.2, z: 0.1 };

var lifeTime = 90; // seconds
var range = 7.0; // Over what distance in meters do you want the flock to fly around
var frame = 0;

var DISTANCE_IN_FRONT_OF_ME = 1.5;
var DISTANCE_ABOVE_ME = 2.5;

var flockPosition = Vec3.sum(MyAvatar.position,Vec3.sum(
                    Vec3.multiply(Quat.getForward(MyAvatar.orientation), DISTANCE_ABOVE_ME), 
                    Vec3.multiply(Quat.getForward(MyAvatar.orientation), DISTANCE_IN_FRONT_OF_ME)));

// Create a random vector with individual lengths between a,b
function randVector(a, b) {
    var rval = { x: a + Math.random() * (b - a), y: a + Math.random() * (b - a), z: a + Math.random() * (b - a) };
    return rval;
}

// Array of butterflies
var butterflies = [];

function addButterfly() {
    // Decide the size of butterfly 
    var color = { red: 100, green: 100, blue: 100 };

    var MINSIZE = 0.01;
    var RANGESIZE = 0.05;
    var maxSize = MINSIZE + RANGESIZE;
    var size = MINSIZE + Math.random() * RANGESIZE;
    var dimensions = Vec3.multiply(NATURAL_SIZE_OF_BUTTERFLY, (size / maxSize));
        
    var GRAVITY = -0.2;
    var newFrameRate = 45;
    var properties = {
        type: "Model",
        lifetime: lifeTime,
        position: Vec3.sum(randVector(-range, range), flockPosition),
        rotation: Quat.fromPitchYawRollDegrees(-80 + Math.random() * 20, Math.random() * 360.0, 0.0),
        velocity: { x: 0, y: 0, z: 0 },
        gravity: { x: 0, y: GRAVITY, z: 0 },
        damping: 0.00001,
        dimensions: dimensions,
        color: color,
        animation: { 
            url: "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx",
            fps: newFrameRate,
            loop: true,
            running: true,
            startAutomatically:false
        },
        modelURL: "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx"
    };
    butterflies.push(Entities.addEntity(properties));
}

// Generate the butterflies
for (var i = 0; i < numButterflies; i++) {
    addButterfly();
}

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < numButterflies; i++) {
        Entities.deleteEntity(butterflies[i]);
    }
});
