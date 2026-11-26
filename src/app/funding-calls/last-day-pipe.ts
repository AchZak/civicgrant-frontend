import { Pipe, PipeTransform } from '@angular/core';

// A call closes at midnight after its last day and `closesAt` is excluded, so step back a moment.
@Pipe({
  name: 'lastDay',
})
export class LastDayPipe implements PipeTransform {
  transform(closesAt: string): string {
    return new Date(Date.parse(closesAt) - 1).toISOString();
  }
}
