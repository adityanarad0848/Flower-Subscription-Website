package com.evrydayy.app.plugins;

import android.app.Activity;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;

import org.json.JSONObject;

@CapacitorPlugin(name = "RazorpayNative")
public class RazorpayNativePlugin extends Plugin {
    
    private static final String TAG = "RazorpayNativePlugin";
    private static PluginCall savedCall;
    private static RazorpayNativePlugin instance;
    
    @Override
    public void load() {
        super.load();
        instance = this;
        Log.d(TAG, "========================================");
        Log.d(TAG, "✓ Plugin loaded successfully");
        Log.d(TAG, "========================================");
    }
    
    @PluginMethod
    public void open(PluginCall call) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "🚀 RAZORPAY NATIVE PLUGIN CALLED");
        Log.d(TAG, "========================================");
        
        savedCall = call;
        
        Activity activity = getActivity();
        if (activity == null) {
            Log.e(TAG, "❌ ERROR: Activity not available");
            call.reject("Activity not available");
            return;
        }
        Log.d(TAG, "✓ Activity available: " + activity.getClass().getSimpleName());
        
        try {
            // Log all received parameters
            Log.d(TAG, "----------------------------------------");
            Log.d(TAG, "📥 Received Parameters:");
            Log.d(TAG, "  Key: " + (call.getString("key") != null ? "✓ Present (" + call.getString("key").substring(0, 10) + "...)" : "❌ MISSING"));
            Log.d(TAG, "  Name: " + call.getString("name"));
            Log.d(TAG, "  Description: " + call.getString("description"));
            Log.d(TAG, "  Currency: " + call.getString("currency"));
            Log.d(TAG, "  Amount: " + call.getInt("amount") + " paise (₹" + (call.getInt("amount") / 100.0) + ")");
            Log.d(TAG, "  Prefill Email: " + call.getString("prefill_email"));
            Log.d(TAG, "  Prefill Contact: " + call.getString("prefill_contact"));
            Log.d(TAG, "  Prefill Name: " + call.getString("prefill_name"));
            Log.d(TAG, "----------------------------------------");
            
            // Initialize Razorpay Checkout
            Log.d(TAG, "⏳ Initializing Razorpay Checkout...");
            Checkout checkout = new Checkout();
            Log.d(TAG, "✓ Checkout instance created");
            
            String keyId = call.getString("key");
            if (keyId == null || keyId.isEmpty()) {
                Log.e(TAG, "❌ ERROR: Razorpay Key ID is null or empty");
                call.reject("Razorpay Key ID is required");
                return;
            }
            
            checkout.setKeyID(keyId);
            Log.d(TAG, "✓ Key ID set successfully");
            
            // Build options JSON
            Log.d(TAG, "⏳ Building payment options JSON...");
            JSONObject options = new JSONObject();
            options.put("name", call.getString("name"));
            options.put("description", call.getString("description"));
            options.put("currency", call.getString("currency"));
            options.put("amount", call.getInt("amount"));
            
            JSONObject prefill = new JSONObject();
            prefill.put("email", call.getString("prefill_email"));
            prefill.put("contact", call.getString("prefill_contact"));
            prefill.put("name", call.getString("prefill_name"));
            options.put("prefill", prefill);
            
            JSONObject theme = new JSONObject();
            theme.put("color", "#F97316");
            options.put("theme", theme);
            
            Log.d(TAG, "✓ Options JSON built successfully");
            Log.d(TAG, "📄 Full Options: " + options.toString(2));
            
            // Open Razorpay checkout
            Log.d(TAG, "========================================");
            Log.d(TAG, "🚀 Opening Razorpay Checkout UI...");
            Log.d(TAG, "========================================");
            checkout.open(activity, options);
            Log.d(TAG, "✓ Checkout.open() called successfully");
            Log.d(TAG, "⏳ Waiting for user to complete payment...");
            
        } catch (Exception e) {
            Log.e(TAG, "========================================");
            Log.e(TAG, "💥 EXCEPTION CAUGHT");
            Log.e(TAG, "========================================");
            Log.e(TAG, "Error Type: " + e.getClass().getSimpleName());
            Log.e(TAG, "Error Message: " + e.getMessage());
            Log.e(TAG, "Stack Trace:", e);
            Log.e(TAG, "========================================");
            call.reject("Failed to open Razorpay: " + e.getMessage());
        }
    }
    
    public static void onPaymentSuccess(String razorpayPaymentID) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "✅ PAYMENT SUCCESS CALLBACK");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Payment ID: " + razorpayPaymentID);
        
        if (savedCall != null && instance != null) {
            Log.d(TAG, "✓ Saved call found, resolving...");
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("payment_id", razorpayPaymentID);
            Log.d(TAG, "📤 Sending response to JS: " + ret.toString());
            savedCall.resolve(ret);
            savedCall = null;
            Log.d(TAG, "✓ Response sent successfully");
        } else {
            Log.e(TAG, "❌ ERROR: savedCall or instance is null!");
            Log.e(TAG, "  savedCall: " + (savedCall != null ? "present" : "null"));
            Log.e(TAG, "  instance: " + (instance != null ? "present" : "null"));
        }
        Log.d(TAG, "========================================");
    }
    
    public static void onPaymentError(int code, String description) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "❌ PAYMENT ERROR CALLBACK");
        Log.d(TAG, "========================================");
        Log.d(TAG, "Error Code: " + code);
        Log.d(TAG, "Error Description: " + description);
        
        if (savedCall != null && instance != null) {
            Log.d(TAG, "✓ Saved call found, resolving with error...");
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error_code", code);
            // Handle null or "undefined" description
            String errorDesc = description;
            if (description == null || description.equals("undefined") || description.isEmpty()) {
                errorDesc = "Payment cancelled";
            }
            ret.put("error_description", errorDesc);
            Log.d(TAG, "📤 Sending error response to JS: " + ret.toString());
            savedCall.resolve(ret);
            savedCall = null;
            Log.d(TAG, "✓ Error response sent successfully");
        } else {
            Log.e(TAG, "❌ ERROR: savedCall or instance is null!");
            Log.e(TAG, "  savedCall: " + (savedCall != null ? "present" : "null"));
            Log.e(TAG, "  instance: " + (instance != null ? "present" : "null"));
        }
        Log.d(TAG, "========================================");
    }
}
