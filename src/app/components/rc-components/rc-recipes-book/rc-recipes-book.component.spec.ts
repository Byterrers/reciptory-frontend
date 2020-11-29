import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcRecipesBookComponent } from './rc-recipes-book.component';

describe('RcRecipesBookComponent', () => {
  let component: RcRecipesBookComponent;
  let fixture: ComponentFixture<RcRecipesBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcRecipesBookComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcRecipesBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
