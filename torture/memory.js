// memory.js -- torture script: leak a specified amount of JS memory

var mbToLeak = 1000;
var mbPerLeak = 1.97; // emperically determined for linux release build
var numLeaks = mbToLeak / mbPerLeak;
print("begin: will leak " + mbToLeak + " MB of memory (" + numLeaks + " iterations)");

// this builds an increasingly high stack of hidden closures
// which is an effective memory leak in JS
var theThing = null;

var replaceThing = function () {
    var originalThing = theThing;

    // unused keeps a reference to originalThing and shares closure scope with someMethod below
    // which means that even though unused is never used it holds a closure reference to originalThing
    // which can never be garbage collected until someMethod is.
    var unused = function () {
        if (originalThing) {
            print("foo");
        }
    };

    // theThing allocates a ~1MB string
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
            print("bar");
        }
    };
};

var leakCount = 0;
var leakMemory = function(dt) {
    leakCount++;
    print("leaked " + (leakCount * mbPerLeak) + " MB of memory");
    replaceThing();
    if (leakCount >= numLeaks) {
        print("done: leaked " + (leakCount * mbPerLeak) + " MB of memory");
        Script.update.disconnect(leakMemory);
    }
};

Script.update.connect(leakMemory);
