export type ArrayMetadata = {
  length: number;
  firstObject: any | undefined;
};
export function getArrayMetadata(arr: any[]): ArrayMetadata;
