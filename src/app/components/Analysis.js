import React, { useEffect } from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Text,
  Center,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "./TranslationProvider";
import { useGPT } from "./GptProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analysis({ accuracy }) {
  const {
    totalAccuracy,
    setTotalAccuracy,
    setTotalTranslation,
    totalTranslation,
    setTotalStrings,
    totalStrings,
  } = useTranslation();
  const { temperature, model } = useGPT();

  const textColor = useColorModeValue("#333333", "#D1D5DB");

  const data = {
    // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        // label: '# of Votes',
        data: [totalAccuracy, 100 - totalAccuracy],
        backgroundColor: ["rgba(247 ,146, 41)", "rgba(0, 0, 0, 0)"],
        borderColor: ["rgba(247 ,146, 41)", "rgba(0, 0, 0, 0)"],
        borderWidth: 1,
        // borderRadius: 100
      },
    ],
  };

  useEffect(() => {
    const translations = document.getElementsByClassName("gpt-translation");
    const sourceStrings = document.getElementsByClassName("source");
    setTotalStrings(sourceStrings.length);

    setTotalTranslation(Array.from(translations).length);

    const sliders = document.getElementsByClassName("chakra-slider__thumb");
    // const ratedStrings = Array.from(sliders).map((each) => parseInt(each.getAttribute('aria-valuenow')) > 0 && each)

    const aggregatedAccuracy = Array.from(sliders).reduce(
      (accumulator, currentValue) =>
        parseInt(accumulator) +
        parseInt(currentValue.getAttribute("aria-valuenow")),
      0
    );

    setTotalAccuracy(aggregatedAccuracy / sliders.length);

    return () => {
      setTotalAccuracy(0);
    };
  }, []);

  return (
    <Box color={textColor}>
      <Center flexDirection={"column"}>
        <Doughnut data={data} />
        <Text mt={"10%"} mb={"5%"}>
          Translation accuracy
        </Text>
        <Stat mb={"20%"} alignItems={"center"} justifyContent={"center"}>
          <StatNumber fontSize={18}>
            {totalAccuracy === 0 || totalAccuracy === NaN
              ? "0"
              : parseFloat(totalAccuracy).toFixed(1)}{" "}
            %
          </StatNumber>
        </Stat>
      </Center>
      <StatGroup>
        <Stat>
          <StatLabel>Total strings</StatLabel>
          <StatNumber fontSize={18}>{totalStrings}</StatNumber>
          {/* <StatHelpText>
        <StatArrow type='increase' />
        23.36%
      </StatHelpText> */}
        </Stat>

        <Stat>
          <StatLabel>Translated string(s)</StatLabel>
          <StatNumber fontSize={18}>{totalTranslation}</StatNumber>
          {/* <StatHelpText>
        <StatArrow type='decrease' />
        9.05%
      </StatHelpText> */}
        </Stat>
      </StatGroup>{" "}
      <StatGroup>
        <Stat>
          <StatLabel>Temperature</StatLabel>
          <StatNumber fontSize={18}>{temperature}</StatNumber>
          {/* <StatHelpText>
        <StatArrow type='increase' />
        23.36%
      </StatHelpText> */}
        </Stat>

        <Stat>
          <StatLabel>Model</StatLabel>
          <StatNumber fontSize={18}>{model}</StatNumber>
          {/* <StatHelpText>
        <StatArrow type='decrease' />
        9.05%
      </StatHelpText> */}
        </Stat>
      </StatGroup>
    </Box>
  );
}
