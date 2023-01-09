import React from "react";
import { Card, Progress, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
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
}) => {
  return (
    <Card title={id.split("", 8)}>
      {isMe && (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Я
        </Tag>
      )}
      {isCurClient && (
        <div>
          <Progress
            percent={(time / reloadTime) * 100}
            status="active"
            showInfo={false}
            style={{ padding: 0, margin: 0, textAlign: "center" }}
          />
          <p style={{ padding: 0, margin: 0, textAlign: "center" }}>
            {moment.utc(Math.floor(time) * 1000).format("mm:ss")}
          </p>
        </div>
      )}
    </Card>
  );
};
