import EmptyNotification from "../../js/dolphin/EmptyNotification";

import { TestClass } from "../../testrunner/tsUnit";


export default class EmptyNotificationTests extends TestClass {

    createEmptyNotificationWithGivenParameter(){
        var emptyNotification = new EmptyNotification();
        this.areIdentical(emptyNotification.id,"Empty");
        this.areIdentical(emptyNotification.className,"org.opendolphin.core.comm.EmptyNotification");
    }

}
