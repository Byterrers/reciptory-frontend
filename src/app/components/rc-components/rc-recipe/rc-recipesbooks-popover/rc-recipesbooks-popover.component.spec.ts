import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcRecipesBooksPopoverComponent } from './rc-recipesbooks-popover.component';

describe('RcRecipesBooksPopoverComponent', () => {
  let component: RcRecipesBooksPopoverComponent;
  let fixture: ComponentFixture<RcRecipesBooksPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcRecipesBooksPopoverComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcRecipesBooksPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
