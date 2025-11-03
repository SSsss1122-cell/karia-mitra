// lib/checkForUpdate.js
import { supabase } from "./supabase";
import { APP_VERSION_CODE } from "../config/version";

export async function checkForAppUpdate() {
  try {
    // ✅ Fetch latest active version from Supabase
    const { data, error } = await supabase
      .from("app_updates")
      .select("*")
      .eq("is_active", true)
      .order("version_code", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // ✅ Compare with current app version
    if (data && data.version_code > APP_VERSION_CODE) {
      return {
        updateAvailable: true,
        apkUrl: data.apk_url,
        versionName: data.version_name,
        releaseNotes: data.release_notes,
      };
    } else {
      return { updateAvailable: false };
    }
  } catch (err) {
    console.error("Update check failed:", err.message);
    return { updateAvailable: false };
  }
}
