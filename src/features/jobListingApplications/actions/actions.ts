"use server"

import z from "zod";
import { newJobListingApplicationSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { db } from "@/drizzle/db";
import { JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { insertJobListingApplication } from "../db/jobListingsApplications";
import { inngest } from "@/services/inngest/client";

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof newJobListingApplicationSchema>
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application",
  };

  const { userId } = await getCurrentUser({});
  if (userId == null) return permissionError;

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublicJobListing(jobListingId),
  ]);
    if (userResume == null || jobListing == null) return permissionError;
    
      const { success, data } = newJobListingApplicationSchema.safeParse(unsafeData)
 if (!success) {
    return {
      error: true,
      message: "There was an error submitting your application",
    }
  }
  await insertJobListingApplication({
    jobListingId,
    userId,
    ...data,
  })

  await inngest.send({
    name: "app/jobListingApplication.created",
    data: { jobListingId, userId },
  })

  return {
    error: false,
    message: "Your application was successfully submitted",
  }
}

async function getPublicJobListing(id: string) {
  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published")
    ),
    columns: { id: true },
  });
}

async function getJobListing(id: string) {
  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, id),
    columns: { organizationId: true },
  });
}

async function getUserResume(userId: string) {
  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: { userId: true },
  });
}
