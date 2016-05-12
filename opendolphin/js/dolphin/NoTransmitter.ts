/// <reference path="Command.ts"/>
/// <reference path="SignalCommand.ts"/>
/// <reference path="ClientConnector.ts"/>

module opendolphin {

    /**
     * A transmitter that is not transmitting at all.
     * It may serve as a stand-in when no real transmitter is needed.
     */

    export class NoTransmitter implements Transmitter {

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
}