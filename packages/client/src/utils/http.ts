import ky from 'ky'

export const http = ky.create({
  prefixUrl: 'http://localhost:3000/',
  redirect: 'manual',
  retry: {
    limit: 3,
    methods: ['get'],
  },
})
