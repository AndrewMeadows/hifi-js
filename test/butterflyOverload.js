//
// butterflyOverload.js -- 600 animating butterflies with 180 sec lifetime
// 

var numButterflies = 600;

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Create a random vector with individual lengths between a,b
function randVector(a, b) {
    var rval = { x: a + Math.random() * (b - a), y: a + Math.random() * (b - a), z: a + Math.random() * (b - a) };
    return rval;
}

var startTimeInSeconds = new Date().getTime() / 1000;

var NATURAL_SIZE_OF_BUTTERFLY = { x:0.5, y: 0.2, z: 0.1 };

var lifeTime = 180; // 3 min
var range = 7.0; // Over what distance in meters do you want the flock to fly around
var frame = 0;

var DISTANCE_IN_FRONT_OF_ME = 1.5;
var DISTANCE_ABOVE_ME = 1.5;
var FIXED_LOCATION = false; 

if (!FIXED_LOCATION) {
    var flockPosition = Vec3.sum(MyAvatar.position,Vec3.sum(
                        Vec3.multiply(Quat.getForward(MyAvatar.orientation), DISTANCE_ABOVE_ME), 
                        Vec3.multiply(Quat.getForward(MyAvatar.orientation), DISTANCE_IN_FRONT_OF_ME)));
} else {
    var flockPosition = { x: 4999.6, y: 4986.5, z: 5003.5 };
}

    
// This is our butterfly object
function defineButterfly(entityID, targetPosition) {
    this.entityID = entityID;
    this.targetPosition = targetPosition;
}

// Array of butterflies
var butterflies = [];

function addButterfly() {
    // Decide the size of butterfly 
    var color = { red: 100, green: 100, blue: 100 };
    var size = 0;

    var MINSIZE = 0.01;
    var RANGESIZE = 0.05;
    var maxSize = MINSIZE + RANGESIZE;
    
    size = MINSIZE + Math.random() * RANGESIZE;
    
    var dimensions = Vec3.multiply(NATURAL_SIZE_OF_BUTTERFLY, (size / maxSize));
        
    var GRAVITY = -0.2;
    var newFrameRate = 29 + Math.random() * 30;
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

// Main update function
var butterflyIndex = 0;
function updateButterflies(deltaTime) {  
    // update one butterfly at a time
    butterflyIndex = (butterflyIndex + 1) % numButterflies;

    var properties = Entities.getEntityProperties(butterflies[butterflyIndex]);
    if (Vec3.length(Vec3.subtract(properties.position, flockPosition)) > range) {
        Entities.editEntity(butterflies[butterflyIndex], { position: flockPosition } );
    } else if (properties.velocity.y <= 0.0) {
        //  If falling, Create a new direction and impulse
        var HORIZ_SCALE = 0.50;
        var VERT_SCALE = 0.50;
        var newHeading = Math.random() * 360.0;  
        var newVelocity = Vec3.multiply(HORIZ_SCALE, Quat.getForward(Quat.fromPitchYawRollDegrees(0.0, newHeading, 0.0))); 
        newVelocity.y = (Math.random() + 0.5) * VERT_SCALE;
        Entities.editEntity(butterflies[butterflyIndex], { rotation: Quat.fromPitchYawRollDegrees(-80 + Math.random() * 20, newHeading, (Math.random() - 0.5) * 10), 
        velocity: newVelocity } );
    }

    // Check to see if we've been running long enough that our butterflies are dead
    var nowTimeInSeconds = new Date().getTime() / 1000;
    if ((nowTimeInSeconds - startTimeInSeconds) >= lifeTime) {
        Script.stop();
        return;
    }
}

// register the call back so it fires before each data send
Script.update.connect(updateButterflies);

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < numButterflies; i++) {
        Entities.deleteEntity(butterflies[i]);
    }
});
