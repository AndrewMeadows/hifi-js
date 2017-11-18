// computePi.js -- torture: needlessly crunch numbers in entity-script
(function() {
    this.preload = function() {
        var randomNumber = Math.floor(Math.random() * 100000);
        this.timerID = Script.setInterval(function() {
        	// This infinite series computes PI but converges slowly.
        	// π = (4/1) - (4/3) + (4/5) - (4/7) + (4/9) - (4/11) + (4/13) - (4/15) ...
        	var numIterations = 1e8; // 1e8 iterations should take 2-4 seconds
        	var pi = 0;
        	var sign = 1.0;
        	for (var i = 0; i < numIterations; i++) {
            	pi += sign * 4.0 / (2.0 * i + 1.0);
            	sign *= -1.0;
        	}
        	print(randomNumber + "  π = " + pi);
        }, 1);
    };
    this.unload = function() {
        Script.clearInterval(this.timerID);
    };
});
