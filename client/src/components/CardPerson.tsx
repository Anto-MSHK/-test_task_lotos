import React from "react";
import { Card } from "antd";

interface CardPersonI {
  id: string;
  name: string;
}
export const CardPerson: React.FC<CardPersonI> = ({ id, name }) => (
  <Card title={name} extra={name} style={{ width: 300 }}></Card>
);
