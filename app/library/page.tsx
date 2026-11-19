import { getBooks } from '@/lib/books'
import { LibraryClient } from './library-client'

export const metadata = {
  title: 'Library',
  description: 'Every post, bound as a book.',
}

export default async function Page() {
  return <LibraryClient books={await getBooks()} />
}
