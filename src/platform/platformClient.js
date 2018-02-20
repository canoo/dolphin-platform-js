import {exists} from '../utils';
import { LoggerFactory } from '../logging';

const services = new Map();
const serviceProviders = new Map();
const configuration = {};

const LOGGER = LoggerFactory.getLogger('PlatformClient');

const getService = function(name) {
    let service = services.get(name);
    if (!exists(service)) {
        let provider = serviceProviders.get(name);
        if (!exists(provider)) {
            throw new Error('No service provider found for ' + name);
        } else {
            service = provider.getService(configuration);
            services.set(name, service);
        }
    }
    return service;
};

const hasService = function(name) {
    const service = services.get(name);
    if (!exists(service)) {
        const provider = serviceProviders.get(name);
        if (!exists(provider)) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
};

const getAllServiceTypes = function() {
    let result = [];
    serviceProviders.forEach(function(val){
        result.push(val);
    });
    return result;
};


const registerServiceProvider = function(serviceProvider) {
    if (serviceProvider === null || typeof serviceProvider === 'undefined') {
        LOGGER.error('Cannot register service provider');
        throw new Error('Cannot register service provider');
    }
    
    if (typeof serviceProvider.getName === 'function' && typeof serviceProvider.getService === 'function') {
        serviceProviders.set(serviceProvider.getName(), serviceProvider);
        LOGGER.debug('Service provider registered with name', serviceProvider.getName());
    } else {
        LOGGER.error('Cannot register service provider without getName() and getService() methods');
        throw new Error('Cannot register service provider without getName() and getService() methods');
    }
};

LOGGER.info('Dolphin Platform Version:' , DOLPHIN_PLATFORM_VERSION);

export { getService, hasService, getAllServiceTypes, registerServiceProvider }