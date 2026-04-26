import Announcement from "../announcement";
import Content from "./content";
import MySubscribes from "./my-subscribes";

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-64px-58px-32px-114px)] w-full flex-col gap-4 overflow-hidden">
      <Announcement type="pinned" />
      <MySubscribes />
      <Content />
    </div>
  );
}
