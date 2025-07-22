import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";
import { and, count, eq } from "drizzle-orm";

export async function hasReachedMaxPublishedJobListings() {
  const { orgId } = await getCurrentOrganization({});
  if (!orgId) return true;

  const count = await getPublishedJobListingsCount(orgId);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
    hasPlanFeature("post_3_job_listing").then((has) => has && count < 3),
    hasPlanFeature("post_15_job_listing").then((has) => has && count < 15),
  ]);

  return !canPost.some(Boolean);
}

async function getPublishedJobListingsCount(orgId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.status, "published")
      )
    );
  return res?.count ?? 0;
}
