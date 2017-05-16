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

import OpenDolphin from '../opendolphin/build/OpenDolphin.js';
import Emitter from 'emitter-component';
import Promise from '../bower_components/core.js/library/fn/promise';
import {exists} from './utils.js';
import {checkMethod} from './utils';
import {checkParam} from './utils';

export default class ClientContext{

    constructor(dolphin, beanManager, controllerManager, connector){
        checkMethod('ClientContext(dolphin, beanManager, controllerManager, connector)');
        checkParam(dolphin, 'dolphin');
        checkParam(beanManager, 'beanManager');
        checkParam(controllerManager, 'controllerManager');
        checkParam(connector, 'connector');

        this.dolphin = dolphin;
        this.beanManager = beanManager;
        this._controllerManager = controllerManager;
        this._connector = connector;
        this.connectionPromise = null;
        this.isConnected = false;
    }

    connect(){
        var self = this;
        this.connectionPromise = new Promise(function(resolve){
            self._connector.connect();
            self._connector.invoke(OpenDolphin.createCreateContextCommand()).then(function(){
                that.isConnected = true;
                resolve();
            });
        });
        return this.connectionPromise;
    }

    onConnect(){
        if(exists(this.connectionPromise)){
            if(!this.isConnected){
                return this.connectionPromise;
            }else{
                return new Promise(function(resolve){
                    resolve();
                });
            }
        }else{
            return this.connect();
        }
    }

    createController(name){
        checkMethod('ClientContext.createController(name)');
        checkParam(name, 'name');

        return this._controllerManager.createController(name);
    }

    disconnect(){
        var self = this;
        this.dolphin.stopPushListening();
        return new Promise(function(resolve) {
            self._controllerManager.destroy().then(function () {
                self._connector.invoke(OpenDolphin.createDestroyContextCommand());
                self.dolphin = null;
                self.beanManager = null;
                self._controllerManager = null;
                self._connector = null;
                resolve();
            });
        });
    }
}

Emitter(ClientContext.prototype);