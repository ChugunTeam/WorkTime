from src.templates.registration import RegistrationRequest, LoginResponse

async def registration_user(user: RegistrationRequest) -> LoginResponse:
    return LoginResponse(token="0", type="0")