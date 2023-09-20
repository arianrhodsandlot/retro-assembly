import ky from 'ky'

export const http = ky.create({
  timeout: false,
  retry: {
    limit: 3,
    methods: ['get'],
  },
})
