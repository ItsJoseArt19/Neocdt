import React from 'react';
import { Layout as AntdLayout, Menu, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Sider } = AntdLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  const sidebarMenu = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/cdt',
      icon: <BankOutlined />,
      label: <Link to="/cdt">Mis CDTs</Link>,
    },
  ];

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ 
          height: '32px', 
          margin: '16px', 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          NeoCDT
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={sidebarMenu}
        />
      </Sider>
      <AntdLayout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.full_name}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: '#fff',
            borderRadius: '6px'
          }}>
            {children}
          </div>
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;