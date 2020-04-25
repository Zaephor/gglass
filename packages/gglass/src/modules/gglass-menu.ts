export namespace model {
  export interface entry {
    id: string;
    label: string;
    order?: number;
    icon?: string;
    url?: string;
    target?: string;
    parent?: string;
    groups?: string[];
  }
}
