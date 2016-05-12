After changing any of the tests or the test suite make sure to run
    /usr/local/bin/tsc --out AllTestsInOne.js AllTests.ts
before
    open AllUnitTests.html
or starting the tests via node.js (e.g. via IDE plugin) in which case you
may want to configure the starter to call the tsc automatically before running
the tests.