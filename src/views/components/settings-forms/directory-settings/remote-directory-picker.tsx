import { useState } from 'react'
import { ui } from '../../../../core'

interface TreeNode {
  path: string
  name: string
  expanded: boolean
  isDirectory: boolean
  hasChildren: boolean
  children: TreeNode[] | undefined
}

const root: TreeNode = {
  path: '/',
  name: 'root',
  expanded: false,
  isDirectory: true,
  hasChildren: true,
  children: undefined,
}

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
        const isDirectory = Boolean(child.folder)
        const hasChildren = child.folder?.childCount > 0
        const path = `${node.path}${child.name}${isDirectory ? '/' : ''}`
        return {
          path,
          name: child.name,
          expanded: false,
          isDirectory,
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
        {node.isDirectory ? (node.expanded ? '📂' : '📁') : '📄'}
        <div className='flex flex-1'>
          <div aria-hidden className='flex-1 cursor-pointer' onClick={() => toggleNodeExpanded(node)}>
            {node.name}
          </div>
          {node.hasChildren ? <button onClick={() => onSelect(node.path)}>select</button> : null}
        </div>
      </div>
      {node.expanded ? (
        <div className='pl-2'>
          {node.children?.map((node) => (
            <TreeNodeView key={node.name} node={node} onChange={onChange} onSelect={onSelect} root={root} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function RemoteDirectoryPicker({ onSelect }: { onSelect: (path: string) => void }) {
  const [tree, setTree] = useState(root)

  function onChange(changed: TreeNode) {
    setTree(changed)
  }

  return (
    <div className='max-h-60 overflow-auto p-3'>
      <TreeNodeView node={tree} onChange={onChange} onSelect={onSelect} root={tree} />
    </div>
  )
}
