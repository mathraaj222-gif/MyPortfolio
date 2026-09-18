from supabase import create_client, Client
from app.core.config import settings

# Fail-safe sanity check
if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
    raise RuntimeError("❌ Core Database Engine could not locate valid Supabase credentials.")

# Initialize the synchronized cloud client instance
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)