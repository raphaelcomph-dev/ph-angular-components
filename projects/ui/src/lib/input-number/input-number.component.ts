import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ph-input-number',
  standalone: true,
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = Infinity;
  @Input() step: number = 1;
  @Output() valueChange = new EventEmitter<number>();

  /** what's shown in the input while typing */
  textValue = '0';

  ngOnInit(): void {
    // Initialize textValue from value
    this.textValue = String(this.value ?? 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !this.isTypingInvalid()) {
      this.textValue = String(this.value ?? 0);
    }
  }

  decrement(): void {
    const next = Math.max(this.min, (this.value ?? 0) - this.step);
    this.setValue(next);
  }

  increment(): void {
    const next = Math.min(this.max, (this.value ?? 0) + this.step);
    this.setValue(next);
  }

  /** When user types */
  onInput(e: Event): void {
    const raw = (e.target as HTMLInputElement).value.trim();
    this.textValue = raw;

    // Allow empty while editing
    if (raw === '') return;

    const parsed = this.toNumber(raw);
    if (parsed == null) return; // ignore invalid interim chars

    const clamped = this.clamp(parsed);
    this.setValue(clamped, /*syncText*/ false);
  }

  /** On blur, finalize/clamp even if empty/invalid */
  onBlur(): void {
    const parsed = this.toNumber(this.textValue);
    const fallback = Number.isFinite(this.value) ? this.value : this.min ?? 0;
    const finalVal = this.clamp(parsed ?? fallback);
    this.setValue(finalVal);
  }

  /** Support ArrowUp/ArrowDown and Enter */
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.increment();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.decrement();
    }
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
    // Block non-numeric (allow control keys)
    const allowed =
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
      // allow Ctrl/Cmd+A/C/V/X
      e.ctrlKey ||
      e.metaKey;
    if (allowed) return;

    // Only digits
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }

  /** Prevent mouse wheel changing value accidentally while focused */
  onWheel(e: WheelEvent): void {
    (e.target as HTMLInputElement).blur();
  }

  // Helpers
  private setValue(v: number, syncText: boolean = true): void {
    if (v === this.value) {
      if (syncText) this.textValue = String(v);
      return;
    }
    this.value = v;
    if (syncText) this.textValue = String(v);
    this.valueChange.emit(this.value);
  }

  private clamp(n: number): number {
    let x = n;
    if (Number.isNaN(x)) x = this.min ?? 0;
    if (x < this.min) x = this.min;
    if (x > this.max) x = this.max;
    return x;
  }

  private toNumber(raw: string): number | null {
    if (raw == null || raw === '') return null;
    const onlyDigits = raw.replace(/[^\d]/g, '');
    if (onlyDigits === '') return null;
    return Number(onlyDigits);
  }

  private isTypingInvalid(): boolean {
    // if user currently has an empty or invalid buffer, don't overwrite it on @Input changes
    return this.textValue === '' || this.toNumber(this.textValue) == null;
  }
}
