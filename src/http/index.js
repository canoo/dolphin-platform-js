import { HttpClient } from './httpClient';
import { HttpClientInterceptor } from './httpClientInterceptor';
import { ServiceProvider } from '../platform/serviceProvider';
import { exists } from '../utils'

function register(platformClient) {
    if (exists(platformClient)) {
        const httpClientProvider = new ServiceProvider(HttpClient, 'HttpClient');
        const httpClientInterceptorProvider = new ServiceProvider(HttpClientInterceptor, 'HttpClientInterceptor');
    
        platformClient.registerServiceProvider(httpClientProvider);
        platformClient.registerServiceProvider(httpClientInterceptorProvider);
    }
}

export { register }