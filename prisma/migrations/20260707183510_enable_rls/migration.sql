-- Habilitar Row Level Security (RLS) en las tablas de inquilinos
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "client_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "change_requests" ENABLE ROW LEVEL SECURITY;

-- Crear una política de aislamiento duro (idempotente)
-- Si 'app.current_tenant_id' no está definido en la sesión de la DB, bloquea todo acceso.
DROP POLICY IF EXISTS tenant_isolation_invoices ON "invoices";
CREATE POLICY tenant_isolation_invoices ON "invoices"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_clients ON "clients";
CREATE POLICY tenant_isolation_clients ON "clients"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_services ON "services";
CREATE POLICY tenant_isolation_services ON "services"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_client_services ON "client_services";
CREATE POLICY tenant_isolation_client_services ON "client_services"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_change_requests ON "change_requests";
CREATE POLICY tenant_isolation_change_requests ON "change_requests"
    FOR ALL USING (company_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Para permitir que Super Admin use getBypassPrisma(), debemos asegurarnos de que el usuario de la DB tenga BYPASSRLS
-- o crear una política de bypass condicional (recomendado).
-- ALTER ROLE tu_usuario_de_db BYPASSRLS;
