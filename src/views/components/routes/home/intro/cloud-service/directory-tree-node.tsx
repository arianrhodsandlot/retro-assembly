import { useAsync } from '@react-hookz/web'
import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CloudService } from '../../../../../../core'
import { directoyTreeAtom } from './atoms'
import type { TreeNode } from './types'
import { toggleNodeExpanded } from './utils'

interface DirectoryTreeNodeParams {
  cloudService: CloudService
  node: TreeNode
  onSelect: (path: string) => void
}

export function DirectoryTreeNode({ cloudService, node, onSelect }: DirectoryTreeNodeParams) {
  const { t } = useTranslation()
  const [tree, setTree] = useAtom(directoyTreeAtom)

  const [state, { execute: updateTree }] = useAsync(async () => {
    if (tree) {
      await toggleNodeExpanded({ cloudService, node })
      setTree({ ...tree })
    }
  })

  function onClickDirectoryName() {
    if (state.status !== 'loading') {
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
      <div
        className='flex items-center rounded p-2 py-1 transition-[background-color,color] hover:bg-rose-100 hover:text-rose-700'
        data-testid='directory-tree-node'
      >
        {node.isDirectory ? (
          node.expanded ? (
            <span className='icon-[mdi--folder-open] mr-2 size-6 text-rose-500' />
          ) : (
            <span
              className={clsx(
                node.hasChildren ? 'icon-[mdi--folder]' : 'icon-[mdi--folder-alert]',
                'mr-2 size-6 text-rose-500',
              )}
            />
          )
        ) : (
          <span className='icon-[mdi--file] mr-2 size-6 text-rose-500' />
        )}

        <div className='group flex min-w-0 flex-1'>
          <div
            aria-hidden
            className='flex flex-1 cursor-default items-center overflow-hidden'
            onClick={onClickDirectoryName}
            title={node.name}
          >
            <div className='truncate'>{node.name}</div>
            {!node.hasChildren && node.isDirectory ? (
              <div className='ml-2  text-xs text-gray-300 opacity-0 group-hover:opacity-100'>
                {t('an empty directory')}
              </div>
            ) : null}
          </div>
          {node.hasChildren ? (
            <button
              className={clsx(
                'flex scale-50 transform-gpu items-center justify-center rounded bg-rose-700 px-2 py-1 text-sm text-white opacity-0 transition-[transform,opacity]',
                'group-hover:scale-100 group-hover:opacity-100',
              )}
              onClick={() => onSelect(node.path)}
              type='button'
            >
              <span className='icon-[mdi--check] mr-1 size-4' />
              {t('Proceed')}
            </button>
          ) : null}
        </div>
      </div>

      {state.status === 'loading' ? (
        <span className='icon-[line-md--loading-loop] my-2 ml-10 size-6 text-rose-700' />
      ) : null}

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
