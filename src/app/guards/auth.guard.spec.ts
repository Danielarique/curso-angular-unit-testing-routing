import { AuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { Auth } from '../models/auth.model';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  fakeActivatedRouteSnapshot,
  fakeParamMap,
  fakeRouterStateSnapShot,
} from '../../testing/snapshot';
import { generateOneUser } from '../models/user.mock';
import { mockObservable } from '../../testing/async-data';
describe('Test for AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true with session', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      paramMap: fakeParamMap({
        idProduct: '1212',
      }),
    });
    const routerState = fakeRouterStateSnapShot({});

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));

    guard.canActivate(activatedRoute, routerState).subscribe((rta) => {
      expect(rta).toBeTrue();
      doneFn();
    });
  });

  it('should return true without session', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      paramMap: fakeParamMap({
        idProduct: '1212',
      }),
    });
    const routerState = fakeRouterStateSnapShot({});

    authService.getUser.and.returnValue(mockObservable(null));

    guard.canActivate(activatedRoute, routerState).subscribe((rta) => {
      expect(rta).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      doneFn();
    });
  });

  it('should return false with idProduct param', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      paramMap: fakeParamMap({
        idProduct: '1212',
      }),
    });
    const routerState = fakeRouterStateSnapShot({});

    authService.getUser.and.returnValue(mockObservable(null));

    guard.canActivate(activatedRoute, routerState).subscribe((rta) => {
      expect(rta).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      doneFn();
    });
  });
});
