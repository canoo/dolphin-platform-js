/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />


import { CommandAndHandler, OnFinishedHandler } from "../../js/dolphin/ClientConnector";
import { BlindCommandBatcher, NoCommandBatcher } from "../../js/dolphin/CommandBatcher";
import ValueChangedCommand from "../../js/dolphin/ValueChangedCommand";


import { expect } from 'chai';

describe('CommandBatcherTests', () => {

    it('Batcher Does Not Batch', () => {

        var whateverCommandAndHandler : CommandAndHandler = {command: null, handler: null};
        var queue = [ whateverCommandAndHandler, whateverCommandAndHandler, whateverCommandAndHandler ];

        var batcher = new NoCommandBatcher();

        var result = batcher.batch(queue);
        expect(result.length).to.equal(1);
        expect(queue.length).to.equal(2);

        var result = batcher.batch(queue);
        expect(result.length).to.equal(1);
        expect(queue.length).to.equal(1);

        var result = batcher.batch(queue);
        expect(result.length).to.equal(1);
        expect(queue.length).to.equal(0);
    });

    it('Simple Blind Batching', () => {

        var whateverCommandAndHandler : CommandAndHandler = { command: { id:"x" }, handler: null };
        var queue = [ whateverCommandAndHandler, whateverCommandAndHandler, whateverCommandAndHandler ];

        var batcher = new BlindCommandBatcher();

        var result = batcher.batch(queue);

        expect(result.length).to.equal(3);
        expect(queue.length).to.equal(0);
    });


    it('Blind Batching With Non Blind', () => {

        var blind   : CommandAndHandler = { command: { id:"x"}, handler: null };
        var finisher: OnFinishedHandler = { onFinished : null, onFinishedData: null };
        var handled : CommandAndHandler = { command: { id:"x"}, handler: finisher };

        var queue = [ handled, blind, blind, handled, blind, handled ]; // batch sizes 1, 3, 2

        var batcher = new BlindCommandBatcher();

        var result = batcher.batch(queue);
        expect(result.length).to.equal(1);

        var result = batcher.batch(queue);
        expect(result.length).to.equal(3);

        var result = batcher.batch(queue);
        expect(result.length).to.equal(2);

        expect(result[0]).to.equal(blind); // make sure we have the right sequence
        expect(result[1]).to.equal(handled);

        expect(queue.length).to.equal(0);
    });

    it('Blind Folding', () => {

        var cmd1    : ValueChangedCommand = new ValueChangedCommand("1", 1);
        var cmd2    : ValueChangedCommand = new ValueChangedCommand("1", 2); // other id, will be batched
        var cmd3    : ValueChangedCommand = new ValueChangedCommand("12", 2); // will be folded

        var queue = [
            { command: cmd1, handler: null },
            { command: cmd2, handler: null },
            { command: cmd3, handler: null }
        ];
        var unfolded = queue[2];

        var batcher = new BlindCommandBatcher();

        var result = batcher.batch(queue);
        expect(result.length).to.equal(2);

        expect(result[0].command['attributeId']).to.equal("1");
        expect(result[0].command['newValue']).to.equal(2);
        expect(result[1]).to.equal(unfolded);

        expect(queue.length).to.equal(0);

    });

});
