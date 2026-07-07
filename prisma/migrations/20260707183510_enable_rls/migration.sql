-- Habilitar Row Level Security (RLS) en las tablas de inquilinos
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "client_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChangeRequest" ENABLE ROW LEVEL SECURITY;

-- Crear una política de aislamiento duro
-- Si 'app.current_tenant_id' no está definido en la sesión de la DB, bloquea todo acceso.
CREATE POLICY tenant_isolation_invoices ON "invoices"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_clients ON "clients"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_services ON "services"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_client_services ON "client_services"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_change_requests ON "ChangeRequest"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Para permitir que Super Admin use getBypassPrisma(), debemos asegurarnos de que el usuario de la DB tenga BYPASSRLS
-- o crear una política de bypass condicional (recomendado).
-- ALTER ROLE tu_usuario_de_db BYPASSRLS;
