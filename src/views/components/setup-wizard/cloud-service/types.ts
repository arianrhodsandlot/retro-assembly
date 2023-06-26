export interface TreeNode {
  path: string
  name: string
  expanded: boolean
  isDirectory: boolean
  hasChildren: boolean
  children: TreeNode[] | undefined
}
