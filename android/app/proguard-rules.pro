# ── Capacitor core ──
-keep class com.getcapacitor.** { *; }
-keep class com.gfd.app.** { *; }
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# ── Capacitor plugins ──
-keep class com.capacitorjs.** { *; }
-keep class com.codetrixstudio.capacitor.** { *; }

# ── AndroidX / Jetpack ──
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# ── WebView JS bridge ──
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ── Google Services ──
-keep class com.google.android.gms.** { *; }
-keep class com.google.firebase.** { *; }
-dontwarn com.google.android.gms.**

# ── Suppress common warnings ──
-dontwarn org.bouncycastle.**
-dontwarn org.conscrypt.**
-dontwarn org.openjsse.**

# ── Keep enum values (used by Capacitor) ──
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
