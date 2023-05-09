# Next.js Boilerplate

This is a boilerplate for Next.js apps with following tools:
- TypeScript
- TailwindCSS
- ESLint with Prettier
- Husky hook with lint-staged
- Prisma

## Initialization

#### Clone the repository and go to the project directory

```bash
git clone git@github.com:yukio5347/nextjs-boilerplate.git YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME && git remote remove origin
```

#### Install packages

```bash
npm install
```

#### Run local server

```bash
npm run dev
```

## Configurations

### Database

#### .env

Create `.env` file and set `DATABASE_URL` variable.

```bash
cp .env.example .env
```

#### Schema

Edit `prisma/schema.prisma` to define models.

If you want to change the provider, modify `provider` property.

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Generate the prisma client

After editing the schema file, generate the prisma client.

```bash
npx prisma generate
```

#### Seeding

Edit `prisma/seed.ts` to define the seeder.

After editing the seeder file, run the db seed command.

```bash
npx prisma db seed
```
