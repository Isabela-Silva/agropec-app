# Integração com API

## Configuração

Para configurar a integração com a API, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# PWA Configuration
VITE_PWA_NAME=AgroPec
VITE_PWA_SHORT_NAME=AgroPec
VITE_PWA_DESCRIPTION=Aplicativo oficial da AgroPec
```

## Autenticação

### Login de Usuário

- **Endpoint**: `POST /users/login`
- **Credenciais**: email e password
- **Token**: Salvo em `localStorage` como `auth_token`

### Login de Administrador

- **Endpoint**: `POST /admin/login`
- **Credenciais**: email e password
- **Token**: Salvo em `localStorage` como `admin_token`

### Logout

- **Tipo**: Apenas local (não há endpoint na API)
- **Ação**: Remove tokens e dados do localStorage
- **Redirecionamento**: Para tela de login apropriada

## Interceptors

### Request Interceptor

- Adiciona automaticamente o token de autenticação no header `Authorization`
- Prioriza o token de admin se ambos existirem

### Response Interceptor

- Trata erros 401 (não autorizado)
- Remove tokens expirados do localStorage
- Redireciona para login apropriado

## Serviços

### AuthService

- `signIn(credentials)`: Login de usuário
- `signUp(userData)`: Cadastro de usuário
- `adminSignIn(credentials)`: Login de administrador
- `adminSignUp(adminData)`: Cadastro de administrador
- `signOut()`: Remove tokens locais (logout local)

## Hooks

### useAdminAuth

- Gerencia estado de autenticação administrativa
- Fornece métodos `login` e `logout`
- Trata erros e exibe toasts
- Redireciona automaticamente

### useUserAuth

- Gerencia estado de autenticação de usuário
- Funcionalidades similares ao useAdminAuth

## Contextos

### AdminAuthContext

- Fornece estado global para autenticação administrativa
- Persiste dados no localStorage
- Recupera estado ao inicializar

### UserAuthContext

- Fornece estado global para autenticação de usuário
- Funcionalidades similares ao AdminAuthContext

## Tratamento de Erros

- Erros de API são capturados e exibidos via toast
- Tokens expirados são removidos automaticamente
- Redirecionamento automático para login
- Logs de erro no console para debugging

## Segurança

- Tokens são armazenados no localStorage
- Interceptors garantem envio automático de tokens
- Limpeza automática de tokens expirados
- Separação entre tokens de usuário e admin
- Logout local sem dependência de endpoint da API

## Endpoints Disponíveis

### Autenticação

- `POST /users/login` - Login de usuário
- `POST /users/signup` - Cadastro de usuário
- `POST /admin/login` - Login de administrador
- `POST /admin/signup` - Cadastro de administrador

### Outros endpoints

- Consulte a documentação completa da API para ver todos os endpoints disponíveis
