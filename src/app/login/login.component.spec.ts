import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
      });
  }));



  fit("should have welcome text 'welcome'", () => {
    expect(component.welcome).toBeTruthy();
  });


  it(`should call the onSubmit method`, async(() => {
    spyOn(component, 'onSubmit');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.onSubmit).toHaveBeenCalled();
  }));


  fit(`form should be valid`, async(() => {
    component.form.controls['email'].setValue('boi_admin@istarindia.com');
    component.form.controls['password'].setValue('test123');
    expect(component.form.valid).toBeTruthy();
  }));

  fit(`form should be invalid`, async(() => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  }));


  fit(`password should have minimum 4 letters`, async(() => {

    component.form.controls['email'].setValue('boi_admin@istarindia.com');
    component.form.controls['password'].setValue('123');
    expect(component.form.valid).toBeFalsy();
  }));

  fit(`email should be valid`, async(() => {
    component.form.controls['email'].setValue('boi_admin');
    component.form.controls['password'].setValue('test123');
    expect(component.form.valid).toBeFalsy();
  }));




});