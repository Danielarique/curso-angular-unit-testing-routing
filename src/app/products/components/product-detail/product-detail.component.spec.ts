import { Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { asyncData, getText, mockObservable } from '../../../../testing';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { generateOneProduct } from '../../../models/product.mock';
import { ProductsService } from '../../../services/product.service';
import { ProductDetailComponent } from './product-detail.component';

fdescribe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let route: ActivatedRouteStub;
  let productService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const routeStub = new ActivatedRouteStub();
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getOne',
    ]);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('should create', () => {
    const productId = '1';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the product in the view', () => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges();

    const titleText = getText(fixture, 'title');
    const priceText = getText(fixture, 'price');

    expect(titleText).toContain(productMock.title);
    expect(priceText).toContain(productMock.price);
    expect(productService.getOne).toHaveBeenCalledWith(productId);
  });

  it('should go to back without id params', () => {
    route.setParamMap({});

    location.back.and.callThrough();
    fixture.detectChanges();
    expect(location.back).toHaveBeenCalled();
  });

  it('should change status loading => success', fakeAsync(() => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productService.getOne.and.returnValue(asyncData(productMock));
    fixture.detectChanges();

    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toEqual('success');

  }));


  it('should typeCustomer be "customer"', () => {
    const productId = '2';
    route.setParamMap({ id: productId });
    route.setQueryParamMap({ type: 'customer' });


    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges();
    console.log(component.typeCustomer)
    expect(component.typeCustomer).toEqual('customer');

  });
});
