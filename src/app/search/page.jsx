import { Suspense } from 'react'
import { LoadingGrid } from '@/components/common/loading-grid'
import { SearchPageContent } from '@/components/search/search-page-content'

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-8 lg:px-8">
          <LoadingGrid count={10} />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}