//
//  nBody2.js
//  examples
//
//  Created by Andrew Meadows, simple N-body 1/r interaction, 2018.05.05
//  Copyright 2018 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
// BEGIN Vec3 utilities
var VEC3_UTIL_EPSILON=0.000001;
var VEC3_UTIL_EPSILON_SQUARED=VEC3_UTIL_EPSILON * VEC3_UTIL_EPSILON;
var VEC3_UTIL_PI=3.14159265358979;
var VEC3_UTIL_ALMOST_ONE=1.0-VEC3_UTIL_EPSILON;
var VEC3_UTIL_PI_OVER_TWO=1.57079632679490;
function vec3(x,y,z) {return{x:x,y:y,z:z};}
function lengthVec3(V) {return Math.sqrt(V.x*V.x+V.y*V.y+V.z*V.z);}
function addVec3s(A,B) {return{x:A.x+B.x,y:A.y+B.y,z:A.z+B.z};}
function subtractVec3s(A,B) {return{x:A.x-B.x,y:A.y-B.y,z:A.z-B.z};}
function scaleVec3(scale, V) {return{x:scale*V.x,y:scale*V.y,z:scale*V.z};}
function dotVec3s(A,B) {return A.x*B.x+A.y*B.y+A.z*B.z;}
function crossVec3s(A,B) {return {x:A.y*B.z-A.z*B.y,y:A.z*B.x-A.x*B.z,z:A.x*B.y-A.y*B.x};}
function distanceVec3s(A,B) {return Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y)+(A.z-B.z)*(A.z-B.z));}
function normalizeVec3(V) {
    var L2=V.x*V.x+V.y*V.y+V.z*V.z;
    if(L2<VEC3_UTIL_EPSILON_SQUARED) {return{x:V.x,y:V.y,z:V.z};}
    var invL=1.0/Math.sqrt(L2);
    return {x:invL*V.x,y:invL*V.y,z:invL*V.z}; }
function angleBetweenVec3s(A,B) {
    var dot=dotVec3s(A,B);
    if(dot<VEC3_UTIL_EPSILON) {return VEC3_UTIL_PI_OVER_TWO;}
    var cosAngle=dot/(lengthVec3(A)*lengthVec3(B));
    if(cosAngle>=VEC3_UTIL_ALMOST_ONE) {return 0.0;}
    if(cosAngle<=-VEC3_UTIL_ALMOST_ONE) {return VEC3_UTIL_PI;}
    return Math.acos(cosAngle);
} // END Vec3 utilities

var RED = { red: 255, green: 0, blue: 0 };
var GREEN = { red: 0, green: 255, blue: 0 };
var BLUE = { red: 0, green: 0, blue: 255 };
var YELLOW = { red: 255, green: 255, blue: 0 };
var CYAN = { red: 0, green: 255, blue: 255 };
var MAGENTA = { red: 255, green: 0, blue: 255 };
var WHITE = { red: 255, green: 255, blue: 255 };
var COLORS = [ RED, GREEN, BLUE, YELLOW, CYAN, MAGENTA ];
var NUM_COLORS = COLORS.length;
var ZERO_VEC3 = { x: 0, y: 0, z: 0 };


var NUM_PLANETS = 4;
var SYSTEM_RADIUS = 8;
var PLANET_DIAMETER = 0.5;
var PLANET_DENSITY = 1000.0;
var PLANET_MASS = PLANET_DENSITY * Math.PI * PLANET_DIAMETER * PLANET_DIAMETER * PLANET_DIAMETER / 6.0;
var SUN_DIAMETER = 2.0 * PLANET_DIAMETER;
var SUN_DENSITY = 3 * PLANET_DENSITY;
var SUN_MASS = SUN_DENSITY * Math.PI * SUN_DIAMETER * SUN_DIAMETER * SUN_DIAMETER / 6.0;
var LIFETIME = 300;
var FIRST_ORBIT_OFFSET = SUN_DIAMETER + SYSTEM_RADIUS / 6.0;
var forward = Quat.getFront(MyAvatar.orientation);
var SUN_POSITION = addVec3s(MyAvatar.position, scaleVec3(2 * SUN_DIAMETER, forward));
var PLANET_MASS = 1.0;
var SUN_MASS = 20.0 * PLANET_MASS;

// we compute a G that will provide reasonable stable velocities at the lowest initial orbit
// v = sqrt(G * totalMass / orbitRadius)
// G = (orbitRadius * v^2) / totalMass
var maxOrbitSpeed = 1.0;
var G = FIRST_ORBIT_OFFSET * maxOrbitSpeed * maxOrbitSpeed / (PLANET_MASS + SUN_MASS);

var bodies = [];
function createSun() {
    var sunDimensions = { x: SUN_DIAMETER, y: SUN_DIAMETER, z: SUN_DIAMETER };
    bodies.push(Entities.addEntity({
        type: "Sphere",
        name: "sun",
        color: WHITE,
        dimensions: sunDimensions,
        position: SUN_POSITION,
        velocity: ZERO_VEC3,
        damping: 0.0,
        angularDamping: 0.0,
        dynamic: false,
        restitution: 1.0,
        density: SUN_DENSITY,
        lifetime: LIFETIME
    }));
}
createSun();

function createPlanets() {
    var deltaPhase = 2.0 * Math.PI / NUM_PLANETS;
    var deltaOrbit = (SYSTEM_RADIUS - FIRST_ORBIT_OFFSET) / NUM_PLANETS;
    var planetDimensions = { x: PLANET_DIAMETER, y: PLANET_DIAMETER, z: PLANET_DIAMETER };
    for (var i = 0; i < NUM_PLANETS; i++) {
        var colorIndex = i % NUM_COLORS;

        var orbitRadius = FIRST_ORBIT_OFFSET + i * deltaOrbit;
        var phase = - i * deltaPhase;
        var c = Math.cos(phase);
        var s = Math.sin(phase);
        var offset = scaleVec3(orbitRadius, { x: c, y: 0, z: s });
        var position = addVec3s(SUN_POSITION, offset);
        var totalMass = PLANET_MASS + SUN_MASS;
        var speed = Math.sqrt(G * totalMass / orbitRadius);
        var velocity = scaleVec3(speed, { x: s, y: 0, z: -c });
        var gravity = scaleVec3(-G * totalMass / (orbitRadius * orbitRadius * orbitRadius), offset);

        bodies.push(Entities.addEntity({
            type: "Sphere",
            name: "planet",
            color: COLORS[colorIndex],
            dimensions: planetDimensions,
            position: position,
            velocity: velocity,
            gravity: ZERO_VEC3,
            damping: 0.0,
            angularDamping: 0.0,
            dynamic: true,
            restitution: 1.0,
            density: PLANET_DENSITY,
            gravity: gravity,
            lifetime: LIFETIME
        }));
    }
}
createPlanets();

Script.update.connect(function(dt) {
    // NOTE: due to script lag and naive integration this code will tend to pump energy into the system.
    // TOTRY: slightly increase damping to compensate
    var planetData = [];
    var GmDt = G * (PLANET_MASS + PLANET_MASS);
    var GMDt = G * (SUN_MASS + PLANET_MASS);
    for (var i = 1; i < bodies.length; i++) {
        var props = Entities.getEntityProperties(bodies[i], ["position", "velocity"]);
        if (props.position !== undefined) {
            props.bodyIndex = i;
            props.gravity = ZERO_VEC3;
            planetData.push(props);
        }
    }
    for (var i = 0; i < planetData.length; i++) {
        // planet-sun interaction
        var offset = subtractVec3s(SUN_POSITION, planetData[i].position);
        var distance = lengthVec3(offset);
        planetData[i].gravity = addVec3s(planetData[i].gravity, scaleVec3(GMDt / (distance * distance * distance), offset));

        // contain planets that want to escape the system
        if (distance > SYSTEM_RADIUS) {
            var vDotD = dotVec3s(offset, planetData[i].velocity);
            if (vDotD < 0.0)  {
                // remove outward velocity to keep the planet in system
                var newVelocity = subtractVec3s(planetData[i].velocity, scaleVec3(vDotD / (distance * distance), offset));
                Entities.editEntity(bodies[planetData[i].bodyIndex], { velocity: newVelocity });
            }
        }

        // planet-planet interaction
        for (var j = i + 1; j < planetData.length; j++) {
            offset = subtractVec3s(planetData[j].position, planetData[i].position);
            distance = lengthVec3(offset);
            var g = scaleVec3(GmDt / (distance * distance * distance), offset);
            planetData[i].gravity = addVec3s(planetData[i].gravity, g);
            planetData[j].gravity = subtractVec3s(planetData[j].gravity, g);
        }

        Entities.editEntity(bodies[planetData[i].bodyIndex], { gravity: planetData[i].gravity });
    }
});

Script.scriptEnding.connect(function scriptEnding() {
    for (var i = 0; i < bodies.length; i++) {
        Entities.deleteEntity(bodies[i]);
    }
    bodies = [];
});
