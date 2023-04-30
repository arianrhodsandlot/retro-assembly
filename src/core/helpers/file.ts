export async function readBlobAsUint8Array(file: Blob) {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer))
    })
  })
}

export function listRemoteRoms() {}
