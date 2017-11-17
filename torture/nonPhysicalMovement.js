// nonPhysicalMovement.js -- torture script: many moving non-physical entities with 90 sec lifetime

var NUM_OBJECTS = 1000;

var DIMENSIONS = { x:0.5, y: 0.2, z: 0.1 };
var LIFE_SPAN = 90; // seconds

var FLOCK_RADIUS = 4.0;
var FLOCK_UP_OFFSET = FLOCK_RADIUS;
var FLOCK_FORWARD_OFFSET = 1.5 * FLOCK_RADIUS;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };
var flockCenter = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_OFFSET));
var FLOCK_LOCAL_VELOCITY = { x: 0.2, y: 0, z: 0 };
var flockVelocity = Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_VELOCITY);

var MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx";

function randomPosition() {
    return { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 };
}

var objects = [];
function createObject() {
    var position = Vec3.sum(flockCenter, Vec3.multiplyQbyV(MyAvatar.orientation, Vec3.multiply(2.0 * FLOCK_RADIUS, randomPosition())));
    var properties = {
        type: "Model",
        shapeType: "none",
        lifetime: LIFE_SPAN,
        position: position,
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        velocity: flockVelocity,
        gravity: { x: 0, y: 0, z: 0 },
        damping: 0.0,
        angularDamping: 0.0,
        dimensions: DIMENSIONS,
        modelURL: MODEL_URL
    };
    objects.push(Entities.addEntity(properties));
}

// Generate the objects
for (var i = 0; i < NUM_OBJECTS; i++) {
    createObject();
}

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < NUM_OBJECTS; i++) {
        Entities.deleteEntity(objects[i]);
    }
});
