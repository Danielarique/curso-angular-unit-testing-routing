import { AppComponent } from './app.component';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { query, queryAllByDirective, getText } from '../testing/finders';
import { clickElement } from '../testing/click';
import { routes } from './app-routing.module';
import { AppModule } from './app.module';
import { ProductsService } from './services/product.service';
import { generate } from 'rxjs';
import { generateManyProducts } from './models/product.mock';
import { asyncData, mockObservable } from '../testing/async-data';
import { AuthService } from './services/auth.service';
import { generateOneUser } from './models/user.mock';

describe('App integration test', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //providers
    router = TestBed.inject(Router);
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    router.initialNavigation();
    tick();
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should there are 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);
    expect(links.length).toEqual(7);
  });

  it('should rend OtherComponent when clicked with session', fakeAsync(() => {
    const productsMock = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMock));

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));
    clickElement(fixture, 'others-link', true);
    tick();
    fixture.detectChanges();

    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMock.length);
  }));

  it('should rend OtherComponent when clicked without session', fakeAsync(() => {

    authService.getUser.and.returnValue(mockObservable(null));
    clickElement(fixture, 'others-link', true);
    tick();
    fixture.detectChanges();

    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/');
  
  }));
});
