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

import {makeDolphin} from './openDolphin.js';
import {exists} from './utils';
import {checkMethod} from './utils';
import {checkParam} from './utils';
import Connector from './connector.js';
import BeanManager from './beanmanager.js';
import ClassRepository from './classrepo.js';
import ControllerManager from './controllermanager.js';
import ClientContext from './clientcontext.js';
import PlatformHttpTransmitter from './platformHttpTransmitter.js';

export default class ClientContextFactory {

    create(url, config){
        checkMethod('connect(url, config)');
        checkParam(url, 'url');
        console.log('Creating client context '+ url +'    '+ JSON.stringify(config));

        let builder = makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
        if (exists(config)) {
            if (exists(config.errorHandler)) {
                builder.errorHandler(config.errorHandler);
            }
            if (exists(config.headersInfo) && Object.keys(config.headersInfo).length > 0) {
                builder.headersInfo(config.headersInfo);
            }
        }

        var dolphin = builder.build();

        var transmitter = new PlatformHttpTransmitter(url, config);
        transmitter.on('error', function (error) {
            clientContext.emit('error', error);
        });
        dolphin.clientConnector.transmitter = transmitter;

        var classRepository = new ClassRepository(dolphin);
        var beanManager = new BeanManager(classRepository);
        var connector = new Connector(url, dolphin, classRepository, config);
        var controllerManager = new ControllerManager(dolphin, classRepository, connector);

        var clientContext = new ClientContext(dolphin, beanManager, controllerManager, connector);
        return clientContext;
    }
}

exports.ClientContextFactory = ClientContextFactory;