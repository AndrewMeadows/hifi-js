// pushBall.js
//
// interactive ball for multi-user play
// whoever clicks on ball will set velocity to <0,1,0>
//
(function () {
    this.entityID = null;
    var GRAVITY = {x: 0, y: -1.5, z: 0};
    this.preload = function (entityID) {
        this.entityID = entityID;
        Entities.editEntity(this.entityID, {
            dimensions: {x: 1, y: 1, z: 1},
            dynamic: true,
            damping: 0.39,
            restitution: 1,
            gravity: GRAVITY,
            userData: "{\"grabbableKey\": { \"wantsTrigger\": true, \"grabbable\": false  }}"
        })
    }
    this.push = function() {
        var newVelocity = { x: 0, y: 1, z: 0 };
        Entities.editEntity(this.entityID, {velocity: newVelocity});
    }
    this.startFarTrigger = function (entityID) {
        if (entityID === this.entityID) {
            push();
        }
    };
    this.startNearGrab = function (entityID) {
        if (entityID === this.entityID) {
            push();
        }
    };
    this.clickDownOnEntity = function (entityID, mouseEvent) {
        if (entityID === this.entityID) {
            if (mouseEvent.isLeftButton) {
                push();
            }
        }
    };
});
