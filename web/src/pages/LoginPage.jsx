import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";

import { login } from "../api";

export default function LoginPage({ onNavigate }) {
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
      await login(email, password);
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
          <Card.Title>Вход</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={wasValidated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-email">
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

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              <Form.Control.Feedback type="invalid">Введите пароль</Form.Control.Feedback>
            </Form.Group>

            <div className="auth-actions">
              <Button disabled={isSubmitting} type="submit">
                Войти
              </Button>
              <Button variant="link" onClick={() => onNavigate("/register")}>
                Регистрация
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
}
