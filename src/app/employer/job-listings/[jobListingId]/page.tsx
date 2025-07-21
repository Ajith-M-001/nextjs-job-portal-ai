import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";

type Props = {
    params: Promise<{ jobListingId: string }>;
};

export default function JobListingPage(props: Props) {
    return (
        <Suspense>
            <SuspendedPage {...props} />
        </Suspense>
    );
}

async function SuspendedPage({ params }: Props) {
    const { orgId } = await getCurrentOrganization({});
    if (!orgId) return null;

    const { jobListingId } = await params;
    const jobListing = await getJobListing(jobListingId, orgId);
    if (!jobListing) return notFound();

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
            <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {jobListing.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
                        <JobListingBadges jobListing={jobListing} />
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

async function getJobListing(id: string, orgId: string) {
    return db.query.JobListingTable.findFirst({
        where: and(
            eq(JobListingTable.id, id),
            eq(JobListingTable.organizationId, orgId)
        ),
    });
}
