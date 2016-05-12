/// <reference path="Command.ts" />
module opendolphin {

    export class ResetPresentationModelCommand extends Command {

        className:string;

        constructor(public pmId:string) {
            super();
            this.id = 'ResetPresentationModel';
            this.className = "org.opendolphin.core.comm.ResetPresentationModelCommand";
        }
    }
}