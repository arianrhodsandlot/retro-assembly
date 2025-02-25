import { type CloudService, listDirectory, path } from '../../../../../../core'
import type { TreeNode } from './types'

interface ToggleNodeExpandedParams {
  cloudService: CloudService
  node: TreeNode
}

export async function toggleNodeExpanded({ cloudService, node }: ToggleNodeExpandedParams) {
  if (!node?.hasChildren) {
    return
  }

  if (node.expanded) {
    node.expanded = false
    return
  }

  if (!node.children) {
    const children = await listDirectory({ path: node.path, type: cloudService })
    node.children = children.map((child) => {
      const { isDirectory, name } = child
      const hasChildren = isDirectory
      return { children: undefined, expanded: false, hasChildren, isDirectory, name, path: path.join(node.path, name) }
    })
  }

  node.expanded = true
}
