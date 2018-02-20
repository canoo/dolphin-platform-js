import { ClientContextFactory } from './clientContextFactory'
import { ServiceProvider } from '../platform/serviceProvider'

const provider = new ServiceProvider(ClientContextFactory, 'ClientContextFactory');

export { provider };