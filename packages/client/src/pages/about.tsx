import { Link } from 'waku'

export default function AboutPage() {
  const data = {
    body: 'The minimal React framework',
    headline: 'About Waku',
    title: 'About',
  }

  return (
    <div>
      <title>{data.title}</title>
      <h1 className='text-4xl font-bold tracking-tight'>{data.headline}</h1>
      <p>{data.body}</p>
      <Link className='mt-4 inline-block underline' to='/'>
        Return home
      </Link>
    </div>
  )
}
