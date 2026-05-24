import { Button, Container } from "react-bootstrap";

function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Header({ user, onNavigate, onLogout }) {
  return (
    <header className="app-header">
      <Container className="app-header-inner">
        <button className="app-logo" type="button" onClick={() => onNavigate("/")}>
          WorkTime
        </button>

        <nav className="app-header-actions" aria-label="Авторизация">
          {!user && (
            <>
              <Button variant="outline-primary" size="sm" onClick={() => onNavigate("/login")}>
                Войти
              </Button>
              <Button variant="primary" size="sm" onClick={() => onNavigate("/register")}>
                Регистрация
              </Button>
            </>
          )}

          {user && (
            <>
              <span className="app-user-chip" title={user.fio}>
                <span className="app-user-avatar" aria-hidden="true">
                  {getInitials(user.fio)}
                </span>
                <span className="app-user-name">{user.fio}</span>
              </span>
              <Button variant="outline-secondary" size="sm" onClick={onLogout}>
                Выйти
              </Button>
            </>
          )}
        </nav>
      </Container>
    </header>
  );
}
