import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Markdown } from "@workspace/ui/composed/markdown";
import { getCommonSitePrivacy as getPrivacyPolicy } from "@workspace/ui/services/common/common";

export const Route = createLazyFileRoute("/(main)/privacy-policy")({
  component: () => {
    const { data = "" } = useQuery({
      queryKey: ["tos"],
      queryFn: async () => {
        const { data } = await getPrivacyPolicy();
        return data.data?.privacy_policy;
      },
    });
    return (
      <div className="container py-8">
        <Markdown>{data}</Markdown>
      </div>
    );
  },
});
