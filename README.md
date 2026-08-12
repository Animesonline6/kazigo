# KaziGo — Frontend (Fase 1)

Marketplace de trabalho e serviços para Moçambique. Esta é a fundação **apenas de frontend** —
sem backend, sem autenticação real, sem pagamentos. Tudo usa mock data em `data/mock/`.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide React · React Hook Form + Zod (prontos a usar)

## Como correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

> Este projeto foi gerado num ambiente sem acesso à rede, por isso as dependências
> ainda não foram instaladas. Basta correr `npm install` no teu computador.

## Estrutura

- `app/` — rotas (App Router)
- `components/ui/` — componentes base reutilizáveis (Button, Input, Card, Modal, etc.)
- `components/marketplace/` — JobCard, WorkerCard, CompanyCard, RatingStars, etc.
- `components/layout/` — Navbar, Footer
- `data/mock/` — dados fictícios (trabalhos, trabalhadores, empresas, categorias)
- `types/` — interfaces TypeScript preparadas para o backend futuro
- `lib/` — utilitários (formatação de moeda, datas, classnames)

## Identidade visual

- Navy `#0B2545` · Teal `#00A99D` · Orange `#FF6A3D` (usado com moderação)
- Tipografia: Manrope (títulos) + Inter (corpo)
- Tokens completos em `tailwind.config.ts`

## Próximos passos sugeridos

1. `npm install` e correr `npm run dev` para validar tudo visualmente
2. Ajustar copy e imagens reais
3. Ligar Supabase (auth, base de dados) mantendo os `types/` já definidos
4. Integrar PaySuite / M-Pesa / e-Mola quando o backend estiver pronto
