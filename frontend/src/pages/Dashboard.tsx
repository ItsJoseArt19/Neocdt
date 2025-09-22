import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, List, Typography, Spin } from 'antd';
import { BankOutlined, DollarOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { CDTApplication } from '../types';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [cdts, setCdts] = useState<CDTApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadCDTs();
  }, []);

  const loadCDTs = async () => {
    try {
      const response = await apiService.getCDTs();
      const cdtData = response.data;
      setCdts(cdtData);
      
      // Calculate stats
      const pending = cdtData.filter((cdt: CDTApplication) => cdt.status === 'pending').length;
      const approved = cdtData.filter((cdt: CDTApplication) => cdt.status === 'approved').length;
      const totalAmount = cdtData.reduce((sum: number, cdt: CDTApplication) => sum + Number(cdt.amount), 0);
      
      setStats({
        total: cdtData.length,
        pending,
        approved,
        totalAmount
      });
    } catch (error) {
      console.error('Error loading CDTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#faad14',
      approved: '#52c41a',
      rejected: '#f5222d',
      completed: '#1890ff'
    };
    return colors[status as keyof typeof colors] || '#000';
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <Title level={2}>Bienvenido, {user?.full_name}</Title>
      
      <div className="dashboard-cards">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total CDTs"
                value={stats.total}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pendientes"
                value={stats.pending}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Aprobados"
                value={stats.approved}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Monto Total"
                value={stats.totalAmount}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card 
        title="CDTs Recientes" 
        extra={
          <Link to="/cdt/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Nuevo CDT
            </Button>
          </Link>
        }
      >
        <List
          dataSource={cdts.slice(0, 5)}
          renderItem={(cdt) => (
            <List.Item>
              <List.Item.Meta
                title={`CDT #${cdt.id}`}
                description={
                  <div>
                    <div>Monto: {formatCurrency(Number(cdt.amount))}</div>
                    <div>Plazo: {cdt.term_days} días</div>
                    <div>Tasa: {Number(cdt.interest_rate)}% anual</div>
                  </div>
                }
              />
              <div style={{ color: getStatusColor(cdt.status) }}>
                {cdt.status.toUpperCase()}
              </div>
            </List.Item>
          )}
        />
        {cdts.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/cdt">
              <Button>Ver todos los CDTs</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;