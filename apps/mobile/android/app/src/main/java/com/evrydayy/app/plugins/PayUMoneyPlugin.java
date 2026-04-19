package com.evrydayy.app.plugins;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.evrydayy.app.PayUWebViewActivity;

@CapacitorPlugin(name = "PayUMoney")
public class PayUMoneyPlugin extends Plugin {

    private static final String TAG = "PayUMoneyPlugin";

    @PluginMethod
    public void startPayment(PluginCall call) {
        try {
            String merchantKey  = call.getString("merchantKey");
            String txnId        = call.getString("txnId");
            String amount       = call.getString("amount");
            String productInfo  = call.getString("productInfo");
            String firstName    = call.getString("firstName");
            String email        = call.getString("email");
            String phone        = call.getString("phone");
            String surl         = call.getString("surl");
            String furl         = call.getString("furl");
            String hash         = call.getString("hash");
            Boolean isProduction = call.getBoolean("isProduction", false);

            if (merchantKey == null || txnId == null || amount == null ||
                productInfo == null || firstName == null || email == null ||
                phone == null || hash == null) {
                call.reject("Missing required payment parameters");
                return;
            }

            Intent intent = new Intent(getContext(), PayUWebViewActivity.class);
            intent.putExtra("merchantKey",  merchantKey);
            intent.putExtra("txnId",        txnId);
            intent.putExtra("amount",       amount);
            intent.putExtra("productInfo",  productInfo);
            intent.putExtra("firstName",    firstName);
            intent.putExtra("email",        email);
            intent.putExtra("phone",        phone);
            intent.putExtra("surl",         surl);
            intent.putExtra("furl",         furl);
            intent.putExtra("hash",         hash);
            intent.putExtra("isProduction", isProduction);

            startActivityForResult(call, intent, "paymentResult");

        } catch (Exception e) {
            Log.e(TAG, "Error starting payment: " + e.getMessage(), e);
            call.reject("Failed to start payment: " + e.getMessage());
        }
    }

    @ActivityCallback
    private void paymentResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        JSObject ret = new JSObject();
        Intent data = result.getData();

        if (result.getResultCode() == Activity.RESULT_OK && data != null) {
            String status = data.getStringExtra("status");
            String txnId  = data.getStringExtra("txnId");
            if ("success".equals(status)) {
                ret.put("status", "success");
                ret.put("transactionId", txnId != null ? txnId : "");
                ret.put("message", "Payment successful");
            } else {
                ret.put("status", "failed");
                ret.put("message", "Payment failed");
            }
        } else {
            ret.put("status", "cancelled");
            ret.put("message", "Payment cancelled by user");
        }
        call.resolve(ret);
    }
}
