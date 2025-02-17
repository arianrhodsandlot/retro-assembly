type Params = Promise<Record<string, string>>
type SearchParams = Promise<Record<string, string | undefined>>

interface NextPageProps {
  params: Params
  searchParams: SearchParams
}
