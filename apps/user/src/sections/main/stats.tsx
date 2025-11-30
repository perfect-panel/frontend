import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Stats() {
  const { t } = useTranslation("main");

  const list = [
    {
      name: t("users", "Users"),
      description: t("users_description", "Trusted by users worldwide"),
      icon: (
        <DotLottieReact
          autoplay
          className="size-24"
          loop
          src="./assets/lotties/users.json"
        />
      ),
    },
    {
      name: t("servers", "Servers"),
      description: t(
        "servers_description",
        "High-performance servers globally"
      ),
      icon: (
        <DotLottieReact
          autoplay
          className="size-24"
          loop
          src="./assets/lotties/servers.json"
        />
      ),
    },
    {
      name: t("locations", "Locations"),
      description: t("locations_description", "Available in multiple regions"),
      icon: (
        <DotLottieReact
          autoplay
          className="size-24"
          loop
          src="./assets/lotties/locations.json"
        />
      ),
    },
  ];
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="z-10 grid w-full grid-cols-1 divide-y-2 divide-muted rounded-lg sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0"
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {list.map((item, index) => (
        <motion.div
          className="mx-auto flex w-10/12 items-center justify-start px-4 py-4 sm:w-full sm:justify-center sm:py-6"
          initial={{ opacity: 0, scale: 0.8 }}
          key={item.name}
          transition={{ duration: 0.8, delay: index * 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="flex w-full items-center sm:w-auto">
            <div className="mr-4 flex h-20 w-20 items-center justify-center rounded-full">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
