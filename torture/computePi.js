// computePi.js -- torture: needlessly crunch numbers on update

(function() {
    print("adebug computePi.js");
    var computeCount = 0;
    function computePi(computeTime) {
        // This infinite series computes PI, but it converges slowly.
        // π = (4/1) - (4/3) + (4/5) - (4/7) + (4/9) - (4/11) + (4/13) - (4/15) ...
        var numIterations = 1e8; // 1e8 iterations should take 2-4 seconds
        var pi = 0;
        var sign = 1.0;
        for (i = 0; i < numIterations; i++) {
            pi += sign * 4.0 / (2.0 * i + 1.0);
            sign *= -1.0;
        }
        computeCount++;
        print("computeCount = " + computeCount + "  computeTime = " + dt + "  pi = " + pi);
    }

    Script.update.connect(computePi);
})
