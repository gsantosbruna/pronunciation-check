"use client";
import * as React from "react";
import { useCourseContext } from "@/domains/Training/contexts/context";
import { useMemo, useEffect, useState } from "react";
import styles from "./Start.module.css";
import PhraseCard from "@/domains/Training";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Alert, AlertTitle, Button, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function StartTraining({ params }: { params: { id: string } }) {
  const { courses } = useCourseContext();

  const course = useMemo(
    () => courses.find((course) => course.id === Number(params.id)),
    [courses, params.id]
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
        contrastText: "rgba(2,1,1,0.87)",
      },
      secondary: {
        main: "#63ffb3",
      },
      divider: "rgba(187,0,0,0.12)",
    },
  });

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
        <MobileStepper
          variant="dots"
          steps={course?.content.length || 0}
          elevation={0}
          sx={{ borderRadius: "3px", bgColor: "transparent" }}
          classes={{
            root: styles.stepper,
            dotActive: styles.dotActive,
          }}
          position="static"
          activeStep={activeStep}
          backButton={null}
          nextButton={null}
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
      <div className={styles.progressButtons}>
        <ThemeProvider theme={theme}>
          <Button
            className={styles.button}
            variant="contained"
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
          <Button
            className={styles.button}
            size="small"
            variant="contained"
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
        </ThemeProvider>
      </div>
      {showWarning && (
        <div className={styles.warning}>
          <Alert severity="warning">
            <div className={styles.warning__header}>
              <AlertTitle>Warning</AlertTitle>
              <div className={styles.warning__header__button}>
                <Button onClick={handleDismiss} color="inherit" size="small">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <p>
              Apparently you are using an iOS device. <br />
              It might take a while for the training to load for the first time.
            </p>
          </Alert>
        </div>
      )}
    </div>
  );
}
