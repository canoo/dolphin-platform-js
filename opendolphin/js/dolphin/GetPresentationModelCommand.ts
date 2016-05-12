/// <reference path="Command.ts" />
module opendolphin {

    export class GetPresentationModelCommand extends Command {

        className:string;

        constructor(public pmId:string) {
            super();
            this.id = 'GetPresentationModel';
            this.className = "org.opendolphin.core.comm.GetPresentationModelCommand";
        }
    }
}