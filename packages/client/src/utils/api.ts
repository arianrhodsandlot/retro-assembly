import ky from 'ky'

const http = ky.create({
  prefixUrl: 'http://localhost:3000/api',
  redirect: 'manual',
  retry: {
    limit: 3,
    methods: ['get'],
  },
})

export const api = {
  async getPlatforms() {
    return await http.get('platforms')
  },
}
