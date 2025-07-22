import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobListingStatus, JobListingTable } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditIcon } from "lucide-react";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import AsyncIf from "@/components/AsyncIf";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";
import { hasReachedMaxPublishedJobListings } from "@/features/jobListings/lib/planfeatureHelpers";

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
                <div className="flex items-center gap-2 empty:-mt-4">
                    <AsyncIf
                        condition={() =>
                            hasOrgUserPermission("database_access:job_listing_update")
                        }
                    >
                        <Button asChild variant={"outline"}>
                            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                                <EditIcon className="size-4" />
                                <span>Edit</span>
                            </Link>
                        </Button>
                    </AsyncIf>
                    <StatusUpdateButton status={jobListing.status} />
                </div>
            </div>
            <MarkdownPartial
                dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
                mainMarkdown={
                    <MarkdownRenderer
                        className="prose-sm"
                        source={jobListing.description}
                    />
                }
                dialogTitle="Description"
            />
        </div>
    );
}

function StatusUpdateButton({ status }: { status: JobListingStatus }) {
    const button = <Button variant={"outline"}>Toggle</Button>;
    return (
        <AsyncIf
            condition={() =>
                hasOrgUserPermission("database_access:job_listing_change_status")
            }
        >
            {getNextJobListingStatus(status) === "published" ? (
                <AsyncIf
                    condition={async () => {
                        const isMaxed = await hasReachedMaxPublishedJobListings();
                        return !isMaxed;
                    }}
                    otherWise={"fdsaf"}
                >
                    {button}
                </AsyncIf>

            ) : (
                button
            )}
        </AsyncIf>
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
