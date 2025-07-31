import Skeleton from "./SkeletonBase";

const ActivitySkeleton = () => {
  return (
    <div className="flex items-center gap-3 rounded-md p-2">
      {/* <Skeleton className={`h-8 w-6 rounded-full p-2`}></Skeleton> */}
      <Skeleton className="flex h-9 w-full flex-col"></Skeleton>
      <Skeleton className="h-8 w-6 p-2"></Skeleton>
    </div>
  );
};
export default ActivitySkeleton;
