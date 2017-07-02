import OpenDolphin from './OpenDolphin.js';
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

        let builder = OpenDolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
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