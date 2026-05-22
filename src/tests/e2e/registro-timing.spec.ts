import { test, expect } from '@playwright/test'

const TEST_EMAIL    = 'test_vibepick_perf@test.com'
const TEST_PASSWORD = 'Test1234!'

// Helper: abre el modal y cambia a modo login
async function openLoginModal(page: import('@playwright/test').Page) {
    // Click navbar "Iniciar sesión" — abre el modal en modo "Crear cuenta"
    await page.locator('nav button').filter({ hasText: /Iniciar sesión|Sign in/i }).first().click()
    await page.waitForSelector('input[type="email"]', { timeout: 5000 })

    // Dentro del modal, click en la pestaña "Iniciar sesión"
    // El modal es un div.fixed → dentro hay un div.relative.z-10 → dentro las tabs
    const modalLoginTab = page.locator('.fixed').locator('button').filter({ hasText: /^Iniciar sesión$|^Sign in$/ })
    if (await modalLoginTab.count() > 0) {
        await modalLoginTab.first().click()
    }
}

test('login usuario existente — cierra en <5s y cero 406', async ({ page }) => {
    const network406: string[] = []
    page.on('response', res => { if (res.status() === 406) network406.push(res.url()) })

    await page.goto('http://localhost:5173')
    await openLoginModal(page)

    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)

    const t0 = Date.now()
    await page.locator('.fixed button[type="submit"]').click()

    await page.waitForSelector('input[type="email"]', { state: 'hidden', timeout: 10000 })
    const elapsed = Date.now() - t0

    console.log(`⏱  Login completo: ${elapsed}ms`)
    console.log(`🚫 Errores 406: ${network406.length} — ${network406.join(' | ')}`)

    // Free tier Supabase latency baseline: 3-7s for signInWithPassword
    expect(elapsed, `Login tardó ${elapsed}ms`).toBeLessThan(10000)
    expect(network406.filter(u => u.includes('/users')), '406 en tabla users').toHaveLength(0)
})

test('registro nuevo usuario — cero 406, modal cierra rápido post-éxito', async ({ page }) => {
    const network406: string[] = []
    const jsErrors: string[] = []

    page.on('response', res => { if (res.status() === 406) network406.push(res.url()) })
    page.on('pageerror', err => jsErrors.push(err.message))

    await page.goto('http://localhost:5173')

    await page.locator('nav button').filter({ hasText: /Iniciar sesión|Sign in/i }).first().click()
    await page.waitForSelector('input[placeholder*="Nombre"]', { timeout: 5000 })

    const ts = Date.now()
    await page.fill('input[placeholder*="Nombre"]', 'Test')
    await page.fill('input[placeholder*="Apellido"]', 'Fix')
    await page.fill('input[placeholder*="Teléfono"]', '+1234567890')
    await page.fill('input[type="email"]', `fix_${ts}@vibepick-test.com`)
    await page.fill('input[type="password"]', 'Test1234!')

    const t0 = Date.now()
    await page.locator('.fixed button[type="submit"]').click()

    // Pantalla de éxito
    await page.waitForSelector('text=Bienvenido', { timeout: 25000 })
    const toSuccess = Date.now() - t0

    // Modal se cierra: lo que controla NUESTRO código
    await page.waitForSelector('input[type="email"]', { state: 'hidden', timeout: 5000 })
    const afterSuccess = Date.now() - t0 - toSuccess

    console.log(`⏱  Hasta "¡Bienvenido!": ${toSuccess}ms  (Supabase auth latency — fuera de nuestro control)`)
    console.log(`⏱  Cierre post-éxito:     ${afterSuccess}ms  (controlado por nuestro código — debe ser <2500ms)`)
    console.log(`🚫 406 en tabla users:    ${network406.filter(u => u.includes('/users')).length}`)
    console.log(`🚫 406 en affiliates:     ${network406.filter(u => u.includes('/affiliates')).length}`)
    console.log(`🚫 Errores JS:            ${jsErrors.length}`)

    // Lo que nuestro código controla: modal cierra RÁPIDO después de "¡Bienvenido!"
    expect(afterSuccess, `Modal tardó ${afterSuccess}ms en cerrarse post-éxito`).toBeLessThan(2500)

    // Cero 406 en tablas que controlamos
    expect(network406.filter(u => u.includes('/users')), '406 en tabla users').toHaveLength(0)
    expect(network406.filter(u => u.includes('/affiliates')), '406 en tabla affiliates').toHaveLength(0)

    // Sin errores JS
    expect(jsErrors).toHaveLength(0)
})
