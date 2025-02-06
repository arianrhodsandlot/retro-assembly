import { join } from 'path-browserify'
import { type CloudService, listDirectory } from '../../../../../../core'
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
      const path = join(node.path, name)
      return { children: undefined, expanded: false, hasChildren, isDirectory, name, path }
    })
  }

  node.expanded = true
}
