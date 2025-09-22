import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <Card className="login-form">
        <h1 className="login-title">Registro</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Crea tu cuenta en NeoCDT
        </p>
        
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre completo!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nombre completo"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa un nombre de usuario!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nombre de usuario"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email!' },
              { type: 'email', message: 'El email no es válido!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa una contraseña!' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor confirma tu contraseña!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmar contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;