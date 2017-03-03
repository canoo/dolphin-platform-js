/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import EmptyNotification from "../../js/dolphin/EmptyNotification";

import { expect } from 'chai';

describe('EmptyNotificationTests', () => {

    var emptyNotification;
    beforeEach(() =>{
        emptyNotification = new EmptyNotification();
    });

    it('id should  be equal to Empty', () => {
        expect(emptyNotification.id).to.equal('Empty');
    });

    it('className should  be equal to org.opendolphin.core.comm.EmptyNotification', () => {
        expect(emptyNotification.className).to.equal('org.opendolphin.core.comm.EmptyNotification');
    });

});