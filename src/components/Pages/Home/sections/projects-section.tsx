"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSectionLogic } from "@/hooks/useSectionLogic";
import { useSectionContent } from "@/hooks/useSectionContent";
import { useSectionItems } from "@/lib/sectionItems/use-sectionItems";

export default function ProjectsSection({ sectionId, websiteId }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const {  direction } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction1, setDirection1] = useState(0); // -1 for left, 1 for right

  const { content, isLoading: sectionLoading, error: sectionError, formatDate } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "projects",
  });

  


  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      excerpt: "Description",
      readMore: "Back Link Text",
      category: "Category",
      date: "createdAt",
      section : "section",
      color: () => "from-digitek-orange to-digitek-pink",
    },
  });

  // Validate that all required fields are non-empty
  const requiredFields = ["id", "image", "title", "excerpt", "category", "date"];
  const projects = (contentItems || []).filter((project) =>
    requiredFields.every(
      (field) => project[field] != null && project[field] !== "" && project[field] !== undefined
    )
  );




  // Ensure activeIndex is valid
  useEffect(() => {
    if (projects.length > 0 && activeIndex >= projects.length) {
      setActiveIndex(0);
    }
  }, [projects.length, activeIndex]);

  // Auto-rotate carousel
  useEffect(() => {
    if (projects.length <= 1) return; // No need to rotate if 0 or 1 project
    const timer = setInterval(() => {
      setDirection1(1);
      setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [projects.length]);

  const nextProject = () => {
    if (projects.length <= 1) return;
    setDirection1(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevProject = () => {
    if (projects.length <= 1) return;
    setDirection1(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  // Get visible projects for desktop view (3 at a time)
  const getVisibleProjects = () => {
    if (projects.length <= 3) return projects;
    const visibleProjects = [];
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % projects.length;
      visibleProjects.push(projects[index]);
    }
    return visibleProjects;
  };

  // Create a slug function
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };



  if (sectionError || itemsError) {
    return (
      <section className="relative w-full py-20" id="projects" dir={direction}>
        <div className="container text-center text-red-500">
          Error: {sectionError?.message || itemsError?.message || "Failed to load projects"}
        </div>
      </section>
    );
  }



  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  return (
    <section className="relative w-full py-20 overflow-hidden" id="projects" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30"></div>
      <div className="absolute top-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-digitek-purple blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {content.sectionLabel || "Projects"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            {content.sectionTitle || "Our Projects"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-muted-foreground text-lg"
          >
            {content.sectionDescription || "Explore our latest work"}
          </motion.p>
        </div>

        {/* Desktop view: 3-card carousel */}
        <div className="hidden md:block relative">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-3 gap-8"
              >
                {getVisibleProjects().map((project, index) => (
                  <ProjectCard
                    key={`${project.id}-${activeIndex}-${index}`}
                    project={project}
                    index={index}
                    isInView={isInView}
                    viewCaseStudyText={content.readMore || "View Case Study"}
                    custom={direction1}
                    createSlug={createSlug}
                    websiteId={websiteId}
                    sectionId={sectionId}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={prevProject}
              disabled={projects.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">{content.previousProject || "Previous Project"}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={nextProject}
              disabled={projects.length <= 1}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">{content.nextProject || "Next Project"}</span>
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-8 flex justify-center items-center gap-2">
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection1(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className="group flex flex-col items-center"
                aria-label={`Go to project ${project.id || `number ${index + 1}`}`}
              >
                <div className="relative h-1 w-8 bg-muted overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={{ width: index === activeIndex ? "100%" : "0%" }}
                    animate={{ width: index === activeIndex ? "100%" : "0%" }}
                    transition={index === activeIndex ? { duration: 5, ease: "linear" } : { duration: 0.3 }}
                  />
                </div>
                <span
                  className={`text-xs mt-1 ${
                    index === activeIndex ? "text-primary" : "text-muted-foreground"
                  } group-hover:text-primary transition-colors`}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile view: Single card carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{
                  x: direction1 > 0 ? 300 : -300,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: direction1 > 0 ? -300 : 300,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full"
              >
                <ProjectCard
                  project={projects[activeIndex]}
                  index={0}
                  isInView={isInView}
                  viewCaseStudyText={content.readMore || "View Case Study"}
                  custom={direction1}
                  createSlug={createSlug}
                  websiteId={websiteId}
                  sectionId={sectionId}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={prevProject}
              disabled={projects.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">{content.previousProject || "Previous Project"}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={nextProject}
              disabled={projects.length <= 1}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">{content.nextProject || "Next Project"}</span>
            </Button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection1(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-primary w-8" : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to project ${project.id || `number ${index + 1}`}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isInView, viewCaseStudyText, custom = 0, createSlug, sectionId, websiteId }) {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Card animation variants
  const cardVariants = {
    hidden: {
      y: custom > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.15,
      },
    },
    exit: {
      y: custom > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  // Fallback for missing project data
  if (!project) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      whileHover="hover"
      className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      {/* Animated gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${project.color || "from-digitek-orange to-digitek-pink"} opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative overflow-hidden aspect-video">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title || "Project image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${
                project.color || "from-digitek-orange to-digitek-pink"
              }`}
            >
              {project.category || "Uncategorized"}
            </span>
          </motion.div>
        </div>
      </div>

      <CardContent className="flex-grow p-6 z-10">
        <motion.h3
          className="text-xl font-bold mb-3 group-hover:text-primary transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
        >
          {project.title || "Untitled Project"}
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
        >
          {project.excerpt || "No description available"}
        </motion.p>

        {project.technologies?.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
          >
            {project.technologies.map((tech, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
        >
          <Link
            href={`/Pages/ProjectsDetailPage/${project.id}`}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            { viewCaseStudyText }
            <ArrowRight
              className={`${isRTL ? "mr-1 rotate-180" : "ml-1"} h-4 w-4 transition-transform duration-300 ${
                isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </motion.div>
      </CardContent>

      {/* Corner accent */}
      <motion.div
        className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${
          project.color || "from-digitek-orange to-digitek-pink"  
        } opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + index * 0.15, duration: 0.6, type: "spring" }}
      />
    </motion.div>
  );
}