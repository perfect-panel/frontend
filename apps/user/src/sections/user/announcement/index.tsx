"use client";

import { useQuery } from "@tanstack/react-query";
import { Timeline } from "@workspace/ui/components/timeline";
import Empty from "@workspace/ui/composed/empty";
import { Markdown } from "@workspace/ui/composed/markdown";
import { queryAnnouncement } from "@workspace/ui/services/user/announcement";

export default function Announcement() {
  const { data } = useQuery({
    queryKey: ["queryAnnouncement"],
    queryFn: async () => {
      const { data } = await queryAnnouncement({
        page: 1,
        size: 99,
      });
      return data.data?.announcements || [];
    },
  });
  return data && data.length > 0 ? (
    <Timeline
      data={
        data.map((item) => ({
          title: item.title,
          content: <Markdown>{item.content}</Markdown>,
        })) || []
      }
    />
  ) : (
    <Empty border />
  );
}
