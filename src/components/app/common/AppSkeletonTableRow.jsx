import { Skeleton } from "@/components/ui/skeleton";

const AppSkeletonTableRow = ({ count = 10 }) => {
  const tableRows = Array.from({ length: count }, (_, index) => {
    return (
      <div className="mb-4" key={index + 1}>
        <Skeleton className="w-full h-8 rounded" />
      </div>
    );
  });
};
export default AppSkeletonTableRow;
