import { clsx } from 'clsx'
import { ui } from '../../../core'

export interface TreeNode {
  path: string
  name: string
  expanded: boolean
  isDirectory: boolean
  hasChildren: boolean
  children: TreeNode[] | undefined
}

export function OnedriveDirectoryTreeNode({
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
      <div className='flex rounded p-2 py-1 transition-[background-color,color] hover:bg-red-100 hover:text-red-600'>
        <div className='mr-1'>{node.isDirectory ? (node.expanded ? '📂' : '📁') : '📄'}</div>
        <div className='group flex min-w-0 flex-1'>
          <div
            aria-hidden
            className='flex flex-1 cursor-default items-center overflow-hidden text-ellipsis whitespace-nowrap'
            onClick={() => toggleNodeExpanded(node)}
            title={node.name}
          >
            <div>{node.name}</div>
            {!node.hasChildren && node.isDirectory ? (
              <div className='ml-2  text-xs text-gray-300 opacity-0 group-hover:opacity-100'>empty</div>
            ) : null}
          </div>
          {node.hasChildren ? (
            <button
              className={clsx(
                'flex scale-50 transform-gpu items-center justify-center rounded bg-red-600 px-2 py-1 text-sm text-white opacity-0 transition-[transform,opacity]',
                'group-hover:scale-100 group-hover:opacity-100'
              )}
              onClick={() => onSelect(node.path)}
            >
              <span className='icon-[mdi--check] mr-1 h-4 w-4' />
              Proceed
            </button>
          ) : null}
        </div>
      </div>

      {node.expanded ? (
        <div className='pl-6'>
          {node.children?.map((node) => (
            <OnedriveDirectoryTreeNode
              key={node.name}
              node={node}
              onChange={onChange}
              onSelect={onSelect}
              root={root}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
