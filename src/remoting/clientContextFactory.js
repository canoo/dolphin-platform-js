import {makeDolphin} from './openDolphin.js';
import {exists, checkMethod, checkParam} from '../utils';
import { LoggerFactory } from '../logging';
import Connector from './connector';
import BeanManager from './beanmanager';
import ClassRepository from './classrepo';
import ControllerManager from './controllermanager';
import ClientContext from './clientcontext';
import PlatformHttpTransmitter from './platformHttpTransmitter';

class ClientContextFactory {

    create(url, config){
        checkMethod('connect(url, config)');
        checkParam(url, 'url');
        ClientContextFactory.LOGGER.info('Dolphin Platform Version:' , DOLPHIN_PLATFORM_VERSION);
        ClientContextFactory.LOGGER.debug('Creating client context', url, config);

        let builder = makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
        if (exists(config)) {
            if (exists(config.errorHandler)) {
                builder.errorHandler(config.errorHandler);
            }
            if (exists(config.headersInfo) && Object.keys(config.headersInfo).length > 0) {
                builder.headersInfo(config.headersInfo);
            }
        }

        let dolphin = builder.build();

        let transmitter = new PlatformHttpTransmitter(url, config);
        transmitter.on('error', function (error) {
            clientContext.emit('error', error);
        });
        dolphin.clientConnector.transmitter = transmitter;

        let classRepository = new ClassRepository(dolphin);
        let beanManager = new BeanManager(classRepository);
        let connector = new Connector(url, dolphin, classRepository, config);
        let controllerManager = new ControllerManager(dolphin, classRepository, connector);

        let clientContext = new ClientContext(dolphin, beanManager, controllerManager, connector);

        ClientContextFactory.LOGGER.debug('clientContext created with', clientContext);

        return clientContext;
    }
}

ClientContextFactory.LOGGER = LoggerFactory.getLogger('ClientContextFactory');

let createClientContext = new ClientContextFactory().create;

export { createClientContext, ClientContextFactory };