package com.evrydayy.app;

import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.BridgeActivity;
import com.evrydayy.app.plugins.PayUMoneyPlugin;

public class MainActivity extends BridgeActivity {

    private String pendingDeepLink = null;

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(PayUMoneyPlugin.class);
        Uri data = getIntent().getData();
        if (data != null) handleDeepLink(data);
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
}
