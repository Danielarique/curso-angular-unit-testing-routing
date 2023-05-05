import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { RouterLinkDirectiveStub, queryAllByDirective  } from 'src/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'app-banner'
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
class BannerComponentStub{}

@Component({
  selector: 'app-footer'
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
class FooterComponentStub{}

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        RouterLinkDirectiveStub,
        BannerComponentStub,
        FooterComponentStub
      ],
    }).compileComponents();
  });

  beforeEach(()=>{
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

/*   it(`should have as title 'ng-testing-services'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng-testing-services');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('ng-testing-services app is running!');
  }); */

  it('should there are 7 routerLinks', ()=>{
    const links = queryAllByDirective(fixture,RouterLinkDirectiveStub);
    expect(links.length).toEqual(7)
  })

  it('should there are 7 routerLinks with match routes', ()=>{
    const links = queryAllByDirective(fixture,RouterLinkDirectiveStub);
    const routerLinks = links.map(link => link.injector.get(RouterLinkDirectiveStub));
    expect(links.length).toEqual(7);
    expect(routerLinks[0].linkParams).toEqual('/')
    expect(routerLinks[1].linkParams).toEqual('/auth/register')

  })
});
