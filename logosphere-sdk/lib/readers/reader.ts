export interface Reader {
  list(): string[];
  read(name: string): string;
}