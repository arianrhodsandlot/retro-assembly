import { getLoginUrl } from './actions.ts'

export default async function Login({ searchParams }: NextPageProps) {
  const { redirect_to: redirectTo = '/' } = await searchParams

  return (
    <form action={getLoginUrl} className='mt-20 w-5xl mx-auto text-center'>
      <div className='mt-10'>
        <input name='redirect_to' type='hidden' value={redirectTo} />
        <button className='underline' type='submit'>
          Login with Google
        </button>
      </div>
    </form>
  )
}
