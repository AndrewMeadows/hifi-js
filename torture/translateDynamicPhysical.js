// translateDynamicPhysical.js -- torture script: many translating dynamic physical entities with 90 sec lifetime

//Window.location = "hifi://localhost/0,0,0/0,0,0,1";
Window.location = "leviathan/0,0,0/0,0,0,1"

var NUM_OBJECTS = 1000;

var DIMENSIONS = { x:0.2, y: 0.2, z: 0.2 };
var LIFE_SPAN = 90; // seconds

var FLOCK_RADIUS = 1.0;
var AVATAR_HEIGHT = 2.0;
var FLOCK_UP_OFFSET = FLOCK_RADIUS + AVATAR_HEIGHT;
var FLOCK_FORWARD_OFFSET = 2.0 * FLOCK_RADIUS + 4.0;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };
var flockCenter = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_OFFSET));
var FLOCK_LOCAL_VELOCITY = { x: 0, y: 0.2, z: 0.0 };
var flockVelocity = Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_VELOCITY);

function randomPosition() {
    return { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 };
}

var objects = [];
function createObjects() {
    // create these moving objects in a flat spiral
    var stride = 2.0 * Vec3.length(DIMENSIONS);
    var rezPhase = 0.0;
    var numObjectsCreated = 0;
    var rezRadiusPerPhase = 0.5 * stride / Math.PI;
    while (numObjectsCreated < NUM_OBJECTS) {
        var rezRadius = FLOCK_RADIUS + rezPhase * rezRadiusPerPhase;
        var localPosition = { x: rezRadius * Math.sin(rezPhase), y: 0.0, z: rezRadius * Math.cos(rezPhase) };
        var worldPosition = Vec3.sum(flockCenter, Vec3.multiplyQbyV(MyAvatar.orientation, localPosition));
        var properties = {
            type: "Sphere",
            dynamic: true,
            lifetime: LIFE_SPAN,
            position: worldPosition,
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            velocity: flockVelocity,
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.0,
            angularDamping: 0.0,
            dimensions: DIMENSIONS
        };
        objects.push(Entities.addEntity(properties));

        rezPhase += stride / rezRadius;
        numObjectsCreated += 1;
    }
}

// Generate the objects
createObjects();

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
var outputFile = "/tmp/trace-detailed-translateDynamicPhysical.json.gz";
var dumpFile = "/tmp/stats-detailed-translateDynamicPhysical.txt";

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
