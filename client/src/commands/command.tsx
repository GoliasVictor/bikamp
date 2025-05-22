export interface BikampCommand {
  execute(): Promise<any>;
  undo?(): Promise<any>;
}