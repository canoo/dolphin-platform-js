import { HttpClient } from './httpClient'
import { ServiceProvider } from '../platform/serviceProvider'

const provider = new ServiceProvider(HttpClient, 'HttpClient');

export { provider };