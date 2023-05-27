package com.example.compose.accidentcompanion

import android.annotation.SuppressLint
import android.content.Context
import android.location.Address
import android.location.Geocoder
import android.location.Location
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Done
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import java.util.*

class MainActivity : ComponentActivity() {

    @SuppressLint("MissingPermission")
    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Column {

                val context = LocalContext.current

                val text = remember { mutableStateOf("This is a very long input that extends beyond the height of the text area.") }
                val fire = remember { mutableStateOf(false) }
                val smoke = remember { mutableStateOf(false) }
                val carCrash = remember { mutableStateOf(false) }
                val loc: MutableState<LatLng> = remember { mutableStateOf(LatLng(12.901731999999999,77.517605)) }
                val cameraPositionState = remember { mutableStateOf(CameraPositionState(position = CameraPosition.fromLatLngZoom(loc.value,10f))) }

                GetMap(context = context, loc, cameraPositionState)
                TextArea(text)
                ChipGroup(fire, smoke, carCrash)

                Button(
                    onClick = { sendToFirebase(text, fire, smoke, carCrash, loc) },
                    shape = MaterialTheme.shapes.large,
                    modifier = Modifier
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                        .fillMaxWidth()
                ) {
                    Text(
                        text = "Submit",
                        modifier = Modifier
                            .padding(vertical = 4.dp),
                        style = MaterialTheme.typography.displayMedium
                    )
                }
            }

        }

    }

    private fun sendToFirebase(text: MutableState<String>, fire: MutableState<Boolean>, smoke: MutableState<Boolean>, carCrash: MutableState<Boolean>, loc: MutableState<LatLng>) {
        println(text.value)
        println(fire.value)
    }


//    @SuppressLint("MissingPermission")
//    fun getUserLocation(context: Context){
//        val mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
//        lateinit var list: List<Address>
//        mFusedLocationClient.lastLocation.addOnCompleteListener { task ->
//            val location: Location? = task.result
//            if (location != null) {
//                val geocoder = Geocoder(context, Locale.getDefault())
//                list =
//                    geocoder.getFromLocation(location.latitude, location.longitude, 1) as List<Address>
//
//                println("Lattude${list[0].latitude} Longitude ${list[0].longitude} ${list[0].getAddressLine(0)} ${list[0].locality}")
//                lat = list[0].latitude
//                long = list[0].longitude
//
//            }
//        }
//    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TextArea(text: MutableState<String>) {
    TextField(
        value = text.value,
        onValueChange = { text.value = it },
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .padding(start = 8.dp, end = 8.dp, top = 16.dp, bottom = 4.dp)
            .clip(MaterialTheme.shapes.medium)
            .fillMaxWidth()
            .height(100.dp),
        label = { Text("Label") }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ChipGroup(fire: MutableState<Boolean>, smoke: MutableState<Boolean>, carCrash: MutableState<Boolean>) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        //horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        FilterChip(
            modifier = Modifier.padding(horizontal = 4.dp),
            selected = !fire.value,
            onClick = { fire.value = !fire.value },
            label = { Text("Fire") },
            leadingIcon = {
                if (fire.value) {
                    Icon(
                        imageVector = Icons.Filled.Done,
                        contentDescription = "Localized Description",
                        modifier = Modifier.size(FilterChipDefaults.IconSize)
                    )
                }
            }
        )
        FilterChip(
            modifier = Modifier.padding(horizontal = 4.dp),
            selected = !smoke.value,
            onClick = { smoke.value = !smoke.value },
            label = { Text("Smoke") },
            leadingIcon = {
                if (smoke.value) {
                    Icon(
                        imageVector = Icons.Filled.Done,
                        contentDescription = "Localized Description",
                        modifier = Modifier.size(FilterChipDefaults.IconSize)
                    )
                }
            }
        )
        FilterChip(
            modifier = Modifier.padding(horizontal = 4.dp),
            selected = !carCrash.value,
            onClick = { carCrash.value = !carCrash.value },
            label = { Text("Car Crash") },
            leadingIcon = {
                if (carCrash.value) {
                    Icon(
                        imageVector = Icons.Filled.Done,
                        contentDescription = "Localized Description",
                        modifier = Modifier.size(FilterChipDefaults.IconSize)
                    )
                }
            }
        )
    }
}


@SuppressLint("MissingPermission")
@Composable
private fun GetMap(
    context: Context,
    loc: MutableState<LatLng>,
    cameraPositionState: MutableState<CameraPositionState>
){
    if (cameraPositionState.value.isMoving && cameraPositionState.value.cameraMoveStartedReason == CameraMoveStartedReason.GESTURE) {
        loc.value = cameraPositionState.value.position.target
        println(loc)
    }
    GoogleMap(
        modifier = Modifier
            .fillMaxWidth()
            .height(550.dp),
        cameraPositionState = cameraPositionState.value,
        properties = MapProperties(isMyLocationEnabled = true),
        uiSettings = MapUiSettings(
            zoomControlsEnabled = false,
            myLocationButtonEnabled = true,
        ),
        onMapLoaded = {
            val mFusedLocationClient =
                LocationServices.getFusedLocationProviderClient(context)
            lateinit var list: List<Address>
            mFusedLocationClient.lastLocation.addOnCompleteListener { task ->
                val location: Location? = task.result
                if (location != null) {
                    val geocoder = Geocoder(context, Locale.getDefault())
                    list = geocoder.getFromLocation(
                        location.latitude,
                        location.longitude,
                        1
                    ) as List<Address>

                    println(
                        "Lattude${list[0].latitude} Longitude ${list[0].longitude} ${
                            list[0].getAddressLine(
                                0
                            )
                        } ${list[0].locality}"
                    )
                    val lat = list[0].latitude
                    val long = list[0].longitude
                    loc.value = LatLng(lat, long)
                    cameraPositionState.value = CameraPositionState(
                        position = CameraPosition.fromLatLngZoom(
                            loc.value,
                            10f
                        )
                    )
                }
            }
        }
    ) {
        Marker(
            state = MarkerState(position = loc.value),
            title = "Address",
            snippet = "Mark Your Location"
        )
    }

}

//            mainBinding.apply {
//                tvLatitude.text = "Latitude\n${list[0].latitude}"
//                tvLongitude.text = "Longitude\n${list[0].longitude}"
//                tvCountryName.text = "Country Name\n${list[0].countryName}"
//                tvLocality.text = "Locality\n${list[0].locality}"
//                tvAddress.text = "Address\n${list[0].getAddressLine(0)}"
//            }