import Header from "@/components/shared/Header";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { UserContext } from "@/context/UserContext";
import {
  addOptionToQuestion,
  getQuestionsWithOptions,
  saveResponse,
} from "@/services/core/TrackService";
import {
  Question,
  ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import { ROUTES } from "@/utils/route";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionFlowScreen() {
  const { itemId, itemName, entryId } = useLocalSearchParams<{
    itemId: string;
    itemName: string;
    entryId: string;
  }>();

  const router = useRouter();
  const showToast = useCustomToast();
  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { setRefreshData } = useContext(TrackContext);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ResponseOption[]>([]);

  const itemIdNum = Number(itemId);
  const entryIdNum = Number(entryId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [customOptions, setCustomOptions] = useState<Record<number, string>>(
    {}
  );

  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }

    const loadQuestionsWithOptions = async () => {
      if (!itemIdNum) return;
      const questionWithOptions = await getQuestionsWithOptions(itemIdNum);

      const questionsArray = questionWithOptions.map((qwo) => qwo.question);
      const responseOptionsArray = questionWithOptions.flatMap(
        (qwo) => qwo.options
      );

      setQuestions(questionsArray);
      setResponseOptions(responseOptionsArray);
    };
    loadQuestionsWithOptions();
  }, [itemIdNum]);

  useEffect(() => {
    if (questions.length > 0) {
      const itemQuestions = questions.filter((q) => q.item_id === itemIdNum);
      const currentQ = itemQuestions[currentIndex] || null;
      const optionsForCurrent = responseOptions.filter(
        (r) => r.question_id === currentQ?.id
      );

      setCurrentQuestion(currentQ);
      setCurrentOptions(optionsForCurrent);
    }
  }, [questions, responseOptions, currentIndex, itemIdNum]);

  // Answer setter (used by QuestionRenderer)
  const handleSetAnswer = (val: any) => {
    if (!currentQuestion || !currentQuestion.id) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion?.id]: val }));
  };

  // Custom option adder (used by QuestionRenderer for MSQ question type)
  const handleAddOption = (question_id: number, newOption: string) => {
    setCustomOptions((prev) => ({ ...prev, [question_id]: newOption }));
  };

  const submitAnswers = async (responseObj: Record<number, any>) => {
    if (!user?.id) throw new Error("Authentication ERROR");
    if (!patient?.id) throw new Error("Authentication ERROR");

    try {
      for (const [questionIdStr, answerObj] of Object.entries(responseObj)) {
        const questionId = Number(questionIdStr);

        if (answerObj === null || answerObj === undefined) {
          // Skip saving if no answer
          continue;
        }

        // Handle custom options before saving response
        for (const [customQuesIdStr, customVal] of Object.entries(
          customOptions
        )) {
          const customQuesId = Number(customQuesIdStr);

          if (JSON.stringify(answerObj).includes(customVal)) {
            logger.debug(
              `Adding new option '${customVal}' for question id: ${customQuesId}`
            );
            await addOptionToQuestion(customQuesId, customVal);
          }
        }

        await saveResponse(
          entryIdNum,
          questionId,
          answerObj,
          user.id,
          patient.id
        );
        logger.debug(`Answer saved for question ${questionId}`);
      }

      logger.debug("All answers saved successfully.");
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleNext = async () => {
    // check required
    if (
      currentQuestion &&
      currentQuestion.required &&
      (answers[currentQuestion.id] === undefined ||
        answers[currentQuestion.id] === null)
    ) {
      showToast({
        title: "Answer required",
        description: "Please answer the question before proceeding.",
      });
      return;
    }

    if (isLast) {
      // mark fully completed (ensure completed === total)
      await submitAnswers(answers);
      // setRefreshData(true);
      router.back();
      setRefreshData(true);
    } else {
      setCurrentIndex((p) => p + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title={itemName} />
    </SafeAreaView>
  );
}
