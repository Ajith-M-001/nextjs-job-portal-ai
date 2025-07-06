import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { getCurrentOrganization } from '@/services/clerk/lib/getCurrentAuth'
import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

export default function EmployerHomePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  )
}

const SuspendedPage = async () => {
  const { orgId } = await getCurrentOrganization({})
  if (!orgId) return null

  const jobListing = await getMostRecentJobListing(orgId)
  if (!jobListing) {
    redirect("/employer/job-listings/new")
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`)
  }
}


const getMostRecentJobListing = async (orgId: string) => {
  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  })
}