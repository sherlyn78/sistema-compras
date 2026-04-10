import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVendedor } from './dashboardVendedor';

describe('DashboardVendedor', () => {
  let component: DashboardVendedor;
  let fixture: ComponentFixture<DashboardVendedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVendedor],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardVendedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
