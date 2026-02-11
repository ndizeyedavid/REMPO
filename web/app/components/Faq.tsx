"use client";
import { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Webhook } from "lucide-react";
import Image from "next/image";
import { BorderBeam } from "@/components/ui/border-beam";

const data = [
  {
    id: "1",
    question: "How do I start scanning my repositories?",
    answer:
      "Getting started is simple! Open REMPO and click the 'Scan' button. It will automatically discover all Git repositories on your system. You can customize the scan paths in settings if needed.",
  },
  {
    id: "2",
    question: "Does REMPO support all Git repository formats?",
    answer:
      "Yes! REMPO works with all standard Git repositories, whether they're hosted on GitHub, GitLab, Bitbucket, or self-hosted servers. Any valid Git repository will be discovered and managed.",
  },
  {
    id: "3",
    question: "Can I use REMPO offline?",
    answer:
      "Absolutely! REMPO works offline for viewing repository information and using the terminal. However, some cloud-based AI features may require an internet connection for optimal performance.",
  },
  {
    id: "4",
    question: "How does the AI summarization work?",
    answer:
      "REMPO uses advanced AI to analyze commit messages, changes, and repository activity to generate intelligent summaries. The AI learns from your repository patterns to provide increasingly accurate insights over time.",
  },
  {
    id: "5",
    question: "What themes are available?",
    answer:
      "REMPO comes with 9 beautiful, carefully designed themes ranging from light to dark modes. Each theme is optimized for different lighting conditions and personal preferences to reduce eye strain.",
  },
  {
    id: "6",
    question: "How can I access the terminal?",
    answer:
      "Press Ctrl+K to instantly open the integrated terminal at any time. The terminal is fully integrated with REMPO and respects your current repository context for faster Git operations.",
  },
  {
    id: "7",
    question: "Does REMPO store my repositories?",
    answer:
      "No, REMPO never stores your repositories in the cloud by default. It only reads and analyzes local repositories on your system. Your code stays on your machine under your full control.",
  },
  {
    id: "8",
    question: "Can I customize keyboard shortcuts?",
    answer:
      "Yes, all keyboard shortcuts are fully customizable. Go to Settings > Keyboard Shortcuts to rebind commands to your preferred keys.",
  },
  {
    id: "9",
    question: "What are the system requirements?",
    answer:
      "REMPO runs on Windows, macOS, and Linux. You'll need Git installed on your system. Minimum requirements: 2GB RAM and 500MB disk space.",
  },
  {
    id: "10",
    question: "How often does REMPO scan for changes?",
    answer:
      "REMPO provides real-time updates by default with configurable scan intervals. You can set custom scan frequencies in settings, from continuous updates to manual scans only.",
  },
  {
    id: "11",
    question: "Is there a mobile version?",
    answer:
      "Currently, REMPO is available for desktop platforms (Windows, macOS, Linux). We're exploring mobile integration for future releases.",
  },
  {
    id: "12",
    question: "How do I report bugs or suggest features?",
    answer:
      "You can report bugs and suggest features directly from REMPO's Help menu, or visit our GitHub repository. We read and respond to all feedback from the community.",
  },
];

export default function Faq() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        easeInOut,
      },
    },
  };

  return (
    <section className="relative flex w-full flex-col items-center justify-center py-5">
      <div className="container m-auto flex min-h-screen w-full flex-col items-center justify-center p-3 lg:p-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="via-primary bg-linear-to-br from-transparent to-transparent bg-clip-text pb-2 text-3xl leading-snug font-medium text-transparent sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Find quick answers to common questions about our services and
            features.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 w-full border-b pb-10"
        >
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={handleValueChange}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {data.map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-1 ${
                  openItems.includes(faq.id)
                    ? "bg-primary/20 border-primary/30 shadow-[0_0_20px_3px_rgba(244,63,94,0.15)]"
                    : "from-primary/5 hover:border-primary/30 hover:bg-linear-to-bl hover:shadow-[0_0_20px_3px_rgba(244,63,94,0.15)]"
                } h-fit rounded-md border`}
              >
                <AccordionItem
                  value={faq.id}
                  className={`bg-background group rounded-sm border! px-5 ${
                    openItems.includes(faq.id)
                      ? "border-primary/30 from-primary/10 bg-linear-to-t"
                      : "hover:border-primary/30"
                  } shadow-none! transition-all duration-700`}
                >
                  <AccordionTrigger className="group cursor-pointer hover:no-underline [&>svg]:hidden">
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`text-left text-lg font-medium ${
                          openItems.includes(faq.id)
                            ? "text-primary"
                            : "group-hover:text-primary"
                        } transition-all duration-700`}
                      >
                        {faq.question}
                      </span>
                      <div className="ml-4 shrink-0">
                        <AnimatePresence>
                          <motion.div
                            key="minus"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Webhook
                              className={`size-6 ${
                                openItems.includes(faq.id)
                                  ? "animate-spin"
                                  : "group-hover:animate-spin"
                              } text-primary`}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent
                    className={`border-t border-dashed ${
                      openItems.includes(faq.id)
                        ? "border-primary/50"
                        : "group-hover:border-primary/50"
                    } pt-4`}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="from-primary/30 via-primary/10 to-primary/5 border-primary/30 group relative m-auto mt-10 flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-tl px-8 py-12 text-center shadow-[0_0_45px_10px_hsl(var(--primary)/0.15)] transition-all duration-500 hover:shadow-[0_0_45px_10px_hsl(var(--primary)/0.2)]"
        >
          <BorderBeam
            duration={12}
            size={300}
            className="via-primary from-transparent to-transparent"
          />
          <BorderBeam
            duration={12}
            size={300}
            reverse={true}
            className="via-primary from-transparent to-transparent"
          />
          <div className="z-10">
            <h3 className="text-primary mb-3 text-3xl font-semibold md:text-4xl">
              Still have questions ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl text-base md:text-lg">
              Can&apos;t find the answer you&apos;re looking for ?{" "}
              <br className="hidden md:block" />
              Reach out to our friendly support team we&apos;re here to help.
            </p>
            <button className="from-primary to-primary/60 relative z-[1] cursor-pointer overflow-hidden rounded-md bg-linear-to-tl px-8 py-3 font-medium text-white transition-all duration-700 before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:rotate-45 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-all before:duration-700 hover:scale-110 hover:px-12 hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:before:left-[100%]">
              Get in Touch
            </button>
          </div>

          {(() => {
            const glowLines = [
              { bottom: "bottom-0", right: "right-10" },
              { bottom: "-bottom-10", right: "right-20" },
              { bottom: "-bottom-20", right: "right-30" },
              { bottom: "-bottom-30", right: "right-40" },
              { bottom: "-bottom-40", right: "right-50" },
            ];
            return (
              <div className="absolute right-0 bottom-0 flex h-full w-full items-center justify-end">
                {glowLines.map((line, index) => (
                  <div
                    key={index}
                    className={`absolute ${line.bottom} ${line.right} bg-primary/90 h-60 w-2 rounded-full transition-all duration-1000 group-hover:-translate-y-full`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
            );
          })()}
        </motion.div>
      </div>
      <div className="fixed top-0 left-0 -z-10 m-auto flex h-screen w-full items-center justify-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={400}
          height={400}
          className="opacity-5 grayscale-100"
        />
      </div>
    </section>
  );
}
