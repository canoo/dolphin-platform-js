"use strict";
import DolphinBuilder from './dolphinBuilder'

export function dolphin(url, reset, slackMS = 300) {
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

export function makeDolphin() {
    return new DolphinBuilder();
}