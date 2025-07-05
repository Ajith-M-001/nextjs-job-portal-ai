import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server"
import { UserTable } from '../../../drizzle/schema/user';
import { eq } from "drizzle-orm";
import { OrganizationTable } from "@/drizzle/schema";

export const getCurrentUser =async ({ allData = false })=>{
    const { userId } = await auth();

    return {
        userId,
        user : (allData && userId !== null) ? await getUser(userId) : null
    }

}

const getUser = async (userId: string) => {
    return db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId)
    })
}

export const getCurrentOrganization =async ({ allData = false })=>{
    const { orgId } = await auth();

    return {
        orgId,
        organization : (allData && orgId !== null) ? await getOrganization(orgId!) : null
    }

}

const getOrganization = async (orgId: string) => {
    return db.query.OrganizationTable.findFirst({
        where: eq(OrganizationTable.id, orgId)
    })
}