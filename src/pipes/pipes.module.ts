import { NgModule } from '@angular/core';
import { RelativeTimePipe } from '@ashy/pipes/relative-time/relative-time';
import { SimpleRelativeTimePipe } from '@ashy/pipes/simple-relative-time/simple-relative-time';
import { WordcounterPipe } from '@ashy/pipes/wordcounter/wordcounter';


@NgModule({
	declarations: [
    RelativeTimePipe,
    SimpleRelativeTimePipe,
    WordcounterPipe
  ],
	exports: [
    RelativeTimePipe,
    SimpleRelativeTimePipe,
    WordcounterPipe
  ]
})
export class PipesModule {}
