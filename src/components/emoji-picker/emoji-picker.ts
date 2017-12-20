import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { EmojiServiceProvider } from '../../providers/emoji-service/emoji-service';

export const EMOJI_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmojiPickerComponent),
    multi: true
};

@Component({
  selector: 'emoji-picker',
  providers: [EMOJI_PICKER_VALUE_ACCESSOR],
  templateUrl: 'emoji-picker.html'
})
export class EmojiPickerComponent implements ControlValueAccessor {

  emojiBucket: string[] = [];
  content: string;
  onChanged: Function;
  onTouched: Function;

  constructor(public emojiService: EmojiServiceProvider) {
    this.emojiBucket = this.emojiService.getEmojis();
  }

  writeValue(obj: any): void {
    this.content = obj;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
    this.setValue(this.content);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setValue(val: any): any {
    this.content += val;
    if (this.content) 
      this.onChanged(this.content);
  }
}