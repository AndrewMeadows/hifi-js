// scriptedEntities.js -- torture script: many scripted entities

var NUM_OBJECTS = 1000;

var DIMENSIONS = { x:0.5, y: 0.5, z: 0.5 };
var LIFE_SPAN = 90; // seconds

var SCRIPT_URL = "https://raw.githubusercontent.com/AndrewMeadows/hifi-js/master/torture/computePi.js";

var FLOCK_RADIUS = 4.0;
var FLOCK_UP_OFFSET = FLOCK_RADIUS;
var FLOCK_FORWARD_OFFSET = 1.5 * FLOCK_RADIUS;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };
var flockCenter = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_OFFSET));

function randomPosition() {
    return { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 };
}

var objects = [];
function createObjects() {
    for (var i = 0; i < NUM_OBJECTS; i++) {
        var position = Vec3.sum(flockCenter, Vec3.multiplyQbyV(MyAvatar.orientation, Vec3.multiply(2.0 * FLOCK_RADIUS, randomPosition())));
        var properties = {
            type: "Box",
            lifetime: LIFE_SPAN,
            position: position,
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            velocity: { x: 0, y: 0, z: 0 },
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.0,
            angularDamping: 0.0,
            dimensions: DIMENSIONS,
            script: SCRIPT_URL
        };
        objects.push(Entities.addEntity(properties));
    }
}
createObjects();

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < NUM_OBJECTS; i++) {
        Entities.deleteEntity(objects[i]);
    }
});
