import { useEffect, useState } from 'react'
import { ui } from '../../../../core'
import { DirectoryTreeNode, type TreeNode } from './directory-tree-node'

const cloudServiceNameMap = {
  onedrive: 'OneDrive',
  'google-drive': 'Google Drive',
}

export function DirectoryTree({
  cloudService,
  onSelect,
}: {
  cloudService: 'onedrive' | 'google-drive'
  onSelect: (path: string) => void
}) {
  const [tree, setTree] = useState<TreeNode>({
    path: '/',
    name: cloudServiceNameMap[cloudService],
    expanded: false,
    isDirectory: true,
    hasChildren: true,
    children: undefined,
  })

  function onChange(changed: TreeNode) {
    setTree(changed)
  }

  useEffect(() => {
    ;(async () => {
      const node = tree
      const children = await ui.listDirectory({
        path: node.path,
        type: cloudService,
      })
      node.children = children.map((child) => {
        const { name, isDirectory } = child
        const hasChildren = isDirectory
        const path = `${node.path}${name}${isDirectory ? '/' : ''}`
        return { path, name, expanded: false, isDirectory, hasChildren, children: undefined }
      })
      node.expanded = true
      setTree({ ...node })
    })()
  })

  return (
    <div className='mt-4 text-lg text-black'>
      <DirectoryTreeNode cloudService={cloudService} node={tree} onChange={onChange} onSelect={onSelect} root={tree} />
    </div>
  )
}
