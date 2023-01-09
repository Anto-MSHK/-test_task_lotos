import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Layout, Menu, Row, theme } from "antd";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { CardPerson } from "./components/CardPerson";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const WS_NAME = "ws://192.168.1.67:5000";
  type dataT = {
    status: string;
    me?: string;
    startTime: string;
    reloadTime: string;
    curClient: string;
    clients: string[];
    timeValue: number;
  };

  const [data, setData] = useState<dataT>();
  const [me, setMe] = useState("");
  const [mSeconds, setMSeconds] = useState(0);
  const [timeValue, setTimeValue] = useState(0);
  const [reloadTime, setReloadTime] = useState("");
  const { sendJsonMessage, getWebSocket } = useWebSocket(WS_NAME, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => {
      console.log(JSON.parse(event.data));
      const dataForServer: dataT = JSON.parse(event.data);
      setData(dataForServer);
      setReloadTime(dataForServer.reloadTime);
      setMSeconds(
        (new Date(dataForServer.reloadTime).getTime() - new Date().getTime()) /
          1000
      );
      if (dataForServer.me) {
        setMe(dataForServer.me);
      }
      if (dataForServer.timeValue) {
        setTimeValue(dataForServer.timeValue);
      }
    },
  });

  const timer = () => {
    if ((new Date(reloadTime).getTime() - new Date().getTime()) / 1000 > 0)
      setMSeconds(
        (new Date(reloadTime).getTime() - new Date().getTime()) / 1000
      );
  };
  useEffect(() => {
    if (mSeconds < 0) {
      return;
    }
    const id = setInterval(timer, 10);
    return () => clearInterval(id);
  }, [mSeconds]);

  return (
    <Layout className="layout">
      <Header>
        <div style={{ color: "white", fontSize: 20, fontWeight: 600 }}>
          Таймер
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          {data?.clients.map((client) => (
            <CardPerson
              id={client}
              isCurClient={data.curClient === client ? true : false}
              isMe={me && me === client ? true : false}
              time={mSeconds}
              reloadTime={timeValue}
            />
          ))}
        </Row>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Тестовое задание для АО «ЛОТОС», Мащенко Антон
      </Footer>
    </Layout>
  );
};

export default App;
