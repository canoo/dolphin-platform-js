
import { ServiceProvider } from '../platform/serviceProvider';
import { exists } from '../utils'
import { KeycloakSecurity } from './keycloakSecurity';

function register(platformClient) {
    if (exists(platformClient)) {
        const securityProvider = new ServiceProvider(KeycloakSecurity, 'Security');
        platformClient.registerServiceProvider(securityProvider);
    }
}

export { register }