import React, { useEffect } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const WS_NAME = "ws://192.168.1.67:5000";

  const { sendJsonMessage, getWebSocket } = useWebSocket(WS_NAME, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => console.log(event),
  });

  return (
    <Layout className="layout">
      <Header>
        <div style={{ color: "white", fontSize: 20, fontWeight: 600 }}>
          Таймер
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer }}
        >
          Content
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Тестовое задание для АО «ЛОТОС», Мащенко Антон
      </Footer>
    </Layout>
  );
};

export default App;
