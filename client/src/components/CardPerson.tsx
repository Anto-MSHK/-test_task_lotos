import React from "react";
import { Card, Progress, Tag } from "antd";
import { CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import styles from "./CardPerson.module.css";
interface CardPersonI {
  id: string;
  isCurClient: boolean;
  isMe: boolean;
  isNext: boolean;
  time: number;
  reloadTime: number;
}
export const CardPerson: React.FC<CardPersonI> = ({
  id,
  isCurClient,
  isMe,
  isNext,
  time,
  reloadTime,
}) => {
  return (
    <Card title={id.split("", 8)} className={styles.container}>
      {isMe && (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          className={styles.tag}
        >
          Я
        </Tag>
      )}
      {isNext && (
        <Tag icon={<ArrowRightOutlined />} color="blue" className={styles.tag}>
          Следующий
        </Tag>
      )}
      {isCurClient && (
        <div className={styles.info}>
          <Progress
            className={styles.progress}
            percent={(Math.floor(time) / reloadTime) * 100}
            status="active"
            showInfo={false}
          />
          <p className={styles.time}>
            {moment.utc(Math.floor(time) * 1000).format("mm:ss")}
          </p>
        </div>
      )}
    </Card>
  );
};
