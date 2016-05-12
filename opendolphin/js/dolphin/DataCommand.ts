/// <reference path="Command.ts" />
module opendolphin {


    export class DataCommand extends Command{

        className:string;

        constructor(public data:any) {
            super();
            this.id = "Data";
            this.className ="org.opendolphin.core.comm.DataCommand";
        }

    }

}