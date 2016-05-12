/// <reference path="Command.ts" />
module opendolphin {

    export class SavedPresentationModelNotification extends Command {

        className:string;

        constructor(public pmId:string) {
            super();
            this.id = 'SavedPresentationModel';
            this.className = "org.opendolphin.core.comm.SavedPresentationModelNotification";
        }
    }
}