package com.nesh34.quizme;

import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.Window;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Sets navigation bar colour and theme on Android
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          Window window = getWindow();
          int flags = window.getDecorView().getSystemUiVisibility();
          int colourInt = Color.parseColor("#000000");
          flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
          window.getDecorView().setSystemUiVisibility(flags);
          window.setNavigationBarColor(colourInt);
        }
        setTheme(R.style.AppTheme);
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "QuizMe";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
         return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }
}
