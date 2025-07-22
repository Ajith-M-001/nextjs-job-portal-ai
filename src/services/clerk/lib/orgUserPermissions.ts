import { auth } from "@clerk/nextjs/server"

type UserPermission =
  | "database_access:job_listing_create"
  | "database_access:job_listing_update"
  | "database_access:job_listing_delete"
  | "database_access:job_listing_change_status"
  | "database_access:job_listing_applications_change_rating"
  | "database_access:job_listing_applications_change_status"

export async function hasOrgUserPermission(permission: UserPermission) {
  const { has } = await auth()
  return has({ permission })
}