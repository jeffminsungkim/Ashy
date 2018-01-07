import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { EmojiServiceProvider } from '@ashy-services/emoji-service/emoji-service';

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
    console.log('init content:', this.content);
  }

  writeValue(obj: any) {
    this.content = obj;
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
    if (this.content !== undefined || this.content !== null || this.content !== '') {
      console.log('register on change');
      this.setValue(this.content);
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setValue(val: any): any {
   
    if (val === null) {
       console.log('setValue val is null', val);
       return;
    }

    if (this.content === undefined)
      this.content = '';

    console.log('setValue val', val);
    console.log('typeof val', typeof val);

    this.content += val;
    console.log('content2:', this.content);
    if (this.content) {
      this.onChanged(this.content);
      console.log('ok');
    }
  }
}