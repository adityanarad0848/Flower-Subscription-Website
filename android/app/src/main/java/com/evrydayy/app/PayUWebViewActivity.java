package com.evrydayy.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;

public class PayUWebViewActivity extends Activity {

    private WebView webView;
    private String txnId;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(true);

        webView = new WebView(this);
        RelativeLayout layout = new RelativeLayout(this);
        layout.addView(webView, new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.MATCH_PARENT));
        setContentView(layout);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);

        Intent intent = getIntent();
        String merchantKey = intent.getStringExtra("merchantKey");
        txnId              = intent.getStringExtra("txnId");
        String amount      = intent.getStringExtra("amount");
        String productInfo = intent.getStringExtra("productInfo");
        String firstName   = intent.getStringExtra("firstName");
        String email       = intent.getStringExtra("email");
        String phone       = intent.getStringExtra("phone");
        String surl        = intent.getStringExtra("surl");
        String furl        = intent.getStringExtra("furl");
        String hash        = intent.getStringExtra("hash");
        boolean isProduction = intent.getBooleanExtra("isProduction", false);

        String actionUrl = isProduction
            ? "https://secure.payu.in/_payment"
            : "https://test.payu.in/_payment";

        String html = "<!DOCTYPE html><html><head>"
            + "<meta name='viewport' content='width=device-width,initial-scale=1'>"
            + "</head><body>"
            + "<form id='f' method='post' action='" + actionUrl + "'>"
            + hidden("key",         merchantKey)
            + hidden("txnid",       txnId)
            + hidden("amount",      amount)
            + hidden("productinfo", productInfo)
            + hidden("firstname",   firstName)
            + hidden("email",       email)
            + hidden("phone",       phone)
            + hidden("surl",        surl)
            + hidden("furl",        furl)
            + hidden("hash",        hash)
            + hidden("udf1", "") + hidden("udf2", "") + hidden("udf3", "")
            + hidden("udf4", "") + hidden("udf5", "")
            + "</form>"
            + "<script>window.onload=function(){document.getElementById('f').submit();}</script>"
            + "</body></html>";

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                android.util.Log.d("PayUWebView", "URL: " + url);

                if (url.contains("mobileapp/payumoney/success") || url.contains("payment/success")) {
                    Intent result = new Intent();
                    result.putExtra("status", "success");
                    result.putExtra("txnId", txnId);
                    setResult(Activity.RESULT_OK, result);
                    finish();
                    return true;
                }
                if (url.contains("mobileapp/payumoney/failure") || url.contains("payment/failure")) {
                    Intent result = new Intent();
                    result.putExtra("status", "failed");
                    setResult(Activity.RESULT_OK, result);
                    finish();
                    return true;
                }

                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request,
                                        WebResourceError error) {
                android.util.Log.e("PayUWebView", "Error " + error.getErrorCode()
                    + ": " + error.getDescription() + " | " + request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                android.util.Log.d("PayUWebView", "Finished: " + url);
            }
        });

        webView.loadDataWithBaseURL(
            "file:///android_asset/",
            html,
            "text/html",
            "UTF-8",
            null
        );
    }

    private String hidden(String name, String value) {
        if (value == null) value = "";
        return "<input type='hidden' name='" + name + "' value='"
            + value.replace("'", "&#39;") + "'/>";
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            setResult(Activity.RESULT_CANCELED);
            finish();
        }
    }
}
