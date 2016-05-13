var allTests = require('./AllTests');

(function (window) {

    window.__karma__.start = runAllTests(window.__karma__);

    function runAllTests(karma) {
        return function () {
            var startTime = Date.now();
            var results = allTests.testAll();
            var time = Date.now() - startTime;

            karma.info({total: results.passes.length + results.errors.length});

            mapSuccessResults(karma, results, time);
            mapErrorResults(karma, results, time);

            // to notify Karma that unit tests runner is done
            karma.complete({
                coverage: window.__coverage__
            });
        };
    }

    function mapSuccessResults(karma, results, time) {
        var successes = results.passes;
        for (var i = 0; i < successes.length; i++) {
            var resultOk = successes[i];
            karma.result({
                description: resultOk.funcName,
                suite      : [resultOk.testName],
                success    : true,
                time       : time
            });

        }

    }

    function mapErrorResults(karma, results, time) {
        var errors = results.errors;
        for (var i = 0; i < errors.length; i++) {
            var resultError = errors[i];

            karma.result({
                description: resultError.funcName,
                suite      : [resultError.testName],
                success    : false,
                time       : time,
                log        : [resultError.message]
            });
        }
    }

})(window);