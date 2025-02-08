import { type drive_v3 as driveV3, google } from 'googleapis'
import { compact, initial, last } from 'lodash-es'

const folderMimeType = 'application/vnd.google-apps.folder'
const defaultFileFields = 'name,id,mimeType,modifiedTime,webContentLink'
const defaultFileNestedFields = `files(${defaultFileFields})`

function formatValue(value: boolean | number | string) {
  return typeof value === 'string' ? `'${value}'` : `${value}`
}

function buildGoogleDriveConditions(
  conditions: Record<string, { operator: string; value: boolean | number | string } | boolean | number | string>,
) {
  const mergedConditions: typeof conditions = { trashed: false, ...conditions }
  return Object.entries(mergedConditions)
    .map(([key, value]) =>
      typeof value === 'object'
        ? `${key} ${value.operator} ${formatValue(value.value)}`
        : `${key} = ${formatValue(value)}`,
    )
    .join(' and ')
}

export class CloudFS {
  private client: driveV3.Resource$Files

  constructor({ credentials }: { credentials: { access_token: string; refresh_token?: string } }) {
    const auth = new google.auth.OAuth2()
    auth.credentials = credentials
    this.client = google.drive({ auth, version: 'v3' }).files
  }

  async create(path: string, blob: Blob) {
    await this.client.create({})
  }

  async delete(path: string) {
    await this.client.delete({})
  }

  async list(path: string) {
    let normalizedPath = path
    if (!normalizedPath.startsWith('/')) {
      throw new Error(`invalid path: ${path}`)
    }
    if (normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1)
    }
    const segments = compact(normalizedPath.slice(1).split('/'))
    if (segments.length === 0) {
      return this.listRoot()
    }

    let results: driveV3.Schema$File[]
    let parentId = 'root'
    for (const segment of segments) {
      const response = await this.client.list({
        fields: defaultFileNestedFields,
        q: buildGoogleDriveConditions({
          mimeType: folderMimeType,
          name: segment,
          parents: { operator: 'in', value: parentId },
        }),
        spaces: 'drive',
      })
      results = response.data.files
      parentId = results[0]?.id
      if (!parentId) {
        throw new Error(`invalid path: ${path}, segment: ${segment}`)
      }
    }

    return results
  }

  async read(path) {
    const segments = path.split('/')
    const fileDirectory = initial(segments).join('/')
    const fileName = last(segments)
    const directory = await this.getDirectoryWithCache(fileDirectory)
    const conditions = ['trashed=false', `parents in '${directory.id}'`, `name='${fileName}'`]
    const q = conditions.join(' and ')
    const response = await this.client.list({ fields: defaultFileNestedFields, orderBy: 'name', q })
    const file = response.result.files?.[0]
    if (!file) {
      throw new Error('invalid file')
    }
    const fileId = file.id
    const { access_token: accessToken } = gapi.client.getToken()
    return await http(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      searchParams: { alt: 'media' },
    }).blob()
  }

  private async listRoot() {
    const response = await this.client.list({
      fields: defaultFileNestedFields,
      orderBy: 'name',
      q: buildGoogleDriveConditions({
        parents: { operator: 'in', value: 'root' },
      }),
    })
    return response.data.files
  }
}
