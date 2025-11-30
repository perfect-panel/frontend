import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "@tanstack/react-router";
import { HoverBorderGradient } from "@workspace/ui/components/hover-border-gradient";
import { TextGenerateEffect } from "@workspace/ui/components/text-generate-effect";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";

export function Hero() {
  const { t } = useTranslation("main");
  const { common, user } = useGlobalStore();
  const { site } = common;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-8 pt-16 sm:grid-cols-2"
      initial={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-center"
        initial={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className="my-6 font-bold text-4xl lg:text-6xl">
          {t("welcome", "Welcome to")} {site.site_name}
        </h1>
        {site.site_desc && (
          <TextGenerateEffect
            className="mb-8 max-w-xl *:text-muted-foreground"
            words={site.site_desc}
          />
        )}
        <Link to={user ? "/dashboard" : "/auth"}>
          <HoverBorderGradient
            as="button"
            className="m-0.5 flex items-center space-x-2 text-white"
            containerClassName="rounded-full"
          >
            {t("started", "Get Started")}
          </HoverBorderGradient>
        </Link>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full"
        initial={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <DotLottieReact
          autoplay
          loop
          src="./assets/lotties/network-security.json"
        />
      </motion.div>
    </motion.div>
  );
}
