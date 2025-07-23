"use server";

import z from "zod";
import { jobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListing , updateJobListing as updateJobListingDb ,   deleteJobListing as deleteJobListingDb } from "../db/jobListings";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import { hasReachedMaxFeaturedJobListings, hasReachedMaxPublishedJobListings } from "../lib/planfeatureHelpers";
import { revalidatePath } from "next/cache";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization({});

  if (!orgId || !(await hasOrgUserPermission("database_access:job_listing_create"))) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
}


export async function updateJobListing(id:string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization({});

  if (!orgId || !(await hasOrgUserPermission("database_access:job_listing_update"))) {
    return {
      error: true,
      message: "You don't have permission to updating a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = getJobListing(id , orgId)

  if (!jobListing) {
    return {
      error: true,
      message: "There was an error updating this job listing",
    }
  }

  const updatedJobListing = await updateJobListingDb(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}



async function getJobListing(id: string, orgId: string) {
    return db.query.JobListingTable.findFirst({
        where: and(
            eq(JobListingTable.id, id),
            eq(JobListingTable.organizationId, orgId)
        ),
    });
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  }
  const { orgId } = await getCurrentOrganization({})
  if (!orgId) return error

  const jobListing = await getJobListing(id, orgId)
  if (!jobListing) return error

  const newStatus = getNextJobListingStatus(jobListing.status)
  if (
    !(await hasOrgUserPermission("database_access:job_listing_change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error
  }
   await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
   })
  
  revalidatePath(`/employer/job-listings/${id}`)

  return { error: false }
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  }
  const { orgId } = await getCurrentOrganization({})
  if (!orgId) return error

  const jobListing = await getJobListing(id, orgId)
  if (!jobListing) return error

  const newFeaturedStatus = !jobListing.isFeatured
  if (
    !(await hasOrgUserPermission("database_access:job_listing_change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error
  }

  await updateJobListingDb(id, {
    isFeatured: newFeaturedStatus,
  })

    revalidatePath(`/employer/job-listings/${id}`)

  return { error: false }
}


export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  }
  const { orgId } = await getCurrentOrganization({})
  if (!orgId) return error

  const jobListing = await getJobListing(id, orgId)
  if (!jobListing) return error

  if (!(await hasOrgUserPermission("database_access:job_listing_delete"))) {
    return error
  }

  await deleteJobListingDb(id)

  redirect("/employer")
}