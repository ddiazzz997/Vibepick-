# 🚀 CONTRATO DE EJECUCIÓN: VIBEPICK PREMIUM (Handoff para AI Agent)

Este documento es el **único punto de verdad** para la fase final de implementación. Contiene la inteligencia estratégica ya investigada y el listado de tareas pendientes para transformar Vibepick en una plataforma SaaS de alto nivel.

---

## 🎯 VISIÓN GENERAL
Transformar la herramienta actual de generación de prompts en un ecosistema SaaS con:
1.  **Estética "QuickTok"**: Lujo tecnológico, glassmorphism, paleta Pink & Teal.
2.  **Estrategia "Neuro-Ventas"**: Prompts enriquecidos automáticamente con psicología de persuasión.
3.  **Monetización SaaS**: Sistema de créditos, paywalls y programas de afiliados.

---

## 🧠 INTELIGENCIA ESTRATÉGICA (Ya Investigada)
*   **Modelo Hook de Retención:** Trigger -> Acción -> Recompensa variable -> Inversión.
*   **Principio de Pareto (80/20):** El 80% del valor está en que el usuario *no tenga que pensar*. El prompt debe enriquecerse solo.
*   **Neuromarketing:** Los textos y el diseño deben usar disparadores emocionales, escasez y prueba social.

---

## 🛠️ FASES Y TAREAS PENDIENTES (Ejecución Inmediata)

### FASE 1: Branding y Elevación Visual (Agencia Premium)
- [ ] **Skin QuickTok:** Modificar `index.css` para implementar glassmorphism perfecto (blur, bordes micro-iluminados) y degradados Rosa/Teal.
- [ ] **Navbar Inteligente:** Implementar navegación con anclajes de scroll suave (`#features`, `#pricing`, `#success`).
- [ ] **Social Proof Real:** Crear un banner deslizante con logos de alta autoridad (Arc, Vercel, Supabase, Pinecone).
- [ ] **Carousel de Testimonios:** Implementar 6 testimonios dinámicos enfocados en resultados de IA.

### FASE 2: Monetización y Sistema de Créditos
- [ ] **Tabla de Créditos:** Configurar en Supabase la tabla `user_credits` y vincularla al UUID del usuario.
- [ ] **Lógica de Consumo:** Cada generación de prompt o consulta a "Daniel AI" debe restar créditos (0.5 o 1).
- [ ] **Paywall Modal:** Terminar `PaywallModal.tsx` para que aparezca automáticamente cuando los créditos lleguen a cero.
- [ ] **Pricing Section:** Crear la sección de precios con los tres tiers definidos ($0 / $9 / $29) y anclaje psicológico.

### FASE 3: Retención y Gamificación
- [ ] **Onboarding Progress:** Barra de progreso visual (0-100%) que rastree si el usuario subió logo, testimonios y generó su primer sitio.
- [ ] **Badges/Logros:** Sistema de recompensas visuales por hitos alcanzados.
- [ ] **CAPTCHA Invisible:** Integrar *Cloudflare Turnstile* en el flujo de registro (`AuthModal.tsx`).
- [ ] **Email Automation:** Integrar Resend o Brevo para disparar emails de re-enganche en el Día 1, 3 y 7.

### FASE 4: Programa de Afiliados y Estrategia de Cierre
- [ ] **Panel de Afiliado:** Sección donde el usuario pueda ver su link único y sus referidos.
- [ ] **Integración con Pagos:** Conectar con Lemon Squeezy o Stripe para el manejo de suscripciones recurrentes.
- [ ] **Admin Dashboard:** Panel de métricas para el dueño que muestre: Churn rate, LTV (Life Time Value) y usuarios activos.

---

## 📋 NOTAS TÉCNICAS PARA EL AGENTE
- **Stack:** Vite, React, Tailwind, Supabase, Lucide Icons.
- **Componentes Críticos:** `SectionBuilder.tsx` (Builder principal), `generatePrompt.ts` (Lógica de IA), `App.tsx` (Estructura de la landing).
- **Consigna:** Mantener el código limpio, seco (DRY) y priorizar SIEMPRE el impacto visual premium sobre la simplicidad.

---
**Ultima Actualización:** Abril 2026
**Estado:** Listo para Construcción (Builder Mode)
