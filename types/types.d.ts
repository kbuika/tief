export interface TreeObject {
  nodeName: string;
  nodeType: number;
  nodeStyle: any;
  nodeValue: string | null;
  classList: any;
  children: TreeObject[];
}
