import { useEffect, useState } from 'react'
import { ui } from '../../../../core'
import { OnedriveDirectoryTreeNode, type TreeNode } from './onedrive-directory-tree-node'

const root: TreeNode = {
  path: '/',
  name: 'OneDrive',
  expanded: false,
  isDirectory: true,
  hasChildren: true,
  children: undefined,
}

export function OnedriveDirectoryTree({ onSelect }: { onSelect: (path: string) => void }) {
  const [tree, setTree] = useState(root)

  function onChange(changed: TreeNode) {
    setTree(changed)
  }

  useEffect(() => {
    ;(async () => {
      const node = root
      const children = await ui.listDirectory(node.path)
      node.children = children.map((child) => {
        const isDirectory = Boolean(child.folder)
        const hasChildren = child.folder?.childCount > 0
        const path = `${node.path}${child.name}${isDirectory ? '/' : ''}`
        return { path, name: child.name, expanded: false, isDirectory, hasChildren, children: undefined }
      })
      node.expanded = true
      setTree({ ...node })
    })()
  }, [])

  return (
    <div className='mt-4 text-lg text-black'>
      <OnedriveDirectoryTreeNode node={tree} onChange={onChange} onSelect={onSelect} root={tree} />
    </div>
  )
}
