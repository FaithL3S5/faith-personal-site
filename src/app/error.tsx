"use client";

import { PillButton } from "@/components/ui/Pill/PillButton";
import { PillLink } from "@/components/ui/Pill/PillLink";
import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";
import { serverErrorCopy } from "@/content/errors";
import { ErrorStage } from "@/features/error/ErrorStage/ErrorStage";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  return (
    <>
      <HeaderWithRuler variant="error" />
      <ErrorStage
        kind="serverError"
        copy={serverErrorCopy}
        referenceValue={error.digest ?? serverErrorCopy.referenceFallback}
        actions={
          <>
            <PillButton variant="primary" arrow="retry" stretchOnMobile onClick={retry}>
              Try again
            </PillButton>
            <PillLink href="/" variant="outline" stretchOnMobile>
              Back to home
            </PillLink>
          </>
        }
      />
    </>
  );
}
