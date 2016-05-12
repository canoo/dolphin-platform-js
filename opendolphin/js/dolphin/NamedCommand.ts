/// <reference path="Command.ts"/>

module opendolphin {

    export class NamedCommand extends Command {

        className:string;

        constructor(name:string) {
            super();
            this.id = name;
            this.className = "org.opendolphin.core.comm.NamedCommand";
        }

    }

}
