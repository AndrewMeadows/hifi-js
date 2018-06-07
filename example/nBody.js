//
//  nBody2.js
//  examples
//
//  Created by Andrew Meadows, simple N-body gravitational interaction, 2018.05.05
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

var NUM_PLANETS = 4;
var SYSTEM_RADIUS = 10;
var PLANET_DIAMETER = 0.5;
var LIFETIME = 300;

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

var forward = Quat.getFront(MyAvatar.orientation);

// sun is an anchor and doesn't move
var sunPosition = addVec3s(MyAvatar.position, scaleVec3(SYSTEM_RADIUS, forward));
var planetMass = 1.0;
var sunDimensions = { x: PLANET_DIAMETER, y: PLANET_DIAMETER, z: PLANET_DIAMETER };
var sunMass = 20.0 * planetMass;
var sun = Entities.addEntity({
    type: "Sphere",
    name: "sun",
    color: WHITE,
    dimensions: sunDimensions,
    position: sunPosition,
    velocity: ZERO_VEC3,
    damping: 0.0,
    angularDamping: 0.0,
    dynamic: false,
    restitution: 1.0,
    lifetime: LIFETIME
});

// planets move around sun
var planets = [];
var deltaPhase = 2.0 * Math.PI / NUM_PLANETS;
var firstOrbitOffset = SYSTEM_RADIUS / 4.0;
var deltaOrbit = (SYSTEM_RADIUS - firstOrbitOffset) / NUM_PLANETS;
var planetDimensions = { x: PLANET_DIAMETER, y: PLANET_DIAMETER, z: PLANET_DIAMETER };

// we compute a G that will provide reasonable stable velocities at the lowest initial orbit
// v = sqrt(G * totalMass / orbitRadius)
// G = (orbitRadius * v^2) / totalMass
var maxOrbitSpeed = 1.0;
var G = firstOrbitOffset * maxOrbitSpeed * maxOrbitSpeed / (planetMass + sunMass);

for (var i = 0; i < NUM_PLANETS; i++) {
    var colorIndex = i % NUM_COLORS;

    var orbitRadius = firstOrbitOffset + i * deltaOrbit;
    var phase = - i * deltaPhase;
    var c = Math.cos(phase);
    var s = Math.sin(phase);
    var position = addVec3s(sunPosition, scaleVec3(orbitRadius, { x: c, y: 0, z: s }));
    var totalMass = planetMass + sunMass;
    var speed = Math.sqrt(G * totalMass / orbitRadius);
    var velocity = scaleVec3(speed, { x: s, y: 0, z: -c });

    planets.push(Entities.addEntity({
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
        lifetime: LIFETIME
    }));
}

Script.update.connect(function(dt) {
    // NOTE: due to script lag and naive integration this code will tend to pump energy into the system.
    // TOTRY: slightly increase damping to compensate
    var pv = [];
    var GmDt = G * planetMass * dt;
    var GMDt = G * sunMass * dt;
    for (var i = 0; i < NUM_PLANETS; i++) { 
        pv.push(Entities.getEntityProperties(planets[i], ["position", "velocity"]));
    }
    for (var i = 0; i < NUM_PLANETS; i++) {
        for (var j = i + 1; j < NUM_PLANETS; j++) {
            var offset = subtractVec3s(pv[j].position, pv[i].position);
            var distance = lengthVec3(offset);
            if (distance > 1.2 * PLANET_DIAMETER) {
                // dV = a * dt = F/m * dt = (G * M / r^2) * dt
                var dV = scaleVec3(GmDt / (distance * distance * distance), offset);
                pv[i].velocity = addVec3s(pv[i].velocity, dV);
                pv[j].velocity = subtractVec3s(pv[j].velocity, dV);
            }
        }
        var offset = subtractVec3s(sunPosition, pv[i].position);
        var distance = lengthVec3(offset);
        if (distance > 1.2 * PLANET_DIAMETER) {
            var dV = scaleVec3(GMDt / (distance * distance * distance), offset);
            pv[i].velocity = addVec3s(pv[i].velocity, dV);
            if (distance > SYSTEM_RADIUS) {
                // check if planet is outward bound
                var d = dotVec3s(offset, pv[i].velocity);
                if (d < 0.0)  {
                    // remove outward velocity to keep the planet in system
                    pv[i].velocity = subtractVec3s(pv[i].velocity, scaleVec3(d / (distance * distance), offset));
                }
            }
            Entities.editEntity(planets[i], { velocity: pv[i].velocity });
        }
    }
});

Script.scriptEnding.connect(function scriptEnding() {
    for (var i = 0; i < NUM_PLANETS; i++) {
        Entities.deleteEntity(planets[i]);
    }
    Entities.deleteEntity(sun);
});
