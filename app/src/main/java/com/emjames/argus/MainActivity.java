package com.emjames.argus;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.wikitude.architect.ArchitectView;
import com.wikitude.architect.StartupConfiguration;

/**
 * Activity launched when pressing app-icon
 * It uses basic ListAdapter for UI representation
 */

public class MainActivity extends AppCompatActivity {

    public final static String EXTRAS_KEY_ACTIVITIES_GEO_ARRAY = "activitiesGeo";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onStartCam(View view) {
//        printToast("START!");
        final Intent intent = new Intent(this, CameraActivity.class);
        String message = "GeoCamera";

        intent.putExtra(EXTRAS_KEY_ACTIVITIES_GEO_ARRAY, message);
        this.startActivity(intent);
    }

    private void printToast(String t) {
        int duration = Toast.LENGTH_SHORT;
        Context context = getApplicationContext();


        Toast toast = Toast.makeText(context, t, duration);
        toast.setGravity(Gravity.TOP, 20, 20);
        toast.show();
    }
}
