import React from "react";
import { Path, Svg, Text } from "react-native-svg";

type StatisticComponentProps = {
  data: DataItem[];
  chartSize: number;
  emojiSize: number;
};

type DataItem = {
  number: number;
  emoji: string;
  color: string;
};

const StatisticComponent: React.FC<StatisticComponentProps> = ({
  data,
  chartSize,
  emojiSize,
}) => {
  const total = data.reduce((sum, item) => sum + item.number, 0);
  let currentAngle = -Math.PI / 2;

  const PieChartSlice: React.FC<{
    center: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    emoji: string;
  }> = ({ center, radius, startAngle, endAngle, color, emoji }) => {
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${center} ${center} Z`;

    const textX =
      center +
      (radius / 2) * Math.cos(startAngle + (endAngle - startAngle) / 2);
    const textY =
      center +
      (radius / 2) * Math.sin(startAngle + (endAngle - startAngle) / 2);

    return (
      <>
        <Path d={pathData} fill={color} />
        <Text
          x={textX}
          y={textY}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={emojiSize}
        >
          {emoji}
        </Text>
      </>
    );
  };

  return (
    <Svg width={chartSize} height={chartSize}>
      {data.map((item, index) => {
        const { number, emoji, color } = item;
        const angle = currentAngle;
        const endAngle = currentAngle + 2 * Math.PI * (number / total);
        currentAngle = endAngle;

        return (
          <PieChartSlice
            key={index}
            center={chartSize / 2}
            radius={chartSize / 2}
            startAngle={angle}
            endAngle={endAngle}
            color={color}
            emoji={emoji}
          />
        );
      })}
    </Svg>
  );
};

export default StatisticComponent;
