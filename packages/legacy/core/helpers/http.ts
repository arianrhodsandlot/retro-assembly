import ky from 'ky'

export const http = ky.create({
  retry: {
    limit: 3,
    methods: ['get'],
  },
  timeout: false,
})
