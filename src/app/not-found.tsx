import { PillLink } from "@/components/ui/Pill/PillLink";
import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";
import { notFoundCopy } from "@/content/errors";
import { ErrorStage } from "@/features/error/ErrorStage/ErrorStage";
import { RequestedPath } from "@/features/error/RequestedPath/RequestedPath";

export default function NotFound() {
  return (
    <>
      <HeaderWithRuler variant="error" />
      <ErrorStage
        kind="notFound"
        copy={notFoundCopy}
        referenceValue={<RequestedPath />}
        actions={
          <PillLink href="/" variant="primary" arrow="back" stretchOnMobile>
            Back to home
          </PillLink>
        }
      />
    </>
  );
}
