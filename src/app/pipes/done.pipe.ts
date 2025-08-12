import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'done',
  standalone: true
})
export class DonePipe implements PipeTransform {
  transform(done: boolean, openText: string, doneText: string): string {
    return done ? doneText : openText;
  }
}
