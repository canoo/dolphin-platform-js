import { HttpClient } from './httpClient';
import { HttpClientInterceptor } from './httpClientInterceptor';
import { ServiceProvider } from '../platform/serviceProvider';

function register(platformClient) {
    if (platformClient) {
        const httpClientProvider = new ServiceProvider(HttpClient, 'HttpClient');
        const httpClientInterceptorProvider = new ServiceProvider(HttpClientInterceptor, 'HttpClientInterceptor');
    
        platformClient.registerServiceProvider(httpClientProvider);
        platformClient.registerServiceProvider(httpClientInterceptorProvider);
    }
}

export { register }