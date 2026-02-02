import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { DateService } from '../services/date.service';
import { ErrorMessages } from '../utils/error-messages';

@Component({
  selector: 'ph-input-date',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-date.component.html',
  styleUrls: []
})
export class InputDateComponent implements OnInit {
  @Input() label: string | null = null;
  @Input() ageCalculationRelativePrefix: string = '';
  @Input() showAgeCalculation: boolean = false;
  @Input() canBeFutureDate: boolean = true;
  @Input() canBePastDate: boolean = true;
  @Input() required: boolean = false;
  @Input() showTime: boolean = false;
  @Input() initialValue: Date | null = null;
  @Input() referenceDate: Date = new Date();
  @Input() readOnly: boolean = false;
  @Input() displayInline: boolean = false;
  @Input() helperText: string = '';
  @Output() onDateChanges = new EventEmitter<string | null>();

  protected selectedDate: string | null = null;
  protected ageToString: string | null = null;
  protected isValidated: boolean = false;
  protected valid: boolean = true;
  protected errorMessage: string = '';
  protected isSelectedDateInInvalidTimeline: boolean = false;
  protected inputId: string = '';

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    this.setInputId(this.label);
    this.setSelectedDate(this.initialValue);
  }

  getSelectedDate(): Date | null {
    if (this.selectedDate) {
      return this.getSelectedDateAsDayjsDate()?.toDate() || null;
    }
    return null;
  }

  changeDate(date: Date | null): void {
    this.setSelectedDate(date);
  }

  validate(): boolean {
    this.isValidated = true;
    this.valid = true;
    if (this.required && !this.getSelectedDate()) {
      this.valid = false;
      this.errorMessage = ErrorMessages.inputFieldRequired(this.label || '');
      console.info(`Componente ${this.label} está inválido por motivos de obrigatoriedade`);
    } else if (!!this.getSelectedDate() && this.isSelectedDateInInvalidTimeline) {
      this.errorMessage = ErrorMessages.dateTimelineInvalid(
        this.label || '',
        !this.canBePastDate,
        !this.canBeFutureDate
      );
      this.valid = false;
      console.info(`Componente ${this.label} está inválido por motivos de data inválida`);
    }

    return this.valid;
  }

  isValid(): boolean {
    return this.valid;
  }

  protected onChangeDate(): void {
    if (this.selectedDate) {
      this.calculateIfDateIsInWrongTimeline();
    }
    this.calculateAgeAndShowAsHelper();
    if (this.isValidated) {
      this.validate();
    }
    this.onDateChanges.emit(this.selectedDate);
  }

  private getSelectedDateAsDayjsDate(): dayjs.Dayjs | null {
    return this.selectedDate ? dayjs(this.selectedDate) : null;
  }

  private calculateIfDateIsInWrongTimeline(): void {
    const dayjsDate = this.getSelectedDateAsDayjsDate();
    if (!dayjsDate) return;

    const isSelectedDateInPast = this.showTime
      ? dayjsDate.isBefore(dayjs(this.referenceDate))
      : dayjsDate.isBefore(dayjs(this.referenceDate).startOf('day'));
    const isSelectedDateInFuture = this.showTime
      ? dayjsDate.isAfter(dayjs(this.referenceDate))
      : dayjsDate.isAfter(dayjs(this.referenceDate).endOf('day'));

    this.isSelectedDateInInvalidTimeline =
      (!this.canBePastDate && isSelectedDateInPast) || (!this.canBeFutureDate && isSelectedDateInFuture);
  }

  private calculateAgeAndShowAsHelper(): void {
    this.ageToString = null;
    if (this.showAgeCalculation && !!this.getSelectedDateAsDayjsDate() && !this.isSelectedDateInInvalidTimeline) {
      const date = this.getSelectedDateAsDayjsDate()?.toDate();
      if (date) {
        this.ageToString = this.dateService.ageToString(date, this.referenceDate);
      }
    }
  }

  private setSelectedDate(date: Date | null): void {
    if (date && dayjs(date).isValid()) {
      const format = this.showTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
      this.selectedDate = dayjs(date).format(format);
      this.onChangeDate();
      return;
    }
    this.selectedDate = null;
  }

  private setInputId(label: string | null): void {
    if (label) {
      this.inputId = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else {
      this.inputId = `input-date-${Math.random().toString(36).substring(2, 9)}`;
    }
  }
}
