import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'ddiaz.consultor.ia@gmail.com'
const ADMIN_PASS  = 'yoli1317remdiaz17'
const WRONG_PASS  = 'wrongpassword123'

test.describe('CRM Admin — acceso y seguridad', () => {

    test('muestra formulario de login al entrar sin sesión', async ({ page }) => {
        await page.goto('/admin/')
        await expect(page.getByPlaceholder('Correo admin')).toBeVisible()
        await expect(page.getByPlaceholder('Contraseña')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Entrar al CRM' })).toBeVisible()
    })

    test('muestra error con contraseña incorrecta', async ({ page }) => {
        await page.goto('/admin/')
        await page.getByPlaceholder('Correo admin').fill(ADMIN_EMAIL)
        await page.getByPlaceholder('Contraseña').fill(WRONG_PASS)
        await page.getByRole('button', { name: 'Entrar al CRM' }).click()
        await expect(page.getByText('Acceso denegado')).toBeVisible()
    })

    test('muestra error con email incorrecto', async ({ page }) => {
        await page.goto('/admin/')
        await page.getByPlaceholder('Correo admin').fill('otro@gmail.com')
        await page.getByPlaceholder('Contraseña').fill(ADMIN_PASS)
        await page.getByRole('button', { name: 'Entrar al CRM' }).click()
        await expect(page.getByText('Acceso denegado')).toBeVisible()
    })

    test('entra al dashboard con credenciales correctas', async ({ page }) => {
        await page.goto('/admin/')
        await page.getByPlaceholder('Correo admin').fill(ADMIN_EMAIL)
        await page.getByPlaceholder('Contraseña').fill(ADMIN_PASS)
        await page.getByRole('button', { name: 'Entrar al CRM' }).click()
        await expect(page.getByText('Vibepick CRM', { exact: false })).toBeVisible({ timeout: 8000 })
        await expect(page.getByText('CRM · Admin')).toBeVisible()
    })

    test('el dashboard muestra las tabs correctas', async ({ page }) => {
        await page.goto('/admin/')
        await page.getByPlaceholder('Correo admin').fill(ADMIN_EMAIL)
        await page.getByPlaceholder('Contraseña').fill(ADMIN_PASS)
        await page.getByRole('button', { name: 'Entrar al CRM' }).click()
        await page.waitForSelector('text=Vibepick CRM', { timeout: 8000 })
        await expect(page.getByRole('button', { name: /Usuarios/ })).toBeVisible()
        await expect(page.getByRole('button', { name: /Seguimiento/ })).toBeVisible()
        await expect(page.getByRole('button', { name: /Sesiones/ })).toBeVisible()
        await expect(page.getByRole('button', { name: /Métricas/ })).toBeVisible()
    })

    test('cerrar sesión regresa al formulario de login', async ({ page }) => {
        await page.goto('/admin/')
        await page.getByPlaceholder('Correo admin').fill(ADMIN_EMAIL)
        await page.getByPlaceholder('Contraseña').fill(ADMIN_PASS)
        await page.getByRole('button', { name: 'Entrar al CRM' }).click()
        await page.waitForSelector('text=Vibepick CRM', { timeout: 8000 })
        await page.getByRole('button', { name: /Cerrar sesión/ }).click()
        await expect(page.getByPlaceholder('Correo admin')).toBeVisible()
    })
})

test.describe('Página principal — flujo de auth', () => {

    test('carga la página principal sin errores', async ({ page }) => {
        await page.goto('/')
        await expect(page).not.toHaveURL('/error')
        await expect(page.locator('body')).toBeVisible()
    })

    test('el botón de registro abre el modal', async ({ page }) => {
        await page.goto('/')
        const btn = page.getByRole('button', { name: /Crear|Registrar|Empieza|Gratis/i }).first()
        if (await btn.isVisible()) {
            await btn.click()
            await expect(page.getByPlaceholder('Correo electrónico')).toBeVisible({ timeout: 5000 })
        }
    })
})
