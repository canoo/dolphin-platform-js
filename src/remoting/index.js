import { ClientContextFactory } from './clientContextFactory'
import { ServiceProvider } from '../platform/serviceProvider'
import { exists } from '../utils'

function register(platformClient) {
    if (exists(platformClient)) {
        const clientContextFactoryProvider = new ServiceProvider(ClientContextFactory, 'ClientContextFactory');

        platformClient.registerServiceProvider(clientContextFactoryProvider);
    }
}

export { register };