import { test, expect } from '@playwright/test';

test.describe('Dashboard Load', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    // Debería redirigir al login (raíz con callbackUrl)
    await expect(page).toHaveURL(/.*callbackUrl.*/);
  });

  test('should display dashboard metrics after login', async ({ page }) => {
    await page.goto('/');
    
    // Credenciales reales de admin en el seed
    await page.fill('input[type="email"]', 'info.danielvasquez@gmail.com');
    await page.fill('input[type="password"]', '3.3.3.DEVR-24');
    await page.click('button[type="submit"]');

    // Esperar a que la redirección ocurra
    await page.waitForURL('/dashboard');
    
    // Validar que se muestre el título del Dashboard (esto valida que los componentes y la bd están funcionando)
    await expect(page.locator('text=Métricas por Empresa').first()).toBeVisible({ timeout: 10000 });
    
    // Verificar que existen tarjetas de métricas (por ejemplo, Empresas Tenants)
    await expect(page.locator('text=Empresas (Tenants)').first()).toBeVisible();
  });
});
