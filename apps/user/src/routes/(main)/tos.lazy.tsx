import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Markdown } from "@workspace/ui/composed/markdown";
import { getCommonSiteTos as getTos } from "@workspace/ui/services/common/common";

export const Route = createLazyFileRoute("/(main)/tos")({
  component: () => {
    const { data = "" } = useQuery({
      queryKey: ["tos"],
      queryFn: async () => {
        const { data } = await getTos();
        return data.data?.tos_content;
      },
    });
    return (
      <div className="container py-8">
        <Markdown>{data}</Markdown>
      </div>
    );
  },
});
