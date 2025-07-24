import JobListingItems from "./_shared/JobListingItems";

const Homepage = ({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[]>>;
}) => {
    return (
        <div className="m-4">
            <JobListingItems searchParams={searchParams} />
        </div>
    );
};

export default Homepage;
