# Edigar Barbearia

![Deploy Status](https://img.shields.io/badge/deploy-ativo-brightgreen)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Landing page profissional com sistema de agendamento completo para barbearia.

## Funcionalidades

- **Landing Page** — Design dark/luxo com apresentação de serviços
- **Agendamento Online** — Cliente escolhe serviço, data e horário
- **Status em Tempo Real** — Horários ocupados são atualizados automaticamente
- **Cancelamento** — Barbeiro (painel admin) e cliente (pelo site)
- **Confirmação** — Barbeiro confirma agendamentos pelo painel
- **Painel Admin** — Dashboard com filtros, busca, auto-refresh 30s
- **WhatsApp Integrado** — Confirmação automática via WhatsApp
- **100% Responsivo** — Funciona em desktop, tablet e mobile

## Stack

- **Frontend:** HTML, Tailwind CSS (CDN), JavaScript Vanilla
- **Backend:** Vercel Serverless Functions (Node.js)
- **Banco:** Upstash Redis (Vercel KV)
- **Deploy:** Vercel (auto-deploy no push ao `main`)

## Preview

![Preview](assets/images/hero.png)

## Estrutura do Projeto

```
├── index.html            # Landing page principal
├── agendamento.html      # Formulário de agendamento
├── admin.html            # Painel administrativo
├── css/styles.css        # Estilos customizados
├── js/
│   ├── config.js         # Configurações editáveis
│   └── main.js           # Lógica do frontend
├── api/
│   ├── availability.js   # Verificar horários disponíveis
│   ├── book.js           # Reservar horário
│   ├── admin.js          # Dados do painel admin
│   ├── confirm.js        # Confirmar agendamento
│   ├── cancel.js         # Cancelar agendamento
│   └── my-bookings.js    # Consultar reservas do cliente
├── assets/images/        # Logo, hero, favicon
├── robots.txt
├── sitemap.xml
├── vercel.json
└── package.json
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `KV_REST_API_URL` | URL do Upstash Redis (Vercel KV) |
| `KV_REST_API_TOKEN` | Token do Upstash Redis |
| `ADMIN_PASSWORD` | Senha do painel administrativo |

## Como Rodar Local

```bash
git clone https://github.com/Ruanpabloband/edigar-barbearia.git
cd edigar-barbearia
npm install
vercel dev
```

## Deploy

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. O deploy é automático a cada push no `main`

## Links

- **Site:** https://edigar-barbearia.vercel.app/
- **Agendamento:** https://edigar-barbearia.vercel.app/agendamento.html
- **Admin:** https://edigar-barbearia.vercel.app/admin.html

## Licenca

© 2025 Edigar Barbearia. Todos os direitos reservados.
