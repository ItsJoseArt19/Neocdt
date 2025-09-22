import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { CDTApplication } from '../types';
import moment from 'moment';

const { Title } = Typography;

const CDTList: React.FC = () => {
  const [cdts, setCdts] = useState<CDTApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCDTs();
  }, []);

  const loadCDTs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCDTs();
      setCdts(response.data);
    } catch (error) {
      message.error('Error al cargar los CDTs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteCDT(id);
      message.success('CDT eliminado exitosamente');
      loadCDTs();
    } catch (error) {
      message.error('Error al eliminar el CDT');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Pendiente' },
      approved: { color: 'green', text: 'Aprobado' },
      rejected: { color: 'red', text: 'Rechazado' },
      completed: { color: 'blue', text: 'Completado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Plazo (días)',
      dataIndex: 'term_days',
      key: 'term_days',
    },
    {
      title: 'Tasa (%)',
      dataIndex: 'interest_rate',
      key: 'interest_rate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Fecha Solicitud',
      dataIndex: 'application_date',
      key: 'application_date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Fecha Vencimiento',
      dataIndex: 'maturity_date',
      key: 'maturity_date',
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record: CDTApplication) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/cdt/edit/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este CDT?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={2}>Mis CDTs</Title>
        <Link to="/cdt/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Nuevo CDT
          </Button>
        </Link>
      </div>

      <Table
        dataSource={cdts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
        }}
      />
    </div>
  );
};

export default CDTList;