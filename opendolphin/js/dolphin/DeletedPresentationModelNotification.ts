/// <reference path="Command.ts" />
module opendolphin {

    export class DeletedPresentationModelNotification extends Command {

        className:string;

        constructor(public pmId:string) {
            super();
            this.id = 'DeletedPresentationModel';
            this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
        }
    }
}