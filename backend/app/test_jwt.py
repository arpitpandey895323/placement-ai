from app.core.security import create_access_token

token = create_access_token(
    {"sub": "arpit@gmail.com"}
)

print(token)