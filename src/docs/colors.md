# Guia de Cores - Agropec App

## 🎨 Cores Disponíveis

### **App Principal (Mobile)**

Use estas cores para o app mobile principal:

```css
/* Cores base */
base-white: #FFFFFF
base-white-light: #F3F3F3
base-black: #333333
base-gray: #7E7E7E
base-gray-light: #A7ADA4

/* Tons de verde da marca */
green-100: #BDE79A
green-200: #8CC152
green-300: #3B7F44
green-400: #38761D
green-500: #053A35

/* Gradiente verde */
bg-green-gradient: linear-gradient(to right, #55D12C, #78A340)
```

**Exemplo de uso:**

```jsx
<div className="bg-base-white text-base-black">
<div className="bg-green-gradient text-white">
<div className="border-green-200">
```

### **Painel Administrativo**

Use estas cores para o painel admin (com namespace `admin-`):

```css
/* Cores primárias */
admin-primary-50: #f0fdf4
admin-primary-100: #dcfce7
admin-primary-200: #bbf7d0
admin-primary-300: #86efac
admin-primary-400: #4ade80
admin-primary-500: #22c55e
admin-primary-600: #16a34a
admin-primary-700: #15803d
admin-primary-800: #166534
admin-primary-900: #14532d
admin-primary-950: #052e16

/* Cores de status */
admin-success-50: #f0fdf4
admin-success-500: #22c55e
admin-success-600: #16a34a

admin-warning-50: #fffbeb
admin-warning-500: #f59e0b
admin-warning-600: #d97706

admin-error-50: #fef2f2
admin-error-500: #ef4444
admin-error-600: #dc2626
```

**Exemplo de uso:**

```jsx
<div className="bg-admin-primary-500 text-white">
<div className="bg-admin-success-500 text-white">
<div className="bg-admin-warning-500 text-white">
<div className="bg-admin-error-500 text-white">
```

### **Shadcn/UI Components**

Estas cores são usadas pelos componentes do shadcn/ui e devem ser mantidas:

```css
background: hsl(var(--background))
foreground: hsl(var(--foreground))
card: hsl(var(--card))
primary: hsl(var(--primary))  /* IMPORTANTE: Mantido para shadcn */
secondary: hsl(var(--secondary))
muted: hsl(var(--muted))
accent: hsl(var(--accent))
destructive: hsl(var(--destructive))
border: hsl(var(--border))
```

## 📋 Regras de Uso

### ✅ **Recomendado:**

- **App Mobile:** Use `green-*` e `base-*`
- **Painel Admin:** Use `admin-primary-*`, `admin-success-*`, `admin-warning-*`, `admin-error-*`
- **Componentes UI:** Use as cores do shadcn (background, foreground, primary, etc.)

### ❌ **Evite:**

- Misturar cores do app mobile com cores do painel admin
- Usar `primary-*` (sem admin-) no painel admin
- Usar `green-*` no painel admin (mantenha consistência)

## 🔄 Migração Necessária

**IMPORTANTE:** As páginas do painel admin precisam ser atualizadas para usar o namespace `admin-`:

```jsx
// ❌ Antes (pode causar conflito)
<div className="bg-primary-500">
<button className="btn-primary">

// ✅ Depois (específico para o contexto)
<div className="bg-admin-primary-500"> // Para painel admin
<button className="bg-admin-primary-500"> // Para painel admin
```

## 🎯 Exemplos por Contexto

### **App Mobile (src/pages/)**

```jsx
<Button className="bg-green-gradient text-white">
<Card className="bg-base-white border-green-200">
<Text className="text-base-black">
```

### **Painel Admin (src/pages/Admin/)**

```jsx
<Button className="bg-admin-primary-500 text-white">
<Card className="bg-white border-admin-primary-200">
<Alert className="bg-admin-success-50 text-admin-success-600">
```

### **Componentes Shadcn/UI**

```jsx
<Button className="bg-primary text-primary-foreground">
<Card className="bg-card text-card-foreground">
<Input className="border-border">
```

## ⚠️ Ações Necessárias

1. **Atualizar páginas do Admin** para usar `admin-*` em vez de `primary-*`
2. **Manter componentes shadcn** usando `primary` (sem namespace)
3. **Testar** se não há quebras na aplicação principal
