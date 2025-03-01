import AppLayout from '@/components/app/app-layout.tsx'
import { DeviceInfo } from '@/components/app/device-info.tsx'
import { GameList } from '@/components/app/game-list.tsx'
import { PlatformBackground } from '@/components/app/platform/platform-background.tsx'
import { UploadButton } from '@/components/app/platform/upload-button.tsx'
import { SidebarLinks } from '@/components/app/sidebar-links.tsx'
import { platformMap } from '@/constants/platform.ts'
import { getRoms } from '@/controllers/get-roms.ts'

export default async function App({ platform }) {
  if (!platformMap[platform]) {
    return '404 not found'
  }

  const roms = await getRoms({ platform })

  return (
    <AppLayout append={<PlatformBackground platform={platform} />} sidebar={<SidebarLinks platform={platform} />}>
      <title>{`${platformMap[platform].displayName} - RetroAssembly`}</title>

      <div className='flex flex-col gap-8'>
        <DeviceInfo platform={platform} />
        <GameList roms={roms} />
        <UploadButton platform={platform} />
      </div>
    </AppLayout>
  )
}
