import { useAtom } from 'jotai'
import { useEffect } from 'react'
import type { CloudService } from '../../../../../../core'
import { directoyTreeAtom } from './atoms'
import { DirectoryTreeNode } from './directory-tree-node'

const cloudServiceNameMap = {
  dropbox: 'Dropbox',
  'google-drive': 'Google Drive',
  onedrive: 'OneDrive',
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
        children: undefined,
        expanded: false,
        hasChildren: true,
        isDirectory: true,
        name,
        path: '/',
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
