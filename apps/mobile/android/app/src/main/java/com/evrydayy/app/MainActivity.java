package com.evrydayy.app;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.evrydayy.app.plugins.PayUMoneyPlugin;
import com.evrydayy.app.plugins.RazorpayNativePlugin;
import com.razorpay.PaymentResultListener;

public class MainActivity extends BridgeActivity implements PaymentResultListener {

    private static final String TAG = "MainActivity";
    private String pendingDeepLink = null;

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "🚀 MainActivity onCreate - BEFORE super");
        Log.d(TAG, "⏳ Registering plugins BEFORE super.onCreate()...");
        registerPlugin(PayUMoneyPlugin.class);
        Log.d(TAG, "✓ PayUMoneyPlugin registered");
        registerPlugin(RazorpayNativePlugin.class);
        Log.d(TAG, "✓ RazorpayNativePlugin registered");
        Log.d(TAG, "========================================");
        
        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true);
        
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "========================================");
        Log.d(TAG, "✓ super.onCreate() completed");
        Log.d(TAG, "✓ All plugins should now be available");
        
        Uri data = getIntent().getData();
        if (data != null) {
            Log.d(TAG, "🔗 Deep link detected in onCreate: " + data.toString());
            handleDeepLink(data);
        }
        Log.d(TAG, "========================================");
    }

    @Override
    public void onResume() {
        super.onResume();
        if (pendingDeepLink != null && bridge != null) {
            String fragment = pendingDeepLink.contains("#")
                ? pendingDeepLink.substring(pendingDeepLink.indexOf("#") + 1) : "";
            bridge.eval("sessionStorage.setItem('splash_shown','1'); localStorage.setItem('splash_shown','1'); window.location.replace('/auth/callback#" + fragment + "')", null);
            pendingDeepLink = null;
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Uri data = intent.getData();
        if (data != null) handleDeepLink(data);
    }

    private void handleDeepLink(Uri data) {
        String url = data.toString();
        if (url.contains("auth/callback")) {
            String fragment = url.contains("#") ? url.substring(url.indexOf("#") + 1) : "";
            if (bridge != null) {
                bridge.eval("sessionStorage.setItem('splash_shown','1'); localStorage.setItem('splash_shown','1'); window.location.replace('/auth/callback#" + fragment + "')", null);
            } else {
                pendingDeepLink = url;
            }
        }
    }
    
    @Override
    public void onPaymentSuccess(String razorpayPaymentID) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "✅ MainActivity.onPaymentSuccess() called");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Payment ID: " + razorpayPaymentID);
        Log.d(TAG, "📤 Forwarding to RazorpayNativePlugin...");
        RazorpayNativePlugin.onPaymentSuccess(razorpayPaymentID);
        Log.d(TAG, "✓ Forwarded successfully");
        Log.d(TAG, "========================================");
    }
    
    @Override
    public void onPaymentError(int code, String description) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "❌ MainActivity.onPaymentError() called");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Error Code: " + code);
        Log.d(TAG, "Error Description: " + description);
        Log.d(TAG, "📤 Forwarding to RazorpayNativePlugin...");
        RazorpayNativePlugin.onPaymentError(code, description);
        Log.d(TAG, "✓ Forwarded successfully");
        Log.d(TAG, "========================================");
    }
}
