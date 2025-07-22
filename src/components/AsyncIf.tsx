import React, { ReactNode, Suspense } from "react";

type Props = {
  condition: () => Promise<boolean>;
  children: ReactNode;
  loadingFallback?: ReactNode;
  otherWise?: ReactNode;
};


async function SuspendedComponent({
  condition,
  children,
  otherWise = null,
}: Omit<Props, "loadingFallback">) {
  return await condition() ? children : otherWise
}

const AsyncIf = ({
  condition,
  children,
  loadingFallback = null,
  otherWise = null,
}: Props) => {
  return (
    <Suspense fallback={loadingFallback}>
      <SuspendedComponent condition={condition} otherWise={otherWise}  >
        {children}
      </SuspendedComponent>
    </Suspense>
  );
};

export default AsyncIf;

