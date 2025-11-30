import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function GlobalMap() {
  const { t } = useTranslation("main");
  return (
    <motion.section
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <motion.h2
        className="mb-2 text-center font-bold text-3xl"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t("global_map_itle", "Global Connection, Easy and Worry-free")}
      </motion.h2>
      <motion.p
        className="mb-8 text-center text-lg text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t(
          "global_map_description",
          "Explore seamless global connectivity. Choose network services that suit your needs and stay connected anytime, anywhere."
        )}
      </motion.p>
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="aspect-video w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.4,
        }}
      >
        <DotLottieReact
          autoplay
          className="w-full scale-150"
          loop
          src="./assets/lotties/global-map.json"
        />
      </motion.div>
    </motion.section>
  );
}
