// actions.js -- torture: create a bunch of objects, each with a tractor action

var NUM_ACTIONS = 1000;
var NUM_OBJECTS_PER_SIDE = Math.floor(Math.sqrt(NUM_ACTIONS));

var BOX_SIDE = 0.5;
var DIMENSIONS = { x: BOX_SIDE, y: BOX_SIDE, z: BOX_SIDE };
var LIFE_SPAN = 90; // seconds

var STRIDE = 2.0 * BOX_SIDE;
var FLOCK_WIDTH = NUM_OBJECTS_PER_SIDE * STRIDE;
var FLOCK_UP_OFFSET = 0.0;
var FLOCK_FORWARD_OFFSET = 2.0 + 0.5 * FLOCK_WIDTH;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };

var objects = [];
function createObjects() {
    for (var i = 0; i < NUM_OBJECTS_PER_SIDE + 1; i++) {
        for (var j = 0; j < NUM_OBJECTS_PER_SIDE; j++) {
            var k = i * NUM_OBJECTS_PER_SIDE + j;
            if (k < NUM_ACTIONS) {
                // create a box
                var localOffset = { x: STRIDE * i - 0.5 * FLOCK_WIDTH, y: 0, z: STRIDE * j - 0.5 * FLOCK_WIDTH };
                var rotation = MyAvatar.orientation;
                var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(rotation, Vec3.sum(FLOCK_LOCAL_OFFSET, localOffset)));
                var properties = {
                    type: "Box",
                    lifetime: LIFE_SPAN,
                    position: position,
                    rotation: rotation,
                    dimensions: DIMENSIONS,
                    dynamic: true
                };
                var objectID = Entities.addEntity(properties);
                objects.push(objectID);

                // add an action
                Entities.addAction("tractor", objectID, {
                    targetRotation: rotation,
                    targetPosition: position,
                    angularTimeScale: 1.0,
                    linearTimeScale: 1.0,
                    tag: "tractor"
                });
            }
        }
    }
}
createObjects();

/* uncomment this to keep boxes "active" in Bullet simulation
function pokeObjects(dt) {
    for (var i = 0; i < NUM_OBJECTS_PER_SIDE + 1; i++) {
        for (var j = 0; j < NUM_OBJECTS_PER_SIDE; j++) {
            var k = i * NUM_OBJECTS_PER_SIDE + j;
            if (k < NUM_ACTIONS) {
                var properties = {
                    velocity: { x: 0.05, y: 0.05, z: 0.05 };
                };
                Entities.editEntity(objects[k], properties);
            }
        }
    }
}
Script.update.connect(pokeObjects);
*/

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < NUM_ACTIONS; i++) {
        Entities.deleteEntity(objects[i]);
    }
});
