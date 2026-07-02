import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que estemos en la página principal con el título Factur
    await expect(page.locator('h1')).toContainText('Factur');
    
    // Verificar que los inputs existan
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error message on invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Asumiendo que se muestra un mensaje de error o toast al fallar
    const errorToast = page.locator('text=Credenciales incorrectas').first();
    // Playwright intentará buscar el texto de error que se renderiza
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });
});
