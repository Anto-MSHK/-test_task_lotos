import React from "react";
import { Card, Progress, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
interface CardPersonI {
  id: string;
  isCurClient: boolean;
  isMe: boolean;
  time: number;
  reloadTime: number;
}
export const CardPerson: React.FC<CardPersonI> = ({
  id,
  isCurClient,
  isMe,
  time,
  reloadTime,
}) => (
  <Card title={id.split("", 8)}>
    {isMe && (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Я
      </Tag>
    )}
    {isCurClient && (
      <Progress percent={(time / reloadTime) * 100} status="active" />
    )}
    {time}
  </Card>
);
