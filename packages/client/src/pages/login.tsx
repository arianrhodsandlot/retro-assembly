import { http } from '@/utils/http'

export default async function AboutPage() {
  const { data } = await http
    .get('auth/auth', { searchParams: { provider: 'google', redirect: 'http://localhost:3001/' } })
    .json()

  return (
    <div>
      <title>login</title>
      <a href={data.url}>login with google</a>
    </div>
  )
}
