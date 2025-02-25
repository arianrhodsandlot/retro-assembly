export interface TreeNode {
  children: TreeNode[] | undefined
  expanded: boolean
  hasChildren: boolean
  isDirectory: boolean
  name: string
  path: string
}
