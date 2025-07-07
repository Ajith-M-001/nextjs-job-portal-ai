import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { BanknoteIcon, BuildingIcon, MapPinIcon } from "lucide-react";
import { ComponentProps } from "react";
import { formatJobListingLocation, formatLocationRequirement, formatWage } from "../lib/formatters";

export function JobListingBadges({
    jobListing: {
        wage,
        wageInterval,
        stateAbbreviation,
        city,
        type,
        experienceLevel,
        locationRequirement,
        isFeatured,
    },
    className,
}: {
    jobListing: Pick<typeof JobListingTable.$inferSelect, | "wage"
        | "wageInterval"
        | "stateAbbreviation"
        | "city"
        | "type"
        | "experienceLevel"
        | "locationRequirement"
        | "isFeatured">
    className?: string

}) {

    const badgeProps = {
        variant: "outline",
        className,
    } satisfies ComponentProps<typeof Badge>


    return <>
        {wage != null && wageInterval != null && (
            <Badge {...badgeProps}>
                <BanknoteIcon />
                {formatWage(wage, wageInterval)}
            </Badge>
        )}

        {(stateAbbreviation != null || city != null) && (
            <Badge {...badgeProps}>
                <MapPinIcon className="size-10" />
                {formatJobListingLocation({ stateAbbreviation, city })}
            </Badge>
        )}
        <Badge {...badgeProps}>
            <BuildingIcon />
            {formatLocationRequirement(locationRequirement)}
        </Badge>
    </>


}
