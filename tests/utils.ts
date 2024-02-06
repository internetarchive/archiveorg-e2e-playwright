import { SortOrder, DateMetadataLabel } from './models';

export function viewsSorted(order: SortOrder, arr: Number[]): boolean {
  if (order === 'ascending') {
    return arr.every((x, i) => i === 0 || x >= arr[i - 1]);
  } else {
    return arr.every((x, i) => i === 0 || x <= arr[i - 1]);
  }
}

export function datesSorted(
  order: SortOrder,
  arr: DateMetadataLabel[],
): boolean {
  if (order === 'ascending') {
    return arr.every(
      (x, i) => i === 0 || new Date(x.date) >= new Date(arr[i - 1].date),
    );
  } else {
    return arr.every(
      (x, i) => i === 0 || new Date(x.date) <= new Date(arr[i - 1].date),
    );
  }
}
