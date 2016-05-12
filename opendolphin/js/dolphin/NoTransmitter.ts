import { OnSuccessHandler, Transmitter } from "./ClientConnector";
import Command from "./Command";
import SignalCommand from "./SignalCommand";


/**
 * A transmitter that is not transmitting at all.
 * It may serve as a stand-in when no real transmitter is needed.
 */

export default class NoTransmitter implements Transmitter {

    transmit(commands:Command[], onDone:(result:Command[]) => void):void {

        // do nothing special

        onDone( [] );

    }

    signal(command:SignalCommand) : void {
        // do nothing
    }

    reset(successHandler:OnSuccessHandler) : void {
        // do nothing
    }

}
