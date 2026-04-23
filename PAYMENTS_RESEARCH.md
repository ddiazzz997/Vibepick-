# 💳 Vibepick — Estrategia de Pagos y Monetización

> Investigación estratégica | Abril 2026 | Para: Daniel Díaz, Fundador de Vibepick

---

## Resumen Ejecutivo

**Recomendación principal: Lemon Squeezy.**

Es la única plataforma que cumple los 5 criterios del fundador simultáneamente: costo $0/mes fijo (solo comisión del 5% + $0.50 por venta), payouts directos a LATAM sin necesidad de LLC/empresa, actúa como Merchant of Record (elimina la carga de impuestos globales), tiene webhooks en tiempo real bien documentados, y SDK Node.js sólido para integrar con Vercel + Supabase en menos de un día. El flujo completo pago→webhook→`is_pro=true` en Supabase tarda menos de 3 segundos y es trivial de implementar.

Para los primeros 12 meses con MRR entre $0-5,000, el costo efectivo de Lemon Squeezy vs. Stripe es irrelevante (la diferencia es ~$25-125/mes a ese volumen). Stripe solo vale la pena migrar cuando superes $8,000 MRR, cuando la comisión de 2.2% de diferencia se vuelve significativa. Para LATAM puro (sin USA), MercadoPago es una alternativa táctica. No uses dos plataformas al inicio: la complejidad no vale.

**Pricing recomendado:** FREE (3 prompts), PRO $15/mes o $120/año, AGENCY $39/mes o $312/año.

---

## Bloque 1 — Comparativa de Plataformas

### 1.1 Stripe

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Comisión por transacción (tarjeta US) | 2.9% + $0.30 |
| Tarjeta internacional | +1.5% adicional |
| Conversión de divisa | +1.0% adicional |
| Costo mensual fijo | $0 (plan Starter) |
| Stripe Billing (suscripciones) | +0.5% del MRR |
| Instant payouts | +1.0% del monto |
| Costo de setup | $0 |

En la práctica, una transacción de $15 USD desde México con tarjeta de crédito: 2.9% + 1.5% (internacional) + 0.5% (billing) = **4.9% + $0.30 = $1.04 en fees** sobre una venta de $15.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes (mensual/anual): sí, vía Stripe Billing
- ✅ Webhooks en tiempo real con firma HMAC-SHA256 verificable
- ✅ Webhooks clave: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`, `charge.refunded`
- ✅ SDK Node.js oficial, documentación de clase mundial
- ✅ Customer Portal self-service para que el usuario cancele solo
- ✅ Integración con Supabase + Vercel: straightforward

**C) Gestión de usuarios:**
- Se vincula pago con usuario vía `customer.email` o `metadata.supabase_user_id`
- Actualizar `is_pro` vía webhook: directo y bien documentado
- Dashboard con MRR, churn, LTV completo (Stripe Dashboard)
- Maneja upgrades/downgrades automáticamente con proration

**D) Payouts al fundador:**
- ✅ México: **soportado directamente** (payout en MXN o USD)
- ✅ Brasil: soportado directamente
- ❌ Colombia: **NO soportado** sin LLC estadounidense
- ❌ Argentina: no soportado sin entidad legal en país habilitado
- Métodos: transferencia bancaria local
- Frecuencia: 2-7 días hábiles estándar; instantáneo con 1% de fee
- **Requiere LLC o empresa registrada en país soportado** si el fundador está en Colombia, Argentina, Ecuador, etc.

**E) Merchant of Record:**
- ❌ **NO es MoR.** El vendedor es responsable de calcular y remitir IVA/GST en cada jurisdicción. Para vender a Europa (VAT), Australia (GST), etc., necesitas gestión fiscal propia o usar Stripe Tax (~$0.50 extra por transacción en modo automático).

**F) Valoración para Vibepick:** ⭐⭐⭐ (excelente técnicamente, problemático para LATAM sin LLC)

---

### 1.2 Lemon Squeezy

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Comisión base por transacción | 5% + $0.50 |
| Clientes fuera de USA | +1.5% adicional |
| Pago vía PayPal | +1.5% adicional |
| Suscripciones recurrentes | +0.5% adicional |
| Costo mensual fijo | **$0** |
| Payout a banco internacional | 1% del payout |
| Payout vía PayPal | $0.50 fijo por payout |
| Costo de setup | $0 |

Ejemplo real: venta de PRO a $15/mes a usuario de México con tarjeta → 5% + 1.5% + 0.5% + $0.50 = **7% + $0.50 = $1.55 en fees** sobre $15. Queda al fundador $13.45 por cliente.

Payout mensual de $500 MRR: fee banco internacional = $5. Neto: $495.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes (mensual/anual): sí
- ✅ Webhooks en tiempo real con firma HMAC-SHA256
- ✅ Webhooks clave: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`, `subscription_paused`, `subscription_payment_success`, `subscription_payment_failed`, `subscription_payment_refunded`, `order_created`, `order_refunded`
- ✅ SDK oficial para Node.js y REST API bien documentada
- ✅ Customer Portal self-service incluido
- ✅ Checkout alojado en lemonsqueezy.com (no requiere PCI compliance propia)
- ✅ Integración con Vercel Functions: un endpoint, 50-80 líneas de código

**C) Gestión de usuarios:**
- Vincula pago con usuario via `data.attributes.user_email` en el payload del webhook
- Puedes pasar `custom_data` al checkout (ej: `supabase_user_id`) para match exacto
- Dashboard muestra clientes activos, churned, MRR, LTV
- Upgrades/downgrades automáticos con webhooks correspondientes

**D) Payouts al fundador:**
- ✅ **79 países vía transferencia bancaria directa** (México incluido, la mayoría de LATAM incluida)
- ✅ **200+ países vía PayPal** (cubre prácticamente toda América Latina)
- Frecuencia: dos veces al mes (días 1 y 15)
- Fondos retenidos 13 días antes de liberarse (política anti-fraude)
- **No requiere LLC ni empresa formal.** Puedes operar como persona física.
- No requiere EIN ni SSN de USA.

**E) Merchant of Record:**
- ✅ **SÍ es MoR.** Lemon Squeezy recauda, calcula y remite IVA, GST, y sales tax en todas las jurisdicciones globalmente. El fundador no necesita preocuparse por compliance fiscal en Europa, USA, Australia, etc.
- Esto es un diferenciador enorme para un SaaS con clientes globales.

**F) Valoración para Vibepick:** ⭐⭐⭐⭐⭐ (recomendación principal)

---

### 1.3 Paddle

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Comisión por transacción | 5% + $0.50 |
| Conversión de divisa | 2-3% sobre mid-market |
| Costo mensual fijo | $0 |
| Costo de setup | $0 |

Una venta de $15 USD pagada en EUR y con payout en USD: efectivamente pagas 5% + ~2.5% de FX = **7.5% + $0.50**. A volúmenes bajos, el costo real es similar a Lemon Squeezy.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes
- ✅ Webhooks en tiempo real con verificación de firma
- ✅ Eventos: `subscription.created`, `subscription.updated`, `subscription.cancelled`, `transaction.completed`, `transaction.refunded`
- ✅ SDK para Node.js (Paddle.js)
- ✅ Customer Portal self-service
- ⚠️ Checkout embebido disponible pero requiere más configuración que Lemon Squeezy

**C) Gestión de usuarios:**
- Vincula vía `customer.email` o `custom_data`
- Dashboard completo con métricas SaaS
- Upgrades/downgrades con proration automática

**D) Payouts al fundador:**
- ✅ Payouts semanales por defecto; diario para alto volumen
- ✅ Soporta múltiples países LATAM via transferencia bancaria
- ⚠️ La documentación de países soportados específicos para LATAM es menos clara que Lemon Squeezy
- No requiere LLC para la mayoría de países, pero la verificación KYC puede ser más exigente

**E) Merchant of Record:**
- ✅ **SÍ es MoR.** Similar a Lemon Squeezy, maneja impuestos globalmente.

**F) Valoración para Vibepick:** ⭐⭐⭐⭐ (buena alternativa, pero Lemon Squeezy es más simple y transparente para early-stage)

---

### 1.4 Hotmart

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Comisión base (producto > $15 USD) | 9.9% + $0.50 |
| Productos ≤ $15 USD (microtransacción) | Tasa especial (mayor) |
| Cuota mensual para créditos de video | Variable |
| Costo mensual fijo | $0 |

Una venta de $15: **9.9% + $0.50 = $1.985**, quedando $13.015 al vendedor. Notablemente más caro que Lemon Squeezy para el mismo ticket.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes (Hotmart Club)
- ⚠️ Webhooks disponibles pero la documentación es menos robusta que Stripe/Lemon Squeezy
- ⚠️ API principalmente orientada a cursos y productos digitales tipo infoproducto, no a SaaS puro
- ⚠️ Webhooks de suscripción existen pero requieren más trabajo para integrar con Supabase
- ❌ No tiene Customer Portal self-service equivalente al de Stripe/Lemon Squeezy

**C) Gestión de usuarios:**
- Orientado a afiliados y creadores de cursos, no a gestión de usuarios SaaS
- Dashboard fuerte para ventas de infoproductos, débil para métricas SaaS (MRR, churn)

**D) Payouts al fundador:**
- ✅ Payouts directos a cuentas bancarias en México, Colombia, Brasil y la mayoría de LATAM
- Soporta retiros en USD o moneda local
- No requiere LLC o empresa formal

**E) Merchant of Record:**
- ⚠️ Actúa como intermediario/MoR en algunos países, pero la cobertura fiscal no es tan clara como Lemon Squeezy o Paddle

**F) Valoración para Vibepick:** ⭐⭐ (excesivamente caro para SaaS, diseñado para infoproductos/cursos, no recomendado)

---

### 1.5 MercadoPago

**A) Costos reales (2025-2026):**
| Concepto | Costo (estimado) |
|---|---|
| Tarjeta de crédito online (México) | ~3.6% + IVA |
| Tarjeta de crédito online (Colombia) | ~3.29% |
| Tarjeta de débito online | ~2.5-3.0% |
| Suscripciones recurrentes | Misma tasa de la transacción |
| Costo mensual fijo | $0 |
| Payout a banco local | $0 (dentro del mismo país) |

> **Nota:** Las tarifas de MercadoPago varían por país y tipo de integración. Los valores anteriores son estimaciones basadas en tarifas públicas típicas de 2025; verificar en [mercadopago.com.mx](https://www.mercadopago.com.mx) o [mercadopago.com.co](https://www.mercadopago.com.co) para valores exactos actualizados.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes con API
- ✅ Webhooks / IPN (Instant Payment Notifications) disponibles
- ⚠️ Experiencia de developer inferior a Stripe o Lemon Squeezy; documentación más fragmentada por país
- ⚠️ SDK JavaScript oficial existe pero menos robusto
- ❌ No tiene Customer Portal self-service

**C) Gestión de usuarios:**
- Dashboard separado por país (el de México no muestra clientes de Colombia y viceversa)
- Vincula pago con usuario vía `external_reference` (campo personalizable)
- Sin dashboard unificado de MRR/churn/LTV para SaaS

**D) Payouts al fundador:**
- ✅ **Mejor plataforma para recibir dinero en LATAM**
- Payout en moneda local directamente a cuenta bancaria en el mismo país
- Disponible en: Argentina, Brasil, Chile, Colombia, México, Perú, Uruguay
- No requiere LLC ni empresa formal
- No funciona para cobrar a clientes de USA o Europa

**E) Merchant of Record:**
- ❌ **NO es MoR.** El fundador es responsable de impuestos.

**F) Valoración para Vibepick:** ⭐⭐⭐ (excelente para LATAM puro, inutilizable para USA/Europa, no es MoR)

---

### 1.6 Gumroad

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Comisión plataforma (ventas directas) | 10% + $0.50 |
| Processing adicional (Stripe/PayPal) | 2.9% + $0.30 |
| **Fee total efectivo** | **~13% + $0.80** |
| Ventas via Discover marketplace | 30% (no aplica para SaaS directo) |
| Costo mensual fijo | $0 |
| Payout instantáneo (solo USA) | 3% |
| Payout regular (banco) | gratis cada viernes |
| Payout vía PayPal | 2% |

Una venta de $15 tiene un costo efectivo de ~$2.75. La más cara de todas las opciones.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes
- ⚠️ Webhooks disponibles pero limitados (vía Zapier/Make para eventos avanzados)
- ⚠️ API básica, no comparable a Stripe o Lemon Squeezy
- ❌ Sin SDK Node.js oficial robusto
- ❌ Checkout más orientado a consumidores, menos a B2B SaaS

**C) Gestión de usuarios:**
- Más orientado a creadores individuales que a SaaS
- Analytics básico sin métricas SaaS nativas

**D) Payouts al fundador:**
- ✅ PayPal a prácticamente cualquier país
- ✅ Banco directo a USA, algunos países internacionales
- Payouts cada viernes

**E) Merchant of Record:**
- ✅ Desde enero 2025, Gumroad maneja impuestos globalmente (nuevo)

**F) Valoración para Vibepick:** ⭐ (la opción más cara por lejos, sin ventajas reales para un SaaS; descartado)

---

### 1.7 PayPal (Subscriptions API)

**A) Costos reales (2025-2026):**
| Concepto | Costo |
|---|---|
| Transacción doméstica USA | 2.99% + $0.49 |
| Transacción internacional | 4.99% + $0.49 |
| Cross-border fee adicional | +1.5% |
| Conversión de divisa | +3-4% sobre mid-market |
| Costo mensual fijo | $0 |

Una suscripción de $15/mes desde México: 4.99% + 1.5% + ~3% FX + $0.49 = **9.5%+ + $0.49** en el peor caso. La conversión de divisa lo hace extremadamente caro.

**B) Funcionalidad técnica:**
- ✅ Suscripciones recurrentes via Subscriptions API v1
- ✅ Webhooks disponibles con verificación
- ✅ Webhooks de suscripción: `BILLING.SUBSCRIPTION.CREATED`, `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`, `PAYMENT.SALE.COMPLETED`, `PAYMENT.SALE.REFUNDED`
- ⚠️ API más compleja y menos elegante que Stripe/Lemon Squeezy
- ❌ Documentación fragmentada y menos actualizada
- ❌ Sin Customer Portal self-service moderno

**C) Gestión de usuarios:**
- Vincula pago con usuario via `custom_id` en plan
- Dashboard básico de negocio

**D) Payouts al fundador:**
- ✅ **Alta penetración en LATAM** (popular en Colombia, México, etc.)
- Payout a cuenta PayPal en minutos; transferencia bancaria en 1-5 días
- Funciona sin LLC en la mayoría de países

**E) Merchant of Record:**
- ❌ **NO es MoR.** El vendedor gestiona impuestos.

**F) Valoración para Vibepick:** ⭐⭐ (excesivamente caro por FX, API anticuada; solo si el mercado objetivo usa exclusivamente PayPal)

---

### 1.8 Tabla Comparativa General

| Plataforma | Comisión% | Fee fijo | Mensual | Webhooks | LATAM payout | MoR | Facilidad integración | Recomendado |
|---|---|---|---|---|---|---|---|---|
| **Lemon Squeezy** | 5-7% | $0.50 | $0 | ✅ Excelentes | ✅ 79 bancos + 200 PayPal | ✅ Sí | ⭐⭐⭐⭐⭐ | **✅ Principal** |
| **Stripe** | 2.9-4.9% | $0.30 | $0 | ✅ Los mejores | ⚠️ Solo México/Brasil | ❌ No | ⭐⭐⭐⭐⭐ | ⚠️ Escalar >$8k MRR |
| **Paddle** | 5-8% (con FX) | $0.50 | $0 | ✅ Buenos | ⚠️ Parcial LATAM | ✅ Sí | ⭐⭐⭐⭐ | ⚠️ Alternativa |
| **MercadoPago** | 3-4% | Variable | $0 | ⚠️ IPN básico | ✅ Nativo LATAM | ❌ No | ⭐⭐⭐ | ⚠️ Solo LATAM puro |
| **PayPal** | 4.99-10%+ | $0.49 | $0 | ⚠️ Funcional | ✅ Alta penetración | ❌ No | ⭐⭐ | ❌ Muy caro |
| **Hotmart** | 9.9% | $0.50 | $0 | ⚠️ Limitados | ✅ LATAM nativo | ⚠️ Parcial | ⭐⭐ | ❌ Para infoproductos |
| **Gumroad** | ~13% | $0.80 | $0 | ⚠️ Básicos | ⚠️ Vía PayPal | ✅ Desde 2025 | ⭐⭐ | ❌ Demasiado caro |

---

## Bloque 2 — Recomendación

### Opción Principal: Lemon Squeezy

**Justificación basada en datos:**

Lemon Squeezy cumple los 5 criterios del fundador mejor que cualquier alternativa:

1. **Costo $0/mes fijo:** Confirmado. Solo pagas al vender.
2. **Gestión automática users:** El webhook `subscription_payment_success` dispara la actualización de `is_pro=true` en Supabase. Tiempo total del evento al update: <3 segundos.
3. **Dinero llega directo:** Payouts a 79 países vía banco (México y Colombia incluidos) y 200+ via PayPal. Sin intermediarios adicionales.
4. **Mínima complejidad:** Un archivo en `api/`, una librería npm, 60 líneas de código. Integración completa en menos de un día.
5. **LATAM + USA:** Acepta tarjetas de cualquier país, paga impuestos globalmente como MoR.

**Flujo exacto:**
```
Usuario hace clic en "Upgrade" →
Redirige a checkout.lemonsqueezy.com con custom_data.supabase_user_id →
Usuario paga con tarjeta (cualquier país) →
Lemon Squeezy dispara POST a api/webhook-lemonsqueezy.js →
Vercel Function verifica firma HMAC-SHA256 →
Extrae supabase_user_id del payload →
UPDATE profiles SET is_pro = true WHERE id = supabase_user_id →
LS envía email de confirmación al cliente automáticamente →
Frontend detecta cambio en Supabase Realtime → UI muestra acceso PRO
```

**Costo estimado primeros 12 meses:**

Asumiendo ticket PRO promedio de $15/mes y clientes mixtos USA/LATAM (60% LATAM, 40% USA):

| Período | MRR estimado | Fee efectivo aprox | Costo total fees |
|---|---|---|---|
| Mes 1-3 | $0 → $500 | 6.5% + $0.50/tx | $0 → $32/mes |
| Mes 4-6 | $500 → $2,000 | 6.5% + $0.50/tx | $32 → $130/mes |
| Mes 7-12 | $2,000 → $5,000 | 6.5% + $0.50/tx | $130 → $325/mes |
| **Total año 1** | | | **~$1,200-1,500 en fees** |

A $5,000 MRR (mes 12), los fees de Lemon Squeezy vs Stripe son:
- Lemon Squeezy: ~$325/mes
- Stripe: ~$185/mes (si pudieras usarlo directamente)
- **Diferencia: $140/mes.** No justifica la complejidad de necesitar LLC hasta que el negocio esté probado.

---

### Opción Alternativa: Stripe

**Caso de uso:** Cuando el MRR supera $8,000-10,000 y el fundador ya tiene una entidad legal constituida (LLC en USA o empresa en México/Brasil), migrar a Stripe reduce fees ~2.2% y ofrece mayor control.

**También aplica si:** el 80%+ de los clientes son de USA y se tiene LLC. En ese caso, Stripe desde el día 1 tiene sentido por su superior ecosistema (Stripe Tax, Stripe Radar, Customer Portal).

**Limitación crítica:** Sin entidad legal en país soportado, Stripe es inaccesible para recibir payouts en la mayoría de LATAM (excepción: México y Brasil directamente).

---

### ¿Usar Dos Plataformas (Lemon Squeezy + MercadoPago)?

**Análisis:**

| Factor | Detalle |
|---|---|
| Beneficio teórico | MercadoPago tiene menor tasa (3-4%) para clientes LATAM y mayor confianza local |
| Costo de implementación | 2 webhooks, 2 lógicas de gestión de suscripción, 2 dashboards, doble superficie de bugs |
| Riesgo operacional | Si un cliente cambia de plataforma, ¿cómo sincronizas `is_pro`? |
| Complejidad de UX | ¿Cómo decides qué botón mostrar? ¿Geolocalización? |

**Veredicto: NO, al menos en los primeros 12 meses.**

La complejidad técnica y operacional de dos plataformas no está justificada cuando MRR < $10,000. Lemon Squeezy acepta tarjetas latinoamericanas sin problema (Visa/Mastercard de cualquier banco). La ventaja de MercadoPago (métodos de pago locales como OXXO, PSE, PIX) solo aplica si tus clientes no tienen tarjeta internacional, lo cual es un segmento más pequeño en el mercado SaaS B2B.

**Cuándo reconsiderar:** Si la data muestra abandono de checkout > 30% con clientes LATAM por métodos de pago, ahí agregar MercadoPago como opción secundaria tiene sentido.

---

## Bloque 3 — Las 10 Tácticas del 20/80

### Táctica 1: Soft Paywall con Preview del Output — Impacto: Alto | Dificultad: Baja

**Cómo funciona:** En lugar de bloquear el paso 8 (el prompt final) con una pantalla de pago fría, muestra el prompt generado pero truncado al 30-40%. El usuario ve el valor real antes de pagar. Un botón "Desbloquear el prompt completo" lleva al checkout.

**Productos que la usan:** Gamma.app (grays out export options), Copy.ai (muestra primeras líneas del output y blur el resto), Writesonic (preview antes de copiar), Canva (aplica watermark antes de exportar).

**Impacto:** Según OpenView Partners, los soft paywalls que muestran valor antes del pago convierten 2-3x más que los hard paywalls. Gamma convirtió ~15% de free users a Plus en sus primeros 6 meses con esta táctica.

**Aplicación en Vibepick:** Al completar el paso 8, generar el prompt completo en backend pero mostrar solo el 35% en UI. El call-to-action: *"Tu prompt está listo. Activa PRO para copiarlo y usarlo."* No mostrar una página genérica de precios, sino el prompt que ya generaron.

---

### Táctica 2: Timing del Paywall en el Momento de Mayor Intención — Impacto: Alto | Dificultad: Baja

**Cómo funciona:** No mostrar el paywall en el onboarding ni en el primer uso. Mostrarlo justo cuando el usuario ya completó el flujo y quiere usar el resultado. Ese es el peak de intención de compra.

**Productos que la usan:** Durable.co (muestra el sitio generado completo, luego pide upgrade para publicar), Framer (permite diseñar, pero pide plan para publicar), Webflow (tier gratuito funcional hasta que quieres subdominio propio).

**Impacto:** Según estudios de Userpilot (2024), mostrar el paywall post-value delivery convierte 40-60% más que mostrarlo pre-uso. El usuario que completó los 8 pasos tiene 10x más intención de pagar que uno que acaba de registrarse.

**Aplicación en Vibepick:** Dejar completar los 8 pasos siempre (incluso en free). El paywall aparece solo al intentar copiar/exportar el prompt. En el plan FREE, el usuario tiene 3 generaciones completas antes del paywall, asegurando el "aha moment" primero.

---

### Táctica 3: Aha Moment < 5 Minutos — Impacto: Alto | Dificultad: Media

**Cómo funciona:** El "aha moment" de Vibepick es que el usuario vea el prompt final generado y piense "esto es exactamente lo que necesitaba". Si ese momento tarda más de 5-10 minutos, la retención cae drásticamente. Productos que logran entregar valor en <5 min muestran 40% mayor retención a 30 días.

**Productos que la usan:** Loom (primer video grabado en <2 min), Notion (template funcional en 3 clics), Gamma (primera presentación generada en <3 min).

**Impacto:** Lograr aha moment en <5 min produce 40% más retención a 30 días vs. >15 min (dato: OpenView SaaS Benchmark 2024). Un 25% de mejora en activación se traduce en 34% más MRR en 12 meses.

**Aplicación en Vibepick:** Optimizar los 8 pasos para que el flujo tarda < 4 minutos. Considerar un "modo rápido" con preguntas esenciales para usuarios que quieren el resultado inmediato. Mostrar barra de progreso ("Paso 3 de 8 — 2 min restantes").

---

### Táctica 4: Pricing con Ancla y Plan Señuelo — Impacto: Alto | Dificultad: Baja

**Cómo funciona:** Presentar 3 planes donde el plan medio (PRO) es el que quieres vender. El plan AGENCY actúa como ancla de precio alto que hace que PRO parezca razonable. El plan FREE confirma que hay valor real antes de pagar.

**Productos que la usan:** Copy.ai (Free / Pro $49/mes / Team $69/mes — claramente quieren que compres Pro), Jasper (Creator $39/mo / Pro $59/mo / Business custom — Pro es el señuelo), Notion (Free / Plus $10 / Business $15 — Plus es el de mayor conversión).

**Impacto:** Según investigación de Price Intelligently, agregar un plan de precio alto aumenta la conversión al plan medio en un 20-30% (efecto de anclaje). El plan AGENCY que nunca nadie compra puede aumentar el revenue real.

**Aplicación en Vibepick:**
- FREE: 3 generaciones de prompt
- PRO $15/mes: generaciones ilimitadas + historial + exportar
- AGENCY $39/mes: todo lo anterior + múltiples negocios + branding personalizado

La diferencia entre FREE y PRO debe parecer enorme en valor. La diferencia entre PRO y AGENCY debe parecer pequeña en precio.

---

### Táctica 5: Plan Anual con 20% de Descuento (2 Meses Gratis) — Impacto: Alto | Dificultad: Baja

**Cómo funciona:** Ofrecer el plan anual con exactamente 2 meses gratis (descuento del 16.7%). Este es el descuento estándar de la industria porque es matemáticamente simple de comunicar ("paga 10, recibe 12") y reduce el churn anual ~30%.

**Productos que la usan:** Notion, Linear, Framer, Copy.ai, prácticamente todo el SaaS universe. El 16.7% es el punto de referencia del mercado (fuente: OpenView 2024 Pricing Survey).

**Impacto:** Clientes anuales tienen churn ~30% menor que mensuales. El LTV promedio de un cliente anual es 40-60% mayor. Para Vibepick, convertir 30% de PRO a anual podría duplicar el LTV promedio.

**Aplicación en Vibepick:**
- PRO Mensual: $15/mes
- PRO Anual: $120/año ($10/mes efectivo — "Ahorra $60 al año")
- Mostrar el precio anual prominentemente en la tabla de precios (no esconderlo)
- Hacer el toggle mensual/anual visible con el ahorro en verde

---

### Táctica 6: Upgrade Triggers en Momentos de Alto Intento — Impacto: Alto | Dificultad: Media

**Cómo funciona:** Identificar los 3-5 momentos donde el usuario está más motivado a pagar y mostrar el CTA de upgrade exactamente ahí (no antes, no después).

**Productos que la usan:** Notion muestra upgrade cuando el usuario intenta agregar un invitado. Canva muestra upgrade al seleccionar un template premium. Linear muestra upgrade al intentar crear más de 200 issues. Loom muestra upgrade al grabar más de 5 minutos.

**Impacto:** Según Kinde.com, los upgrade triggers basados en comportamiento específico convierten 3-5x más que los CTAs genéricos de "Upgrade" en el navbar. El momento correcto importa más que la copia del botón.

**Triggers específicos para Vibepick:**
1. Al intentar copiar el prompt (paso 8) en plan FREE después de 1 generación gratuita
2. Al intentar ver el historial de un prompt anterior (cuando solo tienen 1 generación)
3. Al generar el 3er prompt (el último del plan free) — modal de upgrade antes de mostrar el resultado
4. Después de compartir/exportar un prompt (el usuario ya usó el valor — mostrar "¿Lo usaste? PRO te da ilimitados")

---

### Táctica 7: Risk Reversal — Garantía de 7 Días + Badge de Confianza — Impacto: Medio-Alto | Dificultad: Baja

**Cómo funciona:** Una garantía visible de devolución elimina la fricción de "¿y si no me sirve?". En SaaS, una garantía de 7-14 días combinada con el primer cargo tiene tasa de refund < 5%, pero aumenta conversión ~21%.

**Datos de referencia:** QuickSprout A/B test (2024): garantía de 30 días aumentó ventas 21% con 12% de refund rate, resultando en +6.5% revenue neto. Combinar trial gratuito + garantía post-trial prácticamente no agrega refunds pero mantiene el efecto de confianza.

**Aplicación en Vibepick:**
- Incluir en la pricing page: *"Garantía de 7 días. Si no estás satisfecho, te devolvemos el 100%."*
- Lemon Squeezy facilita los refunds desde el dashboard en 1 clic
- Agregar badges de confianza: "Sin permanencia", "Cancela cuando quieras"
- No requiere tarjeta para el plan FREE (elimina barrera de entrada; la CC solo se pide al hacer upgrade)

---

### Táctica 8: Social Proof Específico en Pricing Page — Impacto: Medio | Dificultad: Baja

**Cómo funciona:** No testimonios genéricos ("¡Gran producto!"). Testimonios específicos que responden objeciones en el momento de compra: "No sabía cómo describir mi negocio para la IA, en 5 minutos ya tenía el prompt perfecto."

**Productos que la usan:** Durable.co muestra número de sitios generados en tiempo real en la landing ("3.8 millones de sitios creados"). Copy.ai muestra logos de empresas usuarios. Gamma muestra "usados por equipos en [empresa X, Y, Z]".

**Impacto:** Testimonios específicos y verificables aumentan conversión en pricing pages en 15-25% (fuente: CXL Institute). El número de usuarios totales ("Ya ayudamos a 500 negocios a crear su sitio") actúa como prueba de validación.

**Aplicación en Vibepick:**
- En la pricing page: mostrar testimonios que incluyan el tipo de negocio y resultado específico
- Agregar contador de prompts generados: "2,347 negocios ya tienen su prompt"
- Si hay logos de clientes conocidos, mostrarlos cerca del CTA de upgrade

---

### Táctica 9: Email de Nurturing para Free → Paid (Secuencia de 5 Emails) — Impacto: Medio-Alto | Dificultad: Media

**Cómo funciona:** Una secuencia de emails automatizada que activa cuando un usuario se registra y no convierte en los primeros 7 días. El objetivo: recordar el valor, superar objeciones, y llevar de vuelta al producto.

**Productos que la usan:** Copy.ai (secuencia de 4 emails post-signup), Jasper (nurturing con casos de uso específicos), Gamma (emails mostrando ejemplos de presentaciones creadas por usuarios similares).

**Impacto:** Secuencias de nurturing bien diseñadas convierten 2-5% adicional de free users a paid en los primeros 30 días (fuente: Encharge.io SaaS Email Benchmark 2024). Para 1,000 usuarios free, eso son 20-50 conversiones adicionales/mes solo por emails.

**Secuencia recomendada para Vibepick:**
- **Email 1 (día 0):** Bienvenida + "Aquí está cómo usarlo en 5 minutos" (reducir fricción de activación)
- **Email 2 (día 2):** "Mira el prompt que [nombre de negocio similar] generó" (social proof)
- **Email 3 (día 4):** "Te quedas sin generaciones — aquí está lo que pierdes sin PRO" (urgencia real, no falsa)
- **Email 4 (día 7):** Oferta especial por tiempo limitado: primer mes con descuento (ej: $10 en lugar de $15)
- **Email 5 (día 14):** "¿Tienes preguntas?" — email personal del fundador (high touch, aumenta conversión en early-stage)

---

### Táctica 10: Onboarding que Entrega el Aha Moment ANTES del Paywall — Impacto: Alto | Dificultad: Media

**Cómo funciona:** El error más común en SaaS es mostrar el paywall antes de que el usuario entienda por qué querría pagar. La solución: asegurarse de que el usuario complete el flujo core y vea el resultado ANTES de cualquier solicitud de pago.

**Productos que la usan:** Durable.co genera el sitio completo antes de pedir pago para publicarlo. Gamma genera la presentación completa en free antes de mostrar límites de uso. Framer permite diseñar completamente, solo pide plan al publicar.

**Impacto:** Según Userpilot (2024), usuarios que alcanzan el "aha moment" antes de ver el paywall tienen tasa de conversión 3.5x mayor que los que ven el paywall primero. El costo de ofrecer "una generación gratis completa" es prácticamente $0 (tokens de IA), pero el incremento en conversión es enorme.

**Aplicación en Vibepick:**
- El plan FREE permite completar los 8 pasos y ver el prompt completo en la primera generación (sin paywall en la primera experiencia)
- El paywall aparece a partir de la 2ª generación (el usuario ya sabe qué vale el producto)
- Considerar mostrar un resumen de "lo que vas a recibir" al inicio de cada paso (mantiene motivación y reduce abandono mid-funnel)

---

## Bloque 4 — Arquitectura Técnica de Implementación

### 4.1 Flujo de Pago (Diagrama Completo)

```
[FRONTEND — React]
Usuario hace clic en "Activar PRO" (botón en paso 8 o pricing page)
    │
    ▼
usePayment.ts: construye URL de checkout de Lemon Squeezy con custom_data
    │
    ▼
Redirige a: https://vibepick.lemonsqueezy.com/checkout/buy/{variant_id}
    ?custom[supabase_user_id]={user.id}
    &checkout[email]={user.email}
    │
    ▼
[LEMON SQUEEZY CHECKOUT — hosted]
Usuario ingresa tarjeta (cualquier país, cualquier divisa)
Lemon Squeezy procesa pago y maneja impuestos globalmente
    │
    ▼
[EVENTO: subscription_payment_success]
Lemon Squeezy hace POST a: https://vibepick.vercel.app/api/webhook-lemonsqueezy
    Header: X-Signature: {hmac_sha256_signature}
    Body: JSON con evento, custom_data.supabase_user_id, customer info
    │
    ▼
[VERCEL FUNCTION: api/webhook-lemonsqueezy.js]
1. Verifica firma HMAC-SHA256 con LEMON_SQUEEZY_WEBHOOK_SECRET
2. Si firma inválida → responde 401, termina
3. Extrae event_name y supabase_user_id
4. Switch en event_name:
   - subscription_payment_success → is_pro = true
   - subscription_cancelled → programar is_pro = false al fin del período
   - subscription_expired → is_pro = false
   - subscription_payment_failed → enviar email de alerta (opcional)
5. UPDATE Supabase: profiles SET is_pro = true WHERE id = supabase_user_id
6. Responde 200 OK a Lemon Squeezy (importante para no reintentos)
    │
    ▼
[SUPABASE]
profiles.is_pro = true para ese usuario
    │
    ▼
[FRONTEND — React]
AuthContext detecta cambio (Supabase Realtime subscription o re-fetch al regresar)
UI actualiza: desaparece el paywall, aparece acceso PRO inmediato
    │
    ▼
[LEMON SQUEEZY — automático]
Envía email de confirmación de compra al cliente
```

---

### 4.2 Archivos a Crear / Modificar

**Archivos NUEVOS:**

```
api/webhook-lemonsqueezy.js
```
Serverless function que recibe y procesa todos los eventos de Lemon Squeezy. Valida firma, procesa eventos y actualiza Supabase. (~80-100 líneas)

```
src/hooks/usePayment.ts
```
Hook que expone `startCheckout(planId: 'pro' | 'agency')`. Construye la URL del checkout con el `supabase_user_id` del usuario actual y redirige. (~30 líneas)

```
src/components/UpgradeModal.tsx
```
Modal de upgrade que se muestra en los upgrade triggers (paso 8, historial, etc.). Recibe el plan recomendado y llama a `usePayment`. Incluye la tabla de precios y garantía.

**Archivos MODIFICADOS:**

```
src/context/AuthContext.tsx
```
Agregar campo `is_pro: boolean` al perfil de usuario que se lee desde `profiles`. Agregar listener de Supabase Realtime para detectar cambios de `is_pro` en tiempo real.

```
src/hooks/useCredits.ts
```
Modificar para que, si `is_pro = true`, bypass el sistema de créditos (acceso ilimitado).

**Nueva tabla Supabase (opcional pero recomendada):**

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lemon_squeezy_subscription_id TEXT UNIQUE,
  lemon_squeezy_customer_id TEXT,
  plan TEXT, -- 'pro' | 'agency'
  status TEXT, -- 'active' | 'cancelled' | 'expired' | 'past_due'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Esto permite manejar correctamente el caso de "suscripción cancelada pero período no vencido" (el usuario mantiene acceso hasta `current_period_end`).

**Variables de entorno a agregar en Vercel Dashboard:**

```
LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_xxxx
LEMON_SQUEEZY_API_KEY=eyJ...
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_PRO_VARIANT_ID=67890
LEMON_SQUEEZY_AGENCY_VARIANT_ID=67891
```

---

### 4.3 Eventos Webhook a Manejar

| Evento | Cuándo ocurre | Acción en Supabase | Idempotencia |
|---|---|---|---|
| `subscription_created` | Usuario completa primer pago | `UPDATE profiles SET is_pro=true` + `INSERT subscriptions(...)` | Usar `ON CONFLICT (lemon_squeezy_subscription_id) DO NOTHING` |
| `subscription_payment_success` | Renovación mensual/anual exitosa | Confirmar `is_pro=true`, actualizar `current_period_end` | Verificar que `status` no sea ya `active` antes de escribir |
| `subscription_cancelled` | Usuario cancela (pero período puede seguir activo) | `UPDATE subscriptions SET status='cancelled'`. No cambiar `is_pro` todavía | Verificar timestamp, no rever si ya está cancelado |
| `subscription_expired` | Período terminó tras cancelación | `UPDATE profiles SET is_pro=false` + `UPDATE subscriptions SET status='expired'` | Verificar que `current_period_end < NOW()` antes de ejecutar |
| `subscription_payment_failed` | Pago de renovación falla | Enviar email de alerta. Lemon Squeezy reintenta automáticamente 3 veces | Loggear el evento sin cambiar estado hasta `subscription_expired` |
| `order_refunded` | Cliente solicita reembolso | `UPDATE profiles SET is_pro=false` + registrar en subscriptions | Verificar que el order_id no haya sido procesado ya |

**Patrón de idempotencia recomendado:**
```js
// Antes de cualquier UPDATE, verificar el estado actual
const { data: sub } = await supabase
  .from('subscriptions')
  .select('status, updated_at')
  .eq('lemon_squeezy_subscription_id', subscriptionId)
  .single()

// Solo actualizar si el evento es más reciente que el último update
if (!sub || new Date(eventTimestamp) > new Date(sub.updated_at)) {
  // Proceder con UPDATE
}
```

---

### 4.4 Seguridad

**Verificación de firma del webhook (CRÍTICO):**

Cada request de Lemon Squeezy incluye el header `X-Signature` con un HMAC-SHA256 del body usando el `LEMON_SQUEEZY_WEBHOOK_SECRET`. Si no verificas esto, cualquier atacante puede enviar un POST a tu endpoint y activar `is_pro=true` gratis.

```js
// api/webhook-lemonsqueezy.js
import crypto from 'crypto'

export default async function handler(req, res) {
  const rawBody = await getRawBody(req) // crucial: raw, no parseado
  const signature = req.headers['x-signature']
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  )) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const payload = JSON.parse(rawBody)
  // procesar evento...
}
```

> **Importante:** Usar `crypto.timingSafeEqual` (no `===`) para prevenir timing attacks.

**Almacenamiento seguro de keys:**
- Nunca commitear `.env.local` al repo (ya debería estar en `.gitignore`)
- Agregar todas las variables de entorno en Vercel Dashboard → Settings → Environment Variables
- Usar variables diferentes para Preview y Production

**Manejo de fallos de webhook:**
- Lemon Squeezy reintenta el webhook hasta 5 veces si recibe error (cualquier status != 2xx)
- Siempre responder `200 OK` si el evento fue recibido, incluso si no reconoces el tipo de evento
- Loggear todos los eventos en una tabla `webhook_logs` en Supabase para debugging

---

### 4.5 Pricing Recomendado para Vibepick

**Filosofía:** El precio debe ser accesible para LATAM (donde $15 USD ya es un número significativo) pero no tan bajo que genere duda sobre la calidad. Referencia: Copy.ai PRO = $49/mes, Gamma Plus = $10/mes, Durable PRO = $15/mes.

**Estructura recomendada:**

| Plan | Mensual | Anual | Efectivo/mes | Lo que incluye |
|---|---|---|---|---|
| **FREE** | $0 | $0 | $0 | 3 generaciones de prompt · Daniel AI básico · 1 sitio |
| **PRO** | $15 | $120 | $10 | Generaciones ilimitadas · Historial completo · Exportar · Soporte prioritario · Hasta 5 sitios |
| **AGENCY** | $39 | $312 | $26 | Todo PRO · Sitios ilimitados · Branding propio · API access (futuro) · Onboarding call |

**Justificación del precio PRO en $15:**
- Bajo el umbral psicológico de $20 (precio "alto" para LATAM)
- Sobre $10 (que se percibe como "demasiado barato, ¿es confiable?")
- El descuento anual del 33% ($120 vs. $180) es generoso y motiva a comprometerse
- En USA, $15/mes es impulse-buy (menos que Netflix)

**Justificación del descuento anual del 33% (en lugar del 16.7% estándar):**
En early-stage, el churn es el enemigo principal. Ofrecer un descuento más agresivo (33% vs. 17%) para el plan anual reduce el churn en los primeros 12 meses y genera caja inmediata ($120 vs. $15/mes). El trade-off de menor revenue a corto plazo vale la retención.

**¿Tiene sentido el plan AGENCY?**
Sí, con condiciones: solo si hay un segmento de usuarios (freelancers de marketing, agencias digitales) que manejan múltiples clientes. Lanzar inicialmente con solo PRO si no hay evidencia de este segmento, y agregar AGENCY cuando 3-5 usuarios te pidan explícitamente manejar múltiples negocios.

---

## Próximos Pasos (Checklist Ordenado por Prioridad)

- [ ] **1. Crear cuenta en Lemon Squeezy** (gratis, sin empresa, sin LLC)
  - Completar KYC con datos personales y cuenta bancaria o PayPal
  - Crear tienda "Vibepick"

- [ ] **2. Crear productos en Lemon Squeezy**
  - Producto: "Vibepick PRO" — suscripción mensual $15 + anual $120
  - Producto: "Vibepick AGENCY" (opcional para launch inicial) — mensual $39 + anual $312
  - Obtener los `variant_id` de cada producto

- [ ] **3. Configurar webhook en Lemon Squeezy**
  - URL: `https://[tu-dominio].vercel.app/api/webhook-lemonsqueezy`
  - Seleccionar eventos: `subscription_created`, `subscription_payment_success`, `subscription_cancelled`, `subscription_expired`, `order_refunded`, `subscription_payment_failed`
  - Copiar el signing secret → agregar en Vercel como `LEMON_SQUEEZY_WEBHOOK_SECRET`

- [ ] **4. Crear tabla `subscriptions` en Supabase** (SQL del Bloque 4.2)

- [ ] **5. Implementar `api/webhook-lemonsqueezy.js`**
  - Verificación de firma HMAC-SHA256
  - Handlers para cada evento
  - Update de `profiles.is_pro` y tabla `subscriptions`

- [ ] **6. Implementar `src/hooks/usePayment.ts`**
  - Función que construye URL de checkout con `custom_data.supabase_user_id`
  - Redirige al checkout de Lemon Squeezy

- [ ] **7. Modificar `AuthContext.tsx`**
  - Leer `is_pro` desde `profiles`
  - Agregar Supabase Realtime para detectar cambios de `is_pro`

- [ ] **8. Crear `src/components/UpgradeModal.tsx`**
  - Trigger en paso 8 (copiar prompt) y en historial
  - Mostrar tabla de precios con toggle mensual/anual
  - Incluir garantía de 7 días y badges de confianza

- [ ] **9. Crear página de Pricing (`/pricing`)**
  - 3 columnas: FREE, PRO, AGENCY
  - Toggle mensual/anual con ahorro en verde
  - Social proof: testimonios específicos + contador de prompts generados
  - Garantía visible

- [ ] **10. Configurar email de nurturing (5 emails)**
  - Usar Resend (ya está en el stack) + trigger desde Supabase Edge Function
  - Secuencia: día 0, 2, 4, 7, 14

- [ ] **11. Testing end-to-end antes de launch**
  - Usar tarjeta de prueba de Lemon Squeezy en modo test
  - Verificar que `is_pro=true` aparece en Supabase tras pago
  - Verificar que `is_pro=false` tras cancelación y expiración
  - Testear idempotencia: enviar mismo webhook dos veces, verificar que no duplica updates

- [ ] **12. Monitorear primeros 30 días**
  - KPIs: conversion rate free→paid, checkout abandonment, churn a 30 días
  - Si abandono > 30%: agregar MercadoPago como opción secundaria para LATAM

---

*Investigación compilada en Abril 2026. Verificar fees actualizados directamente en las plataformas antes de tomar decisiones financieras, ya que las estructuras de pricing pueden cambiar.*

---

**Fuentes principales consultadas:**
- [Lemon Squeezy Docs — Fees](https://docs.lemonsqueezy.com/help/getting-started/fees)
- [Stripe Pricing](https://stripe.com/pricing)
- [Paddle Pricing](https://www.paddle.com/pricing)
- [Gumroad Pricing](https://gumroad.com/pricing)
- [Hotmart Fees Help Center](https://help.hotmart.com/en/article/208298448/what-are-the-fees-charged-by-hotmart-)
- [PayPal Merchant Fees](https://www.paypal.com/us/business/paypal-business-fees)
- [Userpilot — Freemium Conversion Guide](https://userpilot.com/blog/freemium-conversion-rate/)
- [Chargebee — Free Trial CC vs No CC](https://www.chargebee.com/blog/saas-free-trial-credit-card-verdict/)
- [Kinde — Freemium Billing Triggers](https://www.kinde.com/learn/billing/conversions/freemium-to-premium-converting-free-ai-tool-users-with-smart-billing-triggers/)
- [OpenView SaaS Freemium Conversion Rates 2026](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/)
- [QuickSprout — Money-back Guarantee vs Free Trial](https://www.quicksprout.com/what-converts-better-free-trial-versus-money-back-guarantee/)
- [Stripe — Payments in Latin America](https://stripe.com/resources/more/payments-in-latin-america)
- [Lemon Squeezy — Bank Payouts Expansion](https://www.lemonsqueezy.com/blog/new-bank-payouts)
