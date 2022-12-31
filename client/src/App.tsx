import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, Menu, Row, theme } from "antd";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { CardPerson } from "./components/CardPerson";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const WS_NAME = "ws://192.168.1.67:5000";
  type dataT =
    | {
        status: string;
        me?: string;
        seconds: number;
        curClient: string;
        clients: string[];
        timeValue: number;
      }
    | undefined;

  const [data, setData] = useState<dataT>();
  const [me, setMe] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [reloadTime, setReloadTime] = useState(0);

  const { sendJsonMessage, getWebSocket } = useWebSocket(WS_NAME, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => {
      console.log(JSON.parse(event.data));
      const dataForServer = JSON.parse(event.data);
      setData(dataForServer);
      setSeconds(dataForServer.seconds);
      if (dataForServer.me) {
        setMe(dataForServer.me);
      }
      setReloadTime(dataForServer.timeValue);
    },
  });

  const timer = () => setSeconds((prev) => prev + 1);
  useEffect(() => {
    if (seconds < 0) {
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [seconds]);

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
              time={seconds}
              reloadTime={reloadTime}
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
