import { RouterStateSnapshot, ActivatedRouteSnapshot, Params, convertToParamMap } from '@angular/router';
export function fakeRouterStateSnapShot(options: Partial<RouterStateSnapshot>){
    return options as RouterStateSnapshot;
}

export function fakeActivatedRouteSnapshot(options: Partial<ActivatedRouteSnapshot>){
    return options as ActivatedRouteSnapshot;
}

export function fakeParamMap(params: Params = {}){
    return convertToParamMap(params);
}