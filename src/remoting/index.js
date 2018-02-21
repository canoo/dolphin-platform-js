import { ClientContextFactory } from './clientContextFactory'
import { ServiceProvider } from '../platform/serviceProvider'

function register(platformClient) {
    if (platformClient) {
        const clientContextFactoryProvider = new ServiceProvider(ClientContextFactory, 'ClientContextFactory');

        platformClient.registerServiceProvider(clientContextFactoryProvider);
    }
}

export { register };