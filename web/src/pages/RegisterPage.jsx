import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";

import { register } from "../api";

export default function RegisterPage({ onNavigate }) {
  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasValidated, setWasValidated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!event.currentTarget.checkValidity()) {
      event.stopPropagation();
      setWasValidated(true);
      return;
    }

    setWasValidated(true);
    setIsSubmitting(true);

    try {
      await register({ fio, email, password });
      onNavigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Card.Body>
          <Card.Title>Регистрация</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={wasValidated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="register-fio">
              <Form.Label>ФИО</Form.Label>
              <Form.Control
                autoComplete="name"
                onChange={(event) => setFio(event.target.value)}
                required
                type="text"
                value={fio}
              />
              <Form.Control.Feedback type="invalid">Введите ФИО</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="register-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
              <Form.Control.Feedback type="invalid">Введите корректный email</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="register-password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                minLength={8}
                value={password}
              />
              <Form.Control.Feedback type="invalid">
                Пароль должен содержать минимум 8 символов
              </Form.Control.Feedback>
            </Form.Group>

            <div className="auth-actions">
              <Button disabled={isSubmitting} type="submit">
                Зарегистрироваться
              </Button>
              <Button variant="link" onClick={() => onNavigate("/login")}>
                Вход
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
}
