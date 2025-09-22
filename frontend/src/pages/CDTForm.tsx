import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Card, Typography, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/api';
import { CDTApplication } from '../types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CDTForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cdt, setCdt] = useState<CDTApplication | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      loadCDT(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCDT = async (cdtId: number) => {
    try {
      const response = await apiService.getCDT(cdtId);
      const cdtData = response.data;
      setCdt(cdtData);
      form.setFieldsValue({
        amount: Number(cdtData.amount),
        term_days: cdtData.term_days,
        interest_rate: Number(cdtData.interest_rate),
        notes: cdtData.notes,
        status: cdtData.status
      });
    } catch (error) {
      message.error('Error al cargar el CDT');
      navigate('/cdt');
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await apiService.updateCDT(parseInt(id), values);
        message.success('CDT actualizado exitosamente');
      } else {
        await apiService.createCDT(values);
        message.success('CDT creado exitosamente');
      }
      navigate('/cdt');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Error al guardar el CDT');
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedReturn = () => {
    const amount = form.getFieldValue('amount');
    const termDays = form.getFieldValue('term_days');
    const interestRate = form.getFieldValue('interest_rate');
    
    if (amount && termDays && interestRate) {
      const yearlyReturn = (amount * interestRate) / 100;
      const dailyReturn = yearlyReturn / 365;
      const totalReturn = dailyReturn * termDays;
      const finalAmount = amount + totalReturn;
      
      return {
        totalReturn: totalReturn.toFixed(2),
        finalAmount: finalAmount.toFixed(2)
      };
    }
    return null;
  };

  const estimatedReturn = calculateEstimatedReturn();

  return (
    <Card>
      <Title level={2}>
        {isEditing ? 'Editar CDT' : 'Crear Nuevo CDT'}
      </Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Monto"
          name="amount"
          rules={[
            { required: true, message: 'Por favor ingresa el monto!' },
            { type: 'number', min: 100000, message: 'El monto mínimo es $100,000' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Ingresa el monto"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Plazo (días)"
          name="term_days"
          rules={[
            { required: true, message: 'Por favor ingresa el plazo!' },
            { type: 'number', min: 30, message: 'El plazo mínimo es 30 días' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Ingresa el plazo en días"
            size="large"
            min={30}
            max={3650}
          />
        </Form.Item>

        <Form.Item
          label="Tasa de Interés Anual (%)"
          name="interest_rate"
          rules={[
            { required: true, message: 'Por favor ingresa la tasa de interés!' },
            { type: 'number', min: 0.1, max: 50, message: 'La tasa debe estar entre 0.1% y 50%' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Ingresa la tasa de interés"
            size="large"
            step={0.1}
            precision={2}
          />
        </Form.Item>

        {isEditing && (
          <Form.Item
            label="Estado"
            name="status"
            rules={[{ required: true, message: 'Por favor selecciona el estado!' }]}
          >
            <Select size="large" placeholder="Selecciona el estado">
              <Option value="pending">Pendiente</Option>
              <Option value="approved">Aprobado</Option>
              <Option value="rejected">Rechazado</Option>
              <Option value="completed">Completado</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Notas (Opcional)"
          name="notes"
        >
          <TextArea
            rows={4}
            placeholder="Agrega notas o comentarios sobre el CDT"
          />
        </Form.Item>

        {estimatedReturn && (
          <Card 
            size="small" 
            title="Proyección de Rendimiento" 
            style={{ marginBottom: 20, backgroundColor: '#f6ffed' }}
          >
            <p><strong>Interés estimado:</strong> ${Number(estimatedReturn.totalReturn).toLocaleString('es-CO')}</p>
            <p><strong>Monto final:</strong> ${Number(estimatedReturn.finalAmount).toLocaleString('es-CO')}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              * Cálculo estimado basado en interés simple
            </p>
          </Card>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ marginRight: 10 }}
          >
            {isEditing ? 'Actualizar CDT' : 'Crear CDT'}
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/cdt')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CDTForm;