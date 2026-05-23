import { supabase } from "@/lib/supabase";

export const CUSTOMER_DASHBOARD_ROUTE = "/dashboard/customer";
export const TECHNICIAN_DASHBOARD_ROUTE = "/dashboard/technician";

export function getDashboardRouteFromRole(role?: string | null) {
    return role?.toLowerCase() === "technician"
        ? TECHNICIAN_DASHBOARD_ROUTE
        : CUSTOMER_DASHBOARD_ROUTE;
}

export async function resolveDashboardRouteForUser(
    userId: string,
    roleHint?: string | null
) {
    if (roleHint) {
        return getDashboardRouteFromRole(roleHint);
    }

    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .maybeSingle();

        return getDashboardRouteFromRole(profile?.role ?? null);
    } catch {
        return CUSTOMER_DASHBOARD_ROUTE;
    }
}

export async function syncProfileFromAuthUser(
    user: {
        id: string;
        email?: string | null;
        user_metadata?: Record<string, unknown> | null;
    },
    fullName?: string | null,
    role?: string | null
) {
    const profileRole = role ?? (user.user_metadata?.role as string | null) ?? null;
    const profileName = fullName ?? (user.user_metadata?.full_name as string | null) ?? null;

    try {
        const { error } = await supabase.from("profiles").upsert(
            [
                {
                    id: user.id,
                    full_name: profileName,
                    email: user.email ?? null,
                    role: profileRole,
                },
            ],
            {
                onConflict: "id",
            }
        );

        return { error };
    } catch {
        return { error: null };
    }
}
