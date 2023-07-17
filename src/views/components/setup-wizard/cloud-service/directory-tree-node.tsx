import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { directoyTreeAtom } from './atoms'
import { type TreeNode } from './types'
import { toggleNodeExpanded } from './utils'

interface DirectoryTreeNodeParams {
  node: TreeNode
  cloudService: 'onedrive' | 'google-drive'
  onSelect: (path: string) => void
}

export function DirectoryTreeNode({ node, cloudService, onSelect }: DirectoryTreeNodeParams) {
  const [tree, setTree] = useAtom(directoyTreeAtom)

  const [state, updateTree] = useAsyncFn(async () => {
    if (tree) {
      await toggleNodeExpanded({ node, cloudService })
      setTree({ ...tree })
    }
  })

  function onClickDirectoryName() {
    if (state.loading === false) {
      updateTree()
    }
  }

  const isRoot = node === tree

  useEffect(() => {
    if (isRoot) {
      updateTree()
    }
  }, [isRoot, updateTree])

  return (
    <div>
      <div className='flex items-center rounded p-2 py-1 transition-[background-color,color] hover:bg-rose-100 hover:text-rose-700'>
        {node.isDirectory ? (
          node.expanded ? (
            <span className='icon-[mdi--folder-open] mr-2 h-6 w-6 text-rose-500' />
          ) : node.hasChildren ? (
            <span className='icon-[mdi--folder] mr-2 h-6 w-6 text-rose-500' />
          ) : (
            <span className='icon-[mdi--folder-alert] mr-2 h-6 w-6 text-rose-500' />
          )
        ) : (
          <span className='icon-[mdi--file] mr-2 h-6 w-6 text-rose-500' />
        )}

        <div className='group flex min-w-0 flex-1'>
          <div
            aria-hidden
            className='flex flex-1 cursor-default items-center overflow-hidden text-ellipsis whitespace-nowrap'
            onClick={onClickDirectoryName}
            title={node.name}
          >
            <div>{node.name}</div>
            {!node.hasChildren && node.isDirectory ? (
              <div className='ml-2  text-xs text-gray-300 opacity-0 group-hover:opacity-100'>an empty directory</div>
            ) : null}
          </div>
          {node.hasChildren ? (
            <button
              className={clsx(
                'flex scale-50 transform-gpu items-center justify-center rounded bg-rose-700 px-2 py-1 text-sm text-white opacity-0 transition-[transform,opacity]',
                'group-hover:scale-100 group-hover:opacity-100',
              )}
              onClick={() => onSelect(node.path)}
            >
              <span className='icon-[mdi--check] mr-1 h-4 w-4' />
              Proceed
            </button>
          ) : null}
        </div>
      </div>

      {state.loading ? <span className='icon-[line-md--loading-loop] my-2 ml-10 h-6 w-6 text-rose-700' /> : null}

      {node.expanded ? (
        <div className='pl-6'>
          {node.children?.map((node) => (
            <DirectoryTreeNode cloudService={cloudService} key={node.name} node={node} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
