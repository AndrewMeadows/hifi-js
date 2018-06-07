// animateNonPhysical.js -- torture script: many animating entities with 90 sec lifetime

//Window.location = "hifi://localhost/0,0,0/0,0,0,1";
Window.location = "leviathan/0,0,0/0,0,0,1";

var NUM_OBJECTS = 1000;

var DIMENSIONS = { x:0.5, y: 0.2, z: 0.1 };
var LIFE_SPAN = 90; // seconds

var FLOCK_RADIUS = 4.0;
var FLOCK_UP_OFFSET = FLOCK_RADIUS;
var FLOCK_FORWARD_OFFSET = 3.5 * FLOCK_RADIUS;
var FLOCK_LOCAL_OFFSET = { x: 0, y: FLOCK_UP_OFFSET, z: -FLOCK_FORWARD_OFFSET };
var flockCenter = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, FLOCK_LOCAL_OFFSET));

var MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx";
var ANIMATION = { 
    fps: 45,
    loop: true,
    running: true,
    startAutomatically:false,
    url: "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx"
};

// random point on unit sphere
function randomDirection() {
    var vertical = 2.0 * Math.random() - 1.0;
    var horizontal = Math.sqrt(1.0 - vertical * vertical);
    var azimuth = Math.random() * 2.0 * Math.PI;
    return { x: horizontal * Math.sin(azimuth), y: vertical, z: horizontal * Math.cos(azimuth) };
}

function randomPosition() {
    return { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 };
}

var objects = [];
function createObject() {
    //var position = Vec3.sum(Vec3.multiply(FLOCK_RADIUS, randomDirection()), flockCenter), // random on sphere
    var position = Vec3.sum(flockCenter, Vec3.multiplyQbyV(MyAvatar.orientation, Vec3.multiply(2.0 * FLOCK_RADIUS, randomPosition())));
    var properties = {
        type: "Model",
        shapeType: "none",
        lifetime: LIFE_SPAN,
        position: position,
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        velocity: { x: 0, y: 0, z: 0 },
        gravity: { x: 0, y: 0, z: 0 },
        damping: 1.0,
        dimensions: DIMENSIONS,
        animation: ANIMATION,
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

// prepare for trace
var startTime = 20;
var dumpTime = startTime - 1;
var endTime = startTime + 5;
var outputFile = "/tmp/trace-detailed-animateNonPhysical.json.gz";
var dumpFile = "/tmp/stats-detailed-animateNonPhysical.txt";

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
