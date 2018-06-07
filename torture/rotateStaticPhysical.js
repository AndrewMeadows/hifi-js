// rotateStaticPhysical.js -- torture: change rotation of many static boxes AFAP

//Window.location = "hifi://localhost/0,0,0/0,0,0,1";
Window.location = "leviathan/0,0,0/0,0,0,1"

var NUM_OBJECTS = 1000;
var NUM_OBJECTS_PER_SIDE = Math.floor(Math.sqrt(NUM_OBJECTS));

var BOX_SIDE = 0.5;
var DIMENSIONS = { x: BOX_SIDE, y: BOX_SIDE, z: BOX_SIDE };
var LIFE_SPAN = 90; // seconds

var STRIDE = 2.0 * BOX_SIDE;
var FLOCK_WIDTH = NUM_OBJECTS_PER_SIDE * STRIDE;
var FLOCK_UP_OFFSET = 0.0;
var FLOCK_FORWARD_OFFSET = 2.0 + 0.5 * FLOCK_WIDTH;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };

var phase = 0;
var phasePerIndex = 0.1;
var TWO_PI = 2.0 * Math.PI;
var omega = TWO_PI / 8;

var objects = [];
function createObjects() {
    for (var i = 0; i < NUM_OBJECTS_PER_SIDE + 1; i++) {
        for (var j = 0; j < NUM_OBJECTS_PER_SIDE; j++) {
            var k = i * NUM_OBJECTS_PER_SIDE + j;
            if (k < NUM_OBJECTS) {
                // create a box
                var localOffset = { x: STRIDE * i - 0.5 * FLOCK_WIDTH, y: 0, z: STRIDE * j - 0.5 * FLOCK_WIDTH };
                var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, Vec3.sum(FLOCK_LOCAL_OFFSET, localOffset)));
                var localPhase = phase + k * phasePerIndex;
                var rotation = { x: 0, y: Math.sin(0.5 * localPhase), z: 0, w: Math.cos(0.5 * localPhase) };
                var properties = {
                    type: "Box",
                    lifetime: LIFE_SPAN,
                    position: position,
                    rotation: rotation,
                    dimensions: DIMENSIONS,
                    dynamic: false
                };
                var objectID = Entities.addEntity(properties);
                objects.push(objectID);
            }
        }
    }
}
createObjects();

function spinObjects(dt) {
    phase += omega * dt;
    for (var i = 0; i < NUM_OBJECTS_PER_SIDE + 1; i++) {
        for (var j = 0; j < NUM_OBJECTS_PER_SIDE; j++) {
            var k = i * NUM_OBJECTS_PER_SIDE + j;
            if (k < NUM_OBJECTS) {
                var localPhase = phase + k * phasePerIndex;
                var properties = {
                    rotation: { x: 0, y: Math.sin(0.5 * localPhase), z: 0, w: Math.cos(0.5 * localPhase) }
                };
                Entities.editEntity(objects[k], properties);
            }
        }
    }
}
Script.update.connect(spinObjects);

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < NUM_OBJECTS; i++) {
        Entities.deleteEntity(objects[i]);
    }
});

// prepare for trace
var startTime = 20;
var dumpTime = startTime - 1;
var endTime = startTime + 5;
var outputFile = "/tmp/trace-detailed-rotateStaticPhysical.json.gz";
var dumpFile = "/tmp/stats-detailed-rotateStaticPhysical.txt";

Script.setTimeout(function() {
    var loggingRules = "" +
        "trace.*=false\n" +
        //"trace.render.debug=true\n" +
        //"trace.app.debug=true\n" +
        "trace.simulation.*=true\n"
        "";
    Test.startTracing(loggingRules);
}, startTime * 1000);

Script.setTimeout(function() {
    Test.savePhysicsSimulationStats(dumpFile);
}, dumpTime * 1000);

Script.setTimeout(function() {
    Test.stopTracing(outputFile);
    Test.quit();
    Script.stop();
}, endTime * 1000);
