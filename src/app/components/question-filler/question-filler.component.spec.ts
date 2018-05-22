import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFillerComponent } from './question-filler.component';

describe('QuestionFillerComponent', () => {
  let component: QuestionFillerComponent;
  let fixture: ComponentFixture<QuestionFillerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFillerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
