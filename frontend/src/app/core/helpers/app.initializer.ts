import { AuthenticationService } from '../services/authorization.service';

export function appInitializer(authenticationService: AuthenticationService) {
    return () => new Promise(resolve => {
        // if(authenticationService.tokenValue != null){
            // attempt to refresh token on app start up to auto authenticate
        authenticationService.refreshToken()
        .subscribe()
        .add(resolve);
        // }
    });
}