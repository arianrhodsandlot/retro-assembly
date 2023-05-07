import { useState } from 'react'
import { system, ui } from '../../core'

interface TreeNode {
  path: string
  name: string
  expanded: boolean
  hasChildren: boolean
  children: TreeNode[] | undefined
}

const root: TreeNode = { path: '/', name: 'root', expanded: false, hasChildren: true, children: undefined }

function TreeNodeView({
  node,
  root,
  onChange,
  onSelect,
}: {
  root: TreeNode
  node: TreeNode
  onChange: (tree: TreeNode) => void
  onSelect: (path: string) => void
}) {
  async function toggleNodeExpanded(node) {
    if (!node.hasChildren) {
      return
    }
    if (node.expanded) {
      node.expanded = false
    } else {
      const children = await ui.listDirectory(node.path)
      node.children = children.map((child) => {
        const hasChildren = child.folder?.childCount > 0
        const path = node.path + child.name + (child.folder ? '/' : '')
        return {
          path,
          name: child.name,
          expanded: false,
          hasChildren,
          children: undefined,
        }
      })
      node.expanded = true
    }
    onChange({ ...root })
  }

  return (
    <div>
      <div className='flex'>
        {node.hasChildren ? (node.expanded ? '📂' : '📁') : '📄'}
        <div className='flex flex-1'>
          <div className='flex-1 cursor-pointer' aria-hidden onClick={() => toggleNodeExpanded(node)}>
            {node.name}
          </div>
          {node.hasChildren && <button onClick={() => onSelect(node.path)}>select</button>}
        </div>
      </div>
      {node.expanded && (
        <div className='pl-2'>
          {node.children?.map((node) => (
            <TreeNodeView root={root} node={node} onChange={onChange} key={node.name} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export function RemoteDirectoryPicker({ onSelect }: { onSelect: (string) => void }) {
  const [tree, setTree] = useState(root)

  async function onChange(changed) {
    setTree(changed)
  }

  return (
    <div className='max-h-60 overflow-auto p-3'>
      <TreeNodeView node={tree} root={tree} onChange={onChange} onSelect={onSelect} />
    </div>
  )
}
