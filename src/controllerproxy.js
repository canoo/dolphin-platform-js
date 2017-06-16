/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

import Set from '../bower_components/core.js/library/fn/set';
import {checkMethod} from './utils';
import {checkParam} from './utils';

export default class ControllerProxy{

    constructor(controllerId, model, manager){
        checkMethod('ControllerProxy(controllerId, model, manager)');
        checkParam(controllerId, 'controllerId');
        checkParam(model, 'model');
        checkParam(manager, 'manager');

        this.controllerId = controllerId;
        this.model = model;
        this.manager = manager;
        this.destroyed = false;
        this.onDestroyedHandlers = new Set();
    }

    getModel() {
        return this.model;
    }

    getId() {
        return this.controllerId;
    }

    invoke(name, params){
        checkMethod('ControllerProxy.invoke(name, params)');
        checkParam(name, 'name');

        if (this.destroyed) {
            throw new Error('The controller was already destroyed');
        }
        return this.manager.invokeAction(this.controllerId, name, params);
    }

    destroy(){
        if (this.destroyed) {
            throw new Error('The controller was already destroyed');
        }
        this.destroyed = true;
        this.onDestroyedHandlers.forEach((handler) => {
            try {
                handler(this);
            } catch(e) {
                console.warn('An exception occurred while calling an onDestroyed-handler', e);
            }
        }, this);
        return this.manager.destroyController(this);
    }

    onDestroyed(handler){
        checkMethod('ControllerProxy.onDestroyed(handler)');
        checkParam(handler, 'handler');

        var self = this;
        this.onDestroyedHandlers.add(handler);
        return {
            unsubscribe: () => {
                self.onDestroyedHandlers.delete(handler);
            }
        };
    }
}
