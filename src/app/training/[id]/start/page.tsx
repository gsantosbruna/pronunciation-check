"use client";
import * as React from "react";
import { useCourseContext } from "@/shared/courses/context";
import { useMemo, useEffect, useState } from "react";
import styles from "./Start.module.css";
import PhraseCard from "@/modules/Training";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Alert, AlertTitle, Button } from "@mui/material";
import { initializeFFmpeg } from "@/modules/Training/utils/audioRecorder";

export default function StartTraining({ params }: { params: { id: string } }) {
  const { courses } = useCourseContext();

  const course = useMemo(
    () => courses.find((course) => course.id === Number(params.id)),
    [courses, params.id]
  );

  const lang = useMemo(() => {
    switch (course?.tag) {
      case "French":
        return "fr-FR";
      case "English":
        return "en-US";
      case "Spanish":
        return "es-ES";
      case "Portuguese":
        return "pt-BR";
      default:
        return null;
    }
  }, [course]);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      setShowWarning(true);
    }
  }, []);
  const handleDismiss = () => {
    setShowWarning(false);
  };

  return (
    <div className={styles.content}>
      <div>
        {showWarning && (
          <div className={styles.warning}>
            <Alert severity="warning">
              <div className={styles.warning__header}>
                <AlertTitle>Warning</AlertTitle>
                <div className={styles.warning__header__button}>
                  <Button onClick={handleDismiss} color="inherit" size="small">
                    X
                  </Button>
                </div>
              </div>
              <p>
                Apparently you are using an iOS device. <br /> It might take a
                while for each audio to load. We are sorry for the
                inconvenience.
              </p>
            </Alert>
          </div>
        )}

        <MobileStepper
          variant="dots"
          steps={course?.content.length || 0}
          elevation={3}
          sx={{ borderRadius: "3px" }}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === course!.content.length - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Previous
            </Button>
          }
        />
      </div>
      <div className={styles.content__card}>
        {course && (
          <div className={styles.container}>
            <PhraseCard
              key={`${course.content[activeStep]}-${activeStep}`}
              text={course.content[activeStep]}
              lang={lang || "en-US"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
