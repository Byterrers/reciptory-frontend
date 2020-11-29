import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcScannerOcrComponent } from './rc-scanner-ocr.component';

describe('RcScannerOcrComponent', () => {
  let component: RcScannerOcrComponent;
  let fixture: ComponentFixture<RcScannerOcrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcScannerOcrComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcScannerOcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
