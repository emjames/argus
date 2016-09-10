package com.emjames.argus;

import android.hardware.SensorManager;
import android.location.LocationListener;
import android.provider.Settings;
import android.widget.Toast;

import com.wikitude.architect.ArchitectView;
import com.wikitude.architect.StartupConfiguration.CameraPosition;
import com.wikitude.architect.ArchitectView.SensorAccuracyChangeListener;

/**
 * Created by james on 8/6/16.
 */
public class CameraActivity extends AbstractArchitectCamActivity{

    // last time calibration toast was show, voids too many toasts show when compass needs calibration
    private long lastCalibrationToastShownTimeMillis = System.currentTimeMillis();

    protected final static String TAG = "Argus:CameraActivity";
    public static final String EXTRAS_KEY_ACTIVITY_GEO = "activityGeo";
/*
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);
        // To notify ArchitectView about life-cycle events
        // Call architectView's onCreate(), onPostCreate(), onPause(),
        //      onResume(), onDestroy() inside the activity's lifecycle methods
        //
        this.architectView = (ArchitectView) this.findViewById(R.id.architectView);
        final StartupConfiguration config = new StartupConfiguration(EmjamesConstants.WIKITUDE_SDK_KEY);
        this.architectView.onCreate(config);
    }
    */

    @Override
    protected CameraPosition getCameraPosition() {
        return CameraPosition.DEFAULT;
    }

    // check if the app uses geo location
    @Override
    protected boolean hasGeo() {
//        return getIntent().getExtras().getBoolean(EXTRAS_KEY_ACTIVITY_GEO);
        return true;
    }

    @Override
    protected boolean hasIR() {
        return false;
    }
    /*
        protected void onPostCreate(Bundle savedInstanceState) {
            super.onPostCreate(savedInstanceState);
            // The path of the html file specifying the AR experience
    //         * architectView.load('arexperience.html') opens the html in your project's assets-folder,
    //         * architectView.load('http://your-server.com/arexperience.html') loads the file from a server.
            String path = "ArgusCamera/index.html";

            // Inform ArchitectView of the lifecycle of the activity
            this.architectView.onPostCreate();

            // load the path of the html file that defines your AR experience.
            // It can be relative to the asset folder root or a web-url (http:// or https://)
            try {
                this.architectView.load(path);
            } catch (IOException e) {
                e.printStackTrace();
                Log.d(TAG, "onPostCreate: Failed to load the file at:" + path);
            }
        }
    */
    @Override
    public String getActivityTitle() {
        return "Argus";
    }

    @Override
    public String getARchitectWorldPath() {
        return "ArgusCamera/index.html";
    }

    @Override
    public ArchitectView.ArchitectUrlListener getUrlListener() {
        return null;
    }

    @Override
    public int getContentViewId() {
        return R.layout.activity_camera;
    }

    @Override
    public String getWikitudeSDKLicenseKey() {
        return EmjamesConstants.WIKITUDE_SDK_KEY;
    }

    @Override
    public int getArchitectViewId() {
        return R.id.architectView;
    }

    @Override
    public ILocationProvider getLocationProvider(final LocationListener locationListener) {
        return new LocationProvider(this, locationListener);
    }

    @Override
    public SensorAccuracyChangeListener getSensorAccuracyListener() {
        return new SensorAccuracyChangeListener() {
            @Override
            public void onCompassAccuracyChanged( int accuracy ) {
				/* UNRELIABLE = 0, LOW = 1, MEDIUM = 2, HIGH = 3 */
                if ( accuracy < SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM && CameraActivity.this != null && !CameraActivity.this.isFinishing() && System.currentTimeMillis() - CameraActivity.this.lastCalibrationToastShownTimeMillis > 5 * 1000) {
                    Toast.makeText( CameraActivity.this, R.string.compass_accuracy_low, Toast.LENGTH_LONG ).show();
                    CameraActivity.this.lastCalibrationToastShownTimeMillis = System.currentTimeMillis();
                }
            }
        };
    }

    @Override
    public float getInitialCullingDistanceMeters() {
        // you need to adjust this in case your POIs are more than 50km away from user here while loading or in JS code (compare 'AR.context.scene.cullingDistance')
        return ArchitectViewHolderInterface.CULLING_DISTANCE_DEFAULT_METERS;
    }

}
