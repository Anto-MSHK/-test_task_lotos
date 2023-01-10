import React, { useEffect, useState } from "react";
import { Layout, notification, Row, Spin, theme } from "antd";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { CardPerson } from "./components/CardPerson";
import { NotificationPlacement } from "antd/es/notification/interface";

const { Header, Content, Footer } = Layout;
const WS_NAME = `wss://${process.env.SERVER}/`;

type dataT = {
  status: "start" | "reload";
  me?: string;
  startTime: string;
  reloadTime: string;
  curClient: string;
  clients: string[];
  timeValue: number;
};

const App: React.FC = () => {
  const [data, setData] = useState<dataT>();
  const [me, setMe] = useState("");
  const [next, setNext] = useState("");
  const [mSeconds, setMSeconds] = useState(0);
  const [timeValue, setTimeValue] = useState(0);
  const [reloadTime, setReloadTime] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    message: string
  ) => {
    api.info({
      message,
      placement,
    });
  };

  const getNotifications = (newData: dataT, outdated: dataT | undefined) => {
    if (newData.status === "start")
      openNotification(
        "bottomRight",
        `Вы подключились! Ваш ID - ${newData.me?.substring(0, 8)}`
      );
    else if (newData.status === "reload") {
      if (me && me === newData.curClient)
        openNotification("bottomRight", `Ваша очередь!`);
      let retired: (string | undefined)[] | undefined = [];
      retired = outdated?.clients
        .map((client) => {
          let isExist = false;
          for (let index in newData.clients) {
            if (client === newData.clients[index]) {
              isExist = true;
            }
          }
          if (!isExist) return client;
        })
        .filter((el) => el !== undefined);
      if (retired && retired?.length > 0)
        openNotification(
          "bottomRight",
          `Вышли игроки: ${retired?.map(
            (client) => " " + client?.substring(0, 8)
          )}`
        );
    }
  };

  useWebSocket(WS_NAME, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => {
      const dataForServer: dataT = JSON.parse(event.data);
      console.log(dataForServer);

      getNotifications(dataForServer, data);

      setData(dataForServer);
      setReloadTime(dataForServer.reloadTime);
      setMSeconds(
        (new Date(dataForServer.reloadTime).getTime() - new Date().getTime()) /
          1000
      );
      if (dataForServer.me) {
        setMe(dataForServer.me);
      }

      let nextInd = dataForServer.clients.indexOf(dataForServer.curClient);
      if (nextInd + 1 < dataForServer.clients.length)
        setNext(dataForServer.clients[nextInd + 1]);
      else setNext(dataForServer.clients[0]);

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
      <Content style={{ padding: "0 50px", height: "100vh" }}>
        {contextHolder}
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          {data?.clients && data?.clients.length > 0 ? (
            data?.clients.map((client) => (
              <CardPerson
                id={client}
                key={client}
                isCurClient={data.curClient === client ? true : false}
                isMe={me && me === client ? true : false}
                isNext={client === next ? true : false}
                time={mSeconds}
                reloadTime={timeValue}
              />
            ))
          ) : (
            <Spin
              tip="Загрузка..."
              size="large"
              style={{ width: "100%", marginTop: 30 }}
            />
          )}
        </Row>
        <p style={{ textAlign: "center", fontSize: 16, padding: 10 }}>
          {" "}
          Тестовое задание для АО «ЛОТОС», Мащенко Антон{" "}
        </p>
      </Content>
    </Layout>
  );
};

export default App;
