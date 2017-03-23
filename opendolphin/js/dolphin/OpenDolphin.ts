import ClientDolphin from "./ClientDolphin";
import DolphinBuilder from "./DolphinBuilder";
import CallActionCommand from "./CallActionCommand";
import CreateContextCommand from "./CreateContextCommand";
import CreateControllerCommand from "./CreateControllerCommand";
import DestroyContextCommand from "./DestroyContextCommand";
import DestroyControllerCommand from "./DestroyControllerCommand";
import InterruptLongPollCommand from "./InterruptLongPollCommand";
import StartLongPollCommand from "./StartLongPollCommand";


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
export function dolphin(url:string, reset:boolean, slackMS:number = 300):ClientDolphin {
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

// factory method to build an initialized dolphin
export function makeDolphin():DolphinBuilder {
    return new DolphinBuilder();
}

//Factory methods to have a better integration of ts sources in JS & es6

export function createCallActionCommand():CallActionCommand {
    return new CallActionCommand();
}

export function createCreateContextCommand():CreateContextCommand {
    return new CreateContextCommand();
}

export function createCreateControllerCommand():CreateControllerCommand {
    return new CreateControllerCommand();
}

export function createDestroyContextCommand():DestroyContextCommand {
    return new DestroyContextCommand();
}

export function createDestroyControllerCommand():DestroyControllerCommand {
    return new DestroyControllerCommand();
}

export function createInterruptLongPollCommand():InterruptLongPollCommand {
    return new InterruptLongPollCommand();
}

export function createStartLongPollCommand():StartLongPollCommand {
    return new StartLongPollCommand();
}
