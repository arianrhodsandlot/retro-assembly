import { join } from 'path-browserify'
import { type CloudService, listDirectory } from '../../../../../../core'
import type { TreeNode } from './types'

interface ToggleNodeExpandedParams {
  node: TreeNode
  cloudService: CloudService
}

export async function toggleNodeExpanded({ node, cloudService }: ToggleNodeExpandedParams) {
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
      const { name, isDirectory } = child
      const hasChildren = isDirectory
      const path = join(node.path, name)
      return { path, name, expanded: false, isDirectory, hasChildren, children: undefined }
    })
  }

  node.expanded = true
}
