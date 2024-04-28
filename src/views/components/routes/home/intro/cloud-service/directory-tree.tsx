import { useAtom } from 'jotai'
import { useEffect } from 'react'
import type { CloudService } from '../../../../../../core'
import { directoyTreeAtom } from './atoms'
import { DirectoryTreeNode } from './directory-tree-node'

const cloudServiceNameMap = {
  onedrive: 'OneDrive',
  'google-drive': 'Google Drive',
  dropbox: 'Dropbox',
}

interface DirectoryTreeParams {
  cloudService: CloudService
  onSelect: (path: string) => void
}

export function DirectoryTree({ cloudService, onSelect }: DirectoryTreeParams) {
  const [tree, setTree] = useAtom(directoyTreeAtom)
  const name = cloudServiceNameMap[cloudService]

  useEffect(() => {
    return () => {
      setTree(undefined)
    }
  }, [setTree])

  useEffect(() => {
    if (!tree) {
      const initialTree = {
        path: '/',
        name,
        expanded: false,
        isDirectory: true,
        hasChildren: true,
        children: undefined,
      }
      setTree(initialTree)
    }
  }, [tree, name, setTree])

  return (
    <div className='mt-4 text-lg text-black'>
      {tree ? <DirectoryTreeNode cloudService={cloudService} node={tree} onSelect={onSelect} /> : null}
    </div>
  )
}
