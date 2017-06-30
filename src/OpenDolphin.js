"use strict";
const DolphinBuilder_1 = require("./DolphinBuilder");
const InterruptLongPollCommand_1 = require("./InterruptLongPollCommand");
const StartLongPollCommand_1 = require("./StartLongPollCommand");
/**
 * JS-friendly facade to avoid too many dependencies in plain JS code.
 * The name of this file is also used for the initial lookup of the
 * one javascript file that contains all the dolphin code.
 * Changing the name requires the build support and all users
 * to be updated as well.
 * Dierk Koenig
 */
// factory method for the initialized dolphin
// Deprecated ! Use 'makeDolphin() instead
function dolphin(url, reset, slackMS = 300) {
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}
exports.dolphin = dolphin;
// factory method to build an initialized dolphin
function makeDolphin() {
    return new DolphinBuilder_1.default();
}
exports.makeDolphin = makeDolphin;
//Factory methods to have a better integration of ts sources in JS & es6
function createInterruptLongPollCommand() {
    return new InterruptLongPollCommand_1.default();
}
exports.createInterruptLongPollCommand = createInterruptLongPollCommand;
function createStartLongPollCommand() {
    return new StartLongPollCommand_1.default();
}
exports.createStartLongPollCommand = createStartLongPollCommand;

//# sourceMappingURL=OpenDolphin.js.map
