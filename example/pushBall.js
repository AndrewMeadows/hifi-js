// pushBall.js
//
// interactive ball for multi-user play
// when someone clicks on the ball it will pop up and toward a point in front of them
//

(function () {
    this.entityID = null;
    var GRAVITY = {x: 0, y: -1.5, z: 0};
    var LOCAL_TARGET = { x: 0, y: 3, z: -6 }; // remember -Z points in front of avatar in local-frame
    var BOOST_SPEED = 3.0;
    var MIN_UP_COMPONENT = 0.5;

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
        // figure out which way is "up" in a future-proof way
        var localUp = { x: 0, y: 1, z: 0 };
        var up = Vec3.multiplyQbyV(MyAvatar.orientation, localUp);
        var target = Vec3.multiplyQbyV(MyAvatar.orientation, LOCAL_TARGET);

        // compute direction toward target
        var entityProps = Entities.getEntityProperties(this.entityID, ["position", "velocity"]);
        var offset = Vec3.subtract(target, entityProps.position);
        var distance = Vec3.length(offset);
        var direction = Vec3.multiply(offset, 1.0 / distance);

        // enforce a minimum "upward" component for "direction"
        // this makes "direction" non-normalized, but that's OK
        var upward = Vec3.dot(direction, up);
        if (upward < MIN_UP_COMPONENT) {
            direction = Vec3.sum(direction, Vec3.multiply(MIN_UP_COMPONENT, up));
        }

        // clear "downward" component of current velocity
        var downwardSpeed = Vec3.dot(entityProps.velocity, up);
        if (downwardSpeed < 0.0) {
            entityProps.velocity = Vec3.subtract(entityProps.velocity, Vec3.multiply(downwardSpeed, up));
        }

        // add boost and remainder velocity
        var boostVelocity = Vec3.multiply(BOOST_SPEED, direction);
        var newVelocity = Vec3.sum(boostVelocity, entityProps.velocity);
        Entities.editEntity(this.entityID, {velocity: newVelocity});
    }

    this.startFarTrigger = function (entityID) {
        if (entityID === this.entityID) {
            this.push();
        }
    };
    this.startNearGrab = function (entityID) {
        if (entityID === this.entityID) {
            this.push();
        }
    };

    this.clickDownOnEntity = function (entityID, mouseEvent) {
        if (entityID === this.entityID) {
            if (mouseEvent.isLeftButton) {
                this.push();
            }
        }
    };
});

