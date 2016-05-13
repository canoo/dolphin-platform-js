import NamedCommand from "../../js/dolphin/NamedCommand";

import { TestClass } from "../../testrunner/tsUnit";


export default class NamedCommandTests extends TestClass {

    createNamedCommandWithGivenParameter(){
        var namedCommand = new NamedCommand("CustomId");
        this.areIdentical(namedCommand.id,"CustomId");
        this.areIdentical(namedCommand.className,"org.opendolphin.core.comm.NamedCommand");
    }

}
